"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useSectionVisible } from "@/src/hooks/useSectionVisible";

type Segment = {
  start: [number, number];
  end: [number, number];
};

type OrbitalStar = {
  radius: number;
  speed: number;
  size: number;
  phase: number;
  y: number;
};

const LETTER_DEFS: Record<string, Segment[]> = {
  H: [
    { start: [-0.34, -0.62], end: [-0.34, 0.62] },
    { start: [0.34, -0.62], end: [0.34, 0.62] },
    { start: [-0.34, 0.02], end: [0.34, 0.02] },
  ],
  U: [
    { start: [-0.34, 0.62], end: [-0.34, -0.38] },
    { start: [0.34, 0.62], end: [0.34, -0.38] },
    { start: [-0.34, -0.58], end: [0.34, -0.58] },
  ],
  M: [
    { start: [-0.42, -0.62], end: [-0.42, 0.62] },
    { start: [-0.42, 0.62], end: [0.0, 0.0] },
    { start: [0.0, 0.0], end: [0.42, 0.62] },
    { start: [0.42, 0.62], end: [0.42, -0.62] },
  ],
  A: [
    { start: [-0.36, -0.62], end: [0.0, 0.62] },
    { start: [0.0, 0.62], end: [0.36, -0.62] },
    { start: [-0.18, -0.08], end: [0.18, -0.08] },
  ],
  I: [
    { start: [0.0, -0.62], end: [0.0, 0.62] },
    { start: [-0.22, 0.62], end: [0.22, 0.62] },
    { start: [-0.22, -0.62], end: [0.22, -0.62] },
  ],
};

const STORY_LINES = [
  { id: "date", text: "July 1st", threshold: 17.6 },
  { id: "bright", text: "A day the universe became brighter.", threshold: 18.8 },
  { id: "arrived", text: "Because you arrived.", threshold: 20.0 },
];

const FINAL_LINES = [
  { id: "birthday", text: "Happy Birthday", threshold: 21.8 },
  { id: "name", text: "Humaima", threshold: 22.7 },
  {
    id: "story",
    text: "For the girl who turned a random message into my favorite story.",
    threshold: 23.9,
  },
  { id: "sparkle", text: "✨", threshold: 24.6 },
  { id: "memory", text: "Every star ahead holds a memory.", threshold: 25.0 },
];

const FUTURE_STAR_COUNT = 8;
const HERO_STAR_COUNT = 420;
const HEART_LINE_POINTS = 120;
const CTA_REVEAL_TIME = 25.8;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function sampleSegments(segments: Segment[], count: number) {
  const lengths = segments.map((segment) =>
    Math.hypot(segment.end[0] - segment.start[0], segment.end[1] - segment.start[1]),
  );
  const totalLength = lengths.reduce((sum, value) => sum + value, 0);
  const points: [number, number][] = [];

  for (let index = 0; index < count; index += 1) {
    const targetDistance = totalLength * (count <= 1 ? 0.5 : index / (count - 1));
    let walked = 0;

    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
      const segment = segments[segmentIndex];
      const length = lengths[segmentIndex];

      if (walked + length >= targetDistance || segmentIndex === segments.length - 1) {
        const progress = length === 0 ? 0 : (targetDistance - walked) / length;
        points.push([
          mix(segment.start[0], segment.end[0], progress),
          mix(segment.start[1], segment.end[1], progress),
        ]);
        break;
      }

      walked += length;
    }
  }

  return points;
}

function createWordPoints(word: string, totalPoints: number) {
  const letters = word.split("");
  const spacing = 1.22;
  const offsetX = -((letters.length - 1) * spacing) / 2;
  const perLetter = Math.max(12, Math.floor(totalPoints / letters.length));
  const points: THREE.Vector3[] = [];

  letters.forEach((letter, letterIndex) => {
    const segments = LETTER_DEFS[letter];
    const sampled = sampleSegments(segments, perLetter);
    sampled.forEach(([x, y], pointIndex) => {
      const depth = Math.sin(pointIndex * 0.8 + letterIndex) * 0.08;
      points.push(
        new THREE.Vector3(offsetX + letterIndex * spacing + x, y * 1.08, depth),
      );
    });
  });

  while (points.length < totalPoints) {
    points.push(points[points.length % Math.max(1, points.length)].clone());
  }

  return points.slice(0, totalPoints);
}

function createHeartPoints(totalPoints: number) {
  const points: THREE.Vector3[] = [];

  for (let index = 0; index < totalPoints; index += 1) {
    const t = (index / totalPoints) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    points.push(
      new THREE.Vector3(
        x * 0.12,
        (y + 2.8) * 0.12,
        Math.sin(t * 3) * 0.15,
      ),
    );
  }

  return points;
}

function createStarPositions(count: number, spread: THREE.Vector3, depthOffset = 0) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const i = index * 3;
    positions[i] = (Math.random() - 0.5) * spread.x;
    positions[i + 1] = (Math.random() - 0.5) * spread.y;
    positions[i + 2] = (Math.random() - 0.5) * spread.z + depthOffset;
  }

  return positions;
}

function createMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(520, 420, 120, 512, 512, 480);
  gradient.addColorStop(0, "#f2f7ff");
  gradient.addColorStop(0.28, "#cbd7f7");
  gradient.addColorStop(0.62, "#7b8eb9");
  gradient.addColorStop(1, "#293552");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let layer = 0; layer < 520; layer += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 12 + Math.random() * 80;
    const alpha = 0.018 + Math.random() * 0.055;
    const crater = context.createRadialGradient(x, y, radius * 0.12, x, y, radius);
    crater.addColorStop(0, `rgba(15,23,42,${alpha * 2.5})`);
    crater.addColorStop(0.55, `rgba(56,72,112,${alpha})`);
    crater.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = crater;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  for (let dust = 0; dust < 850; dust += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2.2;
    context.fillStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.04})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createNebulaTexture(colorA: string, colorB: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(384, 384, 100, 384, 384, 360);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(0.55, colorB);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let puff = 0; puff < 95; puff += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 38 + Math.random() * 115;
    const alpha = 0.025 + Math.random() * 0.045;
    const cloud = context.createRadialGradient(x, y, 0, x, y, radius);
    cloud.addColorStop(0, `rgba(255,255,255,${alpha})`);
    cloud.addColorStop(0.5, `rgba(170,200,255,${alpha * 0.65})`);
    cloud.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = cloud;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function useAmbientSeeds() {
  return useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        top: `${8 + ((index * 11) % 78)}%`,
        left: `${4 + ((index * 17) % 88)}%`,
        duration: 8 + index * 0.45,
        delay: index * 0.16,
      })),
    [],
  );
}

function StarLayer({
  count,
  size,
  color,
  elapsedRef,
  start,
  end,
  spread,
  depthOffset,
  speed,
}: {
  count: number;
  size: number;
  color: string;
  elapsedRef: React.MutableRefObject<number>;
  start: number;
  end: number;
  spread: THREE.Vector3;
  depthOffset?: number;
  speed: number;
}) {
  const positions = useMemo(
    () => createStarPositions(count, spread, depthOffset),
    [count, spread, depthOffset],
  );
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = elapsedRef.current;
    const opacity = smoothstep(start, end, elapsed);

    if (materialRef.current) {
      materialRef.current.opacity = opacity * (0.55 + Math.sin(state.clock.elapsedTime * speed) * 0.05);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.1) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color={color}
          size={size}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function NebulaLayer({
  texture,
  position,
  rotation,
  scale,
  elapsedRef,
  revealStart,
  revealEnd,
  drift,
}: {
  texture: THREE.Texture | null;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  elapsedRef: React.MutableRefObject<number>;
  revealStart: number;
  revealEnd: number;
  drift: number;
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = elapsedRef.current;
    const visibility = smoothstep(revealStart, revealEnd, elapsed) * 0.58;

    if (materialRef.current) {
      materialRef.current.opacity = visibility;
    }

    if (meshRef.current) {
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.1 + drift) * 0.08;
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.08 + drift) * 0.5;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.06 + drift) * 0.35;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture ?? undefined}
        color="#9fb7ff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function HeroConstellation({ elapsedRef }: { elapsedRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => new Float32Array(HERO_STAR_COUNT * 3), []);
  const base = useMemo(
    () => createStarPositions(HERO_STAR_COUNT, new THREE.Vector3(16, 9.5, 10), -1.5),
    [],
  );
  const nameTargets = useMemo(() => createWordPoints("HUMAIMA", HERO_STAR_COUNT), []);
  const heartTargets = useMemo(() => createHeartPoints(HERO_STAR_COUNT), []);
  const heartLine = useMemo(
    () => createHeartPoints(HEART_LINE_POINTS).map((point) => [point.x, point.y, point.z] as [number, number, number]),
    [],
  );
  const lineRef = useRef<THREE.Group>(null);

  useEffect(() => {
    positions.set(base);
  }, [base, positions]);

  useFrame((state) => {
    const elapsed = elapsedRef.current;
    const nameIn = smoothstep(10.7, 13.2, elapsed);
    const nameOut = smoothstep(14.2, 15.4, elapsed);
    const nameWeight = nameIn * (1 - nameOut);
    const heartWeight = smoothstep(15.4, 18.4, elapsed);
    const heroVisibility = smoothstep(2.4, 5.6, elapsed);

    for (let index = 0; index < HERO_STAR_COUNT; index += 1) {
      const i = index * 3;
      const baseX = base[i];
      const baseY = base[i + 1];
      const baseZ = base[i + 2];
      const name = nameTargets[index];
      const heart = heartTargets[index];

      let x = mix(baseX, name.x, nameWeight);
      let y = mix(baseY, name.y, nameWeight);
      let z = mix(baseZ, name.z, nameWeight);

      x = mix(x, heart.x, heartWeight);
      y = mix(y, heart.y, heartWeight);
      z = mix(z, heart.z, heartWeight);

      const drift = Math.sin(state.clock.elapsedTime * 0.45 + index * 0.37) * 0.028;
      const bob = Math.cos(state.clock.elapsedTime * 0.32 + index * 0.22) * 0.026;

      positions[i] = x + drift * (1 - heartWeight * 0.45);
      positions[i + 1] = y + bob * (1 - heartWeight * 0.35);
      positions[i + 2] = z + Math.sin(state.clock.elapsedTime * 0.25 + index) * 0.02;
    }

    if (pointsRef.current) {
      const attribute = pointsRef.current.geometry.attributes.position;
      attribute.needsUpdate = true;
    }

    if (materialRef.current) {
      materialRef.current.opacity = heroVisibility * (0.72 + Math.sin(state.clock.elapsedTime * 1.1) * 0.08);
    }

    if (lineRef.current) {
      lineRef.current.visible = heartWeight > 0.02;
      lineRef.current.scale.setScalar(0.96 + heartWeight * 0.05);
    }
  });

  return (
    <>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color="#ffffff"
          size={0.14}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={lineRef} visible={false}>
        <Line
          points={heartLine}
          color="#8bd9ff"
          lineWidth={1.4}
          transparent
          opacity={0.18}
        />
      </group>
    </>
  );
}

function MoonCluster({
  elapsedRef,
  isFlying,
}: {
  elapsedRef: React.MutableRefObject<number>;
  isFlying: boolean;
}) {
  const texture = useMemo(() => createMoonTexture(), []);
  const glowTexture = useMemo(
    () => createNebulaTexture("rgba(196,228,255,0.95)", "rgba(103,143,255,0.2)"),
    [],
  );
  const moonRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const shellRef = useRef<THREE.MeshBasicMaterial>(null);
  const orbitalGroupRef = useRef<THREE.Group>(null);
  const futureStars = useMemo<OrbitalStar[]>(
    () =>
      Array.from({ length: FUTURE_STAR_COUNT }, (_, index) => ({
        radius: 2.2 + (index % 3) * 0.42,
        speed: 0.18 + index * 0.015,
        size: 0.04 + (index % 2) * 0.018,
        phase: index * ((Math.PI * 2) / FUTURE_STAR_COUNT),
        y: -0.62 + (index % 4) * 0.44,
      })),
    [],
  );

  useFrame((state) => {
    const elapsed = elapsedRef.current;
    const reveal = smoothstep(6.0, 9.4, elapsed);
    const orchestra = smoothstep(19.0, 22.0, elapsed);
    const glowPulse = 0.78 + Math.sin(state.clock.elapsedTime * 0.45) * 0.08;

    if (moonRef.current) {
      moonRef.current.visible = reveal > 0.01;
      moonRef.current.position.set(
        mix(5.8, 2.55, reveal),
        mix(1.8, 1.05, reveal),
        mix(-7.8, -4.8, reveal),
      );
      const scale = mix(0.22, isFlying ? 1.16 : 1, reveal);
      moonRef.current.scale.setScalar(scale);
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      moonRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
    }

    if (glowRef.current) {
      glowRef.current.opacity = reveal * (0.34 + orchestra * 0.15) * glowPulse;
    }

    if (shellRef.current) {
      shellRef.current.opacity = reveal * 0.2;
    }

    if (orbitalGroupRef.current) {
      orbitalGroupRef.current.visible = orchestra > 0.05;
      orbitalGroupRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={moonRef} visible={false}>
      <mesh>
        <sphereGeometry args={[1.78, 64, 64]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color="#d8e7ff"
          emissive="#5baeff"
          emissiveIntensity={0.18}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      <mesh scale={1.06}>
        <sphereGeometry args={[1.82, 48, 48]} />
        <meshBasicMaterial
          ref={shellRef}
          color="#8cd4ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={[5.7, 5.7, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={glowRef}
          map={glowTexture ?? undefined}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={orbitalGroupRef} visible={false}>
        {futureStars.map((star, index) => (
          <FutureStar key={index} config={star} />
        ))}
      </group>
    </group>
  );
}

function FutureStar({ config }: { config: OrbitalStar }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const angle = state.clock.elapsedTime * config.speed + config.phase;
    ref.current.position.set(
      Math.cos(angle) * config.radius,
      config.y + Math.sin(angle * 1.3) * 0.12,
      Math.sin(angle) * config.radius * 0.38,
    );
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + config.phase) * 0.22;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[config.size, 12, 12]} />
      <meshBasicMaterial color="#f8fbff" />
    </mesh>
  );
}

function ShootingStars({ elapsedRef }: { elapsedRef: React.MutableRefObject<number> }) {
  const trails = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => ({
        offset: index * 1.7,
        startX: 8 + index * 1.3,
        startY: 2.6 - index * 0.6,
        depth: -2 - index * 0.45,
        speed: 0.42 + index * 0.04,
      })),
    [],
  );

  return (
    <>
      {trails.map((trail, index) => (
        <ShootingStar key={index} trail={trail} elapsedRef={elapsedRef} />
      ))}
    </>
  );
}

function ShootingStar({
  trail,
  elapsedRef,
}: {
  trail: {
    offset: number;
    startX: number;
    startY: number;
    depth: number;
    speed: number;
  };
  elapsedRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const elapsed = elapsedRef.current;
    const reveal = smoothstep(19.4, 21.8, elapsed);
    const cycle = (state.clock.elapsedTime * trail.speed + trail.offset) % 5.5;
    const progress = smoothstep(0.2, 1.55, cycle);
    const active = reveal > 0.02 && cycle < 1.8;

    if (groupRef.current) {
      groupRef.current.visible = active;
      groupRef.current.position.set(
        mix(trail.startX, -6.8, progress),
        mix(trail.startY, -2.5, progress),
        trail.depth,
      );
      groupRef.current.rotation.z = -0.55;
    }

    if (materialRef.current) {
      materialRef.current.opacity = active ? reveal * (1 - progress * 0.55) : 0;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <planeGeometry args={[1.2, 0.035]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#d9efff"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0.55, 0, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function CameraRig({
  elapsedRef,
  flyThrough,
  onFlyComplete,
}: {
  elapsedRef: React.MutableRefObject<number>;
  flyThrough: boolean;
  onFlyComplete: () => void;
}) {
  const { camera } = useThree();
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
  }, [flyThrough]);

  useFrame((state) => {
    const elapsed = elapsedRef.current;
    const baseDriftX = Math.sin(state.clock.elapsedTime * 0.18) * 0.35;
    const baseDriftY = Math.cos(state.clock.elapsedTime * 0.12) * 0.22;
    const reveal = smoothstep(6.0, 9.2, elapsed);

    if (flyThrough) {
      const progress = smoothstep(0, 1.9, state.clock.elapsedTime - elapsed + elapsedRef.current);
      camera.position.x = mix(camera.position.x, 0.0, 0.08);
      camera.position.y = mix(camera.position.y, 0.1, 0.08);
      camera.position.z = mix(camera.position.z, -4.8, 0.06);
      camera.lookAt(0, 0.1, -10);

      if (!completedRef.current && camera.position.z < -4.15) {
        completedRef.current = true;
        onFlyComplete();
      }

      if (progress > 0.99 && !completedRef.current) {
        completedRef.current = true;
        onFlyComplete();
      }
      return;
    }

    camera.position.x = mix(camera.position.x, baseDriftX - reveal * 0.7, 0.03);
    camera.position.y = mix(camera.position.y, baseDriftY + reveal * 0.25, 0.03);
    camera.position.z = mix(camera.position.z, 12.5 - reveal * 1.8, 0.03);
    camera.lookAt(0, 0.2, -1.5);
  });

  return null;
}

function IntroScene({
  elapsedRef,
  flyThrough,
  onFlyComplete,
}: {
  elapsedRef: React.MutableRefObject<number>;
  flyThrough: boolean;
  onFlyComplete: () => void;
}) {
  const nebulaA = useMemo(
    () => createNebulaTexture("rgba(164,214,255,0.65)", "rgba(47,76,163,0.08)"),
    [],
  );
  const nebulaB = useMemo(
    () => createNebulaTexture("rgba(255,207,162,0.52)", "rgba(108,91,255,0.08)"),
    [],
  );
  const sparklesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const elapsed = elapsedRef.current;
    if (sparklesRef.current) {
      sparklesRef.current.visible = elapsed > 18.6;
    }
  });

  return (
    <>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#030610", 10, 28]} />

      <ambientLight intensity={0.26} />
      <directionalLight position={[5, 4, 7]} intensity={1.05} color="#c9ddff" />
      <pointLight position={[2.4, 1.8, -3.8]} intensity={1.8} color="#72d3ff" />
      <pointLight position={[-5, 0, 3]} intensity={0.35} color="#6f8df6" />

      <StarLayer
        count={260}
        size={0.05}
        color="#a8c8ff"
        elapsedRef={elapsedRef}
        start={2.8}
        end={4.6}
        spread={new THREE.Vector3(24, 15, 13)}
        speed={0.8}
      />
      <StarLayer
        count={420}
        size={0.07}
        color="#d9ebff"
        elapsedRef={elapsedRef}
        start={3.8}
        end={5.8}
        spread={new THREE.Vector3(21, 12, 15)}
        depthOffset={-3}
        speed={1.05}
      />
      <StarLayer
        count={680}
        size={0.03}
        color="#f4f8ff"
        elapsedRef={elapsedRef}
        start={4.8}
        end={7.0}
        spread={new THREE.Vector3(32, 18, 24)}
        depthOffset={-7}
        speed={1.2}
      />

      <NebulaLayer
        texture={nebulaA}
        position={[-4.8, 1.2, -8.2]}
        rotation={[0.08, 0.12, -0.28]}
        scale={[12, 8.4, 1]}
        elapsedRef={elapsedRef}
        revealStart={5.2}
        revealEnd={8.8}
        drift={0.2}
      />
      <NebulaLayer
        texture={nebulaB}
        position={[5.6, -0.8, -9.5]}
        rotation={[0.02, -0.1, 0.22]}
        scale={[13.2, 9.2, 1]}
        elapsedRef={elapsedRef}
        revealStart={6.2}
        revealEnd={10.2}
        drift={1.1}
      />

      <HeroConstellation elapsedRef={elapsedRef} />
      <MoonCluster elapsedRef={elapsedRef} isFlying={flyThrough} />
      <ShootingStars elapsedRef={elapsedRef} />

      <group ref={sparklesRef} visible={false}>
        <Sparkles
          count={80}
          size={5}
          speed={0.22}
          color="#d7f1ff"
          scale={[18, 11, 10]}
          opacity={0.34}
        />
      </group>

      <CameraRig
        elapsedRef={elapsedRef}
        flyThrough={flyThrough}
        onFlyComplete={onFlyComplete}
      />
    </>
  );
}

function MusicToggle({
  visible,
  enabled,
  onClick,
}: {
  visible: boolean;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={enabled ? "Pause intro music" : "Play intro music"}
      onClick={onClick}
      className="pointer-events-auto rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/72 backdrop-blur-md transition hover:border-white/25 hover:text-white"
      initial={{ opacity: 0, y: -10 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {enabled ? "Music On" : "Music Off"}
    </motion.button>
  );
}

export default function Chapter0() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setRef: setVisibleRef, visible } = useSectionVisible("20% 0px", true);
  const elapsedRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flyCompleteRef = useRef(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [flyThrough, setFlyThrough] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const ambientSeeds = useAmbientSeeds();

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      setVisibleRef(node);
    },
    [setVisibleRef],
  );

  useEffect(() => {
    let cancelled = false;

    async function detectAudio() {
      try {
        const response = await fetch("/audio/intro-theme.mp3", { method: "HEAD" });
        if (!cancelled && response.ok) {
          const audio = new Audio("/audio/intro-theme.mp3");
          audio.loop = true;
          audio.volume = 0.45;
          audio.preload = "none";
          audioRef.current = audio;
          setAudioReady(true);
        }
      } catch {
        if (!cancelled) {
          setAudioReady(false);
        }
      }
    }

    detectAudio();

    return () => {
      cancelled = true;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    let frameId = 0;
    const update = () => {
      const current = ((performance.now() - (startTimeRef.current ?? performance.now())) / 1000);
      elapsedRef.current = current;
      setElapsed(current);
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frameId);
  }, [visible]);

  useEffect(() => {
    if (audioEnabled) {
      audioRef.current?.play().catch(() => {
        setAudioEnabled(false);
      });
      return;
    }

    audioRef.current?.pause();
  }, [audioEnabled]);

  const handleFollowTheStars = useCallback(() => {
    if (flyThrough) return;
    setFlyThrough(true);
  }, [flyThrough]);

  const handleFlyComplete = useCallback(() => {
    if (flyCompleteRef.current) return;
    flyCompleteRef.current = true;

    window.setTimeout(() => {
      document.getElementById("chapter-1")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 240);
  }, []);

  const allowText = elapsed > 17.2;
  const showFinalReveal = elapsed > 21.6;
  const showCTA = elapsed > CTA_REVEAL_TIME;

  return (
    <section
      ref={mergedRef}
      id="chapter-0"
      className="relative h-screen w-full overflow-hidden bg-[#02030a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(106,161,255,0.08)_0%,rgba(2,3,10,0.08)_32%,transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(126,214,255,0.12)_0%,transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.98)_0%,rgba(2,3,10,0.7)_38%,rgba(2,3,10,0.86)_100%)]" />

      <div className="absolute inset-0">
        {visible && (
          <Canvas
            camera={{ position: [0, 0, 12.5], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            className="h-full w-full"
          >
            <IntroScene
              elapsedRef={elapsedRef}
              flyThrough={flyThrough}
              onFlyComplete={handleFlyComplete}
            />
          </Canvas>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {ambientSeeds.map((seed) => (
          <motion.span
            key={seed.id}
            className="absolute h-1 w-1 rounded-full bg-white/70 shadow-[0_0_12px_rgba(141,219,255,0.55)]"
            style={{ top: seed.top, left: seed.left }}
            animate={{
              opacity: elapsed > 18 ? [0.08, 0.55, 0.12] : [0, 0, 0],
              y: elapsed > 18 ? [0, -14, 0] : 0,
            }}
            transition={{
              duration: seed.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: seed.delay,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col">
        <div className="pointer-events-none flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7">
          <div />
          {audioReady && (
            <MusicToggle
              visible={elapsed > 8}
              enabled={audioEnabled}
              onClick={() => setAudioEnabled((current) => !current)}
            />
          )}
        </div>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="relative flex w-full max-w-6xl flex-col items-center text-center">
            <AnimatePresence>
              {allowText && (
                <motion.div
                  key="story-intro"
                  className="pointer-events-none space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 1.3, ease: "easeOut" }}
                >
                  {STORY_LINES.map((line) => (
                    <motion.p
                      key={line.id}
                      className={`mx-auto max-w-4xl text-sm font-light uppercase tracking-[0.55em] text-white/74 sm:text-base ${
                        line.id === "date" ? "text-white/86" : ""
                      }`}
                      initial={{ opacity: 0, y: 22 }}
                      animate={
                        elapsed > line.threshold
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 22 }
                      }
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showFinalReveal && (
                <motion.div
                  key="final-reveal"
                  className="mt-10 flex w-full max-w-5xl flex-col items-center"
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                >
                  <motion.p
                    className="text-[11px] uppercase tracking-[0.8em] text-white/50 sm:text-xs"
                    initial={{ opacity: 0 }}
                    animate={elapsed > FINAL_LINES[0].threshold ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.9 }}
                  >
                    The Story Begins
                  </motion.p>

                  <motion.h1
                    className="mt-5 text-4xl font-light tracking-[0.2em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
                    initial={{ opacity: 0, y: 24 }}
                    animate={elapsed > FINAL_LINES[0].threshold ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    Happy Birthday
                  </motion.h1>

                  <motion.h2
                    className="mt-4 bg-gradient-to-r from-[#f7fbff] via-[#d9efff] to-[#ffd7a8] bg-clip-text text-5xl font-light tracking-[0.28em] text-transparent sm:text-7xl md:text-8xl lg:text-[9rem]"
                    initial={{ opacity: 0, y: 28 }}
                    animate={elapsed > FINAL_LINES[1].threshold ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                    transition={{ duration: 1.35, ease: "easeOut" }}
                  >
                    Humaima
                  </motion.h2>

                  <motion.p
                    className="mt-8 max-w-2xl text-sm leading-7 text-white/72 sm:text-base"
                    initial={{ opacity: 0, y: 18 }}
                    animate={elapsed > FINAL_LINES[2].threshold ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  >
                    For the girl who turned a random message into my favorite story.
                  </motion.p>

                  <motion.p
                    className="mt-5 text-3xl text-white/90"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={elapsed > FINAL_LINES[3].threshold ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    ✨
                  </motion.p>

                  <motion.p
                    className="mt-2 text-sm uppercase tracking-[0.45em] text-white/62 sm:text-base"
                    initial={{ opacity: 0, y: 12 }}
                    animate={elapsed > FINAL_LINES[4].threshold ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    Every star ahead holds a memory.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-none relative z-20 flex min-h-[8rem] items-end justify-center px-6 pb-8 sm:pb-10">
          <AnimatePresence>
            {showCTA && (
              <motion.div
                key="cta"
                className="pointer-events-auto flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                <motion.button
                  type="button"
                  onClick={handleFollowTheStars}
                  className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/18 bg-white/[0.05] backdrop-blur-md transition hover:border-white/35"
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                      "0 0 28px rgba(108,194,255,0.18)",
                      "0 0 48px rgba(108,194,255,0.32)",
                      "0 0 28px rgba(108,194,255,0.18)",
                    ],
                  }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-3 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(153,223,255,0.95)_28%,rgba(82,163,255,0.2)_72%,transparent_100%)]" />
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0)_0deg,rgba(255,255,255,0.25)_120deg,rgba(255,255,255,0)_220deg)] opacity-0 transition group-hover:opacity-100" />
                  <div className="relative h-4 w-4 rotate-45 bg-white shadow-[0_0_18px_rgba(255,255,255,0.85)]" />
                </motion.button>

                <motion.p
                  className="text-[11px] uppercase tracking-[0.52em] text-white/72 sm:text-xs"
                  animate={{ opacity: [0.62, 1, 0.62] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Follow The Stars
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        aria-label="Hidden star"
        onClick={() => setSecretRevealed(true)}
        className="absolute right-7 top-[24%] z-20 h-3 w-3 rounded-full bg-white/10 shadow-[0_0_14px_rgba(255,255,255,0.15)] transition hover:bg-white/30 hover:shadow-[0_0_18px_rgba(186,228,255,0.45)]"
      />

      <AnimatePresence>
        {secretRevealed && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center px-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="rounded-3xl border border-white/12 bg-[#071120]/75 px-6 py-4 text-center backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/55">
                Secret
              </p>
              <p className="mt-3 text-sm text-white/82 sm:text-base">
                The brightest star was never in the sky.
              </p>
              <p className="mt-2 text-lg text-white/90">❤️</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
