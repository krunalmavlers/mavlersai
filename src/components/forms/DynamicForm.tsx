'use client';

import { useMemo, useState } from 'react';
import type { FormDef, FormField } from '@/lib/types';
import { useRecaptcha } from './useRecaptcha';
import { CalendlyEmbed } from './CalendlyEmbed';
import { Icon } from '@/components/sections/icons';

export function DynamicForm({ form, siteKey }: { form: FormDef; siteKey?: string }) {
  const modes = form.settings?.modes || [];
  const [mode, setMode] = useState(modes[0]?.key || '');
  const [values, setValues] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Prefer the site key configured in admin Settings; fall back to the env var.
  const resolvedSiteKey = siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  const executeRecaptcha = useRecaptcha(form.recaptcha_enabled ? resolvedSiteKey : '');

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

  // The strip of reassurances above the calendar. `helper_text` already held
  // these, separated by middots, but only the written form ever rendered it.
  const callFacts = (form.settings?.helper_text || '')
    .split('·')
    .map((t) => t.trim())
    .filter(Boolean);

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
      <div className="mx-auto max-w-[560px] rounded-[20px] border border-surface-line2 bg-surface-tint p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-black">
          ✓
        </div>
        <h2 className="m-0 mb-3 font-display text-[28px] font-bold text-black">Thanks, we&apos;ve got it.</h2>
        <p className="m-0 mb-6 text-[16px] text-body-muted">
          We received your {kind} and our team will be in touch shortly.
        </p>
        <button
          onClick={() => {
            setValues({});
            setStatus('idle');
          }}
          className="rounded-[10px] border border-surface-line2 bg-white px-6 py-3 text-[14px] font-bold text-black transition-colors hover:border-black"
        >
          Send another
        </button>
      </div>
    );
  }

  const modeToggle = modes.length > 1 && (
    <div className="mb-6 inline-flex rounded-[12px] border border-surface-line2 bg-surface-tint2 p-1">
      {modes.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => setMode(m.key)}
          className={`rounded-[9px] px-4 py-2 text-[13.5px] font-bold transition-colors ${
            mode === m.key ? 'bg-brand text-black shadow-sm' : 'text-body-soft hover:text-black'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );

  const steps = form.settings?.next_steps || [];
  const supportPanel = (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
      {hasNextSteps && (
        <div className="rounded-[20px] border border-surface-line2 bg-surface-tint p-6 md:p-7">
          <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-ink">
            {form.settings?.next_steps_eyebrow || 'Step by step'}
          </div>
          <h3 className="m-0 mb-5 font-display text-[18px] font-bold tracking-[-0.02em] text-black">
            {form.settings?.next_steps_heading || 'What happens next'}
          </h3>
          <ol className="m-0 list-none p-0">
            {steps.map((s, i) => (
              <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
                {/* The rule that makes this read as one sequence rather than
                    three loose rows. Not drawn under the final step. */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-[30px] bottom-[2px] w-px bg-surface-line2"
                  />
                )}
                <span className="relative z-10 flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-brand font-display text-[13px] font-extrabold text-black ring-4 ring-surface-tint">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-[3px]">
                  <div className="text-[14.5px] font-bold leading-snug text-black">{s.title}</div>
                  <div className="mt-1 text-[13px] leading-relaxed text-body-faint">{s.body}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="rounded-[20px] bg-brand p-6 md:p-7">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black text-brand">
            <Icon name="lock" size={16} />
          </span>
          <h3 className="m-0 font-display text-[16px] font-extrabold tracking-[-0.01em] text-black">
            Your brand, protected
          </h3>
        </div>
        <p className="m-0 text-[13.5px] leading-relaxed text-[#1A1A1A]">
          Non-disclosure agreements available on request. Whether you&apos;re an agency protecting a
          client relationship or a brand building directly, we can operate behind the scenes or
          alongside your team.
        </p>
      </div>
    </aside>
  );

  // BOOK A CALL — when a Calendly scheduler is configured for this mode, show
  // ONLY the scheduler (Calendly collects the details, so no form is needed).
  //
  // Everything that decides whether someone books — who they are meeting, how
  // long it takes, what happens afterwards, what it commits them to — is on
  // our side of the frame. Calendly is left to do one job: show times.
  if (showCalendly) {
    return (
      <div>
        {modeToggle}
        <div className="mx-auto mb-7 max-w-[760px] text-center lg:mx-0 lg:mb-8 lg:text-left">
          {title && (
            <h2 className="m-0 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[1.12] tracking-[-0.03em] text-black [text-wrap:balance]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="m-0 mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-body-faint">{subtitle}</p>
          )}
        </div>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] lg:gap-8">
          <CalendlyEmbed
            url={calendly!.url!}
            note={calendly?.note}
            host={calendly?.host}
            duration={calendly?.duration}
            facts={callFacts}
            height={700}
          />
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
        <div className="rounded-[20px] border border-surface-line2 bg-surface-tint p-6 md:p-9">
          {title && <h2 className="m-0 mb-1.5 font-display text-[24px] font-bold text-black">{title}</h2>}
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
    'w-full rounded-[10px] border border-surface-line2 bg-white px-4 py-3 text-[14px] text-black placeholder:text-body-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

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
            <option key={o} value={o} className="bg-white text-black">
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
      <div className="flex items-center justify-between rounded-[10px] border border-brand-ink/30 bg-brand/10 px-4 py-3 text-[13px]">
        <span className="truncate text-body-soft">
          📎 {value.name} <span className="text-body-dim">({Math.round((value.size || 0) / 1024)} KB)</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-3 text-[13px] font-semibold text-body-faint hover:text-black"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-surface-line2 bg-white px-4 py-6 text-center text-[13px] text-body-faint hover:border-brand">
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
