'use client';

import { Editor } from '@tinymce/tinymce-react';

/**
 * Full WYSIWYG editor (self-hosted TinyMCE — no API key, GPL licence).
 * Emits HTML via onChange. `<>` source view, formats, alignment, lists,
 * links, images (uploaded to the media bucket), tables, colors, etc.
 * Assets are served from /public/tinymce (see scripts/copy-tinymce.mjs).
 */
export function RichEditor({
  value,
  onChange,
  placeholder = 'Write content…',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-surface-line2 bg-white">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value || ''}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 520,
          menubar: 'edit view insert format table tools',
          branding: false,
          promotion: false,
          statusbar: true,
          resize: true,
          placeholder,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'media', 'table', 'wordcount', 'help',
          ],
          toolbar:
            'undo redo | code | blocks | bold italic underline | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
            'link image media table | removeformat fullscreen',
          block_formats:
            'Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote',
          content_style: `
            body { font-family: Montserrat, system-ui, sans-serif; font-size: 16px; color: #111; line-height: 1.7; padding: 12px 16px; }
            h2 { font-weight: 800; letter-spacing: -0.03em; font-size: 30px; }
            h3 { font-weight: 700; letter-spacing: -0.015em; font-size: 21px; }
            a { color: #111; text-decoration: underline; text-decoration-color: #FFDB2D; text-decoration-thickness: 2px; }
            blockquote { border-left: 4px solid #FFDB2D; margin: 1.4em 0; padding: 4px 0 4px 20px; font-weight: 700; }
            img { max-width: 100%; height: auto; border-radius: 12px; }
          `,
          images_upload_handler: async (blobInfo: any) => {
            const fd = new FormData();
            fd.append('file', blobInfo.blob(), blobInfo.filename());
            const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
            const json = await res.json();
            if (!res.ok || !json.ok) throw new Error(json.error || 'Upload failed');
            return json.url as string;
          },
        }}
      />
    </div>
  );
}
