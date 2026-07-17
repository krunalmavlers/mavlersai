'use client';

import { useState, useTransition } from 'react';
import type { Page } from '@/lib/types';
import { savePage, deletePage } from '@/app/admin/actions';
import { Card, Field, inputCls } from './ui';

export function PageEditor({ page, isNew }: { page: any; isNew: boolean }) {
  const [f, setF] = useState({
    ...page,
    schema_jsonld:
      typeof page.schema_jsonld === 'string'
        ? page.schema_jsonld
        : JSON.stringify(page.schema_jsonld || {}, null, 2),
  });
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');

  const set = (k: string, v: any) => setF((prev: any) => ({ ...prev, [k]: v }));

  function save() {
    setMsg('');
    start(async () => {
      await savePage(f);
      setMsg('Saved.');
    });
  }

  return (
    <Card className="mb-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Title">
          <input className={inputCls} value={f.title || ''} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="URL slug" hint="Empty = home page. e.g. about, services/pricing">
          <input className={inputCls} value={f.slug || ''} onChange={(e) => set('slug', e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 border-t border-white/8 pt-5">
        <div className="mb-3 text-[12px] font-bold uppercase tracking-wide text-brand">SEO</div>
        <div className="grid grid-cols-1 gap-4">
          <Field label="SEO title">
            <input className={inputCls} value={f.seo_title || ''} onChange={(e) => set('seo_title', e.target.value)} />
          </Field>
          <Field label="Meta description">
            <textarea className={inputCls} rows={2} value={f.meta_description || ''} onChange={(e) => set('meta_description', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Meta keywords">
              <input className={inputCls} value={f.meta_keywords || ''} onChange={(e) => set('meta_keywords', e.target.value)} />
            </Field>
            <Field label="OG image URL">
              <input className={inputCls} value={f.og_image || ''} onChange={(e) => set('og_image', e.target.value)} />
            </Field>
            <Field label="Canonical URL">
              <input className={inputCls} value={f.canonical_url || ''} onChange={(e) => set('canonical_url', e.target.value)} />
            </Field>
            <Field label="Robots">
              <input className={inputCls} value={f.robots || ''} onChange={(e) => set('robots', e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-white/8 pt-5">
        <Field label="Schema (JSON-LD)" hint="Rendered as application/ld+json on this page.">
          <textarea
            className={`${inputCls} font-mono text-[12.5px]`}
            rows={6}
            value={f.schema_jsonld}
            onChange={(e) => set('schema_jsonld', e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/8 pt-5">
        <Field label="Status">
          <select className={inputCls} value={f.status} onChange={(e) => set('status', e.target.value)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            className={inputCls}
            value={f.sort_order ?? 0}
            onChange={(e) => set('sort_order', e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-[10px] bg-brand px-5 py-2.5 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
        >
          {pending ? 'Saving…' : isNew ? 'Create page' : 'Save changes'}
        </button>
        {!isNew && (
          <button
            onClick={() => {
              if (confirm('Delete this page and all its sections?')) start(() => deletePage(page.id));
            }}
            className="rounded-[10px] border border-red-500/40 px-4 py-2.5 text-[14px] font-semibold text-red-400 hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
        {msg && <span className="text-[13px] text-emerald-300">{msg}</span>}
      </div>
    </Card>
  );
}
