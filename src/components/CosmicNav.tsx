import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Aether" },
  { to: "/nebula", label: "Nebula" },
  { to: "/voidwalk", label: "Void" },
  { to: "/eclipse", label: "Eclipse" },
  { to: "/quasar", label: "Quasar" },
  { to: "/wormhole", label: "Wormhole" },
  { to: "/pulsar", label: "Pulsar" },
  { to: "/stardust", label: "Stardust" },
  { to: "/singularity", label: "Singularity" },
] as const;

export function CosmicNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(1180px,calc(100%-1.5rem))]">
      <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white shrink-0">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          <span>AETHER</span>
        </Link>
        <ul className="hidden lg:flex items-center gap-0.5 overflow-hidden">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`relative rounded-full px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    active ? "text-white" : "text-white/55 hover:text-white/90"
                  }`}
                >
                  {active && <span className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20" />}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          to="/singularity"
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-[1.03] shrink-0"
        >
          Enter
        </Link>
      </div>
    </nav>
  );
}
