'use client';

import { useState, useTransition } from 'react';
import { saveSettings } from '@/app/admin/actions';
import { PLATFORMS, SocialIcon } from '@/components/site/SocialIcon';
import { Card, Field, inputCls } from './ui';

type Social = { platform?: string; label: string; url: string };
type Phone = { region: string; number: string };

export function SettingsEditor({ settings }: { settings: any }) {
  const [f, setF] = useState<any>({
    ...settings,
    url_config: JSON.stringify(settings.url_config || {}, null, 2),
    organization_schema: JSON.stringify(settings.organization_schema || {}, null, 2),
  });
  const [social, setSocial] = useState<Social[]>(
    Array.isArray(settings.social_links) ? settings.social_links : [],
  );
  const [phones, setPhones] = useState<Phone[]>(
    Array.isArray(settings.contact?.phones) ? settings.contact.phones : [],
  );
  const [emails, setEmails] = useState<string>(
    Array.isArray(settings.contact?.emails) ? settings.contact.emails.join(', ') : '',
  );
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const set = (k: string, v: any) => setF((prev: any) => ({ ...prev, [k]: v }));

  // ---- social links ----
  const addSocial = () => setSocial((prev) => [...prev, { platform: 'linkedin', label: 'LinkedIn', url: '' }]);
  const updateSocial = (i: number, patch: Partial<Social>) =>
    setSocial((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSocial = (i: number) => setSocial((prev) => prev.filter((_, idx) => idx !== i));

  // ---- phones ----
  const addPhone = () => setPhones((prev) => [...prev, { region: '', number: '' }]);
  const updatePhone = (i: number, patch: Partial<Phone>) =>
    setPhones((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const removePhone = (i: number) => setPhones((prev) => prev.filter((_, idx) => idx !== i));

  function save() {
    setMsg('');
    const emailList = emails
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      ...f,
      social_links: social
        .filter((s) => s.url.trim())
        .map((s) => ({ platform: s.platform || undefined, label: s.label || s.platform || '', url: s.url.trim() })),
      contact: { ...(f.contact || {}), emails: emailList, phones: phones.filter((p) => p.number.trim()) },
    };
    start(async () => {
      await saveSettings(payload);
      setMsg('Settings saved.');
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-black">Branding</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Site name">
            <input className={inputCls} value={f.site_name} onChange={(e) => set('site_name', e.target.value)} />
          </Field>
          <Field label="Tagline">
            <input className={inputCls} value={f.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </Field>
          <Field label="Logo URL" hint="Leave blank to use the text wordmark.">
            <input className={inputCls} value={f.logo_url} onChange={(e) => set('logo_url', e.target.value)} />
          </Field>
          <Field label="Favicon URL">
            <input className={inputCls} value={f.favicon_url} onChange={(e) => set('favicon_url', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-black">Default SEO</h2>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Default meta title">
            <input className={inputCls} value={f.default_meta_title} onChange={(e) => set('default_meta_title', e.target.value)} />
          </Field>
          <Field label="Default meta description">
            <textarea className={inputCls} rows={2} value={f.default_meta_description} onChange={(e) => set('default_meta_description', e.target.value)} />
          </Field>
          <Field label="Default OG image URL">
            <input className={inputCls} value={f.default_og_image} onChange={(e) => set('default_og_image', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-1 font-display text-[16px] font-bold text-black">Tracking & scripts</h2>
        <p className="m-0 mb-4 text-[12.5px] text-body-dim">
          Enter IDs for standard tags, or paste raw snippets. All are injected into the site head/body.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Google Analytics ID"><input className={inputCls} placeholder="G-XXXXXXXXXX" value={f.ga_id} onChange={(e) => set('ga_id', e.target.value)} /></Field>
          <Field label="Google Tag Manager ID"><input className={inputCls} placeholder="GTM-XXXXXXX" value={f.gtm_id} onChange={(e) => set('gtm_id', e.target.value)} /></Field>
          <Field label="Facebook Pixel ID"><input className={inputCls} value={f.fb_pixel_id} onChange={(e) => set('fb_pixel_id', e.target.value)} /></Field>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <Field label="Header scripts (raw HTML/JS)"><textarea className={`${inputCls} font-mono text-[12px]`} rows={4} value={f.header_scripts} onChange={(e) => set('header_scripts', e.target.value)} /></Field>
          <Field label="Body start scripts"><textarea className={`${inputCls} font-mono text-[12px]`} rows={3} value={f.body_start_scripts} onChange={(e) => set('body_start_scripts', e.target.value)} /></Field>
          <Field label="Footer scripts"><textarea className={`${inputCls} font-mono text-[12px]`} rows={3} value={f.footer_scripts} onChange={(e) => set('footer_scripts', e.target.value)} /></Field>
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-black">reCAPTCHA & URL structure</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="reCAPTCHA site key" hint="Public key. Secret key lives in .env (RECAPTCHA_SECRET_KEY).">
            <input className={inputCls} value={f.recaptcha_site_key} onChange={(e) => set('recaptcha_site_key', e.target.value)} />
          </Field>
          <Field label="reCAPTCHA min score">
            <input type="number" step="0.1" min="0" max="1" className={inputCls} value={f.recaptcha_threshold} onChange={(e) => set('recaptcha_threshold', e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="URL config (JSON)" hint='e.g. {"implementations_base":"implementations","insights_base":"insights"}'>
            <textarea className={`${inputCls} font-mono text-[12px]`} rows={4} value={f.url_config} onChange={(e) => set('url_config', e.target.value)} />
          </Field>
        </div>
      </Card>

      {/* -------- Footer: social links -------- */}
      <Card>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="m-0 font-display text-[16px] font-bold text-black">Footer social links</h2>
          <button
            type="button"
            onClick={addSocial}
            className="rounded-[9px] border border-surface-line2 px-3 py-1.5 text-[13px] font-semibold text-body-soft hover:border-brand hover:text-black"
          >
            + Add link
          </button>
        </div>
        <p className="m-0 mb-4 text-[12.5px] text-body-dim">
          Pick a platform to show its icon (e.g. LinkedIn, YouTube). Choose “Other” to show a text label instead.
        </p>
        {social.length === 0 && <p className="m-0 text-[13px] text-body-dim">No social links yet.</p>}
        <div className="flex flex-col gap-3">
          {social.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2.5 rounded-[12px] border border-surface-line2 bg-white p-3">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-surface-line2 text-[11px] font-bold text-body-faint">
                {s.platform ? <SocialIcon platform={s.platform} /> : (s.label || '?').slice(0, 2)}
              </span>
              <select
                className={`${inputCls} w-auto min-w-[140px] flex-none`}
                value={s.platform ?? ''}
                onChange={(e) => {
                  const platform = e.target.value;
                  const preset = PLATFORMS.find((p) => p.value === platform);
                  updateSocial(i, { platform, label: platform ? preset?.label ?? s.label : s.label });
                }}
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {!s.platform && (
                <input
                  className={`${inputCls} w-[120px] flex-none`}
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => updateSocial(i, { label: e.target.value })}
                />
              )}
              <input
                className={`${inputCls} min-w-[200px] flex-1`}
                placeholder="https://…"
                value={s.url}
                onChange={(e) => updateSocial(i, { url: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removeSocial(i)}
                aria-label="Remove link"
                className="rounded-[9px] border border-surface-line2 px-3 py-2 text-[13px] font-semibold text-red-600 hover:border-red-400/60 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* -------- Footer: phone numbers -------- */}
      <Card>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="m-0 font-display text-[16px] font-bold text-black">Footer phone numbers</h2>
          <button
            type="button"
            onClick={addPhone}
            className="rounded-[9px] border border-surface-line2 px-3 py-1.5 text-[13px] font-semibold text-body-soft hover:border-brand hover:text-black"
          >
            + Add phone
          </button>
        </div>
        <p className="m-0 mb-4 text-[12.5px] text-body-dim">Region label is optional (e.g. UK, US, AUS).</p>
        {phones.length === 0 && <p className="m-0 text-[13px] text-body-dim">No phone numbers yet.</p>}
        <div className="flex flex-col gap-3">
          {phones.map((p, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2.5 rounded-[12px] border border-surface-line2 bg-white p-3">
              <input
                className={`${inputCls} w-[110px] flex-none`}
                placeholder="Region"
                value={p.region}
                onChange={(e) => updatePhone(i, { region: e.target.value })}
              />
              <input
                className={`${inputCls} min-w-[200px] flex-1`}
                placeholder="+44 20 0000 0000"
                value={p.number}
                onChange={(e) => updatePhone(i, { number: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removePhone(i)}
                aria-label="Remove phone"
                className="rounded-[9px] border border-surface-line2 px-3 py-2 text-[13px] font-semibold text-red-600 hover:border-red-400/60 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Field label="Contact emails" hint="Comma or line separated.">
            <textarea className={inputCls} rows={2} value={emails} onChange={(e) => setEmails(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-black">Organization schema (JSON-LD)</h2>
        <Field label="Organization schema">
          <textarea className={`${inputCls} font-mono text-[12px]`} rows={6} value={f.organization_schema} onChange={(e) => set('organization_schema', e.target.value)} />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={pending} className="rounded-[10px] bg-brand px-6 py-3 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60">
          {pending ? 'Saving…' : 'Save settings'}
        </button>
        {msg && <span className="text-[13px] text-emerald-600">{msg}</span>}
      </div>
    </div>
  );
}
