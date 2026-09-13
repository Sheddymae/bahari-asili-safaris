/*
# Phase 1 security — admin accounts, audit log, persistent login lockout, newsletter

## Summary
Adds the tables needed to move the admin dashboard off a single shared
username/password env pair onto real per-person accounts with roles, adds a
durable (DB-backed, survives cold serverless starts) login-lockout counter,
adds an audit trail for admin actions, and adds a `newsletter_subscribers`
table for the footer signup form.

## New tables
- admin_users            One row per admin person. role = 'owner' | 'staff'.
- admin_login_attempts    Tracks failed logins per identifier (ip or
                          ip+username) so 5 fails -> 15 min lock survives
                          serverless cold starts (unlike the in-memory
                          limiter in lib/rate-limit.ts).
- admin_audit_log         Append-only record of admin actions (login,
                          logout, status change, delete, export, resend...).
- newsletter_subscribers  Email capture from the footer newsletter form.

## Security
- RLS enabled on all four tables with NO anon/authenticated policies —
  every one of these is only ever touched by API routes using the
  service-role key (getSupabaseAdmin()), which bypasses RLS entirely.
  This intentionally keeps them unreachable from the public anon key.
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
  full_name     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- Intentionally no anon/authenticated policies — service-role only.

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  identifier    TEXT PRIMARY KEY,   -- e.g. "ip:1.2.3.4" or "ip:1.2.3.4|user:Admin"
  fail_count    INTEGER NOT NULL DEFAULT 0,
  locked_until  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;
-- Intentionally no anon/authenticated policies — service-role only.

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username     TEXT NOT NULL,
  role         TEXT,
  action       TEXT NOT NULL,        -- login_success | login_failed | login_locked | logout | reservation_status_change | reservation_delete | export | resend_email | send_email
  target_type  TEXT,                 -- e.g. 'booking'
  target_id    TEXT,
  ip           TEXT,
  user_agent   TEXT,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_username ON admin_audit_log (username);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
-- Intentionally no anon/authenticated policies — service-role only.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  locale       TEXT,
  source       TEXT NOT NULL DEFAULT 'footer',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- Intentionally no anon/authenticated policies — service-role only
-- (insert happens through /api/newsletter using the service-role key).
