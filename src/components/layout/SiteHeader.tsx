export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
      <p className="font-display text-sm tracking-[0.28em] text-paper uppercase">
        Portfolio
      </p>
      <p className="font-mono text-[11px] tracking-[0.28em] text-mist uppercase">
        Environment
      </p>
    </header>
  );
}
