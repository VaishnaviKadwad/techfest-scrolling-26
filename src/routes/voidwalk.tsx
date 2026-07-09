import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/voidwalk")({
  component: VoidwalkPage,
  head: () => ({
    meta: [
      { title: "Voidwalk — A Perspective Tunnel Through Space" },
      { name: "description", content: "Walk into the void through a receding tunnel of rings and light." },
      { property: "og:title", content: "Voidwalk — Perspective Tunnel" },
      { property: "og:description", content: "A 3D perspective tunnel driven by scroll. Rings fly past you, one at a time." },
    ],
  }),
});

const rings = Array.from({ length: 22 });

function VoidwalkPage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const maxY = typeof window !== "undefined" ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
  const progress = Math.min(1, y / maxY);

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="voidwalk" />
      <CosmicNav />

      <section className="relative min-h-[100dvh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [perspective:900px]">
          {/* Tunnel rings */}
          {rings.map((_, i) => {
            const spacing = 260;
            const zBase = -i * spacing;
            const z = reduced ? zBase : zBase + progress * spacing * rings.length;
            const opacity = Math.max(0, 1 - Math.abs(z) / (spacing * rings.length));
            return (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: 640,
                  height: 640,
                  borderColor: `hsl(${210 + i * 6} 90% 70% / ${0.15 + (i % 3) * 0.1})`,
                  borderWidth: 1.5,
                  transform: `translateZ(${z}px) rotate(${i * 12 + (reduced ? 0 : y * 0.05)}deg)`,
                  opacity,
                  boxShadow: `0 0 40px hsl(${210 + i * 6} 90% 60% / 0.25) inset`,
                }}
              />
            );
          })}

          {/* Center core */}
          <div
            className="pointer-events-none absolute h-40 w-40 rounded-full"
            style={{
              background: "radial-gradient(circle, #dbeafe 0%, #3b82f6 40%, transparent 75%)",
              boxShadow: "0 0 120px 40px rgba(59,130,246,0.6)",
              transform: reduced ? undefined : `scale(${0.6 + progress * 1.4})`,
            }}
          />

          {/* Copy overlay */}
          <div className="relative z-10 max-w-2xl text-center px-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
              Chapter II · Perspective tunnel
            </p>
            <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7rem)]">
              <span className="bg-gradient-to-r from-sky-200 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Walk</span> into
              <br />the <span className="italic font-light text-white/85">void</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base sm:text-lg text-white/60">
              Every ring is another second. Every second is another light-year. Keep scrolling.
            </p>
          </div>

          {/* HUD */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full border border-white/15 bg-black/40 px-5 py-2 text-[10px] uppercase tracking-[0.35em] text-white/60 backdrop-blur">
            <span>Depth</span>
            <span className="tabular-nums text-white">{(progress * 100).toFixed(1)}%</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="tabular-nums text-white">{(progress * 12.4).toFixed(2)} ly</span>
          </div>
        </div>

        {/* Spacer to enable scroll */}
        <div style={{ height: "260vh" }} />
      </section>

      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-white font-black tracking-tight text-[clamp(2rem,6vw,4rem)]">
            You reached the other side.
          </h2>
          <p className="mt-6 text-white/60 text-lg">A doorway. Another chapter. Keep going.</p>
        </div>
      </section>
    </div>
  );
}
