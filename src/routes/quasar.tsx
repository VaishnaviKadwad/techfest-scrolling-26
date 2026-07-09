import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/quasar")({
  component: QuasarPage,
  head: () => ({
    meta: [
      { title: "Quasar — Spiral Arms of a Waking Galaxy" },
      { name: "description", content: "Scroll to unfurl the spiral arms of a rotating galaxy of light." },
      { property: "og:title", content: "Quasar — Spiral Arms" },
      { property: "og:description", content: "A rotating galactic spiral. Scroll to spin the arms outward." },
    ],
  }),
});

// Deterministic pseudo-star positions along logarithmic spiral arms
const ARMS = 4;
const STARS_PER_ARM = 22;
const spiral = Array.from({ length: ARMS * STARS_PER_ARM }).map((_, i) => {
  const arm = i % ARMS;
  const t = Math.floor(i / ARMS) / STARS_PER_ARM;
  const angle = arm * ((Math.PI * 2) / ARMS) + t * Math.PI * 2.2;
  const radius = 40 + t * 380;
  const seed = Math.sin(i * 12.9898) * 43758.5453;
  const jitter = (seed - Math.floor(seed)) - 0.5;
  const hue = 45 + t * 130 + jitter * 20;
  return { angle, radius, hue, size: 3 + (1 - t) * 6, t };
});

const facets = [
  { title: "Ignition", note: "A supermassive core wakes and starts to feed.", hue: 50 },
  { title: "Jet", note: "Twin beams of matter fired across a million light-years.", hue: 160 },
  { title: "Arms", note: "Density waves shepherd young stars into brilliant lanes.", hue: 200 },
  { title: "Halo", note: "Dark matter cradles the whole spinning cathedral.", hue: 280 },
];

function QuasarPage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const maxY = typeof window !== "undefined" ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
  const p = Math.min(1, y / maxY);
  const rot = reduced ? 0 : y * 0.08;

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="quasar" />
      <CosmicNav />

      <section className="relative" style={{ height: "360vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [perspective:1400px]">
          {/* Galactic disk */}
          <div
            className="pointer-events-none absolute h-[900px] w-[900px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(250,204,21,0.35) 0%, rgba(20,184,166,0.15) 30%, transparent 65%)",
              transform: reduced
                ? "rotateX(70deg)"
                : `rotateX(${70 - p * 12}deg) rotate(${rot}deg) scale(${0.8 + p * 0.6})`,
              filter: "blur(20px)",
            }}
          />
          {/* Bright core */}
          <div
            className="pointer-events-none absolute h-40 w-40 rounded-full"
            style={{
              background: "radial-gradient(circle, #fff 0%, #fde68a 25%, #f59e0b 55%, transparent 80%)",
              boxShadow: `0 0 ${120 + p * 200}px ${20 + p * 40}px rgba(250,204,21,0.6)`,
              transform: reduced ? undefined : `scale(${1 + p * 0.8})`,
            }}
          />
          {/* Twin jets */}
          {[-1, 1].map((dir) => (
            <div
              key={dir}
              className="pointer-events-none absolute w-2 rounded-full"
              style={{
                height: 900 + p * 400,
                background: `linear-gradient(${dir > 0 ? "to top" : "to bottom"}, transparent, #22d3ee 25%, #ffffff 50%, #22d3ee 75%, transparent)`,
                filter: "blur(3px)",
                opacity: 0.7,
                transform: reduced
                  ? `translateY(${dir * -300}px)`
                  : `translateY(${dir * -300}px) rotate(${rot * 0.3}deg)`,
              }}
            />
          ))}

          {/* Spiral stars */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              transform: reduced
                ? "rotateX(70deg)"
                : `rotateX(${70 - p * 12}deg) rotate(${rot}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {spiral.map((s, i) => {
              const r = s.radius * (0.6 + p * 0.6);
              const x = Math.cos(s.angle) * r;
              const yv = Math.sin(s.angle) * r;
              return (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: s.size,
                    height: s.size,
                    background: `hsl(${s.hue} 95% 75%)`,
                    boxShadow: `0 0 ${s.size * 2}px hsl(${s.hue} 95% 65% / 0.9)`,
                    transform: `translate3d(${x}px, ${yv}px, 0)`,
                    opacity: 0.7 + s.t * 0.3,
                  }}
                />
              );
            })}
          </div>

          {/* Copy */}
          <div className="relative z-10 max-w-2xl text-center px-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
              Chapter VI · Spiral arms
            </p>
            <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
              <span className="bg-gradient-to-r from-amber-200 via-lime-200 to-teal-200 bg-clip-text text-transparent">Quasar</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base sm:text-lg text-white/60">
              Feed the core. Watch the arms unspool from a point of light and paint the black.
            </p>
          </div>
        </div>
      </section>

      {/* Facet cards */}
      <section className="relative px-6 pb-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {facets.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-transform hover:-translate-y-1"
              style={{
                transform: reduced ? undefined : `translateY(${Math.max(0, 40 - (y - 400 - i * 80) * 0.2)}px)`,
              }}
            >
              <div
                className="mb-5 h-32 w-full rounded-2xl"
                style={{
                  background: `radial-gradient(120% 90% at 30% 30%, hsl(${f.hue} 90% 70%) 0%, hsl(${f.hue + 30} 70% 35%) 55%, #050810 95%)`,
                }}
              />
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">0{i + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
