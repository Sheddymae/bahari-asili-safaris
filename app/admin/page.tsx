import { redirect } from 'next/navigation';

// Root cause of the /admin 404: the admin panel actually lives at
// /auth/dashboard (with /auth/login as the sign-in page) — there was
// simply no page registered for /admin itself, so Next's App Router had
// nothing to match and correctly served a 404.
//
// This route file makes /admin a stable, memorable entry point. It's a
// Server Component, so the redirect happens before anything renders.
// middleware.ts already protects /auth/dashboard (PROTECTED_PAGE), so
// unauthenticated visitors continue on to /auth/login exactly as before —
// this file doesn't change auth behavior, it just gives /admin somewhere
// to go.
export default function AdminEntryPoint() {
  redirect('/auth/dashboard');
}
