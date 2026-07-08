import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useElementScroll, useMousePos, useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/nebula")({
  component: NebulaPage,
  head: () => ({
    meta: [
      { title: "Nebula — Horizontal Drift Through Colored Dust" },
      { name: "description", content: "A vertical scroll that carries you sideways through a 3D nebula gallery." },
      { property: "og:title", content: "Nebula — Horizontal Drift" },
      { property: "og:description", content: "Vertical scroll, horizontal wonder. Tilted 3D cards drift through violet dust." },
    ],
  }),
});

const cards = [
  { title: "Violet Bloom", tag: "NGC 2237", hue: 285, note: "A stellar nursery exhaling ionized hydrogen." },
  { title: "Pink Coma", tag: "IC 1805", hue: 330, note: "Where young suns comb the dust into ribbons." },
  { title: "Cyan Veil", tag: "M42", hue: 190, note: "A cool curtain of oxygen glowing turquoise." },
  { title: "Amber Shell", tag: "NGC 6302", hue: 30, note: "A dying star exhales its last warm breath." },
  { title: "Indigo Wake", tag: "M78", hue: 240, note: "Reflected light on a river of interstellar silt." },
  { title: "Rose Halo", tag: "IC 434", hue: 350, note: "Silhouettes carved against a pink horizon." },
];

function NebulaPage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const mp = useMousePos();
  const trackRef = useRef<HTMLDivElement>(null);
  const rel = useElementScroll(trackRef);

  // Scroll drives horizontal translation of the track
  const progress = Math.max(0, Math.min(1, rel / (window.innerHeight * (cards.length - 0.5))));
  const shift = reduced ? 0 : progress * (cards.length - 1) * 340;

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="nebula" />
      <CosmicNav />

      {/* Hero */}
      <section className="relative flex min-h-[100dvh] items-center justify-center px-6">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
          style={{
            background: "conic-gradient(from 0deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)",
            transform: reduced ? undefined : `translate(-50%,-50%) rotate(${y * 0.06}deg)`,
          }}
        />
        <div className="relative z-10 text-center" style={{ transform: reduced ? undefined : `translate3d(0, ${y * 0.35}px, 0)`, opacity: Math.max(0, 1 - y / 700) }}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.9)]" />
            Chapter II · Horizontal drift
          </p>
          <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
            Through the <span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">nebula</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-white/60">
            Scroll down. Watch the cards drift sideways as light bends around dust older than memory.
          </p>
        </div>
      </section>

      {/* Horizontal scroll hijack */}
      <section
        ref={trackRef}
        className="relative"
        style={{ height: `${cards.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden [perspective:1400px]">
          <div
            className="flex gap-8 pl-[10vw] pr-[40vw] will-change-transform"
            style={{ transform: `translate3d(-${shift}px, 0, 0)` }}
          >
            {cards.map((c, i) => {
              const localP = progress * (cards.length - 1) - i;
              const rotY = reduced ? 0 : Math.max(-25, Math.min(25, localP * -18));
              const tz = reduced ? 0 : -Math.abs(localP) * 120;
              return (
                <article
                  key={c.tag}
                  className="relative h-[64vh] w-[300px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
                  style={{
                    transform: `translateZ(${tz}px) rotateY(${rotY}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="mb-5 aspect-[3/4] w-full overflow-hidden rounded-2xl"
                    style={{
                      background: `radial-gradient(120% 90% at 30% 20%, hsl(${c.hue} 90% 70%) 0%, hsl(${c.hue + 40} 70% 40%) 45%, #0a0418 95%)`,
                    }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          "radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.6) 0%, transparent 55%)",
                      }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">{c.tag}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{c.note}</p>
                  <span className="absolute right-4 top-4 text-xs tabular-nums text-white/40">
                    {String(i + 1).padStart(2, "0")}/{String(cards.length).padStart(2, "0")}
                  </span>
                </article>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="pointer-events-none absolute bottom-10 left-1/2 h-[3px] w-[min(560px,60vw)] -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-pink-400 to-cyan-300" style={{ width: `${progress * 100}%` }} />
          </div>

          {/* Cursor glow */}
          {!reduced && (
            <div
              className="pointer-events-none absolute h-72 w-72 rounded-full opacity-40 blur-3xl"
              style={{
                left: `calc(${mp.x * 100}% - 144px)`,
                top: `calc(${mp.y * 100}% - 144px)`,
                background: "radial-gradient(circle, #f472b6 0%, transparent 60%)",
              }}
            />
          )}
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Continue the voyage</p>
        <p className="mt-4 text-white/80 text-lg">Next stop: the void.</p>
      </footer>
    </div>
  );
}
