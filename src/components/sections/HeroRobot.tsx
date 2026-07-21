/**
 * Animated Mavlers.ai robot mascot from the reference design.
 * `compact` renders a smaller version next to a live "agents at work" board
 * (used in the Implementations block). Pure CSS — animations live in globals.css.
 */
import { Icon } from './icons';

function Robot({ scale = 0.78 }: { scale?: number }) {
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
      <div className="w-[230px] animate-botFloat">
        {/* antenna */}
        <div className="mx-auto h-[26px] w-[3px] rounded bg-[#111]" />
        <div className="mx-auto -mt-1.5 h-4 w-4 animate-botAntenna rounded-full bg-brand shadow-[0_0_14px_rgba(255,219,45,0.9)]" />
        {/* head */}
        <div className="relative mx-auto mt-2.5 h-[176px] w-[230px] rounded-[40px] shadow-[inset_0_3px_0_rgba(255,255,255,0.08),0_22px_44px_rgba(0,0,0,0.22)] [background:linear-gradient(160deg,#1E1E1E,#050505)]">
          <div className="absolute -left-3.5 top-[58px] h-12 w-4 rounded-lg bg-brand" />
          <div className="absolute -right-3.5 top-[58px] h-12 w-4 rounded-lg bg-brand" />
          <div className="absolute inset-x-6 inset-y-[26px] overflow-hidden rounded-[26px] border border-[#EAEAEA] bg-white">
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-[30px]">
              <span className="h-11 w-[30px] animate-botBlink rounded-[16px] bg-brand" />
              <span className="h-11 w-[30px] animate-botBlink rounded-[16px] bg-brand" />
            </div>
            <div className="absolute bottom-5 left-1/2 h-4 w-10 -translate-x-1/2 rounded-b-[20px] border-[3px] border-t-0 border-brand" />
          </div>
        </div>
        {/* neck + body */}
        <div className="mx-auto mt-1.5 h-3 w-[60px] rounded bg-[#111]" />
        <div className="mx-auto h-[30px] w-[150px] rounded-b-[14px] rounded-t-[18px] [background:linear-gradient(160deg,#1E1E1E,#0A0A0A)]" />
      </div>
    </div>
  );
}

function Chip({
  label,
  icon,
  dark,
  style,
}: {
  label: string;
  icon: string;
  dark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-[13px] px-3.5 py-2.5 text-[12.5px] font-bold shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${
        dark ? 'bg-black text-white' : 'border border-surface-line bg-white text-black'
      }`}
      style={style}
    >
      <span
        className={`inline-flex h-[26px] w-[26px] items-center justify-center rounded-lg ${
          dark ? 'bg-brand text-black' : 'bg-surface-tint2 text-black'
        }`}
      >
        <Icon name={icon} size={15} />
      </span>
      {label}
    </div>
  );
}

export function HeroRobot({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex w-full items-center gap-2.5 p-1">
        <div className="flex w-[150px] flex-shrink-0 items-center justify-center">
          <Robot scale={0.6} />
        </div>
        <div className="flex flex-1 flex-col self-stretch rounded-[16px] border border-[#EDEBE3] bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          <div className="mb-3.5 flex items-center gap-2">
            <span className="h-2 w-2 animate-[implDot_1.4s_ease-in-out_infinite] rounded-full bg-brand" />
            <span className="text-[12px] font-extrabold tracking-[0.04em] text-[#111]">Agents at work</span>
            <span className="ml-auto text-[10.5px] font-bold uppercase tracking-[0.08em] text-body-dim">Live</span>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Marketing', icon: 'megaphone' },
              { label: 'Sales', icon: 'trending-up' },
              { label: 'Support', icon: 'headphones' },
              { label: 'Operations', icon: 'settings-2' },
            ].map(({ label, icon }, i) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px] bg-surface-tint2 text-[#111]">
                  <Icon name={icon} size={15} />
                </span>
                <div className="flex-1">
                  <div className="mb-1 text-[12px] font-bold text-[#222]">{label}</div>
                  <div className="h-1.5 overflow-hidden rounded bg-[#F0EEE6]">
                    <div
                      className="h-full w-full origin-left rounded bg-brand"
                      style={{ animation: `implWork 2.6s ease-in-out infinite ${i * 0.5}s` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* glow */}
      <div className="absolute inset-[6%] rounded-full blur-[6px] [background:radial-gradient(circle_at_50%_42%,rgba(255,219,45,0.32),rgba(255,219,45,0.10)_55%,transparent_72%)]" />
      {/* dotted orbit ring */}
      <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-black/[0.09]" />
      {/* ground shadow */}
      <div className="absolute bottom-[12%] left-1/2 h-[26px] w-[180px] animate-botShadow rounded-full bg-black blur-[9px]" />
      {/* flow labels */}
      <div className="absolute left-1 top-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-body-dim">Data in →</div>
      <div className="absolute right-1 top-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-body-dim">→ Solutions out</div>
      {/* robot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Robot scale={0.78} />
      </div>
      {/* input chips (left) */}
      <Chip label="Raw Data" icon="database" style={{ top: '8%', left: -26, animation: 'heroFloat 4s ease-in-out infinite' }} />
      <Chip label="Documents" icon="file-text" style={{ top: '44%', left: -26, animation: 'heroFloat 4.3s ease-in-out infinite .4s' }} />
      <Chip label="CRM & ERP" icon="users" style={{ top: '80%', left: -26, animation: 'heroFloat 4.6s ease-in-out infinite .8s' }} />
      {/* output chips (right) */}
      <Chip label="AI Agents" icon="bot" dark style={{ top: '8%', right: -26, animation: 'heroFloat 4.2s ease-in-out infinite .3s' }} />
      <Chip label="Automation" icon="workflow" dark style={{ top: '44%', right: -26, animation: 'heroFloat 4.5s ease-in-out infinite .7s' }} />
      <Chip label="Integrations" icon="share-2" dark style={{ top: '80%', right: -26, animation: 'heroFloat 4.8s ease-in-out infinite 1.1s' }} />

      {/* caption */}
      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-[18px] py-2.5 text-[12.5px] font-extrabold tracking-[-0.01em] text-black shadow-[0_12px_30px_rgba(255,219,45,0.35)]">
        One engine for all your AI &amp; automation
      </div>
    </div>
  );
}
