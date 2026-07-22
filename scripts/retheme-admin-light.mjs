import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['src/app/admin', 'src/components/admin'];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Ordered [regex, replacement]. Order matters — specific before generic.
const RULES = [
  // brand-yellow text → readable dark-yellow on white
  [/text-brand-200\b/g, 'text-brand-ink'],
  [/text-brand-300\b/g, 'text-brand-ink'],
  [/text-brand(?![-\w])/g, 'text-brand-ink'],
  // white text → black
  [/text-white\b/g, 'text-black'],
  // status colors tuned for dark → darker on white
  [/text-emerald-300\b/g, 'text-emerald-600'],
  [/text-red-300\b/g, 'text-red-600'],
  [/text-red-400\b/g, 'text-red-600'],
  // borders / dividers
  [/border-white\/\d+/g, 'border-surface-line2'],
  [/divide-white\/\d+/g, 'divide-surface-line2'],
  // hover fills (do before base bg fills)
  [/hover:bg-white\/\d+/g, 'hover:bg-black/5'],
  // chip/badge fills
  [/bg-white\/10\b/g, 'bg-surface-tint2'],
  [/bg-white\/8\b/g, 'bg-surface-tint2'],
  // translucent card/panel/input fills → solid white
  [/bg-white\/\[0\.0?\d+\]/g, 'bg-white'],
  [/bg-white\/5\b/g, 'bg-white'],
  // dark code box
  [/bg-black\/40\b/g, 'bg-surface-tint2'],
  // dark surfaces
  [/bg-ink-900\b/g, 'bg-white'],
  [/bg-ink-800\b/g, 'bg-white'],
  [/bg-ink-700\b/g, 'bg-white'],
  [/bg-ink(?![-\w])/g, 'bg-surface-tint2'],
];

let totalFiles = 0;
for (const d of DIRS) {
  for (const f of walk(d)) {
    let txt = readFileSync(f, 'utf8');
    const before = txt;
    for (const [re, rep] of RULES) txt = txt.replace(re, rep);
    if (txt !== before) {
      writeFileSync(f, txt);
      totalFiles++;
      console.log('themed', f);
    }
  }
}
console.log('files updated:', totalFiles);
