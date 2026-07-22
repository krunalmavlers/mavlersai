'use client';

import { useState, useTransition } from 'react';
import { updateSubmissionStatus, deleteSubmission } from '@/app/admin/actions';
import { Card } from './ui';

export function SubmissionRow({ submission }: { submission: any }) {
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();
  const data = submission.data || {};
  const date = new Date(submission.created_at).toLocaleString();

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            submission.status === 'new'
              ? 'bg-brand/15 text-brand-ink'
              : submission.status === 'spam'
                ? 'bg-red-500/15 text-red-600'
                : 'bg-surface-tint2 text-body-faint'
          }`}
        >
          {submission.status}
        </span>
        <span className="text-[14px] font-semibold text-black">
          {data.name || data.email || submission.form_key}
        </span>
        <span className="text-[12.5px] text-body-dim">{submission.form_key}</span>
        <span className="text-[12.5px] text-body-dim">{date}</span>
        {submission.recaptcha_score != null && (
          <span className="text-[12px] text-body-dim">score {submission.recaptcha_score}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setOpen((v) => !v)} className="rounded border border-surface-line2 px-2.5 py-1 text-[12px] text-body-faint hover:bg-black/5">
            {open ? 'Hide' : 'View'}
          </button>
          <button onClick={() => start(() => updateSubmissionStatus(submission.id, 'read') as any)} className="rounded border border-surface-line2 px-2.5 py-1 text-[12px] text-body-faint hover:bg-black/5">
            Read
          </button>
          <button onClick={() => start(() => updateSubmissionStatus(submission.id, 'spam') as any)} className="rounded border border-surface-line2 px-2.5 py-1 text-[12px] text-body-faint hover:bg-black/5">
            Spam
          </button>
          <button
            onClick={() => confirm('Delete submission?') && start(() => deleteSubmission(submission.id) as any)}
            className="rounded border border-red-500/40 px-2.5 py-1 text-[12px] text-red-600 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
      {open && (
        <table className="mt-3 w-full border-t border-surface-line2 text-left text-[13px]">
          <tbody>
            {Object.entries(data).map(([k, v]) => (
              <tr key={k} className="border-b border-surface-line2 last:border-0">
                <td className="w-40 py-2 pr-4 align-top font-semibold text-body-soft">{k}</td>
                <td className="py-2 text-body-faint">
                  {v && typeof v === 'object' && (v as any).__file ? (
                    <a
                      href={`/api/admin/file?path=${encodeURIComponent((v as any).path)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-brand-ink"
                    >
                      📎 {(v as any).name} ↓
                    </a>
                  ) : typeof v === 'object' ? (
                    JSON.stringify(v)
                  ) : (
                    String(v)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
