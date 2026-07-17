'use client';

import { useState, useTransition } from 'react';
import type { FormDef } from '@/lib/types';
import { saveForm, saveFormFields } from '@/app/admin/actions';
import { Card, Field, inputCls } from './ui';

export function FormEditor({ form, isNew }: { form: FormDef; isNew: boolean }) {
  const [f, setF] = useState<any>({
    ...form,
    recipient_emails: (form.recipient_emails || []).join(', '),
    settings: JSON.stringify(form.settings || {}, null, 2),
  });
  const [fieldsText, setFieldsText] = useState(JSON.stringify(form.fields || [], null, 2));
  const [calendlyUrl, setCalendlyUrl] = useState(form.settings?.calendly?.url || '');
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const set = (k: string, v: any) => setF((prev: any) => ({ ...prev, [k]: v }));

  function saveMeta() {
    setMsg('');
    setErr('');
    let settingsObj: any;
    try {
      settingsObj = JSON.parse(f.settings || '{}');
    } catch {
      setErr('Settings is not valid JSON.');
      return;
    }
    // Merge the Calendly URL field into settings.calendly (backend link).
    settingsObj.calendly = {
      ...(settingsObj.calendly || {}),
      url: calendlyUrl.trim(),
      modes: settingsObj.calendly?.modes || ['call'],
    };
    start(async () => {
      await saveForm({ ...f, settings: JSON.stringify(settingsObj) });
      setF((prev: any) => ({ ...prev, settings: JSON.stringify(settingsObj, null, 2) }));
      setMsg('Form saved.');
    });
  }

  function saveFields() {
    setErr('');
    setMsg('');
    let parsed: any[];
    try {
      parsed = JSON.parse(fieldsText);
      if (!Array.isArray(parsed)) throw new Error();
    } catch {
      setErr('Fields must be a valid JSON array.');
      return;
    }
    if (!form.id) {
      setErr('Save the form first, then edit fields.');
      return;
    }
    start(async () => {
      await saveFormFields(form.id, parsed);
      setMsg('Fields saved.');
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Name">
            <input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Key" hint="Referenced by form sections (e.g. book-a-call).">
            <input className={inputCls} value={f.key} onChange={(e) => set('key', e.target.value)} />
          </Field>
          <Field label="Title">
            <input className={inputCls} value={f.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Submit label">
            <input className={inputCls} value={f.submit_label} onChange={(e) => set('submit_label', e.target.value)} />
          </Field>
          <Field label="Description">
            <input className={inputCls} value={f.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
          <Field label="Recipient emails" hint="Comma-separated. Used when email is enabled.">
            <input className={inputCls} value={f.recipient_emails} onChange={(e) => set('recipient_emails', e.target.value)} />
          </Field>
          <Field label="Success message">
            <input className={inputCls} value={f.success_message} onChange={(e) => set('success_message', e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 self-end text-[13px] text-body-soft">
            <input type="checkbox" checked={!!f.recaptcha_enabled} onChange={(e) => set('recaptcha_enabled', e.target.checked)} className="h-4 w-4 accent-[#FFCB2E]" />
            reCAPTCHA enabled
          </label>
        </div>
        <div className="mt-4">
          <Field
            label="Calendly scheduling URL"
            hint="Optional. Shows a 'Pick a time' scheduler on the page (call mode only). e.g. https://calendly.com/your-org/intro-call"
          >
            <input
              className={inputCls}
              value={calendlyUrl}
              onChange={(e) => setCalendlyUrl(e.target.value)}
              placeholder="https://calendly.com/..."
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Settings (JSON)" hint="modes, consent, helper_text, next_steps, calendly">
            <textarea className={`${inputCls} font-mono text-[12px]`} rows={10} value={f.settings} onChange={(e) => set('settings', e.target.value)} />
          </Field>
        </div>
        <button onClick={saveMeta} disabled={pending} className="mt-4 rounded-[10px] bg-brand px-5 py-2.5 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60">
          {pending ? 'Saving…' : isNew ? 'Create form' : 'Save form'}
        </button>
      </Card>

      {!isNew && (
        <Card>
          <h2 className="m-0 mb-3 font-display text-[16px] font-bold text-white">Fields (JSON)</h2>
          <p className="m-0 mb-3 text-[12.5px] text-body-dim">
            Array of {'{ name, label, type, placeholder, options[], required, sort_order, col_span, conditional }'}.
            Types: text, email, tel, url, textarea, select, checkbox.
          </p>
          <textarea className={`${inputCls} font-mono text-[12px]`} rows={16} value={fieldsText} onChange={(e) => setFieldsText(e.target.value)} />
          <button onClick={saveFields} disabled={pending} className="mt-3 rounded-[10px] bg-brand px-5 py-2.5 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60">
            Save fields
          </button>
        </Card>
      )}

      {err && <p className="text-[13px] text-red-400">{err}</p>}
      {msg && <p className="text-[13px] text-emerald-300">{msg}</p>}
    </div>
  );
}
