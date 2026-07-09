import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useMousePos, useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/stardust")({
  component: StardustPage,
  head: () => ({
    meta: [
      { title: "Stardust — Particles That Learn a Constellation" },
      { name: "description", content: "Scroll to gather scattered stardust into the shape of a constellation." },
      { property: "og:title", content: "Stardust — Constellation Assembly" },
      { property: "og:description", content: "Interactive particle field that assembles into a constellation as you scroll." },
    ],
  }),
});

// Target constellation points (a simple stylized bird / phoenix shape) in normalized -1..1 space
const TARGETS: [number, number][] = [
  [-0.75, 0.15], [-0.55, 0.05], [-0.35, -0.05], [-0.15, -0.1], [0.05, -0.05],
  [0.25, 0.1], [0.45, 0.25], [0.65, 0.35], [0.8, 0.5], [-0.5, -0.25],
  [-0.3, -0.35], [-0.1, -0.4], [0.15, -0.3], [0.35, -0.15], [-0.6, 0.35],
  [-0.4, 0.45], [0.2, 0.4], [0.5, 0.55], [-0.2, 0.55], [0.0, 0.2],
];

const N = 220;
const CLOUD = Array.from({ length: N }).map((_, i) => {
  const s1 = Math.sin(i * 12.9898) * 43758.5453;
  const s2 = Math.cos(i * 78.233) * 12345.678;
  const rx = (s1 - Math.floor(s1)) * 2 - 1;
  const ry = (s2 - Math.floor(s2)) * 2 - 1;
  const target = TARGETS[i % TARGETS.length];
  const jitterX = (Math.sin(i * 3.1) * 0.06);
  const jitterY = (Math.cos(i * 2.7) * 0.06);
  return {
    rx,
    ry,
    tx: target[0] + jitterX,
    ty: target[1] + jitterY,
    size: 1.5 + (Math.abs(rx * ry) * 4),
    hue: 220 + (i * 7) % 140,
    speed: 0.3 + ((i * 0.017) % 0.7),
  };
});

function StardustPage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const mp = useMousePos();
  const maxY = typeof window !== "undefined" ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
  const p = Math.min(1, y / maxY);
  // eased assemble
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

  return (
    <div className="relative min-h-screen text-white antialiased">
      <CosmicBackground palette="stardust" />
      <CosmicNav />

      <section className="relative" style={{ height: "360vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="relative h-[80vh] w-[min(1100px,92vw)]">
            {/* Constellation lines fade in near the end */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="-1 -1 2 2"
              preserveAspectRatio="none"
              style={{ opacity: Math.max(0, (e - 0.55) * 2.5) }}
            >
              <g stroke="rgba(192,132,252,0.6)" strokeWidth="0.005" fill="none">
                {TARGETS.slice(0, -1).map((pt, i) => {
                  const next = TARGETS[i + 1];
                  return (
                    <line key={i} x1={pt[0]} y1={-pt[1]} x2={next[0]} y2={-next[1]} />
                  );
                })}
              </g>
            </svg>

            {CLOUD.map((s, i) => {
              const wander = reduced
                ? 0
                : Math.sin((y + i * 30) * 0.003 * s.speed) * 0.03;
              const px = s.rx + (s.tx - s.rx) * e + wander;
              const py = s.ry + (s.ty - s.ry) * e - wander;
              // subtle cursor repulsion
              const dx = (mp.x - 0.5) * 2;
              const dy = (mp.y - 0.5) * 2;
              const distX = px - dx;
              const distY = py - dy;
              const d2 = distX * distX + distY * distY + 0.05;
              const push = reduced ? 0 : Math.min(0.06, 0.012 / d2);
              const fx = px + (distX / Math.sqrt(d2)) * push;
              const fy = py + (distY / Math.sqrt(d2)) * push;
              return (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${(fx * 0.5 + 0.5) * 100}%`,
                    top: `${(-fy * 0.5 + 0.5) * 100}%`,
                    width: s.size,
                    height: s.size,
                    background: `hsl(${s.hue} 95% 80%)`,
                    boxShadow: `0 0 ${s.size * 2}px hsl(${s.hue} 95% 70% / 0.9)`,
                    opacity: 0.6 + e * 0.4,
                    transform: "translate(-50%,-50%)",
                  }}
                />
              );
            })}
          </div>

          {/* Copy */}
          <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 z-10 max-w-2xl text-center px-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
              Chapter IX · Constellation assembly
            </p>
            <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(2.5rem,8vw,6rem)]">
              <span className="bg-gradient-to-r from-violet-200 via-sky-200 to-pink-200 bg-clip-text text-transparent">Stardust</span> remembers.
            </h1>
          </div>

          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white/60 text-base">Scroll — {(e * 100).toFixed(0)}% assembled</p>
            <div className="mt-3 mx-auto h-[3px] w-[min(420px,60vw)] overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-gradient-to-r from-violet-300 via-sky-300 to-pink-300" style={{ width: `${e * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 text-center">
        <h2 className="text-white font-black tracking-tight text-[clamp(2rem,6vw,4rem)]">
          Chaos, then a name.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-white/60 text-lg">
          Every constellation is just a story we told the dust.
        </p>
      </section>
    </div>
  );
}
