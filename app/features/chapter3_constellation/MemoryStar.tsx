"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";

const ACCENT = "#38BDF8";

type Props = {
  position: [number, number, number];
  isActive: boolean;
  onSelect: () => void;
  variant?: "memory" | "secret";
};

const VARIANTS = {
  memory: {
    coreRadius: 0.13,
    glowRadius: 0.42,
    emissive: 2.2,
    emissiveHover: 3.5,
    emissiveActive: 5,
    glowBase: 0.18,
    glowHover: 0.35,
    light: 0.9,
    lightHover: 1.6,
    lightActive: 2.5,
  },
  secret: {
    coreRadius: 0.07,
    glowRadius: 0.22,
    emissive: 0.45,
    emissiveHover: 0.9,
    emissiveActive: 2.8,
    glowBase: 0.06,
    glowHover: 0.14,
    light: 0.15,
    lightHover: 0.4,
    lightActive: 1.4,
  },
} as const;

export default function MemoryStar({
  position,
  isActive,
  onSelect,
  variant = "memory",
}: Props) {
  const style = VARIANTS[variant];
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.8 + position[0]) * 0.08;
    const glowPulse = 0.55 + Math.sin(t * 1.2 + position[1]) * 0.15;

    if (coreRef.current) {
      const targetScale = hovered || isActive ? 1.45 : 1;
      coreRef.current.scale.setScalar(
        pulse * targetScale + (isActive ? 0.2 : 0),
      );
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as MeshBasicMaterial;
      const base = hovered ? style.glowHover : style.glowBase;
      mat.opacity = base + glowPulse * (isActive ? 0.35 : 0.12);
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.35} rotationIntensity={0.15}>
      <group
        ref={groupRef}
        position={position}
        onPointerDown={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={glowRef}>
          <sphereGeometry args={[style.glowRadius, 16, 16]} />
          <meshBasicMaterial
            color={ACCENT}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={coreRef}>
          <sphereGeometry args={[style.coreRadius, 24, 24]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={
              isActive
                ? style.emissiveActive
                : hovered
                  ? style.emissiveHover
                  : style.emissive
            }
            roughness={0.15}
            metalness={0.1}
          />
        </mesh>

        <pointLight
          color={ACCENT}
          intensity={
            isActive ? style.lightActive : hovered ? style.lightHover : style.light
          }
          distance={variant === "secret" ? 2 : 3}
        />
      </group>
    </Float>
  );
}
