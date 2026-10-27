/** Yellow wash used on the light homepage clone. Hidden until a `.home-light` ancestor is present. */
export function LightWash({ dormant = false }: { dormant?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden${dormant ? ' home-wash' : ''}`}
    >
      <div className="absolute left-0 top-[120px] h-[220px] w-[240px] -translate-x-1/3 rounded-full bg-[#FFDD2F] opacity-[0.82] blur-[120px] md:top-[180px] md:h-[280px] md:w-[300px] md:blur-[180px] lg:top-[216px] lg:h-[344px] lg:w-[378px] lg:blur-[274.9px]" />
      <div className="absolute right-0 top-[80px] h-[140px] w-[150px] translate-x-1/3 rounded-full bg-[#FFDD2F] blur-[120px] md:top-[110px] md:h-[170px] md:w-[190px] md:blur-[180px] lg:top-[137px] lg:h-[200px] lg:w-[220px] lg:blur-[274.9px]" />
    </div>
  );
}
