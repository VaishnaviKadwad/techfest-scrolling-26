import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/wormhole")({
  component: WormholePage,
  head: () => ({
    meta: [
      { title: "Wormhole — A Twisting Spiral Through Spacetime" },
      { name: "description", content: "A spiraling tunnel of light rings that twists as you scroll deeper into folded space." },
      { property: "og:title", content: "Wormhole — Spiral Tunnel" },
      { property: "og:description", content: "Scroll to spiral through a twisting corridor of light rings." },
    ],
  }),
});

const segments = Array.from({ length: 40 });

function WormholePage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const maxY = typeof window !== "undefined" ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
  const p = Math.min(1, y / maxY);

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="wormhole" />
      <CosmicNav />

      <section className="relative" style={{ height: "360vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [perspective:1000px]">
          {segments.map((_, i) => {
            const spacing = 220;
            const zBase = -i * spacing;
            const z = reduced ? zBase : zBase + p * spacing * segments.length;
            const opacity = Math.max(0, 1 - Math.abs(z) / (spacing * segments.length));
            const twist = i * 22 + (reduced ? 0 : y * 0.25);
            // squash into elliptical so it feels like a folded tube
            const wobbleX = Math.sin(i * 0.6 + y * 0.005) * 40;
            const wobbleY = Math.cos(i * 0.6 + y * 0.005) * 40;
            const hue = 190 + (i * 8) % 160;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 720,
                  height: 720,
                  border: `2px solid hsl(${hue} 90% 70% / ${0.25 + (i % 4) * 0.12})`,
                  boxShadow: `0 0 40px hsl(${hue} 95% 60% / 0.35) inset`,
                  transform: `translate3d(${wobbleX}px, ${wobbleY}px, ${z}px) rotate(${twist}deg) scaleX(${1 + Math.sin(i * 0.4) * 0.12}) scaleY(${1 + Math.cos(i * 0.4) * 0.12})`,
                  opacity,
                }}
              />
            );
          })}

          {/* Cursor core light */}
          <div
            className="pointer-events-none absolute h-56 w-56 rounded-full"
            style={{
              background: "radial-gradient(circle, #ffffff 0%, #22d3ee 35%, transparent 70%)",
              boxShadow: "0 0 140px 40px rgba(34,211,238,0.7)",
              transform: reduced ? undefined : `scale(${0.6 + p * 1.6})`,
            }}
          />

          {/* Copy */}
          <div className="relative z-10 max-w-2xl text-center px-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
              Chapter V · Spiral tunnel
            </p>
            <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7rem)]">
              <span className="bg-gradient-to-r from-cyan-200 via-violet-300 to-pink-200 bg-clip-text text-transparent">Fold</span>
              <br />the <span className="italic font-light text-white/85">distance</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base sm:text-lg text-white/60">
              Spacetime folds. Two points kiss. You scroll through the seam.
            </p>
          </div>

          {/* HUD */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full border border-white/15 bg-black/40 px-5 py-2 text-[10px] uppercase tracking-[0.35em] text-white/60 backdrop-blur">
            <span>Twist</span>
            <span className="tabular-nums text-white">{(y * 0.25 % 360).toFixed(0)}°</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Fold</span>
            <span className="tabular-nums text-white">{(p * 100).toFixed(1)}%</span>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 text-center">
        <h2 className="text-white font-black tracking-tight text-[clamp(2rem,6vw,4rem)]">
          You arrived before you left.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-white/60 text-lg">
          Time got a little shy on the way through.
        </p>
      </section>
    </div>
  );
}
