export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
      <p className="font-display text-sm tracking-[0.28em] text-paper uppercase">
        Portfolio
      </p>
      <nav aria-label="Main navigation" className="pointer-events-auto flex items-center gap-5 sm:gap-8">
        <a
          href="#experience"
          className="border-b border-transparent py-2 font-mono text-[11px] tracking-[0.22em] text-mist uppercase transition-colors hover:border-cyan hover:text-paper focus-visible:border-cyan focus-visible:text-paper focus-visible:outline-none sm:text-xs"
        >
          Experience
        </a>
        <a
          href="#projects"
          className="border-b border-transparent py-2 font-mono text-[11px] tracking-[0.22em] text-mist uppercase transition-colors hover:border-cyan hover:text-paper focus-visible:border-cyan focus-visible:text-paper focus-visible:outline-none sm:text-xs"
        >
          Projects
        </a>
      </nav>
    </header>
  );
}
