'use client';

import { useState, useTransition } from 'react';
import { saveSettings } from '@/app/admin/actions';
import { Card, Field, inputCls } from './ui';

export function SettingsEditor({ settings }: { settings: any }) {
  const [f, setF] = useState<any>({
    ...settings,
    social_links: JSON.stringify(settings.social_links || [], null, 2),
    contact: JSON.stringify(settings.contact || {}, null, 2),
    url_config: JSON.stringify(settings.url_config || {}, null, 2),
    organization_schema: JSON.stringify(settings.organization_schema || {}, null, 2),
  });
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const set = (k: string, v: any) => setF((prev: any) => ({ ...prev, [k]: v }));

  function save() {
    setMsg('');
    start(async () => {
      await saveSettings(f);
      setMsg('Settings saved.');
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">Branding</h2>
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
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">Default SEO</h2>
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
        <h2 className="m-0 mb-1 font-display text-[16px] font-bold text-white">Tracking & scripts</h2>
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
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">reCAPTCHA & URL structure</h2>
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

      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">Social, contact & schema (JSON)</h2>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Social links" hint='[{"label":"in","url":"https://..."}]'>
            <textarea className={`${inputCls} font-mono text-[12px]`} rows={4} value={f.social_links} onChange={(e) => set('social_links', e.target.value)} />
          </Field>
          <Field label="Contact" hint='{"emails":[],"phones":[{"region":"UK","number":"..."}]}'>
            <textarea className={`${inputCls} font-mono text-[12px]`} rows={4} value={f.contact} onChange={(e) => set('contact', e.target.value)} />
          </Field>
          <Field label="Organization schema (JSON-LD)">
            <textarea className={`${inputCls} font-mono text-[12px]`} rows={6} value={f.organization_schema} onChange={(e) => set('organization_schema', e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={pending} className="rounded-[10px] bg-brand px-6 py-3 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60">
          {pending ? 'Saving…' : 'Save settings'}
        </button>
        {msg && <span className="text-[13px] text-emerald-300">{msg}</span>}
      </div>
    </div>
  );
}
