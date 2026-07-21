'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

/** TipTap WYSIWYG editor. Emits HTML via onChange. Supports inline images
 *  (uploaded to the public media bucket) inserted at the cursor. */
export function RichEditor({
  value,
  onChange,
  placeholder = 'Write content…',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [source, setSource] = useState(false);
  const [html, setHtml] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener' } }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { loading: 'lazy' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: { class: 'tiptap prose-mavlers max-w-none px-4 py-3' },
    },
    onUpdate: ({ editor }) => {
      const h = editor.getHTML();
      setHtml(h);
      onChange(h);
    },
    immediatelyRender: false,
  });

  // Toggle between WYSIWYG and raw-HTML source. Leaving source mode parses the
  // edited HTML back into the editor (so pasted markup renders correctly).
  function toggleSource() {
    if (source) {
      editor?.commands.setContent(html || '', true);
      onChange(html || '');
    } else {
      setHtml(editor?.getHTML() || '');
    }
    setSource((s) => !s);
  }

  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded px-2 py-1 text-[13px] font-semibold ${
      active ? 'bg-brand text-ink' : 'text-body-soft hover:bg-white/10'
    }`;

  async function uploadAndInsert(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Upload failed.');
      // Insert the image, then a paragraph right after so the cursor lands
      // below it and you can keep typing text after the image.
      editor!.chain().focus().setImage({ src: json.url }).createParagraphNear().focus().run();
    } catch (err: any) {
      // Fall back to letting the user paste a URL if the upload fails.
      const url = window.prompt(`Upload failed (${err.message}). Paste an image URL instead:`);
      if (url) editor!.chain().focus().setImage({ src: url }).createParagraphNear().focus().run();
    } finally {
      setUploading(false);
    }
  }

  // Create a throwaway file input only on demand — nothing persistent in the
  // DOM that a stray click in the editor could ever trigger.
  function pickImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const f = input.files?.[0];
      if (f) uploadAndInsert(f);
    };
    input.click();
  }

  return (
    <div className="rounded-[10px] border border-white/12 bg-white/5">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
        <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
        <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          &ldquo; Quote
        </button>
        <button
          type="button"
          className={btn(editor.isActive('link'))}
          onClick={() => {
            const url = window.prompt('Link URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        >
          Link
        </button>
        <button
          type="button"
          className={btn(false)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            pickImage();
          }}
          disabled={uploading}
          title="Insert an image at the cursor"
        >
          {uploading ? 'Uploading…' : '🖼 Image'}
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button
          type="button"
          className={`${btn(source)} ml-auto font-mono`}
          onClick={toggleSource}
          title="Edit / paste raw HTML"
        >
          &lt;/&gt; HTML
        </button>
      </div>
      {source ? (
        <textarea
          value={html}
          onChange={(e) => {
            setHtml(e.target.value);
            onChange(e.target.value);
          }}
          spellCheck={false}
          className="block max-h-[420px] min-h-[220px] w-full resize-y bg-[#0d1117] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[#c9d1d9] focus:outline-none"
          placeholder="<p>Paste or edit HTML…</p>"
        />
      ) : (
        <div className="rounded-b-[10px] bg-white">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
