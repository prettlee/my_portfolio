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
    return {
      bright,
      style: {
        left: `${seededRandom(seed) * 100}%`,
        top: `${seededRandom(seed + 1) * 100}%`,
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity: bright ? 0.92 : 0.35 + seededRandom(seed + 3) * 0.45,
        position: "absolute",
        display: "block",
        borderRadius: "50%",
        background: bright ? "#f4fbff" : "#b4c9e8",
        boxShadow: bright ? "0 0 6px 1px rgb(183 224 255 / 70%), 0 0 14px 2px rgb(122 193 255 / 35%)" : "none",
        animation: `star-drift ${5 + seededRandom(seed + 4) * 14}s linear ${-seededRandom(seed + 5) * 18}s infinite`,
        transform: "translate3d(var(--pointer-offset-x, 0px), var(--pointer-offset-y, 0px), 0)",
        willChange: "translate",
      } satisfies CSSProperties,
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
        @keyframes star-drift {
          from { translate: 0 -12vh; }
          to { translate: 0 112vh; }
        }
        @media (prefers-reduced-motion: reduce) {
          .starfield-dot { animation-duration: 28s !important; }
        }
      `}</style>
    </div>
  );
}
