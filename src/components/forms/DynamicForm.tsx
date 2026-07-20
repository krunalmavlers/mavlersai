'use client';

import { useMemo, useState } from 'react';
import type { FormDef, FormField } from '@/lib/types';
import { useRecaptcha } from './useRecaptcha';
import { CalendlyEmbed } from './CalendlyEmbed';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export function DynamicForm({ form }: { form: FormDef }) {
  const modes = form.settings?.modes || [];
  const [mode, setMode] = useState(modes[0]?.key || '');
  const [values, setValues] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const executeRecaptcha = useRecaptcha(form.recaptcha_enabled ? SITE_KEY : '');

  const activeMode = modes.find((m) => m.key === mode);
  const title = activeMode?.title || form.title;
  const subtitle = activeMode?.subtitle || form.description;
  const submitLabel = activeMode?.submit || form.submit_label;

  // Calendly scheduler: shown only in the modes configured in the backend
  // (default: the "call" mode) and only once a scheduling URL is set.
  const calendly = form.settings?.calendly;
  const calendlyModes = calendly?.modes || ['call'];
  const showCalendly = !!(calendly?.url && (mode ? calendlyModes.includes(mode) : true));
  const hasNextSteps = (form.settings?.next_steps?.length || 0) > 0;

  const visibleFields = useMemo(() => {
    return (form.fields || []).filter((f) => {
      const cond = f.conditional;
      if (!cond || !cond.field) return true;
      if (cond.field === 'mode') return mode === cond.equals;
      return values[cond.field] === cond.equals;
    });
  }, [form.fields, mode, values]);

  function setValue(name: string, v: any) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    // Required consent
    for (const c of form.settings?.consent || []) {
      if (c.required && !values[c.name]) {
        setStatus('error');
        setError('Please accept the required consent to continue.');
        return;
      }
    }

    try {
      const token = await executeRecaptcha('form_submit');
      const payload = {
        form_key: form.key,
        mode,
        data: { ...values, ...(mode ? { mode } : {}) },
        recaptcha_token: token,
      };
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Submission failed. Please try again.');
      }
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Something went wrong.');
    }
  }

  if (status === 'success') {
    const kind = activeMode?.kind || 'message';
    return (
      <div className="mx-auto max-w-[560px] rounded-[20px] border border-brand/30 bg-brand/[0.06] p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-ink">
          ✓
        </div>
        <h2 className="m-0 mb-3 font-display text-[28px] font-bold text-white">Thanks — we&apos;ve got it.</h2>
        <p className="m-0 mb-6 text-[16px] text-body-muted">
          We received your {kind} and our team will be in touch shortly.
        </p>
        <button
          onClick={() => {
            setValues({});
            setStatus('idle');
          }}
          className="rounded-[10px] border border-white/16 bg-white/5 px-6 py-3 text-[14px] font-bold text-body hover:bg-white/10"
        >
          Send another
        </button>
      </div>
    );
  }

  const modeToggle = modes.length > 1 && (
    <div className="mb-6 inline-flex rounded-[12px] border border-white/12 bg-white/[0.04] p-1">
      {modes.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => setMode(m.key)}
          className={`rounded-[9px] px-4 py-2 text-[13.5px] font-bold transition-colors ${
            mode === m.key ? 'bg-brand text-ink' : 'text-body-soft hover:text-white'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );

  const supportPanel = (
    <aside className="flex flex-col gap-4">
      {hasNextSteps && (
        <div className="rounded-[18px] border border-white/9 bg-white/[0.03] p-6">
          <div className="mb-4 font-display text-[16px] font-bold text-white">What happens next</div>
          <div className="flex flex-col gap-4">
            {form.settings!.next_steps!.map((s, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand/15 text-[13px] font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-white">{s.title}</div>
                  <div className="text-[13px] text-body-faint">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-[18px] border border-brand/25 bg-brand/[0.06] p-6">
        <div className="mb-2 font-display text-[15px] font-bold text-white">White-label by design</div>
        <p className="m-0 text-[13px] leading-relaxed text-body-faint">
          NDAs available on request. Your client relationship stays protected — we can operate
          entirely behind your brand.
        </p>
      </div>
    </aside>
  );

  // BOOK A CALL — when a Calendly scheduler is configured for this mode, show
  // ONLY the scheduler (Calendly collects the details, so no form is needed).
  if (showCalendly) {
    return (
      <div>
        {modeToggle}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {title && <h2 className="m-0 mb-1.5 font-display text-[24px] font-bold text-white">{title}</h2>}
            {subtitle && <p className="m-0 mb-5 text-[14.5px] text-body-faint">{subtitle}</p>}
            <CalendlyEmbed url={calendly!.url!} note={calendly?.note} height={700} />
          </div>
          {supportPanel}
        </div>
      </div>
    );
  }

  // SUBMIT A REQUIREMENT (and any non-Calendly mode) — the dynamic form.
  return (
    <div>
      {modeToggle}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[20px] border border-white/9 bg-white/[0.03] p-6 md:p-9">
          {title && <h2 className="m-0 mb-1.5 font-display text-[24px] font-bold text-white">{title}</h2>}
          {subtitle && <p className="m-0 mb-6 text-[14.5px] text-body-faint">{subtitle}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleFields.map((f) => (
              <Field
                key={f.id}
                field={f}
                value={values[f.name]}
                onChange={(v) => setValue(f.name, v)}
                formKey={form.key}
              />
            ))}

            <div className="sm:col-span-2 flex flex-col gap-3 pt-1">
              {(form.settings?.consent || []).map((c) => (
                <label key={c.name} className="flex items-start gap-2.5 text-[13px] text-body-faint">
                  <input
                    type="checkbox"
                    checked={!!values[c.name]}
                    onChange={(e) => setValue(c.name, e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#FFCB2E]"
                  />
                  <span>
                    {c.label}
                    {c.required && <span className="text-brand"> *</span>}
                  </span>
                </label>
              ))}
            </div>

            {error && <p className="sm:col-span-2 m-0 text-[13.5px] text-red-400">{error}</p>}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-[12px] bg-brand px-7 py-4 text-[16px] font-bold text-ink shadow-[0_10px_30px_rgba(255,203,46,0.4)] transition-colors hover:bg-brand-300 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : submitLabel}
              </button>
              {form.settings?.helper_text && (
                <p className="m-0 mt-3 text-[12.5px] text-body-dim">{form.settings.helper_text}</p>
              )}
              {form.recaptcha_enabled && (
                <p className="m-0 mt-2 text-[11px] text-body-dim">Protected by reCAPTCHA.</p>
              )}
            </div>
          </form>
        </div>

        {supportPanel}
      </div>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
  formKey,
}: {
  field: FormField;
  value: any;
  onChange: (v: any) => void;
  formKey: string;
}) {
  const span = field.col_span === 2 ? 'sm:col-span-2' : '';
  const base =
    'w-full rounded-[10px] border border-white/12 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-body-dim focus:border-brand focus:outline-none';

  return (
    <div className={span}>
      <label className="mb-1.5 block text-[13px] font-semibold text-body-soft">
        {field.label}
        {field.required && <span className="text-brand"> *</span>}
      </label>
      {field.type === 'file' ? (
        <FileField field={field} value={value} onChange={onChange} formKey={formKey} />
      ) : field.type === 'textarea' ? (
        <textarea
          rows={3}
          required={field.required}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : field.type === 'select' ? (
        <select
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          <option value="">Select…</option>
          {(field.options || []).map((o) => (
            <option key={o} value={o} className="bg-ink">
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          // `url` renders as plain text so entries like "mavlers.com" are accepted
          // (no forced https:// scheme). email/tel keep their native validation.
          type={field.type === 'hidden' || field.type === 'url' ? 'text' : field.type}
          inputMode={field.type === 'url' ? 'url' : undefined}
          required={field.required}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
      {field.help_text && <p className="m-0 mt-1 text-[12px] text-body-dim">{field.help_text}</p>}
    </div>
  );
}

function FileField({
  field,
  value,
  onChange,
  formKey,
}: {
  field: FormField;
  value: any;
  onChange: (v: any) => void;
  formKey: string;
}) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [error, setError] = useState('');

  async function upload(file: File) {
    setStatus('uploading');
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('form_key', formKey);
    try {
      const res = await fetch('/api/forms/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Upload failed.');
      onChange(json.file);
      setStatus('idle');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Upload failed.');
    }
  }

  if (value?.__file) {
    return (
      <div className="flex items-center justify-between rounded-[10px] border border-brand/30 bg-brand/[0.06] px-4 py-3 text-[13px]">
        <span className="truncate text-body-soft">
          📎 {value.name} <span className="text-body-dim">({Math.round((value.size || 0) / 1024)} KB)</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-3 text-[13px] font-semibold text-body-faint hover:text-white"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-white/20 bg-white/[0.03] px-4 py-6 text-center text-[13px] text-body-faint hover:border-brand/50">
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
      {status === 'uploading' ? (
        <span>Uploading…</span>
      ) : (
        <span>{field.placeholder || 'Drop a file, or click to browse.'}</span>
      )}
      {error && <span className="mt-1 text-red-400">{error}</span>}
    </label>
  );
}
