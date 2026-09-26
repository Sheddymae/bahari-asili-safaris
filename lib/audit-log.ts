import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { AdminRole } from '@/lib/admin-auth';

// Node-only (uses the Supabase service-role client). Do NOT import from
// middleware.ts (edge runtime).

export type AuditAction =
  | 'login_success'
  | 'login_failed'
  | 'login_locked'
  | 'logout'
  | 'reservation_status_change'
  | 'reservation_delete'
  | 'reservation_restore'
  | 'reservation_permanent_delete'
  | 'export'
  | 'resend_email'
  | 'send_email';

export interface AuditEntry {
  username: string;
  role?: AdminRole | null;
  action: AuditAction;
  targetType?: string;
  targetId?: string | number;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

/** Best-effort audit log write — never throws, never blocks the calling request. */
export async function logAdminAction(entry: AuditEntry): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    await admin.from('admin_audit_log').insert({
      username: entry.username,
      role: entry.role || null,
      action: entry.action,
      target_type: entry.targetType || null,
      target_id: entry.targetId != null ? String(entry.targetId) : null,
      ip: entry.ip || null,
      user_agent: entry.userAgent || null,
      metadata: entry.metadata || null,
    });
  } catch (err) {
    console.error('logAdminAction error:', err);
  }
}
