"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Points } from "three";
import { theme } from "@/lib/theme";

function Starfield() {
  const points = useRef<Points>(null);
  const { pointer } = useThree();
  const positions = useMemo(() => {
    const values = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i += 1) {
      values[i * 3] = (Math.sin(i * 127.1) * 0.5) * 24;
      values[i * 3 + 1] = (Math.sin(i * 311.7) * 0.5) * 15;
      values[i * 3 + 2] = Math.sin(i * 74.7) * -32;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const geometry = points.current.geometry;
    const attribute = geometry.attributes.position;
    for (let i = 0; i < attribute.count; i += 1) {
      let z = attribute.getZ(i) + delta * (1.4 + (i % 5) * 0.2);
      if (z > 5) {
        z = -32;
        attribute.setX(i, (Math.random() - 0.5) * 24);
        attribute.setY(i, (Math.random() - 0.5) * 15);
      }
      attribute.setZ(i, z);
    }
    attribute.needsUpdate = true;
    points.current.position.x += (pointer.x * -0.7 - points.current.position.x) * delta * 0.8;
    points.current.position.y += (pointer.y * -0.45 - points.current.position.y) * delta * 0.8;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d9e9ff" size={0.035} sizeAttenuation transparent opacity={0.88} />
    </points>
  );
}

function Astronaut() {
  const astronaut = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!astronaut.current) return;
    astronaut.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.16;
    astronaut.current.position.x += (1.25 + pointer.x * 0.48 - astronaut.current.position.x) * delta * 1.3;
    astronaut.current.rotation.z += (-pointer.x * 0.12 - astronaut.current.rotation.z) * delta * 1.5;
    astronaut.current.rotation.y += (pointer.x * 0.18 - astronaut.current.rotation.y) * delta * 1.2;
  });

  return (
    <group ref={astronaut} position={[1.25, 0.3, 0]} scale={0.82}>
      <mesh position={[0, 0.12, -0.28]}>
        <boxGeometry args={[0.72, 0.92, 0.3]} />
        <meshStandardMaterial color="#8c9bad" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.36, 0.58, 6, 12]} />
        <meshStandardMaterial color="#e8eef8" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.82, 0.08]}>
        <sphereGeometry args={[0.47, 32, 24]} />
        <meshStandardMaterial color="#e4edf8" metalness={0.12} roughness={0.32} />
      </mesh>
      <mesh position={[0.02, 0.82, 0.43]} scale={[0.82, 0.68, 0.24]}>
        <sphereGeometry args={[0.39, 32, 24]} />
        <meshPhysicalMaterial color="#14334d" metalness={0.72} roughness={0.16} clearcoat={1} />
      </mesh>
      <mesh position={[-0.1, 0.9, 0.51]} scale={[0.38, 0.1, 0.035]} rotation={[0, 0, -0.4]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshBasicMaterial color="#75dfff" transparent opacity={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.48, 0.05, 0]} rotation={[0, 0, side * -0.22]}>
          <mesh position={[side * 0.13, -0.2, 0]}>
            <capsuleGeometry args={[0.14, 0.42, 4, 8]} />
            <meshStandardMaterial color="#d5dfeb" roughness={0.75} />
          </mesh>
          <mesh position={[side * 0.18, -0.56, 0.02]} rotation={[0, 0, side * 0.2]}>
            <capsuleGeometry args={[0.15, 0.42, 4, 8]} />
            <meshStandardMaterial color="#d5dfeb" roughness={0.75} />
          </mesh>
          <mesh position={[side * 0.14, 0.3, 0]} rotation={[0, 0, side * 0.5]}>
            <capsuleGeometry args={[0.12, 0.4, 4, 8]} />
            <meshStandardMaterial color="#e8eef8" roughness={0.72} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.2, 0.38]}>
        <boxGeometry args={[0.3, 0.26, 0.06]} />
        <meshStandardMaterial color={theme.colors.cyan} emissive={theme.colors.cyan} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export function SceneCanvas() {
  return (
    <Canvas className="h-full w-full" dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
      <color attach="background" args={[theme.colors.void]} />
      <fog attach="fog" args={[theme.colors.void, 12, 34]} />
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={42} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 5, 6]} intensity={1.8} color="#dceeff" />
      <pointLight position={[2, 1, 3]} intensity={18} color={theme.colors.cyan} distance={8} />
      <Starfield />
      <Astronaut />
    </Canvas>
  );
}
