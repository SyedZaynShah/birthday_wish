"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  constellationEdges,
  memories,
  memoryPositions,
  secretStarPosition,
  type Memory,
} from "@/src/data/memories";
import MemoryStar from "./MemoryStar";

const THEME = {
  background: "#020617",
  accent: "#38BDF8",
};

type Props = {
  selectedMemory: Memory | null;
  secretRevealed: boolean;
  onSelect: (memory: Memory) => void;
  onSelectSecret: () => void;
};

function ConstellationLines() {
  const lines = useMemo(() => {
    return constellationEdges.map(([fromId, toId]) => {
      const from = memoryPositions[fromId];
      const to = memoryPositions[toId];
      return { key: `${fromId}-${toId}`, from, to };
    });
  }, []);

  return (
    <group>
      {lines.map(({ key, from, to }) => (
        <Line
          key={key}
          points={[from, to]}
          color={THEME.accent}
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}
    </group>
  );
}

function CameraRig({
  flyTarget,
  isFlying,
  onFlyComplete,
}: {
  flyTarget: THREE.Vector3 | null;
  isFlying: boolean;
  onFlyComplete: () => void;
}) {
  const { camera } = useThree();
  const time = useRef(0);
  const desiredPosition = useRef(new THREE.Vector3(0, 0.4, 7));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (flyTarget) {
      hasCompleted.current = false;
      desiredPosition.current.copy(flyTarget).add(new THREE.Vector3(0, 0.25, 2.2));
      lookAtTarget.current.copy(flyTarget);
    }
  }, [flyTarget]);

  useFrame((_, delta) => {
    if (isFlying && flyTarget) {
      camera.position.lerp(desiredPosition.current, delta * 2.8);
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      const targetDir = lookAtTarget.current
        .clone()
        .sub(camera.position)
        .normalize();
      currentLook.lerp(targetDir, delta * 3);
      camera.lookAt(
        camera.position.x + currentLook.x,
        camera.position.y + currentLook.y,
        camera.position.z + currentLook.z,
      );

      if (
        !hasCompleted.current &&
        camera.position.distanceTo(desiredPosition.current) < 0.08
      ) {
        hasCompleted.current = true;
        onFlyComplete();
      }
      return;
    }

    time.current += delta * 0.18;
    const driftX = Math.sin(time.current) * 0.35;
    const driftY = 0.35 + Math.cos(time.current * 0.7) * 0.18;
    const driftZ = 7 + Math.sin(time.current * 0.5) * 0.15;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, driftX, delta * 1.2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, driftY, delta * 1.2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, driftZ, delta * 1.2);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContent({
  selectedMemory,
  secretRevealed,
  onSelect,
  onSelectSecret,
}: {
  selectedMemory: Memory | null;
  secretRevealed: boolean;
  onSelect: (memory: Memory) => void;
  onSelectSecret: () => void;
}) {
  const [pendingMemory, setPendingMemory] = useState<Memory | null>(null);
  const [pendingSecret, setPendingSecret] = useState(false);
  const [flyTarget, setFlyTarget] = useState<THREE.Vector3 | null>(null);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    if (!selectedMemory && !secretRevealed) {
      setPendingMemory(null);
      setPendingSecret(false);
      setFlyTarget(null);
      setIsFlying(false);
    }
  }, [selectedMemory, secretRevealed]);

  const handleStarSelect = (memory: Memory) => {
    if (isFlying) return;
    const position = memoryPositions[memory.id];
    setPendingMemory(memory);
    setPendingSecret(false);
    setFlyTarget(new THREE.Vector3(...position));
    setIsFlying(true);
  };

  const handleSecretSelect = () => {
    if (isFlying) return;
    setPendingMemory(null);
    setPendingSecret(true);
    setFlyTarget(new THREE.Vector3(...secretStarPosition));
    setIsFlying(true);
  };

  const handleFlyComplete = () => {
    if (pendingSecret) {
      onSelectSecret();
    } else if (pendingMemory) {
      onSelect(pendingMemory);
    }
    setIsFlying(false);
  };

  return (
    <>
      <color attach="background" args={[THEME.background]} />
      <fog attach="fog" args={[THEME.background, 6, 18]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[2, 3, 4]} intensity={1.1} color={THEME.accent} />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#7DD3FC" />

      <Stars radius={40} depth={40} count={450} factor={2.8} fade speed={0.4} />
      <Sparkles
        count={30}
        size={1.8}
        color={THEME.accent}
        speed={0.3}
        scale={[10, 7, 10]}
        opacity={0.45}
      />

      <ConstellationLines />

      {memories.map((memory) => (
        <MemoryStar
          key={memory.id}
          position={memoryPositions[memory.id]}
          isActive={
            selectedMemory?.id === memory.id ||
            pendingMemory?.id === memory.id
          }
          onSelect={() => handleStarSelect(memory)}
        />
      ))}

      <MemoryStar
        position={secretStarPosition}
        variant="secret"
        isActive={secretRevealed || pendingSecret}
        onSelect={handleSecretSelect}
      />

      <CameraRig
        flyTarget={flyTarget}
        isFlying={isFlying}
        onFlyComplete={handleFlyComplete}
      />
    </>
  );
}

export default function ConstellationScene({
  selectedMemory,
  secretRevealed,
  onSelect,
  onSelectSecret,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 7], fov: 45 }}
      className="absolute inset-0 touch-none"
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <SceneContent
        selectedMemory={selectedMemory}
        secretRevealed={secretRevealed}
        onSelect={onSelect}
        onSelectSecret={onSelectSecret}
      />
    </Canvas>
  );
}
