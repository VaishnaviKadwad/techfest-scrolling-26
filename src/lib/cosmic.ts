import { useEffect, useState } from "react";

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

export function useReducedMotion() {
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

export function useMousePos() {
  const [p, setP] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const on = (e: MouseEvent) => setP({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, []);
  return p;
}

export function useElementScroll<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const y = useScrollY();
  const [rel, setRel] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRel(-r.top);
  }, [y, ref]);
  return rel;
}
