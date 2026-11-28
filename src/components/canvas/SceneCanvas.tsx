"use client";

import { useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const planetSurface = "radial-gradient(circle at 31% 26%, #f4fbff 0%, #dcecff 13%, #b4c9e8 37%, #637a9d 69%, #101827 100%)";
const planetGlow = "0 0 24px 4px rgb(244 251 255 / 54%), 0 0 68px 14px rgb(244 251 255 / 34%), inset -20px -14px 26px rgb(1 7 16 / 68%), inset 8px 7px 16px rgb(255 255 255 / 24%)";
const planetRingGlow = "0 0 2px rgb(244 251 255 / 100%), 0 0 8px rgb(244 251 255 / 98%), 0 0 20px rgb(244 251 255 / 82%), 0 0 42px rgb(244 251 255 / 42%)";
const ringSparklePositions = [
  { left: "14%", top: "84%" },
  { left: "85%", top: "16%" },
  { left: "97%", top: "61%" },
] as const;

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
      { id: "outer", width: "190%", height: "68%", rotation: "-22deg", color: "rgb(183 224 255 / 92%)", front: false },
      { id: "middle-back", width: "158%", height: "52%", rotation: "-21deg", color: "rgb(244 251 255 / 100%)", front: false },
      { id: "inner", width: "136%", height: "40%", rotation: "-24deg", color: "rgb(180 213 250 / 96%)", front: true },
      { id: "middle-front", width: "176%", height: "61%", rotation: "-23deg", color: "rgb(220 236 255 / 100%)", front: true },
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
  {
    id: "teal",
    travelX: -38,
    travelY: 16,
    size: "clamp(44px, 5vw, 68px)",
    duration: "19s",
    delay: "-5s",
    surface: planetSurface,
    glow: planetGlow,
    rings: [],
  },
  {
    id: "lavender",
    travelX: 39,
    travelY: 34,
    size: "clamp(48px, 5.5vw, 74px)",
    duration: "24s",
    delay: "-11s",
    surface: planetSurface,
    glow: planetGlow,
    rings: [],
  },
] as const;

export function SceneCanvas() {
  const field = useRef<HTMLDivElement>(null);
  const planetLayer = useRef<HTMLDivElement>(null);
  const starLayer = useRef<HTMLDivElement>(null);
  const pointerPosition = useRef<{ x: number; y: number } | null>(null);
  const steeringFrame = useRef<number | null>(null);
  const stars = Array.from({ length: 140 }, (_, index) => {
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
        "--star-x": `${targetX}vw`,
        "--star-y": `${targetY}vh`,
        "--star-opacity": String(opacity),
      } as CSSProperties,
    };
  });

  function updatePointerSteering() {
    const element = field.current;
    const pointer = pointerPosition.current;
    if (!element || !pointer) {
      steeringFrame.current = null;
      return;
    }

    const bounds = element.getBoundingClientRect();
    const offsetX = pointer.x - (bounds.left + bounds.width / 2);
    const offsetY = pointer.y - (bounds.top + bounds.height / 2);
    const distance = Math.hypot(offsetX, offsetY);
    const maxRadius = Math.max(1, Math.min(bounds.width, bounds.height) / 2);
    const strength = Math.min(distance / maxRadius, 1);
    const x = distance > 0 ? (offsetX / distance) * strength : 0;
    const y = distance > 0 ? (offsetY / distance) * strength : 0;

    if (starLayer.current) {
      starLayer.current.style.transform = `translate3d(${-x * 260}px, ${-y * 260}px, 0)`;
    }
    if (planetLayer.current) {
      planetLayer.current.style.transform = `translate3d(${-x * 420}px, ${-y * 420}px, 0)`;
    }

    steeringFrame.current = null;
  }

  function requestSteeringFrame() {
    if (steeringFrame.current === null) {
      steeringFrame.current = requestAnimationFrame(updatePointerSteering);
    }
  }

  function moveField(event: PointerEvent<HTMLDivElement>) {
    pointerPosition.current = { x: event.clientX, y: event.clientY };
    requestSteeringFrame();
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
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          ref={planetLayer}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        >
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
            {planet.rings.map((ring, ringIndex) => (
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
              >
                {ringSparklePositions.map((sparkle, sparkleIndex) => (
                  <span
                    key={`${ring.id}-sparkle-${sparkleIndex}`}
                    className="planet-ring-sparkle"
                    style={{
                      left: sparkle.left,
                      top: sparkle.top,
                      animationDelay: `${-(ringIndex * 0.52 + sparkleIndex * 1.1)}s`,
                    }}
                  />
                ))}
              </span>
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
        <div
          ref={starLayer}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        >
        {stars.map((star, index) => (
          <span
            key={index}
            className="starfield-dot"
            style={star.style}
          />
        ))}
        </div>
      </div>
      <style>{`
        .planet-ring-sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #f4fbff;
          box-shadow: 0 0 4px 2px #f4fbff, 0 0 10px 4px rgb(244 251 255 / 90%), 0 0 18px 7px rgb(244 251 255 / 62%);
          animation: ring-sparkle 2.3s ease-in-out infinite;
          pointer-events: none;
        }
        .planet-ring-sparkle::before,
        .planet-ring-sparkle::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          background: linear-gradient(transparent, #f4fbff, transparent);
          transform: translate(-50%, -50%);
        }
        .planet-ring-sparkle::before { width: 1px; height: 14px; }
        .planet-ring-sparkle::after { width: 14px; height: 1px; }
        @keyframes ring-sparkle {
          0%, 100% { opacity: 0.28; transform: translate(-50%, -50%) scale(0.7); }
          48% { opacity: 1; transform: translate(-50%, -50%) scale(1.7); }
        }
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
          .planet-ring-sparkle { animation: none; opacity: 0.8; }
          .starfield-dot { animation-duration: 28s !important; }
          .ambient-planet { animation-duration: 30s !important; }
        }
      `}</style>
    </div>
  );
}
