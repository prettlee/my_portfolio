"use client";

import dynamic from "next/dynamic";

const SceneCanvas = dynamic(
  () => import("./SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false },
);

export function PortfolioScene() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <SceneCanvas />
    </div>
  );
}
