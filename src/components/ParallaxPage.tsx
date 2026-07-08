import { useEffect, useRef, useState } from "react";
import { CosmicNav } from "@/components/CosmicNav";


const sections = [
  {
    id: "origin",
    eyebrow: "Chapter 01",
    title: "Origin",
    subtitle: "Where light was born",
    body: "A silent expanse, older than time itself. From nothingness, the first spark ignited — bending space, weaving stars into constellations no eye had yet seen.",
    hue: 260,
  },
  {
    id: "drift",
    eyebrow: "Chapter 02",
    title: "Drift",
    subtitle: "Through the nebula",
    body: "Clouds of stellar dust roll like oceans. We drift between violet plumes and cold cyan currents, listening to the low hum of galaxies breathing.",
    hue: 200,
  },
  {
    id: "orbit",
    eyebrow: "Chapter 03",
    title: "Orbit",
    subtitle: "Gravity, remembered",
    body: "A pale world holds us close. Rings of ice catch distant suns and scatter them into a thousand quiet mirrors, each one a possible future.",
    hue: 30,
  },
  {
    id: "beyond",
    eyebrow: "Chapter 04",
    title: "Beyond",
    subtitle: "The horizon has no edge",
    body: "Every ending is a doorway. Past the last star, the universe folds inward — infinite, weightless, and waiting for the next traveler.",
    hue: 320,
  },
];

function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 640px)");
    const on = () => setR(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

function Nav({ active }: { active: string }) {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(920px,calc(100%-1.5rem))]">
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
        <a href="#origin" onClick={go("origin")} className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          <span>AETHER</span>
        </a>
        <ul className="hidden sm:flex items-center gap-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={go(s.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
                  active === s.id ? "text-white" : "text-white/55 hover:text-white/90"
                }`}
              >
                {active === s.id && (
                  <span className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20" />
                )}
                <span className="relative">{s.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#beyond"
          onClick={go("beyond")}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-[1.03]"
        >
          Begin
        </a>
      </div>
    </nav>
  );
}

function Starfield({ y, reduced }: { y: number; reduced: boolean }) {
  // Three star layers at different depths
  const layers = [
    { size: 1, count: 60, speed: 0.05, opacity: 0.5 },
    { size: 1.5, count: 40, speed: 0.15, opacity: 0.75 },
    { size: 2.5, count: 20, speed: 0.3, opacity: 1 },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0b2e_0%,_#080314_45%,_#02010a_100%)]" />
      {/* Nebula blobs */}
      <div
        className="absolute -left-24 top-[10%] h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, #a855f7 0%, transparent 65%)",
          transform: reduced ? undefined : `translate3d(0, ${y * -0.08}px, 0)`,
        }}
      />
      <div
        className="absolute right-[-10%] top-[60%] h-[640px] w-[640px] rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, #22d3ee 0%, transparent 65%)",
          transform: reduced ? undefined : `translate3d(0, ${y * -0.12}px, 0)`,
        }}
      />
      <div
        className="absolute left-[30%] top-[130%] h-[560px] w-[560px] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #f472b6 0%, transparent 65%)",
          transform: reduced ? undefined : `translate3d(0, ${y * -0.15}px, 0)`,
        }}
      />
      {/* Stars */}
      {layers.map((L, li) => (
        <div
          key={li}
          className="absolute inset-0"
          style={{ transform: reduced ? undefined : `translate3d(0, ${y * -L.speed}px, 0)` }}
        >
          {Array.from({ length: L.count }).map((_, i) => {
            const seed = (li + 1) * 1000 + i * 37;
            const x = (Math.sin(seed) * 10000) % 100;
            const yv = (Math.cos(seed * 1.3) * 10000) % 100;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.abs(x)}%`,
                  top: `${Math.abs(yv) * 3}%`,
                  width: L.size,
                  height: L.size,
                  opacity: L.opacity,
                  boxShadow: L.size > 1.5 ? "0 0 6px rgba(255,255,255,0.9)" : undefined,
                }}
              />
            );
          })}
        </div>
      ))}
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSeen(true)),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-out ${
        seen ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Hero({ y, reduced }: { y: number; reduced: boolean }) {
  return (
    <section
      id="origin"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6"
    >
      {/* Orbit ring midground */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={{ transform: reduced ? undefined : `translate3d(-50%, calc(-50% + ${y * 0.15}px), 0) rotate(${y * 0.02}deg)` }}
      >
        <div className="absolute inset-8 rounded-full border border-white/5" />
        <div className="absolute inset-20 rounded-full border border-white/5" />
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.9)]" />
      </div>
      {/* Planet */}
      <div
        className="pointer-events-none absolute left-1/2 top-[62%] h-[380px] w-[380px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f0abfc 0%, #a855f7 30%, #4c1d95 65%, #0f0524 100%)",
          boxShadow: "0 0 120px 20px rgba(168,85,247,0.35), inset -30px -40px 90px rgba(0,0,0,0.6)",
          transform: reduced ? undefined : `translate3d(-50%, ${y * 0.25}px, 0)`,
        }}
      />
      <div
        className="relative z-10 mx-auto max-w-4xl text-center"
        style={{ transform: reduced ? undefined : `translate3d(0, ${y * 0.4}px, 0)`, opacity: Math.max(0, 1 - y / 600) }}
      >
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          A parallax voyage
        </p>
        <h1 className="text-white font-black leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
          Fall <span className="italic font-light text-white/80">upward</span>
          <br />
          into the <span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-200 bg-clip-text text-transparent">cosmos</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-white/60">
          Four chapters. One infinite scroll. Move through layers of light, dust, and gravity at your own pace.
        </p>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="relative flex h-9 w-5 justify-center rounded-full border border-white/30">
          <span className="mt-1.5 h-2 w-[3px] animate-[scrollhint_1.6s_ease-in-out_infinite] rounded-full bg-white/80" />
        </span>
      </div>
    </section>
  );
}

function Chapter({
  data,
  index,
  y,
  reduced,
}: {
  data: (typeof sections)[number];
  index: number;
  y: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [rel, setRel] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    setRel(y - top);
  }, [y]);

  const flip = index % 2 === 1;
  const shapeTransform = reduced ? undefined : `translate3d(0, ${rel * -0.15}px, 0) rotate(${rel * 0.03}deg)`;

  return (
    <section
      id={data.id}
      ref={ref}
      className="relative flex min-h-[110dvh] items-center overflow-hidden px-6 py-32"
    >
      {/* Foreground floaty shape */}
      <div
        className="pointer-events-none absolute -z-[1]"
        style={{
          top: "10%",
          [flip ? "right" : "left"]: "-8%",
          transform: shapeTransform,
        }}
      >
        <div
          className="h-[420px] w-[420px] rounded-[42%_58%_54%_46%/48%_44%_56%_52%] opacity-70 blur-[2px]"
          style={{
            background: `conic-gradient(from ${index * 60}deg, hsl(${data.hue} 90% 65% / 0.7), hsl(${data.hue + 60} 90% 55% / 0.6), hsl(${data.hue - 40} 90% 60% / 0.5), hsl(${data.hue} 90% 65% / 0.7))`,
            boxShadow: `0 0 100px 20px hsl(${data.hue} 85% 55% / 0.35)`,
          }}
        />
      </div>
      {/* Tiny particles */}
      {!reduced &&
        Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/70"
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + ((i * 37) % 60)}%`,
              transform: `translate3d(0, ${rel * (-0.3 - i * 0.05)}px, 0)`,
              boxShadow: "0 0 8px rgba(255,255,255,0.9)",
              opacity: 0.6,
            }}
          />
        ))}

      <div
        className={`relative z-10 mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2 md:items-center ${
          flip ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/50">
            {data.eyebrow}
          </p>
          <h2 className="mt-4 text-white font-black tracking-tight text-[clamp(2.5rem,7vw,5rem)] leading-[0.95]">
            {data.title}.
          </h2>
          <p
            className="mt-2 text-2xl font-light italic"
            style={{ color: `hsl(${data.hue} 90% 78%)` }}
          >
            {data.subtitle}
          </p>
          <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-white/65">
            {data.body}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span className="text-5xl font-black text-white/10 tabular-nums">
              0{index + 1}
            </span>
            <span className="h-px w-24 bg-white/20" />
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              of 04
            </span>
          </div>
        </Reveal>

        <Reveal className="delay-100">
          <div
            className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            style={{
              transform: reduced ? undefined : `translate3d(0, ${rel * -0.05}px, 0)`,
            }}
          >
            <div
              className="aspect-[4/5] w-full overflow-hidden rounded-2xl"
              style={{
                background: `radial-gradient(120% 90% at 30% 20%, hsl(${data.hue} 80% 65%) 0%, hsl(${data.hue + 40} 70% 40%) 40%, #0a0418 90%)`,
              }}
            >
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-x-8 bottom-8 h-1/2 rounded-full opacity-90"
                  style={{
                    background: `radial-gradient(ellipse at center, hsl(${data.hue} 100% 85%) 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:36px_36px] opacity-30" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-white/50">
              <span className="uppercase tracking-[0.3em]">Coordinates</span>
              <span className="tabular-nums">
                {(index * 42.7).toFixed(2)}° · {(index * 88.3).toFixed(2)}°
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">End of transmission</p>
      <p className="mt-4 text-white/80 text-lg">
        Thanks for drifting with us.
      </p>
      <p className="mt-1 text-white/40 text-sm">
        Built with parallax, patience, and a little starlight.
      </p>
    </footer>
  );
}

export function ParallaxPage() {
  const y = useParallax();
  const reduced = useReduced();
  const [active, setActive] = useState("origin");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white antialiased selection:bg-fuchsia-400/40 selection:text-white">
      <Starfield y={y} reduced={reduced} />
      <Nav active={active} />
      <Hero y={y} reduced={reduced} />
      {sections.slice(1).map((s, i) => (
        <Chapter key={s.id} data={s} index={i + 1} y={y} reduced={reduced} />
      ))}
      <Footer />
    </div>
  );
}
