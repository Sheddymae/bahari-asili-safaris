'use client';

import { Activity, CalendarDays, FileText, Inbox } from 'lucide-react';

type Booking = { id: number; booking_ref: string; safari_name: string; arrival_date: string; status: string; itinerary_snapshot: any };
type Invoice = { id: string; invoice_number: string; amount: number; currency: string; status: string; created_at: string; itinerary: any };
type Document = { id: string; type: string; title: string; status: string; created_at: string };

type EventItem = { id: string; title: string; detail: string; date: string; status: string; icon: 'booking' | 'invoice' | 'document' };

export default function ActivityOverview({ bookings, invoices, documents }: { bookings: Booking[]; invoices: Invoice[]; documents: Document[] }) {
  const events: EventItem[] = [
    ...bookings.map(item => ({ id: 'booking-' + item.id, title: item.itinerary_snapshot?.title || item.safari_name || 'Safari reservation', detail: 'Reservation ' + item.booking_ref + ' · Travel date', date: item.arrival_date, status: item.status.replaceAll('_', ' '), icon: 'booking' as const })),
    ...invoices.map(item => ({ id: 'invoice-' + item.id, title: 'Invoice ' + item.invoice_number, detail: (item.currency || '') + ' ' + Number(item.amount || 0).toLocaleString(), date: item.created_at, status: item.status, icon: 'invoice' as const })),
    ...documents.map(item => ({ id: 'document-' + item.id, title: item.title, detail: item.type.replaceAll('_', ' '), date: item.created_at, status: item.status, icon: 'document' as const })),
  ].filter(item => item.date && Number.isFinite(new Date(item.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return <section aria-labelledby="activity-overview-title" className="rounded-[4px] border bg-white p-5 sm:p-6">
    <div className="flex items-center gap-2"><Activity className="h-5 w-5 text-ocean-700" /><h2 id="activity-overview-title" className="text-lg font-bold">Recent account activity</h2></div>
    <p className="mt-1 text-sm text-muted-foreground">A combined view of your reservations, invoices, and documents.</p>
    {events.length ? <ol className="mt-4 divide-y divide-border">{events.map(item => <li key={item.id} className="flex min-w-0 items-start gap-3 py-3 first:pt-1 last:pb-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-sand-50 text-ocean-700">{item.icon === 'booking' ? <CalendarDays className="h-4 w-4" /> : item.icon === 'invoice' ? <FileText className="h-4 w-4" /> : <Inbox className="h-4 w-4" />}</span>
      <div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{item.title}</p><p className="mt-1 break-words text-xs text-muted-foreground">{item.detail}</p></div>
      <div className="shrink-0 text-right"><span className="inline-block max-w-32 break-words rounded-full bg-sand-50 px-2 py-1 text-[11px] font-medium capitalize text-foreground">{item.status}</span><p className="mt-1 text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p></div>
    </li>)}</ol> : <p className="mt-4 rounded-[4px] bg-sand-50 p-4 text-sm text-muted-foreground">Your account activity will appear here as bookings, invoices, and documents are added.</p>}
  </section>;
}
