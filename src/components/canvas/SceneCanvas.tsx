"use client";

import { useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function SceneCanvas() {
  const field = useRef<HTMLDivElement>(null);
  const stars = Array.from({ length: 220 }, (_, index) => {
    const bright = index % 7 === 0;
    const seed = index + 900;
    const diameter = bright ? 2.4 + seededRandom(seed + 2) * 1.8 : 1 + seededRandom(seed + 2) * 1.2;
    const targetX = (seededRandom(seed + 6) - 0.5) * 190;
    const targetY = (seededRandom(seed + 7) - 0.5) * 140;
    const opacity = bright ? 1 : 0.4 + seededRandom(seed + 3) * 0.45;
    return {
      bright,
      style: {
        left: "50%",
        top: "50%",
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity,
        position: "absolute",
        display: "block",
        borderRadius: "50%",
        background: bright ? "#f4fbff" : "#b4c9e8",
        boxShadow: bright ? "0 0 6px 1px rgb(183 224 255 / 70%), 0 0 14px 2px rgb(122 193 255 / 35%)" : "none",
        animation: `star-approach ${5 + seededRandom(seed + 4) * 11}s linear ${-seededRandom(seed + 5) * 16}s infinite`,
        transform: "translate3d(var(--pointer-offset-x, 0px), var(--pointer-offset-y, 0px), 0)",
        willChange: "translate, scale",
        "--star-x": `${targetX}vw`,
        "--star-y": `${targetY}vh`,
        "--star-opacity": String(opacity),
      } as CSSProperties,
    };
  });

  function moveField(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    field.current?.style.setProperty("--pointer-offset-x", `${-x * 18}px`);
    field.current?.style.setProperty("--pointer-offset-y", `${-y * 12}px`);
  }

  return (
    <div
      ref={field}
      aria-hidden="true"
      className="starfield-sky"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "var(--void)",
        pointerEvents: "auto",
      }}
      onPointerMove={moveField}
      onPointerLeave={() => {
        field.current?.style.setProperty("--pointer-offset-x", "0px");
        field.current?.style.setProperty("--pointer-offset-y", "0px");
      }}
    >
      {stars.map((star, index) => (
        <span
          key={index}
          className="starfield-dot"
          style={star.style}
        />
      ))}
      <style>{`
        @keyframes star-approach {
          from { translate: 0 0; scale: 0.12; opacity: 0.02; }
          to {
            translate: var(--star-x) var(--star-y);
            scale: 1.5;
            opacity: var(--star-opacity);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .starfield-dot { animation-duration: 28s !important; }
        }
      `}</style>
    </div>
  );
}
