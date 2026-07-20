'use client';

import { useState, useTransition } from 'react';
import { changeOwnPassword } from '@/app/admin/actions';
import { Card, Field, inputCls } from './ui';

export function PasswordForm() {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function save() {
    setMsg(null);
    if (pw.length < 8) return setMsg({ text: 'Password must be at least 8 characters.', ok: false });
    if (pw !== confirm) return setMsg({ text: 'Passwords do not match.', ok: false });
    start(async () => {
      const res = await changeOwnPassword(pw);
      if (res.ok) {
        setPw('');
        setConfirm('');
        setMsg({ text: 'Password changed.', ok: true });
      } else {
        setMsg({ text: res.error || 'Could not change password.', ok: false });
      }
    });
  }

  return (
    <Card>
      <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">Change password</h2>
      <div className="grid max-w-[420px] grid-cols-1 gap-4">
        <Field label="New password" hint="At least 8 characters.">
          <input className={inputCls} type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password">
          <input className={inputCls} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-[10px] bg-brand px-6 py-3 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Update password'}
        </button>
        {msg && <span className={`text-[13px] ${msg.ok ? 'text-emerald-300' : 'text-red-400'}`}>{msg.text}</span>}
      </div>
    </Card>
  );
}
