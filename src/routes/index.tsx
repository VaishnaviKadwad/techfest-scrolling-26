import { createFileRoute } from "@tanstack/react-router";
import { ParallaxPage } from "@/components/ParallaxPage";

export const Route = createFileRoute("/")({
  component: ParallaxPage,
  head: () => ({
    meta: [
      { title: "Aether — An Interactive Parallax Voyage" },
      {
        name: "description",
        content: "Drift through eight chapters of light, dust, and gravity in this immersive parallax scrolling experience.",
      },
      { property: "og:title", content: "Aether — An Interactive Parallax Voyage" },
      { property: "og:description", content: "A cinematic eight-chapter parallax journey through the cosmos." },
    ],
  }),
});
