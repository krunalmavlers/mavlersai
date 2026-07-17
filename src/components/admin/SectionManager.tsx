'use client';

import { useState, useTransition } from 'react';
import type { PageSection } from '@/lib/types';
import { saveSection, reorderSection } from '@/app/admin/actions';
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

  function move(section: PageSection, dir: -1 | 1) {
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === section.id);
    const target = sorted[idx + dir];
    if (!target) return;
    start(async () => {
      await reorderSection(section.id, pageId, target.sort_order);
      await reorderSection(target.id, pageId, section.sort_order);
    });
  }

  function toggleVisible(s: PageSection) {
    start(() => saveSection({ ...s, is_visible: !s.is_visible }) as any);
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 font-display text-[18px] font-bold text-white">Sections</h2>
        <div className="flex items-center gap-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="rounded-[9px] border border-white/12 bg-white/5 px-3 py-2 text-[13px] text-white"
          >
            {SECTION_TYPES.map((t) => (
              <option key={t} value={t} className="bg-ink">
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
        {[...sections]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((s) => (
            <div key={s.id} className="rounded-[12px] border border-white/9 bg-white/[0.02] p-3">
              <div className="flex items-center gap-3">
                <span className="font-display text-[14px] font-semibold text-white">{s.type}</span>
                {!s.is_visible && (
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-body-dim">hidden</span>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                  <button onClick={() => move(s, -1)} className="rounded border border-white/12 px-2 py-1 text-[12px] text-body-faint hover:bg-white/5">
                    ↑
                  </button>
                  <button onClick={() => move(s, 1)} className="rounded border border-white/12 px-2 py-1 text-[12px] text-body-faint hover:bg-white/5">
                    ↓
                  </button>
                  <button onClick={() => toggleVisible(s)} className="rounded border border-white/12 px-2 py-1 text-[12px] text-body-faint hover:bg-white/5">
                    {s.is_visible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => setEditing(editing === s.id ? null : s.id)}
                    className="rounded bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-white/15"
                  >
                    {editing === s.id ? 'Close' : 'Edit'}
                  </button>
                </div>
              </div>
              {editing === s.id && <SectionEditor section={s} onDone={() => setEditing(null)} />}
            </div>
          ))}
      </div>
    </Card>
  );
}
