import {
  Sparkles, Database, Bot, Workflow, GitMerge, Plug, Share2, Rocket,
  Globe, Users, Package, Megaphone, BarChart3, Headphones, Mail, Cloud,
  BookOpen, Brain, Webhook, FileText, MessageCircle, Search, PenTool,
  FlaskConical, Code2, CheckCheck, TrendingUp, Settings2, ArrowRight,
  ArrowUpRight, ShieldCheck, UserCheck, Activity, Layers, Gauge, LifeBuoy,
  Lock, KeyRound, Boxes, GitBranch, ScrollText, Scale, type LucideIcon,
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
  'arrow-up-right': ArrowUpRight, 'shield-check': ShieldCheck,
  'user-check': UserCheck, activity: Activity, layers: Layers, gauge: Gauge,
  'life-buoy': LifeBuoy, lock: Lock, 'key-round': KeyRound, boxes: Boxes,
  'git-branch': GitBranch, 'scroll-text': ScrollText, scale: Scale,
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
  // Delivery roles. These sit *after* the platform rules on purpose: "Marketing
  // Automation" must keep matching `marketing`, not the `automation` role below.
  if (t.includes('consultant')) return 'message-circle';
  if (t.includes('architect')) return 'layers';
  if (t.includes('automation')) return 'workflow';
  if (t.includes('data') || t.includes('integration')) return 'share-2';
  if (t.includes('designer') || t.includes('ux')) return 'pen-tool';
  if (t.includes('qa') || t.includes('test')) return 'flask-conical';
  if (t.includes('devops')) return 'settings-2';
  // before the generic `manager` rule, or "Customer Relationship Managers"
  // lands on the same icon as "Project Managers"
  if (t.includes('relationship')) return 'user-check';
  if (t.includes('subject') || t.includes('expert')) return 'book-open';
  if (t.includes('manager') || t.includes('project')) return 'users';
  if (t.includes('developer') || t.includes('full-stack')) return 'code-2';
  if (t.includes('ai ') || t.includes('engineer')) return 'brain';
  return 'plug';
}

/**
 * Map an engagement model to an icon describing what it *is*.
 *
 * These deliberately carry no sense of rank. An earlier version showed a
 * filled-bar scale, which reads as signal strength — it implied the lighter
 * engagements were worth less, rather than differently shaped.
 */
export function engagementIconName(title = '', explicit?: string): string {
  if (explicit && NAMED[explicit]) return explicit;
  const t = title.toLowerCase();
  if (t.includes('discovery') || t.includes('feasibility')) return 'search';
  if (t.includes('proof') || t.includes('poc') || t.includes('pilot')) return 'flask-conical';
  if (t.includes('pod') || t.includes('dedicated') || t.includes('team')) return 'users';
  if (t.includes('project') || t.includes('implementation') || t.includes('build')) return 'code-2';
  return 'sparkles';
}

/** Roadmap step icons, by 1-based step order (falls back to a sensible default). */
const STEP_ICONS = [
  'message-circle', 'search', 'pen-tool', 'flask-conical',
  'code-2', 'check-check', 'rocket', 'trending-up',
];
export function stepIconName(index: number): string {
  return STEP_ICONS[index] || 'check-check';
}

/**
 * Map a capability-grid item to an icon by explicit `icon`, else by keyword.
 *
 * Covers the two grids that use it — the engineering foundations on /services
 * and the controls on /governance. Specific terms are tested before general
 * ones, so "data isolation" does not fall through to the generic data icon.
 */
export function gridIconName(title = '', explicit?: string): string {
  if (explicit && NAMED[explicit]) return explicit;
  const t = title.toLowerCase();
  if (t.includes('encryption')) return 'lock';
  // personal data before the general governance bucket, and `model` before
  // `access` — "Controlled model access" matches both and is about the model
  if (t.includes('pii') || t.includes('personal data')) return 'file-text';
  if (t.includes('model')) return 'layers';
  if (t.includes('access')) return 'key-round';
  if (t.includes('isolation')) return 'boxes';
  if (t.includes('environment') || t.includes('separation')) return 'git-branch';
  if (t.includes('audit') || t.includes('logging')) return 'scroll-text';
  if (t.includes('monitoring') || t.includes('incident') || t.includes('observability')) return 'activity';
  if (t.includes('security') || t.includes('secure')) return 'shield-check';
  if (t.includes('human') || t.includes('oversight')) return 'user-check';
  if (t.includes('agnostic')) return 'layers';
  if (t.includes('production') || t.includes('testing') || t.includes('quality')) return 'gauge';
  if (t.includes('privacy') || t.includes('governance')
      || t.includes('retention') || t.includes('minimis')) return 'scale';
  if (t.includes('support') || t.includes('maintenance')) return 'life-buoy';
  if (t.includes('flexible') || t.includes('engagement') || t.includes('team')) return 'users';
  if (t.includes('data')) return 'database';
  if (t.includes('integration') || t.includes('api')) return 'share-2';
  return 'check-check';
}
