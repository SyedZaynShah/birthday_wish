"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import type { Mesh, MeshBasicMaterial, MeshStandardMaterial, Points } from "three";
import { finaleTimeline } from "@/src/data/finale";
import {
  buildNameStarPositions,
  buildScatterPositions,
  FINALE_STAR_COUNT,
} from "@/src/lib/starLetter";

const theme = {
  background: "#020617",
  accent: "#38BDF8",
};

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function rangeProgress(value: number, [a, b]: readonly [number, number]) {
  return smoothstep(Math.min(1, Math.max(0, (value - a) / (b - a))));
}

type SceneProps = {
  progressRef: MutableRefObject<number>;
  burstRef: MutableRefObject<number>;
};

function MorphingStars({ progressRef, burstRef }: SceneProps) {
  const pointsRef = useRef<Points>(null);
  const scatter = useMemo(() => buildScatterPositions(FINALE_STAR_COUNT), []);
  const nameStars = useMemo(() => buildNameStarPositions(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const progress = progressRef.current;
    const burst = burstRef.current;
    const gather = rangeProgress(progress, finaleTimeline.starsGather);
    const nameForm = rangeProgress(progress, finaleTimeline.nameForm);
    const orbit = rangeProgress(progress, finaleTimeline.orbit);
    const time = state.clock.elapsedTime;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < FINALE_STAR_COUNT; i++) {
      const si = i * 3;
      const scatterPt = scatter[i];
      const namePt = nameStars[i % nameStars.length];

      let x = scatterPt.x + (namePt.x - scatterPt.x) * nameForm;
      let y = scatterPt.y + (namePt.y - scatterPt.y) * nameForm;
      let z = scatterPt.z + (namePt.z - scatterPt.z) * nameForm;

      const visibility = gather * (0.4 + (i % 10) * 0.06);
      x *= visibility;
      y *= visibility;

      if (orbit > 0.05) {
        const angle = time * 0.35 + i * 0.31;
        const radius = 1.8 + (i % 5) * 0.15;
        const ox = Math.cos(angle) * radius;
        const oz = Math.sin(angle) * radius;
        x = x * (1 - orbit) + ox * orbit;
        z = z * (1 - orbit) + oz * orbit;
        y = y * (1 - orbit) + 0.6 * orbit;
      }

      if (burst > 0) {
        const bx = Math.sin(i * 1.7 + time * 2) * burst * 3;
        const by = Math.cos(i * 2.1 + time * 1.5) * burst * 2;
        x += bx;
        y += by;
      }

      positions[si] = x;
      positions[si + 1] = y;
      positions[si + 2] = z;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const initialPositions = useMemo(() => {
    const arr = new Float32Array(FINALE_STAR_COUNT * 3);
    scatter.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [scatter]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={theme.accent}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function GiantMoon({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame(() => {
    const progress = progressRef.current;
    const rise = rangeProgress(progress, finaleTimeline.moonRise);
    const brighten = rangeProgress(progress, finaleTimeline.skyBrighten);
    const peak = rangeProgress(progress, finaleTimeline.peakGlow);

    if (meshRef.current) {
      meshRef.current.position.y = -2.5 + rise * 2.2;
      meshRef.current.scale.setScalar(0.6 + rise * 1.1);
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + brighten * 0.5 + peak * 0.4;
    }
    if (glowRef.current) {
      glowRef.current.position.y = meshRef.current?.position.y ?? 0;
      glowRef.current.scale.setScalar(1.8 + rise * 1.2 + peak * 0.5);
      const mat = glowRef.current.material as MeshBasicMaterial;
      mat.opacity = 0.08 + brighten * 0.12 + peak * 0.15;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.1} />
      </mesh>
      <mesh ref={meshRef} position={[0, -2.5, -1.5]}>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial
          color="#e2e8f0"
          emissive={theme.accent}
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  useFrame((state) => {
    const progress = progressRef.current;
    const pull = rangeProgress(progress, finaleTimeline.moonRise);
    state.camera.position.y = 0.2 + pull * 1.4;
    state.camera.position.z = 6 - pull * 0.8;
    state.camera.lookAt(0, pull * 0.5, 0);
  });
  return null;
}

function SceneInner({ progressRef, burstRef }: SceneProps) {
  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.background, 4, 18]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 4, 3]} intensity={1} color={theme.accent} />
      <MorphingStars progressRef={progressRef} burstRef={burstRef} />
      <GiantMoon progressRef={progressRef} />
      <Sparkles
        count={40}
        size={1.5}
        color={theme.accent}
        speed={0.25}
        scale={[12, 8, 8]}
        opacity={0.35}
      />
      <CameraRig progressRef={progressRef} />
    </>
  );
}

type Props = {
  active: boolean;
  progressRef: MutableRefObject<number>;
  burstRef: MutableRefObject<number>;
};

export default function FinaleCanvas({ active, progressRef, burstRef }: Props) {
  if (!active) {
    return <div className="absolute inset-0 bg-[#020617]" aria-hidden />;
  }

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0.2, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <SceneInner progressRef={progressRef} burstRef={burstRef} />
    </Canvas>
  );
}
