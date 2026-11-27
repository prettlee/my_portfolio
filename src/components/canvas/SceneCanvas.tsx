"use client";

import { PerspectiveCamera, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
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

function SafetyTether() {
  const tether = useMemo(() => {
    const path = new CatmullRomCurve3([
      new Vector3(-0.2, 0.43, 0.08),
      new Vector3(-0.42, 0.35, 0.08),
      new Vector3(-0.5, 0.1, 0.08),
      new Vector3(-0.76, -0.03, 0.08),
      new Vector3(-0.92, -0.3, 0.08),
    ]);
    return path;
  }, []);
  const cable = useMemo(() => new TubeGeometry(tether, 48, 0.018, 8, false), [tether]);
  const highlight = useMemo(() => {
    const offsetPath = new CatmullRomCurve3(
      tether.getPoints(48).map((point) => new Vector3(point.x, point.y + 0.012, point.z + 0.008)),
    );
    return new TubeGeometry(offsetPath, 48, 0.003, 5, false);
  }, [tether]);

  return (
    <group>
      <mesh geometry={cable}>
        <meshStandardMaterial color="#344454" metalness={0.72} roughness={0.34} />
      </mesh>
      <mesh geometry={highlight}>
        <meshBasicMaterial color="#87dfff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.2, 0.43, 0.08]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#a7d8e8" metalness={0.8} roughness={0.26} />
      </mesh>
    </group>
  );
}

function Astronaut() {
  const astronaut = useRef<Group>(null);
  const { pointer } = useThree();
  const suit = useTexture("/astronaut-cutout-v2.png");

  useFrame((state, delta) => {
    if (!astronaut.current) return;
    astronaut.current.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    astronaut.current.position.x += (1.35 + pointer.x * 0.24 - astronaut.current.position.x) * delta * 1.1;
    astronaut.current.rotation.z += (-pointer.x * 0.08 - astronaut.current.rotation.z) * delta * 1.3;
    astronaut.current.rotation.y += (pointer.x * 0.1 - astronaut.current.rotation.y) * delta * 1.2;
  });

  return (
    <group ref={astronaut} position={[1.35, 0.2, 0]} scale={0.58}>
      <SafetyTether />
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[1.75, 2.05]} />
        <meshBasicMaterial map={suit} transparent alphaTest={0.02} depthWrite={false} toneMapped={false} />
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
