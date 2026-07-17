// Field schemas that drive the visual per-section editors.
// Each section type maps to an ordered list of field descriptors.

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'select'
  | 'bool'
  | 'cta'
  | 'stringList'
  | 'objectList'
  | 'group';

export interface FieldDesc {
  key: string;
  label: string;
  kind: FieldKind;
  hint?: string;
  options?: string[]; // select
  itemFields?: FieldDesc[]; // objectList / group
}

const eyebrow: FieldDesc = { key: 'eyebrow', label: 'Eyebrow', kind: 'text' };
const heading: FieldDesc = { key: 'heading', label: 'Heading', kind: 'text' };

export const SECTION_SCHEMAS: Record<string, FieldDesc[]> = {
  hero: [
    { key: 'badge', label: 'Badge', kind: 'text' },
    { key: 'heading_html', label: 'Heading (HTML — wrap accent words in <span>…</span>)', kind: 'textarea' },
    { key: 'subhead', label: 'Subhead', kind: 'textarea' },
    { key: 'primary_cta', label: 'Primary button', kind: 'cta' },
    { key: 'secondary_cta', label: 'Secondary button', kind: 'cta' },
    { key: 'note', label: 'Note under buttons', kind: 'textarea' },
    { key: 'trust_items', label: 'Trust chips', kind: 'stringList' },
    { key: 'animated', label: 'Show hero animation (home only)', kind: 'bool' },
    {
      key: 'bg_video',
      label: 'Background video URL (full-screen)',
      kind: 'text',
      hint: 'MP4/WebM URL. When set, it fills the hero and hides the animation. Upload to Supabase Storage (media bucket) or /public and paste the URL.',
    },
    { key: 'bg_video_poster', label: 'Video poster image URL', kind: 'text', hint: 'Shown before the video loads and when reduced-motion is on.' },
  ],
  stats_bar: [
    {
      key: 'stats',
      label: 'Stats',
      kind: 'objectList',
      itemFields: [
        { key: 'num', label: 'Number', kind: 'text' },
        { key: 'label', label: 'Label', kind: 'text' },
      ],
    },
    { key: 'logos_title', label: 'Logos title', kind: 'text' },
    { key: 'logos', label: 'Logos (marquee)', kind: 'stringList' },
  ],
  feature_grid: [
    eyebrow,
    heading,
    { key: 'columns', label: 'Columns', kind: 'select', options: ['3', '4'] },
    {
      key: 'items',
      label: 'Cards',
      kind: 'objectList',
      itemFields: [
        { key: 'n', label: 'Number (optional)', kind: 'text' },
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'body', label: 'Body', kind: 'textarea' },
      ],
    },
    {
      key: 'callout',
      label: 'Callout (optional)',
      kind: 'group',
      itemFields: [
        { key: 'text', label: 'Text', kind: 'textarea' },
        { key: 'cta', label: 'Button', kind: 'cta' },
      ],
    },
  ],
  partnership: [
    eyebrow,
    heading,
    { key: 'left_title', label: 'Left column title', kind: 'text' },
    { key: 'left_items', label: 'Left column items', kind: 'stringList' },
    { key: 'right_title', label: 'Right column title', kind: 'text' },
    { key: 'right_items', label: 'Right column items', kind: 'stringList' },
  ],
  service_capabilities: [
    eyebrow,
    heading,
    { key: 'link', label: 'Header link', kind: 'cta' },
    {
      key: 'items',
      label: 'Services',
      kind: 'objectList',
      itemFields: [
        { key: 'mono', label: 'Badge (short)', kind: 'text' },
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'body', label: 'Body', kind: 'textarea' },
      ],
    },
  ],
  connect_grid: [
    eyebrow,
    heading,
    { key: 'subhead', label: 'Subhead', kind: 'textarea' },
    { key: 'items', label: 'Items', kind: 'stringList' },
  ],
  services_detail: [
    eyebrow,
    heading,
    {
      key: 'items',
      label: 'Services',
      kind: 'objectList',
      itemFields: [
        { key: 'id', label: 'Anchor id (slug)', kind: 'text' },
        { key: 'short', label: 'Quick-jump label', kind: 'text' },
        { key: 'mono', label: 'Badge (short)', kind: 'text' },
        { key: 'cat', label: 'Category', kind: 'text' },
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'tagline', label: 'Tagline', kind: 'textarea' },
        { key: 'stack', label: 'Typical stack', kind: 'stringList' },
        { key: 'outcome', label: 'Business outcome', kind: 'textarea' },
        { key: 'build', label: 'What we build', kind: 'stringList' },
        { key: 'detail', label: 'Engineering detail', kind: 'stringList' },
      ],
    },
    { key: 'cta_primary', label: 'Primary per-service button', kind: 'cta' },
    { key: 'cta_secondary', label: 'Secondary per-service button', kind: 'cta' },
  ],
  cta_band: [
    { key: 'variant', label: 'Variant', kind: 'select', options: ['default', 'center', 'final', 'band'] },
    eyebrow,
    heading,
    { key: 'body', label: 'Body', kind: 'textarea' },
    {
      key: 'ctas',
      label: 'Buttons',
      kind: 'objectList',
      itemFields: [
        { key: 'label', label: 'Label', kind: 'text' },
        { key: 'href', label: 'Link', kind: 'text' },
        { key: 'style', label: 'Style', kind: 'select', options: ['primary', 'outline', 'link'] },
      ],
    },
  ],
  process_timeline: [
    eyebrow,
    heading,
    {
      key: 'steps',
      label: 'Steps',
      kind: 'objectList',
      itemFields: [
        { key: 'n', label: 'Number', kind: 'text' },
        { key: 'title', label: 'Title', kind: 'text' },
      ],
    },
  ],
  engagement_models: [
    eyebrow,
    heading,
    {
      key: 'items',
      label: 'Models',
      kind: 'objectList',
      itemFields: [
        { key: 'step', label: 'Step', kind: 'text' },
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'body', label: 'Body', kind: 'textarea' },
        { key: 'featured', label: 'Featured', kind: 'bool' },
      ],
    },
  ],
  pillars: [
    eyebrow,
    heading,
    {
      key: 'items',
      label: 'Pillars',
      kind: 'objectList',
      itemFields: [
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'body', label: 'Body', kind: 'textarea' },
      ],
    },
  ],
  trust_band: [eyebrow, { key: 'text', label: 'Text', kind: 'textarea' }],
  rich_text: [eyebrow, heading, { key: 'html', label: 'Content', kind: 'richtext' }],
  faq: [
    eyebrow,
    heading,
    {
      key: 'items',
      label: 'Questions',
      kind: 'objectList',
      itemFields: [
        { key: 'q', label: 'Question', kind: 'text' },
        { key: 'a', label: 'Answer', kind: 'textarea' },
      ],
    },
  ],
  comparison_table: [
    eyebrow,
    heading,
    { key: 'columns', label: 'Column headers', kind: 'stringList' },
    {
      key: 'rows',
      label: 'Rows',
      kind: 'objectList',
      itemFields: [
        { key: 'label', label: 'Row label', kind: 'text' },
        { key: 'values', label: 'Cell values', kind: 'stringList' },
      ],
    },
  ],
  packages: [
    eyebrow,
    heading,
    {
      key: 'items',
      label: 'Packages',
      kind: 'objectList',
      itemFields: [
        { key: 'name', label: 'Name', kind: 'text' },
        { key: 'duration', label: 'Duration', kind: 'text' },
        { key: 'desc', label: 'Description', kind: 'textarea' },
        { key: 'featured', label: 'Featured', kind: 'bool' },
      ],
    },
  ],
  newsletter: [
    heading,
    { key: 'body', label: 'Body', kind: 'textarea' },
    { key: 'placeholder', label: 'Input placeholder', kind: 'text' },
    { key: 'button', label: 'Button label', kind: 'text' },
  ],
  form: [{ key: 'form_key', label: 'Form key', kind: 'text', hint: 'The key of a form in Admin → Forms.' }],
};

export function emptyForDesc(desc: FieldDesc): any {
  switch (desc.kind) {
    case 'bool':
      return false;
    case 'cta':
      return { label: '', href: '' };
    case 'stringList':
      return [];
    case 'objectList':
      return [];
    case 'group':
      return emptyObject(desc.itemFields || []);
    default:
      return '';
  }
}

export function emptyObject(fields: FieldDesc[]): Record<string, any> {
  const o: Record<string, any> = {};
  for (const f of fields) o[f.key] = emptyForDesc(f);
  return o;
}
