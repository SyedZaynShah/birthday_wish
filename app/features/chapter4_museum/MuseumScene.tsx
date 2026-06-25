"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { galleryImages, galleryZones } from "@/src/data/gallery";
import type { GalleryImage } from "@/src/data/gallery";
import FloatingFrame from "./FloatingFrame";

const THEME = {
  background: "#020617",
  accent: "#38BDF8",
};

type Props = {
  scrollProgress: number;
  selectedImage: GalleryImage | null;
  onSelectImage: (image: GalleryImage) => void;
};

function MuseumHall() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial
          color="#0F172A"
          emissive={THEME.accent}
          emissiveIntensity={0.04}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.95, 0]}
      >
        <ringGeometry args={[7, 8.2, 64]} />
        <meshBasicMaterial color={THEME.accent} transparent opacity={0.1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.94, 0]}>
        <ringGeometry args={[2.8, 3.2, 48]} />
        <meshBasicMaterial color={THEME.accent} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function LightRays() {
  const rays = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        angle: (i / 4) * Math.PI * 2,
        length: 10 + i * 1.5,
      })),
    [],
  );

  return (
    <group position={[0, 4, 0]}>
      {rays.map((ray) => (
        <mesh key={ray.id} rotation={[0.25, ray.angle, 0]}>
          <planeGeometry args={[0.35, ray.length]} />
          <meshBasicMaterial
            color={THEME.accent}
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  const waypoints = useMemo(() => {
    const entry = {
      pos: new THREE.Vector3(0, 2.2, 9),
      look: new THREE.Vector3(0, 1, 0),
    };

    const zones = galleryZones.map((zone) => ({
      pos: new THREE.Vector3(
        zone.focus[0] * 0.4,
        zone.focus[1] + 0.6,
        zone.focus[2] * 0.4 + 5.5,
      ),
      look: new THREE.Vector3(...zone.focus),
    }));

    return [entry, ...zones];
  }, []);

  useFrame(() => {
    const total = waypoints.length - 1;
    const scaled = Math.min(0.88, scrollProgress) * total;
    const index = Math.min(Math.floor(scaled), total - 1);
    const t = scaled - index;
    const eased = t * t * (3 - 2 * t);

    const from = waypoints[index];
    const to = waypoints[Math.min(index + 1, total)];

    camera.position.lerpVectors(from.pos, to.pos, eased);
    const lookTarget = new THREE.Vector3().lerpVectors(
      from.look,
      to.look,
      eased,
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

function SceneContent({
  scrollProgress,
  selectedImage,
  onSelectImage,
}: Props) {
  return (
    <>
      <color attach="background" args={[THEME.background]} />
      <fog attach="fog" args={[THEME.background, 10, 24]} />

      <ambientLight intensity={0.28} />
      <pointLight position={[0, 5, 2]} intensity={1.1} color={THEME.accent} />
      <pointLight position={[-4, 1, -2]} intensity={0.4} color="#7DD3FC" />

      <Stars radius={45} depth={40} count={400} factor={2.5} fade speed={0.3} />
      <Sparkles
        count={25}
        size={1.6}
        color={THEME.accent}
        speed={0.25}
        scale={[12, 7, 12]}
        opacity={0.35}
      />

      <LightRays />
      <MuseumHall />

      {galleryImages.map((image) => (
        <FloatingFrame
          key={image.id}
          image={image}
          isSelected={selectedImage?.id === image.id}
          onSelect={onSelectImage}
        />
      ))}

      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}

export default function MuseumScene({
  scrollProgress,
  selectedImage,
  onSelectImage,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 9], fov: 48 }}
      className="absolute inset-0 touch-none"
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <SceneContent
        scrollProgress={scrollProgress}
        selectedImage={selectedImage}
        onSelectImage={onSelectImage}
      />
    </Canvas>
  );
}
