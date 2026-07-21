// Copies the self-hosted TinyMCE assets into public/tinymce so the editor loads
// them from our own origin (no CDN, no API key). Runs on postinstall + prebuild.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'node_modules', 'tinymce');
const dest = join(__dirname, '..', 'public', 'tinymce');

if (!existsSync(src)) {
  console.warn('[copy-tinymce] node_modules/tinymce not found — skipping.');
  process.exit(0);
}
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('[copy-tinymce] TinyMCE assets copied to public/tinymce');
