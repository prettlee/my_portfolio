"use client";

import { useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const planetSurface = "radial-gradient(circle at 31% 26%, #f4fbff 0%, #dcecff 13%, #b4c9e8 37%, #637a9d 69%, #101827 100%)";
const planetGlow = "0 0 24px 4px rgb(183 224 255 / 48%), 0 0 68px 14px rgb(122 193 255 / 30%), inset -20px -14px 26px rgb(1 7 16 / 68%), inset 8px 7px 16px rgb(255 255 255 / 24%)";
const planetRingGlow = "0 0 2px rgb(255 252 236 / 100%), 0 0 8px rgb(255 224 163 / 98%), 0 0 20px rgb(246 181 92 / 86%), 0 0 42px rgb(246 181 92 / 45%)";

const planets = [
  {
    id: "azure",
    travelX: 28,
    travelY: -27,
    size: "clamp(88px, 12vw, 148px)",
    duration: "18s",
    delay: "-7s",
    surface: planetSurface,
    glow: planetGlow,
    rings: [],
  },
  {
    id: "violet",
    travelX: -30,
    travelY: -28,
    size: "clamp(64px, 7vw, 90px)",
    duration: "20s",
    delay: "-13s",
    surface: planetSurface,
    glow: planetGlow,
    rings: [
      { id: "outer", width: "190%", height: "68%", rotation: "-22deg", color: "rgb(255 215 155 / 92%)", front: false },
      { id: "middle-back", width: "158%", height: "52%", rotation: "-21deg", color: "rgb(255 239 205 / 100%)", front: false },
      { id: "inner", width: "136%", height: "40%", rotation: "-24deg", color: "rgb(255 207 137 / 96%)", front: true },
      { id: "middle-front", width: "176%", height: "61%", rotation: "-23deg", color: "rgb(255 232 184 / 100%)", front: true },
    ],
  },
  {
    id: "amber",
    travelX: 17,
    travelY: 25,
    size: "clamp(64px, 7vw, 88px)",
    duration: "22s",
    delay: "-18s",
    surface: planetSurface,
    glow: planetGlow,
    rings: [],
  },
] as const;

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
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {planets.map((planet) => (
          <span
            key={planet.id}
            className="ambient-planet"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: planet.size,
              height: planet.size,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              animation: `planet-approach ${planet.duration} linear ${planet.delay} infinite`,
              willChange: "translate, scale",
              "--planet-x": `${planet.travelX}vw`,
              "--planet-y": `${planet.travelY}vh`,
              "--planet-opacity": "0.88",
            } as CSSProperties}
          >
            {planet.rings.map((ring) => (
              <span
                key={ring.id}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: ring.width,
                  height: ring.height,
                  transform: `translate(-50%, -50%) rotate(${ring.rotation})`,
                  border: `1px solid ${ring.color}`,
                  borderRadius: "50%",
                  boxShadow: planetRingGlow,
                  zIndex: ring.front ? 2 : 0,
                }}
              />
            ))}
            <span
              style={{
                position: "relative",
                zIndex: 1,
                display: "block",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: planet.surface,
                boxShadow: planet.glow,
              }}
            />
          </span>
        ))}
      </div>
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
        @keyframes planet-approach {
          from { translate: 0 0; scale: 0.12; opacity: 0.02; }
          to {
            translate: var(--planet-x) var(--planet-y);
            scale: 1.5;
            opacity: var(--planet-opacity);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .starfield-dot { animation-duration: 28s !important; }
          .ambient-planet { animation-duration: 30s !important; }
        }
      `}</style>
    </div>
  );
}
