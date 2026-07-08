import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useMousePos, useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/eclipse")({
  component: EclipsePage,
  head: () => ({
    meta: [
      { title: "Eclipse — Where Fire Meets Shadow" },
      { name: "description", content: "A rotating corona and mouse-tilted 3D cards under the shadow of a dying sun." },
      { property: "og:title", content: "Eclipse — Fire & Shadow" },
      { property: "og:description", content: "Interactive 3D tilt cards orbiting a scroll-driven eclipse." },
    ],
  }),
});

const facets = [
  { title: "Corona", note: "The searing halo of superheated plasma reaching a million miles into the black.", hue: 28 },
  { title: "Umbra", note: "The deepest cone of shadow. Here, the sun forgets its own name.", hue: 12 },
  { title: "Chromosphere", note: "A thin, rose-colored layer that flickers into view only when the star hides.", hue: 350 },
  { title: "Diamond Ring", note: "One last brilliant bead of light before totality drapes the world.", hue: 42 },
];

function TiltCard({ f, i }: { f: (typeof facets)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mp = useMousePos();
  const reduced = useReducedMotion();

  // Local tilt based on card center distance from cursor
  let rx = 0, ry = 0;
  if (!reduced && ref.current) {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (mp.x * window.innerWidth - cx) / r.width;
    const dy = (mp.y * window.innerHeight - cy) / r.height;
    rx = Math.max(-12, Math.min(12, -dy * 14));
    ry = Math.max(-12, Math.min(12, dx * 14));
  }

  return (
    <div ref={ref} className="[perspective:1200px]">
      <div
        className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform"
        style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg)`, transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(400px circle at ${mp.x * 100}% ${mp.y * 100}%, hsl(${f.hue} 100% 60% / 0.25), transparent 60%)`,
          }}
        />
        <div
          className="mb-6 h-32 w-32 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, hsl(${f.hue} 100% 70%) 0%, hsl(${f.hue - 20} 90% 40%) 50%, #0a0300 95%)`,
            boxShadow: `0 0 60px hsl(${f.hue} 100% 55% / 0.7)`,
            transform: "translateZ(40px)",
          }}
        />
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/50" style={{ transform: "translateZ(20px)" }}>
          Facet {String(i + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-3xl font-black text-white" style={{ transform: "translateZ(30px)" }}>
          {f.title}
        </h3>
        <p className="mt-3 max-w-sm text-sm text-white/60" style={{ transform: "translateZ(15px)" }}>
          {f.note}
        </p>
      </div>
    </div>
  );
}

function EclipsePage() {
  const y = useScrollY();
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="eclipse" />
      <CosmicNav />

      {/* Eclipse hero */}
      <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6">
        {/* Corona */}
        <div
          className="pointer-events-none absolute h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #fbbf24, #f97316, #dc2626, #7c2d12, #fbbf24)",
            filter: "blur(24px)",
            opacity: 0.75,
            transform: reduced ? undefined : `rotate(${y * 0.15}deg)`,
          }}
        />
        {/* Moon disc */}
        <div
          className="pointer-events-none absolute h-[440px] w-[440px] rounded-full bg-black"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 0 120px rgba(0,0,0,0.9)",
            transform: reduced ? undefined : `translate3d(${Math.min(0, -80 + y * 0.15)}px, 0, 0)`,
          }}
        />
        {/* Diamond flare */}
        <div
          className="pointer-events-none absolute h-6 w-6 rounded-full bg-white"
          style={{
            boxShadow: "0 0 60px 20px rgba(255,255,255,0.9)",
            transform: reduced ? undefined : `translate3d(${180 + y * -0.2}px, -140px, 0) scale(${Math.max(0.3, 1 - y / 500)})`,
            opacity: Math.max(0, 1 - y / 500),
          }}
        />

        <div className="relative z-10 text-center" style={{ transform: reduced ? undefined : `translate3d(0, ${y * 0.3}px, 0)`, opacity: Math.max(0, 1 - y / 700) }}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
            Chapter IV · Totality
          </p>
          <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
            <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-rose-500 bg-clip-text text-transparent">Eclipse</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-white/60">
            Fire meets shadow. Move your cursor. The world tilts.
          </p>
        </div>
      </section>

      {/* Interactive tilt cards */}
      <section className="relative px-6 py-32">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          {facets.map((f, i) => (
            <TiltCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Approach the center</p>
        <p className="mt-4 text-white/80 text-lg">Gravity bends everything, even light.</p>
      </footer>
    </div>
  );
}
