"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { GalleryImage } from "@/src/data/gallery";
import { getPlaceholderTexture } from "./placeholderTexture";

const ACCENT = "#38BDF8";

const SIZE_MAP = {
  small: { width: 0.85, height: 1.05, frame: 0.06, depth: 0.07 },
  medium: { width: 1.2, height: 1.5, frame: 0.08, depth: 0.08 },
  large: { width: 1.65, height: 2.05, frame: 0.1, depth: 0.09 },
  centerpiece: { width: 2.5, height: 3.1, frame: 0.14, depth: 0.1 },
} as const;

type Props = {
  image: GalleryImage;
  isSelected: boolean;
  onSelect: (image: GalleryImage) => void;
};

export default function FloatingFrame({ image, isSelected, onSelect }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const dims = SIZE_MAP[image.size];
  const floatOffset = useRef(image.position[0] + image.position[2]);

  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      image.image,
      (loaded) => {
        if (active) {
          loaded.colorSpace = THREE.SRGBColorSpace;
          setTexture(loaded);
        }
      },
      undefined,
      () => {
        if (active) setTexture(getPlaceholderTexture());
      },
    );
    return () => {
      active = false;
    };
  }, [image.image]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const baseY = image.position[1];
    const floatY = Math.sin(t * 0.5 + floatOffset.current) * 0.07;
    const floatX = Math.cos(t * 0.35 + floatOffset.current * 0.5) * 0.03;

    if (groupRef.current) {
      groupRef.current.position.set(
        image.position[0] + floatX,
        baseY + floatY,
        image.position[2],
      );
      groupRef.current.rotation.y =
        image.rotation[1] + Math.sin(t * 0.2 + floatOffset.current) * 0.04;
      groupRef.current.rotation.z =
        image.rotation[2] + Math.cos(t * 0.25) * 0.02;
    }

    if (frameRef.current) {
      const lift = hovered || isSelected ? 0.12 : 0;
      const targetScale = hovered || isSelected ? 1.06 : 1;
      frameRef.current.position.y += (lift - frameRef.current.position.y) * 0.08;
      frameRef.current.scale.x +=
        (targetScale - frameRef.current.scale.x) * 0.08;
      frameRef.current.scale.y +=
        (targetScale - frameRef.current.scale.y) * 0.08;
      frameRef.current.scale.z +=
        (targetScale - frameRef.current.scale.z) * 0.08;
    }
  });

  const glowIntensity = hovered || isSelected ? 0.45 : 0.1;
  const emissiveIntensity = hovered || isSelected ? 0.35 : 0.06;

  return (
    <group
      ref={groupRef}
      position={image.position}
      rotation={[image.rotation[0], image.rotation[1], image.rotation[2]]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(image);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={frameRef}>
        {/* Glass frame outer */}
        <mesh position={[0, 0, -dims.depth / 2]}>
          <boxGeometry
            args={[
              dims.width + dims.frame * 2,
              dims.height + dims.frame * 2,
              dims.depth,
            ]}
          />
          <meshPhysicalMaterial
            color="#1E293B"
            emissive={ACCENT}
            emissiveIntensity={emissiveIntensity}
            metalness={0.5}
            roughness={0.2}
            transparent
            opacity={0.92}
            transmission={0.15}
          />
        </mesh>

        {/* Inner glow rim */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry
            args={[dims.width + 0.04, dims.height + 0.04, 0.02]}
          />
          <meshBasicMaterial
            color={ACCENT}
            transparent
            opacity={glowIntensity}
          />
        </mesh>

        {/* Photo or placeholder */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[dims.width, dims.height]} />
          <meshBasicMaterial
            map={texture ?? getPlaceholderTexture()}
            toneMapped={false}
            transparent
            opacity={texture ? 1 : 0.95}
          />
        </mesh>

        {/* Ambient frame glow */}
        {(hovered || isSelected) && (
          <pointLight
            color={ACCENT}
            intensity={1.4}
            distance={4}
            position={[0, 0, 0.6]}
          />
        )}
      </group>
    </group>
  );
}
