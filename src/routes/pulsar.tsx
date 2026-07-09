import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicNav } from "@/components/CosmicNav";
import { useReducedMotion, useScrollY } from "@/lib/cosmic";

export const Route = createFileRoute("/pulsar")({
  component: PulsarPage,
  head: () => ({
    meta: [
      { title: "Pulsar — A Rhythmic Timeline of Light" },
      { name: "description", content: "3D flipping cards along a pulsing timeline of a dying neutron star." },
      { property: "og:title", content: "Pulsar — Rhythmic Timeline" },
      { property: "og:description", content: "Scroll a rhythmic timeline. Each beat flips a 3D card of a neutron star's life." },
    ],
  }),
});

const beats = [
  { t: "0 ms", title: "Collapse", note: "A giant star's core folds inward at a quarter the speed of light.", hue: 340 },
  { t: "1 s", title: "Neutron", note: "Protons and electrons fuse. A sun compresses into a city.", hue: 300 },
  { t: "10 s", title: "Spin-up", note: "Angular momentum concentrates. It spins hundreds of times a second.", hue: 260 },
  { t: "1 hr", title: "Beam", note: "Twin lighthouse beams of radio waves sweep the cosmos.", hue: 220 },
  { t: "1 yr", title: "Slow-down", note: "Magnetic braking widens the pulse by microseconds a year.", hue: 190 },
  { t: "10⁶ yr", title: "Silence", note: "The beam fades. The heart still spins, unseen.", hue: 30 },
];

function PulsarPage() {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const maxY = typeof window !== "undefined" ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
  const p = Math.min(1, y / maxY);
  // Rhythmic pulse tied to scroll
  const beat = 0.5 + 0.5 * Math.sin(y * 0.02);

  return (
    <div className="relative min-h-screen text-white antialiased overflow-x-hidden">
      <CosmicBackground palette="pulsar" />
      <CosmicNav />

      {/* Hero */}
      <section className="relative flex min-h-[100dvh] items-center justify-center px-6">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, #fff 0%, #f43f5e 30%, transparent 70%)",
            filter: "blur(20px)",
            opacity: 0.4 + beat * 0.5,
            transform: `translate(-50%,-50%) scale(${0.6 + beat * 0.6})`,
          }}
        />
        {/* Sweeping beams */}
        {!reduced && [0, 1].map((d) => (
          <div
            key={d}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[3px] w-[220vw] -translate-x-1/2 -translate-y-1/2 origin-center"
            style={{
              background: "linear-gradient(to right, transparent, rgba(244,63,94,0.9), transparent)",
              transform: `translate(-50%,-50%) rotate(${(y * 0.6 + d * 180) % 360}deg)`,
              filter: "blur(2px)",
              opacity: 0.7,
            }}
          />
        ))}
        <div className="relative z-10 text-center" style={{ opacity: Math.max(0, 1 - y / 700) }}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.9)]" />
            Chapter VI · Rhythmic timeline
          </p>
          <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
            <span className="bg-gradient-to-r from-rose-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">Pulsar</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-white/60">
            A dying star keeps a pulse. Scroll one heartbeat at a time.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative px-6 pb-40 [perspective:1400px]">
        <div className="relative mx-auto max-w-5xl">
          {/* spine */}
          <div className="pointer-events-none absolute left-4 md:left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-rose-400/0 via-rose-300/70 to-sky-300/0" />
          {/* beat marker */}
          <div
            className="pointer-events-none absolute left-4 md:left-1/2 h-5 w-5 -translate-x-1/2 rounded-full"
            style={{
              top: `${Math.min(100, p * 100)}%`,
              background: "radial-gradient(circle, #fff, #f43f5e 60%, transparent 80%)",
              boxShadow: `0 0 ${20 + beat * 40}px rgba(244,63,94,${0.6 + beat * 0.4})`,
              transform: `translate(-50%, -50%) scale(${0.8 + beat * 0.6})`,
            }}
          />

          <ul className="space-y-16">
            {beats.map((b, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              const localY = typeof window !== "undefined" ? y - (i * 260 + 400) : 0;
              const flip = Math.max(-90, Math.min(0, -localY * 0.25));
              return (
                <li
                  key={b.t}
                  className={`relative flex ${side === "right" ? "md:justify-end" : "md:justify-start"} pl-12 md:pl-0`}
                >
                  <div
                    className="w-full md:w-[46%] rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
                    style={{
                      transform: reduced
                        ? undefined
                        : `rotateY(${side === "right" ? -flip : flip}deg) rotateX(${flip * 0.2}deg)`,
                      transformStyle: "preserve-3d",
                      transformOrigin: side === "right" ? "left center" : "right center",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          background: `hsl(${b.hue} 90% 70%)`,
                          boxShadow: `0 0 12px hsl(${b.hue} 90% 60% / 0.9)`,
                        }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">t + {b.t}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold">{b.title}</h3>
                    <p className="mt-2 text-sm text-white/60">{b.note}</p>
                    <div
                      className="mt-5 h-24 rounded-2xl"
                      style={{
                        background: `radial-gradient(120% 90% at 30% 30%, hsl(${b.hue} 90% 70%) 0%, hsl(${b.hue + 30} 70% 35%) 55%, #060314 95%)`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
