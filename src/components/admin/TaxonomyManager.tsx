'use client';

import { useState, useTransition } from 'react';
import type { Category, Tag } from '@/lib/types';
import { saveCategory, deleteCategory, saveTag, deleteTag } from '@/app/admin/actions';
import { Card, inputCls } from './ui';
import { slugify } from '@/lib/utils';

export function TaxonomyManager({ categories, tags }: { categories: Category[]; tags: Tag[] }) {
  const [, start] = useTransition();
  const [cat, setCat] = useState({ name: '', slug: '', taxonomy: 'category', content_type: 'insight' });
  const [tag, setTag] = useState({ name: '', slug: '' });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="m-0 mb-4 font-display text-[18px] font-bold text-white">Categories</h2>
        <div className="mb-4 flex flex-col gap-2 rounded-[12px] border border-white/9 p-3">
          <input className={inputCls} placeholder="Name" value={cat.name} onChange={(e) => setCat({ ...cat, name: e.target.value, slug: cat.slug || slugify(e.target.value) })} />
          <input className={inputCls} placeholder="slug" value={cat.slug} onChange={(e) => setCat({ ...cat, slug: e.target.value })} />
          <div className="flex gap-2">
            <select className={inputCls} value={cat.taxonomy} onChange={(e) => setCat({ ...cat, taxonomy: e.target.value })}>
              <option value="category">category</option>
              <option value="industry">industry</option>
              <option value="lifecycle">lifecycle</option>
            </select>
            <select className={inputCls} value={cat.content_type} onChange={(e) => setCat({ ...cat, content_type: e.target.value })}>
              <option value="insight">insight</option>
              <option value="implementation">implementation</option>
              <option value="both">both</option>
            </select>
          </div>
          <button
            onClick={() =>
              start(async () => {
                if (!cat.name) return;
                await saveCategory(cat);
                setCat({ name: '', slug: '', taxonomy: cat.taxonomy, content_type: cat.content_type });
              })
            }
            className="rounded-[9px] bg-brand px-3 py-2 text-[13px] font-bold text-ink hover:bg-brand-300"
          >
            + Add category
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-[9px] border border-white/6 px-3 py-2 text-[13px]">
              <span className="font-semibold text-white">{c.name}</span>
              <span className="text-body-dim">/{c.slug}</span>
              <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-body-dim">{c.taxonomy}</span>
              <button
                onClick={() => start(() => deleteCategory(c.id) as any)}
                className="ml-auto text-[12px] font-semibold text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-4 font-display text-[18px] font-bold text-white">Tags</h2>
        <div className="mb-4 flex gap-2 rounded-[12px] border border-white/9 p-3">
          <input className={inputCls} placeholder="Name" value={tag.name} onChange={(e) => setTag({ name: e.target.value, slug: slugify(e.target.value) })} />
          <button
            onClick={() =>
              start(async () => {
                if (!tag.name) return;
                await saveTag(tag);
                setTag({ name: '', slug: '' });
              })
            }
            className="whitespace-nowrap rounded-[9px] bg-brand px-3 py-2 text-[13px] font-bold text-ink hover:bg-brand-300"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t.id} className="flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-[12.5px] text-body-soft">
              #{t.name}
              <button onClick={() => start(() => deleteTag(t.id) as any)} className="text-red-400 hover:text-red-300">
                ×
              </button>
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
