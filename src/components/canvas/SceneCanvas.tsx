"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { theme } from "@/lib/theme";

function ShellForm() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.18;
    mesh.current.rotation.x += delta * 0.04;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color={theme.colors.cyan}
        emissive={theme.colors.violet}
        emissiveIntensity={0.45}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

export function SceneCanvas() {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={[theme.colors.void]} />
      <fog attach="fog" args={[theme.colors.void, 7, 16]} />
      <PerspectiveCamera makeDefault position={[0, 0.15, 6.2]} fov={38} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 5]} intensity={1.4} />
      <ShellForm />
    </Canvas>
  );
}
