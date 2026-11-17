/*
# Production security hardening — bookings, reviews, documents, sequences

## Why
The booking table grew several RLS policies across 2026-07 → 2026-10. Two of the
older ones were never removed and still apply:

- `anon_insert_bookings` (from 2026-07-09) was created `TO anon, authenticated`
  with only data-shape checks, so a signed-in customer could insert a booking
  row owned by a different user_id.
- `update_own_bookings` / `delete_own_bookings` (from 2026-07-11) let any
  authenticated customer UPDATE or DELETE their own booking through PostgREST,
  including `total_price`, `payment_status`, `balance_due` and
  `reservation_status`. That is a direct financial-integrity hole: a customer
  could mark their own booking paid or zero out the amount owed.

`invoice_sequences` was created in 2026-10-07 without RLS at all, leaving the
invoice counter readable/writable through the public API.

`customer_reviews` INSERT only checked `auth.uid() = user_id`, so a caller
could post a published review against any booking id (including bookings that
were never theirs) by inventing booking_id/booking_ref/safari_name values.

The private `documents` bucket's client-read policy compared
`client_documents.pdf_url` to the object `name` with `=`, which misses legacy
rows that stored a full public URL and allows a stored value that is a prefix
of another user's object path to match. It is rewritten to compare normalised
paths.

## What this migration does
1. Drops the stale permissive bookings INSERT policy.
2. Removes customer UPDATE/DELETE on bookings — all mutations now go through the
   server-side admin API, which validates amounts and status transitions.
3. Replaces the guest/authenticated INSERT policies with validated predicates.
4. Restricts customer SELECT to the columns the account dashboard actually
   needs, hiding admin notes, internal cost breakdown and deleted flags.
5. Requires a review to belong to a booking owned by the caller.
6. Enables RLS and revokes client grants on invoice_sequences.
7. Re-creates the storage read policy using normalised paths.
8. Revokes client grants on server-only tables as defence in depth.

## Safety
- Non-destructive: no rows are deleted and no columns are dropped.
- All statements are idempotent (`IF EXISTS` / `CREATE OR REPLACE`), so this is
  safe to re-run.
*/

begin;

-- ---------------------------------------------------------------------------
-- 1. bookings: remove the stale, over-permissive INSERT policy
-- ---------------------------------------------------------------------------
drop policy if exists "anon_insert_bookings" on public.bookings;

-- ---------------------------------------------------------------------------
-- 2. bookings: customers may not mutate reservations directly
--    Price, payment and status changes are admin-API operations only.
-- ---------------------------------------------------------------------------
drop policy if exists "update_own_bookings" on public.bookings;
drop policy if exists "delete_own_bookings" on public.bookings;
revoke update, delete on table public.bookings from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. bookings: validated INSERT policies
--    Guest inserts may not claim an owner; signed-in inserts must own the row
--    and both must pass the same data-shape checks.
-- ---------------------------------------------------------------------------
drop policy if exists "insert_booking_anon" on public.bookings;
create policy "insert_booking_anon" on public.bookings for insert
  to anon
  with check (
    user_id is null
    and length(btrim(first_name)) > 0
    and length(btrim(last_name)) > 0
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(btrim(safari_name)) > 0
    and booking_ref ~ '^BA-[0-9]{8}-[0-9A-Z]+$'
    and arrival_date >= current_date
    and adults >= 1
    and adults <= 30
    and children >= 0
    and children <= 10
  );

drop policy if exists "insert_booking_authenticated" on public.bookings;
create policy "insert_booking_authenticated" on public.bookings for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and length(btrim(first_name)) > 0
    and length(btrim(last_name)) > 0
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(btrim(safari_name)) > 0
    and booking_ref ~ '^BA-[0-9]{8}-[0-9A-Z]+$'
    and arrival_date >= current_date
    and adults >= 1
    and adults <= 30
    and children >= 0
    and children <= 10
  );

-- ---------------------------------------------------------------------------
-- 4. bookings: column-scoped reads for signed-in customers
--    The customer dashboard only needs the booking summary, never admin_notes,
--    the internal cost breakdown or soft-delete bookkeeping.
-- ---------------------------------------------------------------------------
revoke select on table public.bookings from anon;
revoke select on table public.bookings from authenticated;

grant select (
  id, booking_ref, first_name, last_name, email, whatsapp,
  adults, children, kids_ages, arrival_date, safari_name, message,
  reservation_status, status, user_id, created_at, updated_at,
  booking_type, nationality, pickup_location, hotel_name,
  total_price, total_amount, payment_status, invoice_status, invoice_number,
  currency, locale, itinerary, itinerary_snapshot, confirmed_at,
  invoice_url, voucher_url, itinerary_url
) on public.bookings to authenticated;

-- Guests never read bookings directly; they receive their reference from the
-- booking API response only.
grant insert on table public.bookings to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. customer_reviews: a review must belong to the caller's own booking
-- ---------------------------------------------------------------------------
drop policy if exists "Guests can submit reviews for their own bookings" on public.customer_reviews;
create policy "Guests can submit reviews for their own bookings"
  on public.customer_reviews for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.bookings b
      where b.id = customer_reviews.booking_id
        and b.user_id = (select auth.uid())
    )
  );

-- A customer may only mark their own document as viewed. Allowing table-wide
-- UPDATE let a signed-in user rewrite pdf_url to another customer's object path
-- and then request a signed URL for it through /api/account/documents/[id].
revoke update on table public.client_documents from authenticated;
grant update (status) on public.client_documents to authenticated;

-- ---------------------------------------------------------------------------
-- 6. invoice_sequences: was created without RLS
-- ---------------------------------------------------------------------------
alter table public.invoice_sequences enable row level security;
revoke all on table public.invoice_sequences from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 7. documents bucket: private, path-normalised client reads
-- ---------------------------------------------------------------------------
update storage.buckets set public = false where id = 'documents';

drop policy if exists "public_read_documents" on storage.objects;
drop policy if exists "Clients can read their document objects" on storage.objects;

create policy "Clients can read their document objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and exists (
      select 1
      from public.client_documents d
      where d.user_id = (select auth.uid())
        and (
          d.pdf_url = storage.objects.name
          or d.pdf_url = '/storage/v1/object/public/documents/' || storage.objects.name
          or d.pdf_url like '%/storage/v1/object/public/documents/' || storage.objects.name
          or d.pdf_url like '%/storage/v1/object/sign/documents/' || storage.objects.name || '%'
        )
    )
  );

-- ---------------------------------------------------------------------------
-- 8. Defence in depth: server-only tables get no client grants
-- ---------------------------------------------------------------------------
revoke all on table
  public.email_logs,
  public.payments,
  public.admin_users,
  public.admin_login_attempts,
  public.admin_audit_log,
  public.newsletter_subscribers,
  public.api_rate_limits
from anon, authenticated;

revoke all on function public.next_bahari_invoice_number() from public, anon, authenticated;
grant execute on function public.next_bahari_invoice_number() to service_role;

revoke all on function public.get_admin_booking_stats() from public, anon, authenticated;
grant execute on function public.get_admin_booking_stats() to service_role;

commit;

notify pgrst, 'reload schema';
