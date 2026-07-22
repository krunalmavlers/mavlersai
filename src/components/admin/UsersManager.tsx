'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, deleteUser, resetUserPassword, updateUserRole } from '@/app/admin/actions';
import type { AdminUserRow } from '@/lib/adminQueries';
import { Card, Field, inputCls } from './ui';

const ROLE_LABEL: Record<string, string> = { admin: 'Admin (full access)', editor: 'Editor (content only)' };

export function UsersManager({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // New-user form
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
  }

  function add() {
    setMsg(null);
    start(async () => {
      const res = await createUser({ email, password, full_name: fullName, role });
      if (res.ok) {
        setEmail('');
        setFullName('');
        setPassword('');
        setRole('editor');
        flash('User created.', true);
        router.refresh();
      } else {
        flash(res.error || 'Failed to create user.', false);
      }
    });
  }

  function changeRole(userId: string, next: 'admin' | 'editor') {
    setMsg(null);
    start(async () => {
      const res = await updateUserRole(userId, next);
      if (res.ok) {
        flash('Role updated.', true);
        router.refresh();
      } else flash(res.error || 'Failed to update role.', false);
    });
  }

  function resetPw(userId: string, email: string) {
    const pw = window.prompt(`New password for ${email} (min 8 characters):`);
    if (pw == null) return;
    setMsg(null);
    start(async () => {
      const res = await resetUserPassword(userId, pw);
      flash(res.ok ? `Password reset for ${email}.` : res.error || 'Failed to reset password.', res.ok);
    });
  }

  function remove(userId: string, email: string) {
    if (!window.confirm(`Remove ${email}? This deletes their login and cannot be undone.`)) return;
    setMsg(null);
    start(async () => {
      const res = await deleteUser(userId);
      if (res.ok) {
        flash(`Removed ${email}.`, true);
        router.refresh();
      } else flash(res.error || 'Failed to remove user.', false);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="m-0 mb-1 font-display text-[16px] font-bold text-black">Add user</h2>
        <p className="m-0 mb-4 text-[12.5px] text-body-dim">
          Editors can create and edit content (pages, posts, menus, forms) but cannot change site settings or manage users.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Email">
            <input className={inputCls} type="email" value={email} placeholder="person@example.com" onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Full name" hint="Optional.">
            <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="Temporary password" hint="At least 8 characters. Share it securely; they can change it under Account.">
            <input className={inputCls} type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Role">
            <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'editor')}>
              <option value="editor">Editor — content only</option>
              <option value="admin">Admin — full access</option>
            </select>
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={add}
            disabled={pending}
            className="rounded-[10px] bg-brand px-6 py-3 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
          >
            {pending ? 'Working…' : 'Add user'}
          </button>
          {msg && <span className={`text-[13px] ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>{msg.text}</span>}
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-black">Users</h2>
        <div className="flex flex-col divide-y divide-surface-line2">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-[200px] flex-1">
                <div className="text-[14px] font-semibold text-black">
                  {u.full_name || u.email.split('@')[0]}
                  {u.id === currentUserId && <span className="ml-2 text-[11px] font-medium text-body-dim">(you)</span>}
                </div>
                <div className="text-[12.5px] text-body-dim">{u.email}</div>
              </div>
              <select
                className={`${inputCls} w-auto min-w-[190px] flex-none`}
                value={u.role}
                disabled={pending || u.id === currentUserId}
                title={u.id === currentUserId ? 'You cannot change your own role.' : undefined}
                onChange={(e) => changeRole(u.id, e.target.value as 'admin' | 'editor')}
              >
                {Object.entries(ROLE_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <button
                onClick={() => resetPw(u.id, u.email)}
                disabled={pending}
                className="rounded-[9px] border border-surface-line2 px-3 py-2 text-[13px] font-semibold text-body-soft hover:border-brand hover:text-black disabled:opacity-60"
              >
                Reset password
              </button>
              <button
                onClick={() => remove(u.id, u.email)}
                disabled={pending || u.id === currentUserId}
                className="rounded-[9px] border border-surface-line2 px-3 py-2 text-[13px] font-semibold text-red-600 hover:border-red-400/60 hover:bg-red-500/10 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
