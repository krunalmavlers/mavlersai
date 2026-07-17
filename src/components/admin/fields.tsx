'use client';

import { RichEditor } from './RichEditor';
import { inputCls } from './ui';
import { emptyForDesc, emptyObject, type FieldDesc } from './sectionSchemas';

/* Recursive, schema-driven editor for section content. */

export function SchemaEditor({
  schema,
  value,
  onChange,
}: {
  schema: FieldDesc[];
  value: Record<string, any>;
  onChange: (v: Record<string, any>) => void;
}) {
  const setKey = (k: string, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-4">
      {schema.map((desc) => (
        <FieldRenderer
          key={desc.key}
          desc={desc}
          value={value?.[desc.key]}
          onChange={(v) => setKey(desc.key, v)}
        />
      ))}
    </div>
  );
}

function Label({ desc }: { desc: FieldDesc }) {
  return (
    <div className="mb-1.5">
      <span className="block text-[13px] font-semibold text-body-soft">{desc.label}</span>
      {desc.hint && <span className="block text-[12px] text-body-dim">{desc.hint}</span>}
    </div>
  );
}

function FieldRenderer({
  desc,
  value,
  onChange,
}: {
  desc: FieldDesc;
  value: any;
  onChange: (v: any) => void;
}) {
  switch (desc.kind) {
    case 'text':
      return (
        <label className="block">
          <Label desc={desc} />
          <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case 'textarea':
      return (
        <label className="block">
          <Label desc={desc} />
          <textarea className={inputCls} rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case 'richtext':
      return (
        <div>
          <Label desc={desc} />
          <RichEditor value={String(value ?? '')} onChange={onChange} />
        </div>
      );
    case 'select':
      return (
        <label className="block">
          <Label desc={desc} />
          <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {(desc.options || []).map((o) => (
              <option key={o} value={o} className="bg-ink">
                {o}
              </option>
            ))}
          </select>
        </label>
      );
    case 'bool':
      return (
        <label className="flex items-center gap-2 text-[13px] text-body-soft">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#FFCB2E]" />
          {desc.label}
        </label>
      );
    case 'cta': {
      const v = value || {};
      return (
        <div>
          <Label desc={desc} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Label" value={v.label ?? ''} onChange={(e) => onChange({ ...v, label: e.target.value })} />
            <input className={inputCls} placeholder="Link (/path)" value={v.href ?? ''} onChange={(e) => onChange({ ...v, href: e.target.value })} />
          </div>
        </div>
      );
    }
    case 'stringList':
      return <StringListEditor desc={desc} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case 'objectList':
      return <ObjectListEditor desc={desc} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case 'group': {
      const v = value || emptyObject(desc.itemFields || []);
      return (
        <div className="rounded-[10px] border border-white/10 p-3">
          <Label desc={desc} />
          <div className="flex flex-col gap-3">
            {(desc.itemFields || []).map((f) => (
              <FieldRenderer key={f.key} desc={f} value={v[f.key]} onChange={(nv) => onChange({ ...v, [f.key]: nv })} />
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function StringListEditor({
  desc,
  value,
  onChange,
}: {
  desc: FieldDesc;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <Label desc={desc} />
      <div className="flex flex-col gap-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              className={inputCls}
              value={item}
              onChange={(e) => {
                const copy = [...value];
                copy[i] = e.target.value;
                onChange(copy);
              }}
            />
            <ListButtons
              onUp={() => onChange(moveItem(value, i, i - 1))}
              onDown={() => onChange(moveItem(value, i, i + 1))}
              onDelete={() => onChange(value.filter((_, j) => j !== i))}
            />
          </div>
        ))}
        <AddButton label="Add item" onClick={() => onChange([...value, ''])} />
      </div>
    </div>
  );
}

function ObjectListEditor({
  desc,
  value,
  onChange,
}: {
  desc: FieldDesc;
  value: any[];
  onChange: (v: any[]) => void;
}) {
  const fields = desc.itemFields || [];
  return (
    <div>
      <Label desc={desc} />
      <div className="flex flex-col gap-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-[10px] border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-body-dim">#{i + 1}</span>
              <ListButtons
                onUp={() => onChange(moveItem(value, i, i - 1))}
                onDown={() => onChange(moveItem(value, i, i + 1))}
                onDelete={() => onChange(value.filter((_, j) => j !== i))}
              />
            </div>
            <div className="flex flex-col gap-3">
              {fields.map((f) => (
                <FieldRenderer
                  key={f.key}
                  desc={f}
                  value={item?.[f.key]}
                  onChange={(nv) => {
                    const copy = [...value];
                    copy[i] = { ...copy[i], [f.key]: nv };
                    onChange(copy);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        <AddButton label={`Add ${desc.label.toLowerCase()}`} onClick={() => onChange([...value, emptyObject(fields)])} />
      </div>
    </div>
  );
}

function ListButtons({ onUp, onDown, onDelete }: { onUp: () => void; onDown: () => void; onDelete: () => void }) {
  const b = 'rounded border border-white/12 px-2 py-1 text-[12px] text-body-faint hover:bg-white/5';
  return (
    <div className="flex flex-shrink-0 items-center gap-1">
      <button type="button" className={b} onClick={onUp}>
        ↑
      </button>
      <button type="button" className={b} onClick={onDown}>
        ↓
      </button>
      <button type="button" className="rounded border border-red-500/40 px-2 py-1 text-[12px] text-red-400 hover:bg-red-500/10" onClick={onDelete}>
        ×
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start rounded-[9px] border border-white/15 px-3 py-1.5 text-[12.5px] font-semibold text-body-soft hover:bg-white/5"
    >
      + {label}
    </button>
  );
}

export { emptyForDesc };
