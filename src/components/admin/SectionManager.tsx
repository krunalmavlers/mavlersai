'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import type { PageSection } from '@/lib/types';
import { saveSection, reorderSection, reorderSections } from '@/app/admin/actions';
import { SectionEditor } from './SectionEditor';
import { Card } from './ui';

const SECTION_TYPES = [
  'hero',
  'stats_bar',
  'feature_grid',
  'partnership',
  'service_capabilities',
  'services_detail',
  'connect_grid',
  'implementations',
  'cta_band',
  'process_timeline',
  'engagement_models',
  'pillars',
  'trust_band',
  'rich_text',
  'faq',
  'comparison_table',
  'packages',
  'newsletter',
  'form',
];

const TEMPLATES: Record<string, any> = {
  hero: { badge: '', heading_html: '<span>Headline</span>', subhead: '', primary_cta: { label: 'Book a Call', href: '/book-a-call' }, trust_items: [] },
  rich_text: { eyebrow: '', heading: '', html: '<p>Write here…</p>' },
  cta_band: { variant: 'final', heading: 'Call to action', body: '', ctas: [{ label: 'Book a Call', href: '/book-a-call', style: 'primary' }] },
  feature_grid: { eyebrow: '', heading: '', columns: 3, items: [{ title: 'Item', body: '' }] },
  faq: { eyebrow: 'FAQ', heading: 'Questions', items: [{ q: 'Question?', a: 'Answer.' }] },
  form: { form_key: 'book-a-call' },
  pillars: { eyebrow: '', heading: '', items: [{ title: 'Pillar', body: '' }] },
  process_timeline: { eyebrow: '', heading: '', steps: [{ n: '1', title: 'Step' }] },
  stats_bar: { stats: [{ num: '10+', label: 'label' }], logos: [] },
  connect_grid: { eyebrow: '', heading: '', items: ['Item'] },
  implementations: { eyebrow: 'Implementations', heading: 'AI in action across industries', subhead: '', cta: { label: 'Explore Our Implementations', href: '/implementations' } },
  partnership: { eyebrow: '', heading: '', left_title: 'You bring', left_items: [], right_title: 'We deliver', right_items: [] },
  service_capabilities: { eyebrow: '', heading: '', items: [{ mono: 'AI', title: 'Service', body: '' }] },
  services_detail: {
    items: [
      { id: 'service-1', short: 'Service', mono: 'AI', cat: 'Category', title: 'Service title', tagline: '', stack: [], outcome: '', build: [], detail: [] },
    ],
    cta_primary: { label: 'Connect with an AI expert', href: '/book-a-call' },
    cta_secondary: { label: 'Submit a project brief', href: '/book-a-call' },
  },
  engagement_models: { eyebrow: '', heading: '', items: [{ step: '01', title: 'Model', body: '', featured: false }] },
  trust_band: { eyebrow: '', text: '' },
  comparison_table: { eyebrow: '', heading: '', columns: ['', 'A', 'B'], rows: [{ label: 'Row', values: ['x', 'y'] }] },
  packages: { eyebrow: '', heading: '', items: [{ name: 'Package', duration: '', desc: '', featured: false }] },
  newsletter: { heading: 'Subscribe', body: '', placeholder: 'you@agency.com', button: 'Subscribe' },
};

export function SectionManager({ pageId, sections }: { pageId: string; sections: PageSection[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [newType, setNewType] = useState('rich_text');
  const [pending, start] = useTransition();

  const byId = new Map(sections.map((s) => [s.id, s]));
  const serverOrder = [...sections].sort((a, b) => a.sort_order - b.sort_order).map((s) => s.id);
  // Local ordering so drag-and-drop feels instant; re-syncs when the server data changes.
  const [order, setOrder] = useState<string[]>(serverOrder);
  const serverKey = serverOrder.join(',');
  useEffect(() => {
    setOrder(serverOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  const dragId = useRef<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const maxOrder = sections.reduce((m, s) => Math.max(m, s.sort_order), 0);

  function addSection() {
    start(async () => {
      await saveSection({
        page_id: pageId,
        type: newType,
        sort_order: maxOrder + 1,
        is_visible: true,
        content: TEMPLATES[newType] || {},
      });
    });
  }

  function persist(next: string[]) {
    setOrder(next);
    start(() => reorderSections(pageId, next) as any);
  }

  function reindex(fromId: string, toId: string) {
    if (fromId === toId) return;
    const next = [...order];
    const from = next.indexOf(fromId);
    const to = next.indexOf(toId);
    if (from < 0 || to < 0) return;
    next.splice(to, 0, next.splice(from, 1)[0]);
    persist(next);
  }

  function move(id: string, dir: -1 | 1) {
    const idx = order.indexOf(id);
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[idx], next[target]] = [next[target], next[idx]];
    persist(next);
  }

  function toggleVisible(s: PageSection) {
    start(() => saveSection({ ...s, is_visible: !s.is_visible }) as any);
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 font-display text-[18px] font-bold text-black">
          Sections <span className="ml-1 text-[12px] font-normal text-body-dim">— drag to reorder</span>
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="rounded-[9px] border border-surface-line2 bg-white px-3 py-2 text-[13px] text-black"
          >
            {SECTION_TYPES.map((t) => (
              <option key={t} value={t} className="bg-surface-tint2">
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={addSection}
            disabled={pending}
            className="rounded-[9px] bg-brand px-3.5 py-2 text-[13px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
          >
            + Add section
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {order.map((id) => byId.get(id)).filter(Boolean).map((s) => {
          const sec = s as PageSection;
          return (
            <div
              key={sec.id}
              draggable
              onDragStart={() => {
                dragId.current = sec.id;
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOver !== sec.id) setDragOver(sec.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId.current) reindex(dragId.current, sec.id);
                dragId.current = null;
                setDragOver(null);
              }}
              onDragEnd={() => {
                dragId.current = null;
                setDragOver(null);
              }}
              className={`rounded-[12px] border bg-white p-3 transition-colors ${
                dragOver === sec.id ? 'border-brand' : 'border-surface-line2'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="cursor-grab select-none text-body-dim active:cursor-grabbing" title="Drag to reorder">
                  ⠿
                </span>
                <span className="font-display text-[14px] font-semibold text-black">{sec.type}</span>
                {!sec.is_visible && (
                  <span className="rounded bg-surface-tint2 px-2 py-0.5 text-[11px] text-body-dim">hidden</span>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                  <button onClick={() => move(sec.id, -1)} className="rounded border border-surface-line2 px-2 py-1 text-[12px] text-body-faint hover:bg-black/5">
                    ↑
                  </button>
                  <button onClick={() => move(sec.id, 1)} className="rounded border border-surface-line2 px-2 py-1 text-[12px] text-body-faint hover:bg-black/5">
                    ↓
                  </button>
                  <button onClick={() => toggleVisible(sec)} className="rounded border border-surface-line2 px-2 py-1 text-[12px] text-body-faint hover:bg-black/5">
                    {sec.is_visible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => setEditing(editing === sec.id ? null : sec.id)}
                    className="rounded bg-surface-tint2 px-2.5 py-1 text-[12px] font-semibold text-black hover:bg-black/5"
                  >
                    {editing === sec.id ? 'Close' : 'Edit'}
                  </button>
                </div>
              </div>
              {editing === sec.id && <SectionEditor section={sec} onDone={() => setEditing(null)} />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
