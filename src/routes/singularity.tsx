import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/singularity")({
  component: SingularityPage,
  head: () => ({
    meta: [
      { title: "Singularity — Everything Bends Toward the Center" },
      { name: "description", content: "A gravity-well parallax finale where scroll pulls every element toward the black hole." },
      { property: "og:title", content: "Singularity — Gravity Well" },
      { property: "og:description", content: "Interactive 3D finale. As you scroll, orbiting bodies collapse into a singularity." },
    ],
  }),
});

const bodies = [
  { label: "Kepler-22b", angle: 0, radius: 260, size: 40, hue: 280 },
  { label: "Proxima c", angle: 55, radius: 320, size: 32, hue: 200 },
  { label: "Trappist-1e", angle: 120, radius: 220, size: 28, hue: 320 },
  { label: "Gliese-581g", angle: 190, radius: 380, size: 48, hue: 30 },
  { label: "HD-40307g", angle: 245, radius: 300, size: 36, hue: 160 },
  { label: "K2-18b", angle: 310, radius: 240, size: 30, hue: 260 },
];

function SingularityPage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const maxY = typeof window !== "undefined" ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
  const p = Math.min(1, y / maxY);

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="singularity" />
      <CosmicNav />

      <section className="relative" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [perspective:1200px]">
          {/* Accretion disk */}
          <div
            className="pointer-events-none absolute h-[900px] w-[900px] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #7c3aed 15%, #ec4899 30%, #f59e0b 45%, transparent 60%, #06b6d4 80%, transparent 100%)",
              filter: "blur(32px)",
              opacity: 0.55 + p * 0.35,
              transform: reduced
                ? "rotateX(72deg)"
                : `rotateX(${72 - p * 8}deg) rotate(${y * 0.25}deg) scale(${1 + p * 0.6})`,
            }}
          />
          {/* Event horizon */}
          <div
            className="pointer-events-none absolute rounded-full bg-black"
            style={{
              width: 180 + p * 260,
              height: 180 + p * 260,
              boxShadow: `0 0 ${60 + p * 200}px ${20 + p * 60}px rgba(124,58,237,${0.6 + p * 0.3}), inset 0 0 60px rgba(0,0,0,0.9)`,
            }}
          />
          {/* Photon ring */}
          <div
            className="pointer-events-none absolute rounded-full border-2 border-white/70"
            style={{
              width: 200 + p * 260,
              height: 200 + p * 260,
              boxShadow: "0 0 40px rgba(255,255,255,0.6)",
              opacity: 0.6,
              transform: reduced ? undefined : `rotate(${y * 0.3}deg)`,
            }}
          />

          {/* Orbiting bodies collapsing inward */}
          {bodies.map((b, i) => {
            const angle = (b.angle + (reduced ? 0 : y * 0.1)) * (Math.PI / 180);
            const r = b.radius * (1 - p * 0.85);
            const x = Math.cos(angle) * r;
            const yv = Math.sin(angle) * r * 0.55; // squashed for disk feel
            const size = b.size * (1 - p * 0.6);
            return (
              <div
                key={b.label}
                className="pointer-events-none absolute flex items-center gap-2"
                style={{
                  transform: `translate3d(${x}px, ${yv}px, 0)`,
                  opacity: 1 - p * 0.6,
                }}
              >
                <span
                  className="block rounded-full"
                  style={{
                    width: size,
                    height: size,
                    background: `radial-gradient(circle at 35% 35%, hsl(${b.hue} 90% 75%), hsl(${b.hue} 80% 40%) 65%, #0a0418)`,
                    boxShadow: `0 0 ${size}px hsl(${b.hue} 90% 60% / 0.8)`,
                  }}
                />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 whitespace-nowrap">{b.label}</span>
              </div>
            );
          })}

          {/* Copy */}
          <div className="relative z-10 max-w-2xl text-center px-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.9)]" />
              Chapter V · Gravity well
            </p>
            <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
              <span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-200 bg-clip-text text-transparent">Singularity</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base sm:text-lg text-white/60">
              Keep scrolling. Everything you passed is being pulled inward — including you.
            </p>
            <div className="mt-8 mx-auto h-[3px] w-[min(420px,60vw)] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-300"
                style={{ width: `${p * 100}%` }}
              />
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/40 tabular-nums">
              Collapse · {(p * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 text-center">
        <h2 className="text-white font-black tracking-tight text-[clamp(2rem,6vw,4rem)]">
          On the other side, another sky.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-white/60 text-lg">
          Thank you for drifting through five chapters of light, dust, gravity, and shadow.
        </p>
      </section>
    </div>
  );
}
