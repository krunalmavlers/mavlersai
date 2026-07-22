'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.refresh();
    router.push('/admin');
  }

  const input =
    'w-full rounded-[10px] border border-surface-line2 bg-white px-4 py-3 text-[14px] text-black placeholder:text-body-dim focus:border-brand focus:outline-none';

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[18px] border border-surface-line2 bg-white p-7"
    >
      <label className="mb-1.5 block text-[13px] font-semibold text-body-soft">Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`${input} mb-4`}
        placeholder="you@example.com"
      />
      <label className="mb-1.5 block text-[13px] font-semibold text-body-soft">Password</label>
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`${input} mb-4`}
        placeholder="••••••••"
      />
      {error && <p className="mb-4 mt-0 text-[13px] text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[10px] bg-brand px-5 py-3 text-[15px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
