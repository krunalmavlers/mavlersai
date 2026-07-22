'use client';

import { useState, useTransition } from 'react';
import type { Author, Category, Tag } from '@/lib/types';
import { savePost, deletePost } from '@/app/admin/actions';
import { RichEditor } from './RichEditor';
import { Card, Field, inputCls } from './ui';
import { slugify } from '@/lib/utils';

export function PostEditor({
  post,
  isNew,
  categories,
  tags,
  authors,
}: {
  post: any;
  isNew: boolean;
  categories: Category[];
  tags: Tag[];
  authors: Author[];
}) {
  const [f, setF] = useState({
    ...post,
    meta: typeof post.meta === 'string' ? post.meta : JSON.stringify(post.meta || {}, null, 2),
    schema_jsonld:
      typeof post.schema_jsonld === 'string'
        ? post.schema_jsonld
        : JSON.stringify(post.schema_jsonld || {}, null, 2),
    published_at: post.published_at ? String(post.published_at).slice(0, 10) : '',
    category_ids: post.category_ids || [],
    tag_ids: post.tag_ids || [],
  });
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (k: string, v: any) => setF((prev: any) => ({ ...prev, [k]: v }));
  const isImpl = f.content_type === 'implementation';
  const isCreated = !!f.id;

  function toggleArr(key: 'category_ids' | 'tag_ids', id: string) {
    setF((prev: any) => {
      const arr: string[] = prev[key];
      return { ...prev, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
    });
  }

  function save() {
    setMsg(null);
    if (!f.title?.trim()) {
      setMsg({ ok: false, text: 'Please add a title before saving.' });
      return;
    }
    start(async () => {
      try {
        const res = await savePost(f);
        if (res?.ok) {
          // First save of a new post: adopt its id + reflect it in the URL,
          // so further saves update instead of creating duplicates.
          if (!f.id && res.id) {
            setF((prev: any) => ({ ...prev, id: res.id }));
            if (typeof window !== 'undefined')
              window.history.replaceState(null, '', `/admin/posts/${res.id}`);
          }
          setMsg({
            ok: true,
            text:
              f.status === 'published'
                ? 'Saved & published — it’s now live on the site.'
                : 'Saved as draft.',
          });
        } else {
          setMsg({ ok: false, text: 'Could not save. Please try again.' });
        }
      } catch (e: any) {
        setMsg({ ok: false, text: e?.message || 'Could not save. Please try again.' });
      }
    });
  }

  const catGroups = ['category', 'industry', 'lifecycle'].filter((tax) =>
    categories.some((c) => c.taxonomy === tax),
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Title">
              <input
                className={inputCls}
                value={f.title}
                onChange={(e) => {
                  set('title', e.target.value);
                  if (isNew && !f.slug) set('slug', slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Slug">
              <input className={inputCls} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
            </Field>
            <Field label="Excerpt / dek">
              <textarea className={inputCls} rows={2} value={f.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            </Field>
            <Field label="Body (WYSIWYG)">
              <RichEditor value={f.body_html} onChange={(html) => set('body_html', html)} />
            </Field>
          </div>
        </Card>

        {isImpl && (
          <Card>
            <Field label="Implementation details (JSON)" hint="metrics, challenge, architecture, delivered, stack, type, result_headline, related">
              <textarea className={`${inputCls} font-mono text-[12px]`} rows={12} value={f.meta} onChange={(e) => set('meta', e.target.value)} />
            </Field>
          </Card>
        )}

        <Card>
          <div className="mb-3 text-[12px] font-bold uppercase tracking-wide text-brand-ink">SEO & Schema</div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="SEO title">
              <input className={inputCls} value={f.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
            </Field>
            <Field label="Meta description">
              <textarea className={inputCls} rows={2} value={f.meta_description} onChange={(e) => set('meta_description', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="OG image URL">
                <input className={inputCls} value={f.og_image} onChange={(e) => set('og_image', e.target.value)} />
              </Field>
              <Field label="Robots">
                <input className={inputCls} value={f.robots} onChange={(e) => set('robots', e.target.value)} />
              </Field>
            </div>
            <Field label="Schema (JSON-LD)">
              <textarea className={`${inputCls} font-mono text-[12px]`} rows={5} value={f.schema_jsonld} onChange={(e) => set('schema_jsonld', e.target.value)} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <div className="flex flex-col gap-4">
            <Field label="Type">
              <select className={inputCls} value={f.content_type} onChange={(e) => set('content_type', e.target.value)}>
                <option value="insight">insight</option>
                <option value="implementation">implementation</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={f.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </Field>
            <Field label="Published date">
              <input type="date" className={inputCls} value={f.published_at} onChange={(e) => set('published_at', e.target.value)} />
            </Field>
            <Field label="Reading time">
              <input className={inputCls} value={f.reading_time} onChange={(e) => set('reading_time', e.target.value)} placeholder="6 min" />
            </Field>
            <Field label="Cover image URL">
              <input className={inputCls} value={f.cover_image} onChange={(e) => set('cover_image', e.target.value)} />
            </Field>
            <Field label="Author">
              <select className={inputCls} value={f.author_id || ''} onChange={(e) => set('author_id', e.target.value)}>
                <option value="">—</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-2 text-[13px] text-body-soft">
              <input type="checkbox" checked={!!f.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="h-4 w-4 accent-[#FFCB2E]" />
              Featured
            </label>
          </div>
        </Card>

        <Card>
          <div className="mb-2 text-[13px] font-bold text-black">Categories</div>
          {catGroups.map((tax) => (
            <div key={tax} className="mb-3">
              <div className="mb-1.5 text-[11px] uppercase tracking-wide text-body-dim">{tax}</div>
              <div className="flex flex-wrap gap-1.5">
                {categories
                  .filter((c) => c.taxonomy === tax)
                  .map((c) => {
                    const on = f.category_ids.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleArr('category_ids', c.id)}
                        className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${
                          on ? 'border-brand bg-brand/15 text-brand-ink' : 'border-surface-line2 text-body-faint hover:border-black'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
          <div className="mb-2 mt-4 text-[13px] font-bold text-black">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => {
              const on = f.tag_ids.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleArr('tag_ids', t.id)}
                  className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${
                    on ? 'border-brand bg-brand/15 text-brand-ink' : 'border-surface-line2 text-body-faint hover:border-black'
                  }`}
                >
                  #{t.name}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <button
            onClick={save}
            disabled={pending}
            className="w-full rounded-[10px] bg-brand px-5 py-3 text-[14px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
          >
            {pending ? 'Saving…' : isCreated ? 'Save changes' : 'Create'}
          </button>
          {msg && (
            <div
              className={`mt-3 rounded-[9px] border px-3 py-2 text-[13px] font-medium ${
                msg.ok
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
                  : 'border-red-500/40 bg-red-500/10 text-red-600'
              }`}
            >
              {msg.ok ? '✓ ' : '⚠ '}
              {msg.text}
              {msg.ok && isCreated && (
                <>
                  {' '}
                  <a
                    href={`/${isImpl ? 'implementations' : 'insights'}/${f.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    View →
                  </a>
                </>
              )}
            </div>
          )}
          {isCreated && (
            <button
              onClick={() => {
                if (confirm('Delete this post?')) start(() => deletePost(f.id));
              }}
              className="mt-3 w-full rounded-[10px] border border-red-500/40 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}
