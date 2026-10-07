export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import ClientDashboard from '@/components/ClientDashboard';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/dashboard');

  const [{ data: bookings }, { data: invoices }, { data: documents }] = await Promise.all([
    supabase.from('bookings').select('id,booking_ref,safari_name,arrival_date,adults,children,status,itinerary_snapshot').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('id,invoice_number,amount,currency,status,itinerary,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('client_documents').select('id,type,title,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const name = String(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler');
  return <ClientDashboard user={{ id:user.id, email:user.email || null, name }} initialBookings={(bookings || []) as any} initialInvoices={(invoices || []) as any} initialDocuments={(documents || []) as any} />;
}
