'use client';

import { useState, useTransition } from 'react';
import type { MenuItem } from '@/lib/types';
import { saveMenuItem, deleteMenuItem } from '@/app/admin/actions';
import { Card, inputCls } from './ui';

const LOCATIONS = ['header', 'footer', 'footer_legal', 'utility'];

export function MenusManager({ items }: { items: MenuItem[] }) {
  const [, start] = useTransition();
  const [draft, setDraft] = useState<any>({ location: 'header', label: '', url: '/', group_label: '', target: '_self', sort_order: 0 });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">Add menu item</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
          <select className={inputCls} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })}>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <input className={inputCls} placeholder="Label" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          <input className={inputCls} placeholder="URL" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
          <input className={inputCls} placeholder="Group (footer)" value={draft.group_label} onChange={(e) => setDraft({ ...draft, group_label: e.target.value })} />
          <input type="number" className={inputCls} placeholder="Order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
          <button
            onClick={() =>
              start(async () => {
                if (!draft.label) return;
                await saveMenuItem(draft);
                setDraft({ ...draft, label: '', url: '/' });
              })
            }
            className="rounded-[9px] bg-brand px-3 py-2 text-[13px] font-bold text-ink hover:bg-brand-300"
          >
            + Add
          </button>
        </div>
      </Card>

      {LOCATIONS.map((loc) => {
        const rows = items.filter((i) => i.location === loc).sort((a, b) => a.sort_order - b.sort_order);
        return (
          <Card key={loc}>
            <h2 className="m-0 mb-3 font-display text-[16px] font-bold capitalize text-white">{loc.replace('_', ' ')}</h2>
            {rows.length === 0 && <p className="m-0 text-[13px] text-body-dim">No items.</p>}
            <div className="flex flex-col gap-2">
              {rows.map((it) => (
                <MenuRow key={it.id} item={it} />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const [, start] = useTransition();
  const [f, setF] = useState<any>(item);
  return (
    <div className="grid grid-cols-1 gap-2 rounded-[9px] border border-white/6 p-2 md:grid-cols-[1.4fr_1.6fr_1fr_0.6fr_auto_auto]">
      <input className={inputCls} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} />
      <input className={inputCls} value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
      <input className={inputCls} placeholder="group" value={f.group_label || ''} onChange={(e) => setF({ ...f, group_label: e.target.value })} />
      <input type="number" className={inputCls} value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} />
      <button onClick={() => start(() => saveMenuItem(f) as any)} className="rounded-[9px] bg-white/10 px-3 py-2 text-[12px] font-bold text-white hover:bg-white/15">
        Save
      </button>
      <button onClick={() => start(() => deleteMenuItem(item.id) as any)} className="rounded-[9px] border border-red-500/40 px-3 py-2 text-[12px] font-semibold text-red-400 hover:bg-red-500/10">
        Del
      </button>
    </div>
  );
}
