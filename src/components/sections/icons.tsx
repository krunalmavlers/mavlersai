import {
  Sparkles, Database, Bot, Workflow, GitMerge, Plug, Share2, Rocket,
  Globe, Users, Package, Megaphone, BarChart3, Headphones, Mail, Cloud,
  BookOpen, Brain, Webhook, FileText, MessageCircle, Search, PenTool,
  FlaskConical, Code2, CheckCheck, TrendingUp, Settings2, ArrowRight,
  ArrowUpRight, type LucideIcon,
} from 'lucide-react';

const NAMED: Record<string, LucideIcon> = {
  sparkles: Sparkles, database: Database, bot: Bot, workflow: Workflow,
  'git-merge': GitMerge, plug: Plug, 'share-2': Share2, rocket: Rocket,
  globe: Globe, users: Users, package: Package, megaphone: Megaphone,
  'bar-chart-3': BarChart3, headphones: Headphones, mail: Mail, cloud: Cloud,
  'book-open': BookOpen, brain: Brain, webhook: Webhook, 'file-text': FileText,
  'message-circle': MessageCircle, search: Search, 'pen-tool': PenTool,
  'flask-conical': FlaskConical, 'code-2': Code2, 'check-check': CheckCheck,
  'trending-up': TrendingUp, 'settings-2': Settings2, 'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
};

export function Icon({ name, size = 20, className }: { name?: string; size?: number; className?: string }) {
  const C = name ? NAMED[name] : undefined;
  if (!C) return null;
  return <C size={size} className={className} strokeWidth={1.9} aria-hidden />;
}

/** Map a service card to an icon by explicit `icon` field, else by title keyword. */
export function serviceIconName(title = '', explicit?: string): string {
  if (explicit && NAMED[explicit]) return explicit;
  const t = title.toLowerCase();
  if (t.includes('rag') || t.includes('knowledge')) return 'database';
  if (t.includes('agent')) return 'bot';
  if (t.includes('orchestrat')) return 'git-merge';
  if (t.includes('workflow') || t.includes('automation')) return 'workflow';
  if (t.includes('mcp') || t.includes('context protocol')) return 'plug';
  if (t.includes('api') || t.includes('integration')) return 'share-2';
  if (t.includes('mvp') || t.includes('product')) return 'rocket';
  return 'sparkles';
}

/** Map a "what we connect" label to an icon. */
export function connectIconName(label = ''): string {
  const t = label.toLowerCase();
  if (t.includes('website')) return 'globe';
  if (t.includes('crm')) return 'users';
  if (t.includes('erp')) return 'package';
  if (t.includes('marketing')) return 'megaphone';
  if (t.includes('analytic')) return 'bar-chart-3';
  if (t.includes('support')) return 'headphones';
  if (t.includes('email')) return 'mail';
  if (t.includes('cloud') || t.includes('storage')) return 'cloud';
  if (t.includes('knowledge')) return 'book-open';
  if (t.includes('database')) return 'database';
  if (t.includes('llm') || t.includes('model')) return 'brain';
  if (t.includes('api')) return 'webhook';
  return 'plug';
}

/** Roadmap step icons, by 1-based step order (falls back to a sensible default). */
const STEP_ICONS = [
  'message-circle', 'search', 'pen-tool', 'flask-conical',
  'code-2', 'check-check', 'rocket', 'trending-up',
];
export function stepIconName(index: number): string {
  return STEP_ICONS[index] || 'check-check';
}
