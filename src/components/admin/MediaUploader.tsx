'use client';

import { useRef, useState } from 'react';
import { Card } from './ui';

type Uploaded = { path: string; fullUrl: string; name: string };

export function MediaUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Uploaded[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function upload(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    try {
      for (const file of list) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/admin/upload-image', { method: 'POST', body });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `Upload failed for ${file.name}.`);
          continue;
        }
        const path: string = json.path || json.url;
        const fullUrl =
          typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
        setItems((prev) => [{ path, fullUrl, name: file.name }, ...prev]);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 1500);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            upload(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragOver ? 'border-brand bg-brand/10' : 'border-white/15 bg-white/[0.02] hover:border-white/30'
          }`}
        >
          <span className="text-[15px] font-semibold text-white">
            {busy ? 'Uploading…' : 'Drop an image here, or click to choose'}
          </span>
          <span className="text-[12.5px] text-body-dim">PNG, JPG, WEBP, GIF, SVG, AVIF · up to 8 MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
        </div>
        {error && <p className="mt-3 text-[13px] text-red-400">{error}</p>}
      </Card>

      {items.length > 0 && (
        <Card>
          <h2 className="m-0 mb-4 font-display text-[16px] font-bold text-white">Uploaded</h2>
          <div className="grid grid-cols-1 gap-4">
            {items.map((it) => (
              <div
                key={it.path}
                className="flex items-center gap-4 rounded-[12px] border border-white/9 bg-white/[0.02] p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.path}
                  alt={it.name}
                  className="h-16 w-16 flex-shrink-0 rounded-[8px] border border-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 truncate text-[13px] font-semibold text-body-soft">{it.name}</div>
                  <code className="block truncate rounded-[7px] bg-black/40 px-2.5 py-1.5 text-[12.5px] text-brand-200">
                    {it.fullUrl}
                  </code>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button
                    onClick={() => copy(it.fullUrl)}
                    className="rounded-[9px] bg-brand px-3.5 py-2 text-[12.5px] font-bold text-ink hover:bg-brand-300"
                  >
                    {copied === it.fullUrl ? 'Copied ✓' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => copy(it.path)}
                    className="rounded-[9px] border border-white/15 px-3.5 py-2 text-[12.5px] font-semibold text-body-soft hover:border-white/30"
                  >
                    {copied === it.path ? 'Copied ✓' : 'Copy path'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
