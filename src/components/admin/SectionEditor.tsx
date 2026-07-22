'use client';

import { useState, useTransition } from 'react';
import type { PageSection } from '@/lib/types';
import { saveSection, deleteSection } from '@/app/admin/actions';
import { RichEditor } from './RichEditor';
import { Field, inputCls } from './ui';
import { SchemaEditor } from './fields';
import { SECTION_SCHEMAS } from './sectionSchemas';

const HTML_KEYS = /(^html$|_html$)/;
const MULTILINE = new Set(['subhead', 'body', 'text', 'description', 'note', 'html']);

function isHtmlKey(k: string) {
  return HTML_KEYS.test(k);
}

export function SectionEditor({ section, onDone }: { section: PageSection; onDone: () => void }) {
  const schema = SECTION_SCHEMAS[section.type];
  const [content, setContent] = useState<Record<string, any>>(section.content || {});
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const d: Record<string, string> = {};
    for (const [k, v] of Object.entries(section.content || {})) {
      if (v && typeof v === 'object') d[k] = JSON.stringify(v, null, 2);
    }
    return d;
  });
  const [rawMode, setRawMode] = useState(false);
  const [rawText, setRawText] = useState(JSON.stringify(section.content || {}, null, 2));
  const [err, setErr] = useState('');
  const [pending, start] = useTransition();

  function setKey(k: string, v: any) {
    setContent((prev) => ({ ...prev, [k]: v }));
  }
  function setComplex(k: string, text: string) {
    setDrafts((prev) => ({ ...prev, [k]: text }));
    try {
      setKey(k, JSON.parse(text));
      setErr('');
    } catch {
      setErr(`Invalid JSON in "${k}"`);
    }
  }

  function save() {
    let finalContent = content;
    if (rawMode) {
      try {
        finalContent = JSON.parse(rawText);
      } catch {
        setErr('Invalid JSON');
        return;
      }
    }
    setErr('');
    start(async () => {
      await saveSection({ ...section, content: finalContent });
      onDone();
    });
  }

  const entries = Object.entries(content);

  return (
    <div className="mt-3 rounded-[12px] border border-surface-line2 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[13px] text-body-dim">
          Editing <b className="text-body-soft">{section.type}</b>
        </span>
        <button
          onClick={() => {
            if (!rawMode) {
              // visual -> raw: snapshot current content
              setRawText(JSON.stringify(content, null, 2));
            } else {
              // raw -> visual: parse edits back into content
              try {
                setContent(JSON.parse(rawText));
                setErr('');
              } catch {
                setErr('Invalid JSON — fix before switching to the visual editor.');
                return;
              }
            }
            setRawMode((v) => !v);
          }}
          className="rounded border border-surface-line2 px-2.5 py-1 text-[12px] font-semibold text-body-faint hover:bg-black/5"
        >
          {rawMode ? 'Visual editor' : 'Raw JSON'}
        </button>
      </div>

      {rawMode ? (
        <textarea
          className={`${inputCls} font-mono text-[12.5px]`}
          rows={16}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
      ) : schema ? (
        <SchemaEditor schema={schema} value={content} onChange={setContent} />
      ) : (
        // Fallback generic editor for section types without a schema.
        <div className="flex flex-col gap-4">
          {entries.length === 0 && (
            <p className="text-[13px] text-body-dim">
              No fields yet. Switch to Raw JSON to add content.
            </p>
          )}
          {entries.map(([k, v]) => {
            if (v !== null && typeof v === 'object') {
              return (
                <Field key={k} label={k} hint="List / structured data (JSON)">
                  <textarea
                    className={`${inputCls} font-mono text-[12px]`}
                    rows={Math.min(14, JSON.stringify(v, null, 2).split('\n').length + 1)}
                    value={drafts[k] ?? JSON.stringify(v, null, 2)}
                    onChange={(e) => setComplex(k, e.target.value)}
                  />
                </Field>
              );
            }
            if (typeof v === 'boolean') {
              return (
                <label key={k} className="flex items-center gap-2 text-[13px] text-body-soft">
                  <input type="checkbox" checked={v} onChange={(e) => setKey(k, e.target.checked)} className="h-4 w-4 accent-[#FFCB2E]" />
                  {k}
                </label>
              );
            }
            if (isHtmlKey(k)) {
              return (
                <Field key={k} label={`${k} (WYSIWYG)`}>
                  <RichEditor value={String(v ?? '')} onChange={(html) => setKey(k, html)} />
                </Field>
              );
            }
            const multiline = MULTILINE.has(k) || String(v ?? '').length > 90;
            return (
              <Field key={k} label={k}>
                {multiline ? (
                  <textarea className={inputCls} rows={3} value={String(v ?? '')} onChange={(e) => setKey(k, e.target.value)} />
                ) : (
                  <input className={inputCls} value={String(v ?? '')} onChange={(e) => setKey(k, e.target.value)} />
                )}
              </Field>
            );
          })}
        </div>
      )}

      {err && <p className="mt-3 text-[13px] text-red-600">{err}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-[10px] bg-brand px-4 py-2 text-[13px] font-bold text-ink hover:bg-brand-300 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save section'}
        </button>
        <button onClick={onDone} className="text-[13px] font-semibold text-body-faint hover:text-black">
          Cancel
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this section?')) start(() => deleteSection(section.id, section.page_id));
          }}
          className="ml-auto text-[13px] font-semibold text-red-600 hover:text-red-600"
        >
          Delete section
        </button>
      </div>
    </div>
  );
}
