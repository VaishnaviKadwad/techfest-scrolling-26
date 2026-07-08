import { useMemo } from "react";
import { useScrollY, useReducedMotion } from "@/lib/cosmic";

type Palette = {
  base: string; // css bg
  blobs: { color: string; x: string; y: string; size: number; speed: number }[];
};

export const palettes: Record<string, Palette> = {
  aether: {
    base: "radial-gradient(ellipse at top, #1a0b2e 0%, #080314 45%, #02010a 100%)",
    blobs: [
      { color: "#a855f7", x: "-6%", y: "10%", size: 520, speed: 0.08 },
      { color: "#22d3ee", x: "80%", y: "60%", size: 640, speed: 0.12 },
      { color: "#f472b6", x: "30%", y: "130%", size: 560, speed: 0.15 },
    ],
  },
  nebula: {
    base: "radial-gradient(ellipse at top, #2d0a3e 0%, #0a0220 50%, #030010 100%)",
    blobs: [
      { color: "#ec4899", x: "70%", y: "5%", size: 600, speed: 0.1 },
      { color: "#8b5cf6", x: "-10%", y: "50%", size: 700, speed: 0.16 },
      { color: "#06b6d4", x: "50%", y: "140%", size: 520, speed: 0.2 },
    ],
  },
  voidwalk: {
    base: "radial-gradient(ellipse at center, #0f172a 0%, #030711 60%, #000006 100%)",
    blobs: [
      { color: "#3b82f6", x: "50%", y: "20%", size: 800, speed: 0.06 },
      { color: "#1e40af", x: "50%", y: "80%", size: 600, speed: 0.14 },
    ],
  },
  eclipse: {
    base: "radial-gradient(ellipse at top, #3a1a05 0%, #150701 55%, #050200 100%)",
    blobs: [
      { color: "#f97316", x: "20%", y: "10%", size: 560, speed: 0.09 },
      { color: "#dc2626", x: "80%", y: "60%", size: 620, speed: 0.13 },
      { color: "#facc15", x: "40%", y: "130%", size: 480, speed: 0.18 },
    ],
  },
  singularity: {
    base: "radial-gradient(ellipse at center, #0a0a0a 0%, #050014 55%, #000000 100%)",
    blobs: [
      { color: "#7c3aed", x: "50%", y: "50%", size: 900, speed: 0.05 },
      { color: "#0ea5e9", x: "20%", y: "30%", size: 500, speed: 0.2 },
      { color: "#f472b6", x: "80%", y: "80%", size: 500, speed: 0.22 },
    ],
  },
};

export function CosmicBackground({ palette = "aether" }: { palette?: keyof typeof palettes }) {
  const y = useScrollY();
  const reduced = useReducedMotion();
  const p = palettes[palette];

  const stars = useMemo(
    () =>
      [
        { size: 1, count: 70, speed: 0.05, opacity: 0.5 },
        { size: 1.5, count: 45, speed: 0.15, opacity: 0.8 },
        { size: 2.5, count: 22, speed: 0.3, opacity: 1 },
      ].map((L, li) => ({
        ...L,
        stars: Array.from({ length: L.count }).map((_, i) => {
          const seed = (li + 1) * 1000 + i * 37;
          const x = Math.abs((Math.sin(seed) * 10000) % 100);
          const yv = Math.abs((Math.cos(seed * 1.3) * 10000) % 100);
          return { x, y: yv * 3 };
        }),
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: p.base }} />
      {p.blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            transform: reduced ? undefined : `translate3d(0, ${y * -b.speed}px, 0)`,
          }}
        />
      ))}
      {stars.map((L, li) => (
        <div
          key={li}
          className="absolute inset-0"
          style={{ transform: reduced ? undefined : `translate3d(0, ${y * -L.speed}px, 0)` }}
        >
          {L.stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: L.size,
                height: L.size,
                opacity: L.opacity,
                boxShadow: L.size > 1.5 ? "0 0 6px rgba(255,255,255,0.9)" : undefined,
              }}
            />
          ))}
        </div>
      ))}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}
