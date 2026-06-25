"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import { useSectionVisible } from "@/src/hooks/useSectionVisible";

// ==========================================
// Math Point Sampling for Constellations
// ==========================================

interface Segment {
  start: [number, number];
  end: [number, number];
}

const LETTER_DEFS: Record<string, Segment[]> = {
  H: [
    { start: [-0.35, -0.6], end: [-0.35, 0.6] },
    { start: [0.35, -0.6], end: [0.35, 0.6] },
    { start: [-0.35, 0.0], end: [0.35, 0.0] },
  ],
  U: [
    { start: [-0.35, -0.4], end: [-0.35, 0.6] },
    { start: [0.35, -0.4], end: [0.35, 0.6] },
    { start: [-0.35, -0.6], end: [0.35, -0.6] },
    { start: [-0.35, -0.4], end: [-0.35, -0.6] },
    { start: [0.35, -0.4], end: [0.35, -0.6] },
  ],
  M: [
    { start: [-0.45, -0.6], end: [-0.45, 0.6] },
    { start: [-0.45, 0.6], end: [0.0, 0.0] },
    { start: [0.0, 0.0], end: [0.45, 0.6] },
    { start: [0.45, 0.6], end: [0.45, -0.6] },
  ],
  A: [
    { start: [-0.35, -0.6], end: [0.0, 0.6] },
    { start: [0.0, 0.6], end: [0.35, -0.6] },
    { start: [-0.18, -0.15], end: [0.18, -0.15] },
  ],
  I: [
    { start: [0.0, -0.6], end: [0.0, 0.6] },
    { start: [-0.2, 0.6], end: [0.2, 0.6] },
    { start: [-0.2, -0.6], end: [0.2, -0.6] },
  ],
};

function sampleSegments(segments: Segment[], count: number): [number, number][] {
  const lengths: number[] = [];
  let totalLength = 0;
  for (const seg of segments) {
    const dx = seg.end[0] - seg.start[0];
    const dy = seg.end[1] - seg.start[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    lengths.push(len);
    totalLength += len;
  }

  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const targetDist = t * totalLength;
    let accumulatedDist = 0;

    for (let s = 0; s < segments.length; s++) {
      const seg = segments[s];
      const len = lengths[s];
      if (accumulatedDist + len >= targetDist || s === segments.length - 1) {
        const segT = len > 0 ? (targetDist - accumulatedDist) / len : 0;
        const x = seg.start[0] + segT * (seg.end[0] - seg.start[0]);
        const y = seg.start[1] + segT * (seg.end[1] - seg.start[1]);
        points.push([x, y]);
        break;
      }
      accumulatedDist += len;
    }
  }
  return points;
}

function sampleHeart(count: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    points.push([x * 0.09, (y + 2.5) * 0.09]);
  }
  return points;
}

// ==========================================
// GLSL Shaders Definitions
// ==========================================

const StarsShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uWeightName;
    uniform float uWeightHeart;
    
    attribute float aSize;
    attribute float aTwinkleSpeed;
    attribute float aTimeOffset;
    attribute vec3 aTargetName;
    attribute vec3 aTargetHeart;
    
    varying float vOpacity;
    
    void main() {
      vec3 pos = position;
      
      // Blend configurations
      pos = mix(pos, aTargetName, uWeightName);
      pos = mix(pos, aTargetHeart, uWeightHeart);
      
      // Twinkle logic with larger amplitude
      float twinkle = 0.3 + 0.7 * sin(uTime * aTwinkleSpeed + aTimeOffset * 100.0);
      
      // Creation sequence fade-in
      float opacity = 0.0;
      if (uTime > 25.0) {
        opacity = 1.0;
      } else if (aTimeOffset == 0.0) {
        opacity = clamp(uTime - 0.8, 0.0, 1.0);
      } else {
        float fadeStart = 1.2 + aTimeOffset * 1.8;
        opacity = clamp((uTime - fadeStart) * 2.0, 0.0, 1.0);
      }
      
      vOpacity = opacity * twinkle;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = aSize * (350.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    varying float vOpacity;
    void main() {
      vec2 temp = gl_PointCoord - vec2(0.5);
      float dist = dot(temp, temp);
      if (dist > 0.25) discard;
      float alpha = smoothstep(0.25, 0.0, dist) * vOpacity;
      gl_FragColor = vec4(0.92, 0.97, 1.0, alpha);
    }
  `
};

const NebulaShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uVisibility;
    varying vec2 vUv;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(in vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 3; ++i) {
        v += a * noise(p);
        p = p * 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vUv - vec2(0.5);
      float n1 = fbm(uv * 1.2 + vec2(uTime * 0.015, uTime * 0.008));
      float n2 = fbm(uv * 2.2 - vec2(uTime * 0.01, -uTime * 0.015));
      
      vec3 col1 = vec3(0.015, 0.005, 0.04); 
      vec3 col2 = vec3(0.005, 0.012, 0.045); 
      vec3 highlight = vec3(0.14, 0.05, 0.25); 
      vec3 cyanDust = vec3(0.03, 0.15, 0.25);
      
      vec3 baseColor = mix(col1, col2, n1);
      vec3 finalColor = mix(baseColor, highlight, n2 * 0.45);
      finalColor = mix(finalColor, cyanDust, n1 * n2 * 0.35);
      
      float dist = length(uv);
      float vignette = smoothstep(0.7, 0.15, dist);
      
      gl_FragColor = vec4(finalColor, uVisibility * vignette * 0.65);
    }
  `
};

const MoonShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uVisibility;
    uniform float uHeartbeat;
    uniform vec3 uLightDirection;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    
    float noise(in vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)),f.x),
                     mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)),f.x),
                     mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
    
    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100.0);
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      vec3 p = vPosition * 2.2;
      float n = fbm(p);
      
      vec3 darkArea = vec3(0.02, 0.05, 0.12);   
      vec3 lightArea = vec3(0.12, 0.18, 0.32);  
      
      vec3 surfaceColor = mix(darkArea, lightArea, smoothstep(0.3, 0.7, n));
      
      float craters = fbm(p * 6.0 + 5.0);
      surfaceColor += vec3(craters * 0.06);
      
      float diffuse = max(dot(normal, normalize(uLightDirection)), 0.0);
      diffuse = 0.15 + 0.85 * diffuse; 
      
      float rim = pow(1.0 - dot(normal, viewDir), 3.0);
      vec3 rimGlow = vec3(0.28, 0.78, 1.0) * rim * 0.75 * uHeartbeat;
      
      vec3 finalColor = surfaceColor * diffuse + rimGlow;
      
      gl_FragColor = vec4(finalColor, uVisibility);
    }
  `
};

const MoonGlowShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform vec3 uGlowColor;
    uniform float uVisibility;
    uniform float uHeartbeat;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      float intensity = pow(0.7 - dot(normal, viewDir), 3.5);
      float glow = intensity * uVisibility * (0.8 + 0.2 * uHeartbeat);
      
      gl_FragColor = vec4(uGlowColor, glow * 1.25);
    }
  `
};

// ==========================================
// R3F Components
// ==========================================

function CameraRig({
  elapsedTimeRef,
  isTransitioning,
  isSkipped,
  onTransitionComplete
}: {
  elapsedTimeRef: React.MutableRefObject<number>;
  isTransitioning: boolean;
  isSkipped: boolean;
  onTransitionComplete: () => void;
}) {
  const { camera } = useThree();
  const transitionProgress = useRef(0);

  useFrame((_, delta) => {
    const t = elapsedTimeRef.current;

    if (isTransitioning) {
      transitionProgress.current += delta;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -15.0, 0.08);

      if (camera.position.z < -10.0) {
        onTransitionComplete();
      }
    } else {
      const driftX = Math.sin(t * 0.15) * 0.35;
      const driftY = Math.cos(t * 0.12) * 0.15;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, driftX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + driftY, 0.05);

      if (isSkipped) {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.5, 0.05);
      } else {
        const targetZ = t < 5.0 ? 7.8 : 6.5;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
      }

      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function NebulaBackground({ elapsedTimeRef }: { elapsedTimeRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uVisibility: { value: 0 }
  }), []);

  useFrame(() => {
    const t = elapsedTimeRef.current;
    uniforms.uTime.value = t;

    let visibility = 0;
    if (t >= 5.0 && t < 10.0) {
      visibility = (t - 5.0) / 5.0 * 0.4;
    } else if (t >= 10.0) {
      visibility = 0.8;
    }
    uniforms.uVisibility.value = visibility;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        vertexShader={NebulaShader.vertexShader}
        fragmentShader={NebulaShader.fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function StarConstellation({ elapsedTimeRef, isSkipped }: { elapsedTimeRef: React.MutableRefObject<number>; isSkipped: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Denser starfield
  const count = 1800;

  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return arr;
  }, []);

  const targetNamePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = basePositions[i * 3];
      arr[i * 3 + 1] = basePositions[i * 3 + 1];
      arr[i * 3 + 2] = basePositions[i * 3 + 2];
    }

    const charSpacing = 1.05;
    const chars = ["H", "U", "M", "A", "I", "M", "A"];
    const starsPerChar = 100;

    chars.forEach((char, charIdx) => {
      const segments = LETTER_DEFS[char];
      const xCenter = (charIdx - 3) * charSpacing;
      const pts = sampleSegments(segments, starsPerChar);

      pts.forEach((pt, ptIdx) => {
        const starIdx = charIdx * starsPerChar + ptIdx;
        if (starIdx < count) {
          arr[starIdx * 3] = xCenter + pt[0];
          arr[starIdx * 3 + 1] = pt[1] + 0.3;
          arr[starIdx * 3 + 2] = (Math.random() - 0.5) * 0.15;
        }
      });
    });

    return arr;
  }, [basePositions]);

  const targetHeartPositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = basePositions[i * 3];
      arr[i * 3 + 1] = basePositions[i * 3 + 1];
      arr[i * 3 + 2] = basePositions[i * 3 + 2];
    }

    const starsCount = 500;
    const pts = sampleHeart(starsCount);

    pts.forEach((pt, ptIdx) => {
      const starIdx = ptIdx;
      if (starIdx < count) {
        arr[starIdx * 3] = pt[0];
        arr[starIdx * 3 + 1] = pt[1] + 0.2;
        arr[starIdx * 3 + 2] = (Math.random() - 0.5) * 0.15;
      }
    });

    return arr;
  }, [basePositions]);

  const aSize = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      if (i === 0) arr[i] = 5.5; // Majestic single star
      else arr[i] = 1.2 + Math.random() * 2.8; // Larger, clearer stars
    }
    return arr;
  }, []);

  const aTwinkleSpeed = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      if (i === 0) arr[i] = 3.2;
      else arr[i] = 1.2 + Math.random() * 2.2;
    }
    return arr;
  }, []);

  const aTimeOffset = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      if (i === 0) arr[i] = 0.0;
      else arr[i] = Math.random();
    }
    return arr;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWeightName: { value: 0 },
    uWeightHeart: { value: 0 }
  }), []);

  function getInterpolationWeight(t: number, start: number, peakStart: number, peakEnd: number, end: number) {
    if (t < start || t > end) return 0;
    if (t >= peakStart && t <= peakEnd) return 1;
    if (t < peakStart) {
      const ratio = (t - start) / (peakStart - start);
      return ratio * ratio * (3 - 2 * ratio);
    } else {
      const ratio = (end - t) / (end - peakEnd);
      return ratio * ratio * (3 - 2 * ratio);
    }
  }

  useFrame(() => {
    const t = elapsedTimeRef.current;
    uniforms.uTime.value = t;

    // Tightened Morphing Timings
    const w_name = getInterpolationWeight(t, 7.5, 9.0, 10.5, 12.0);
    const w_heart = getInterpolationWeight(t, 20.5, 21.8, 23.5, 25.0);

    uniforms.uWeightName.value = w_name;
    uniforms.uWeightHeart.value = w_heart;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[basePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTargetName"
          args={[targetNamePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTargetHeart"
          args={[targetHeartPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[aSize, 1]}
        />
        <bufferAttribute
          attach="attributes-aTwinkleSpeed"
          args={[aTwinkleSpeed, 1]}
        />
        <bufferAttribute
          attach="attributes-aTimeOffset"
          args={[aTimeOffset, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        vertexShader={StarsShader.vertexShader}
        fragmentShader={StarsShader.fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ProceduralMoon({ elapsedTimeRef }: { elapsedTimeRef: React.MutableRefObject<number> }) {
  const moonRef = useRef<THREE.Group>(null);
  
  const moonUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uVisibility: { value: 0 },
    uHeartbeat: { value: 1.0 },
    uLightDirection: { value: new THREE.Vector3(5, 5, 2) }
  }), []);

  const glowUniforms = useMemo(() => ({
    uVisibility: { value: 0 },
    uHeartbeat: { value: 1.0 },
    uGlowColor: { value: new THREE.Color("#38bdf8") }
  }), []);

  useFrame((_, delta) => {
    const t = elapsedTimeRef.current;
    
    // Heartbeat logic starting Scene 6/7 (17.5s+)
    let heartbeat = 1.0;
    if (t >= 17.5) {
      const period = 1.3;
      const pulseTime = ((t - 17.5) % period) / period;
      if (pulseTime < 0.16) {
        heartbeat = 1.0 + 0.085 * Math.sin((pulseTime / 0.16) * Math.PI);
      } else if (pulseTime >= 0.20 && pulseTime < 0.36) {
        heartbeat = 1.0 + 0.038 * Math.sin(((pulseTime - 0.20) / 0.16) * Math.PI);
      }
    }

    if (moonRef.current) {
      // Tightened rise animation (5s to 7.5s)
      let targetY = 0.2;
      if (t < 5.0) {
        targetY = -4.5;
      } else if (t < 7.5) {
        const ratio = (t - 5.0) / 2.5;
        const smoothRatio = ratio * ratio * (3 - 2 * ratio);
        targetY = -4.5 + 4.7 * smoothRatio;
      }
      moonRef.current.position.y = targetY;
      moonRef.current.scale.setScalar(heartbeat);
      moonRef.current.rotation.y = t * 0.02;
    }

    const moonVisibility = t < 5.0 ? 0 : t < 7.5 ? (t - 5.0) / 2.5 : 1.0;
    
    moonUniforms.uTime.value = t;
    moonUniforms.uVisibility.value = moonVisibility;
    moonUniforms.uHeartbeat.value = heartbeat;

    glowUniforms.uVisibility.value = moonVisibility;
    glowUniforms.uHeartbeat.value = heartbeat;
  });

  return (
    <group ref={moonRef} position={[0, -4.5, -2.5]}>
      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <shaderMaterial
          attach="material"
          uniforms={moonUniforms}
          vertexShader={MoonShader.vertexShader}
          fragmentShader={MoonShader.fragmentShader}
          transparent
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.88, 62, 62]} />
        <shaderMaterial
          attach="material"
          uniforms={glowUniforms}
          vertexShader={MoonGlowShader.vertexShader}
          fragmentShader={MoonGlowShader.fragmentShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ShootingStars({ elapsedTimeRef }: { elapsedTimeRef: React.MutableRefObject<number> }) {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const t = elapsedTimeRef.current;
      // Shooting stars starting Scene 6+ (17.5s+)
      if (t >= 17.5 && Math.random() > 0.4) {
        const id = Math.random();
        const startX = -12 - Math.random() * 4;
        const startY = 6 + Math.random() * 3;
        const endX = startX + 16 + Math.random() * 5;
        const endY = startY - 9 - Math.random() * 3;
        const duration = 0.6 + Math.random() * 0.4;
        setStars(prev => [...prev, { id, startX, startY, endX, endY, duration, time: 0 }]);
      }
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    setStars(prev =>
      prev
        .map(s => ({ ...s, time: s.time + delta }))
        .filter(s => s.time < s.duration)
    );
  });

  return (
    <group>
      {stars.map(s => {
        const progress = s.time / s.duration;
        const x = s.startX + (s.endX - s.startX) * progress;
        const y = s.startY + (s.endY - s.startY) * progress;

        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-(s.endX - s.startX) * 0.12, -(s.endY - s.startY) * 0.12, 0)
        ];

        return (
          <group key={s.id} position={[x, y, -5.5]}>
            <Line
              points={points}
              color="#a5f3fc"
              lineWidth={1.2}
              transparent
              opacity={Math.sin(progress * Math.PI) * 0.65}
            />
          </group>
        );
      })}
    </group>
  );
}

function TimelineUpdater({
  elapsedTimeRef,
  isSkipped,
  isTransitioning,
  setScene
}: {
  elapsedTimeRef: React.MutableRefObject<number>;
  isSkipped: boolean;
  isTransitioning: boolean;
  setScene: React.Dispatch<React.SetStateAction<number>>;
}) {
  const lastScene = useRef(1);

  useFrame((_, delta) => {
    if (isTransitioning) return;

    if (isSkipped) {
      elapsedTimeRef.current = Math.max(elapsedTimeRef.current, 25.0);
    } else {
      elapsedTimeRef.current += delta;
    }

    const t = elapsedTimeRef.current;

    // Tighter Scene Thresholds
    let scene = 1;
    if (t >= 28.0) scene = 10;
    else if (t >= 25.0) scene = 9;
    else if (t >= 20.5) scene = 8;
    else if (t >= 17.5) scene = 6; 
    else if (t >= 12.0) scene = 5;
    else if (t >= 7.5) scene = 4;
    else if (t >= 5.0) scene = 3;
    else if (t >= 3.0) scene = 2;

    if (scene !== lastScene.current) {
      lastScene.current = scene;
      setScene(scene);
    }
  });

  return null;
}

function UniverseScene({
  active,
  elapsedTimeRef,
  scene,
  setScene,
  isSkipped,
  isTransitioning,
  onTransitionComplete
}: {
  active: boolean;
  elapsedTimeRef: React.MutableRefObject<number>;
  scene: number;
  setScene: React.Dispatch<React.SetStateAction<number>>;
  isSkipped: boolean;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
}) {
  if (!active) {
    return <div className="absolute inset-0 bg-[#020617]" />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0.4, 7.8], fov: 45 }}
      className="absolute inset-0 z-0"
      dpr={[1, 1.25]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.2} />
      
      <NebulaBackground elapsedTimeRef={elapsedTimeRef} />

      <StarConstellation elapsedTimeRef={elapsedTimeRef} isSkipped={isSkipped} />

      {scene >= 6 && (
        <Sparkles
          count={50} // Slightly more dust
          size={2.2} // Larger particles
          color="#38bdf8"
          speed={0.4}
          scale={[10, 7, 10]}
        />
      )}

      <ProceduralMoon elapsedTimeRef={elapsedTimeRef} />

      <ShootingStars elapsedTimeRef={elapsedTimeRef} />

      <CameraRig
        elapsedTimeRef={elapsedTimeRef}
        isTransitioning={isTransitioning}
        isSkipped={isSkipped}
        onTransitionComplete={onTransitionComplete}
      />

      <TimelineUpdater
        elapsedTimeRef={elapsedTimeRef}
        isSkipped={isSkipped}
        isTransitioning={isTransitioning}
        setScene={setScene}
      />
    </Canvas>
  );
}

// ==========================================
// Main Component
// ==========================================

export default function Chapter0() {
  const [scene, setScene] = useState(1);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const elapsedTimeRef = useRef(0);

  const { setRef: setVisibleRef, visible } = useSectionVisible("40% 0px", true);

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      setVisibleRef(node);
    },
    [setVisibleRef]
  );

  const handleSkip = () => {
    setIsSkipped(true);
    setScene(9);
  };

  const handleCTAStart = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setIsSkipped(true);
    document.getElementById("chapter-1")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSecretPlay = () => {
    audioRef.current?.play();
  };

  return (
    <section
      ref={mergedRef}
      id="chapter-0"
      className="relative min-h-screen w-full overflow-hidden select-none bg-[#020617]"
    >
      {/* R3F WebGL Scene */}
      <UniverseScene
        active={visible}
        elapsedTimeRef={elapsedTimeRef}
        scene={scene}
        setScene={setScene}
        isSkipped={isSkipped}
        isTransitioning={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
      />

      {/* Text and Interactive Overlays */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {/* Scene 4: Star spelling caption */}
          {scene === 4 && (
            <motion.p
              key="scene4-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.65, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2 }}
              className="absolute text-sm sm:text-base md:text-lg tracking-[0.5em] font-light text-white/80 font-cinzel text-center px-4"
            >
              A NAME WRITTEN IN THE STARS...
            </motion.p>
          )}

          {/* Scene 5: Sequenced Lines (Slightly larger, tighter intervals) */}
          {scene === 5 && (
            <motion.div
              key="scene5-text"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute flex flex-col items-center justify-center gap-8 text-center max-w-2xl px-6"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 0.95, y: 0, transition: { duration: 1.2, delay: 0.2 } },
                  exit: { opacity: 0, y: -12, transition: { duration: 0.8 } }
                }}
                className="text-3xl sm:text-5xl md:text-6xl font-cinzel tracking-[0.4em] text-[#38bdf8]/90 font-semibold"
              >
                July 1st
              </motion.span>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 0.85, y: 0, transition: { duration: 1.2, delay: 1.5 } },
                  exit: { opacity: 0, y: -12, transition: { duration: 0.8 } }
                }}
                className="text-xl sm:text-2xl md:text-3xl font-cormorant tracking-wide text-white/80 italic font-light leading-relaxed"
              >
                A day the universe became brighter.
              </motion.p>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 0.9, y: 0, transition: { duration: 1.2, delay: 3.0 } },
                  exit: { opacity: 0, y: -12, transition: { duration: 0.8 } }
                }}
                className="text-xl sm:text-2xl md:text-3xl font-cormorant tracking-wide text-white/95 font-light leading-relaxed"
              >
                Because you arrived.
              </motion.p>
            </motion.div>
          )}

          {/* Scene 9 & 10: Happy Birthday & Story Intro (Grand cinematic font sizing) */}
          {scene >= 9 && (
            <motion.div
              key="scene9-text"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute flex flex-col items-center gap-8 text-center max-w-3xl px-6 pointer-events-auto"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 1.2 }}
                className="text-4xl sm:text-6xl md:text-7xl font-cinzel tracking-[0.22em] font-bold text-white leading-tight"
                style={{ textShadow: "0 0 50px rgba(56,189,248,0.25)" }}
              >
                HAPPY BIRTHDAY <br className="sm:hidden" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#a5f3fc] to-[#38bdf8]">
                  HUMAIMA
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 0.9, duration: 1.2 }}
                className="text-lg sm:text-xl md:text-2xl font-cormorant tracking-widest text-white/85 font-light italic max-w-2xl leading-relaxed mt-2"
              >
                For the girl who turned a random message <br />
                into my favorite story.
              </motion.p>

              {scene >= 10 && (
                <motion.button
                  key="cta-button"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(56,189,248,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCTAStart}
                  className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 px-12 py-4.5 text-[10px] font-inter uppercase tracking-[0.45em] text-white transition duration-500 cursor-pointer"
                >
                  ✨ Follow The Stars
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-gradient-to-b from-transparent via-[#020617]/30 to-[#020617]" />

      {/* Transition screen fade overlay */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#020617] z-30 pointer-events-none"
        />
      )}

      {/* Skip Intro Overlay */}
      <AnimatePresence>
        {scene < 9 && (
          <motion.button
            key="skip-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.85, scale: 1.02 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-20 text-[9px] font-inter uppercase tracking-[0.25em] text-white border-b border-white/20 pb-0.5 transition cursor-pointer pointer-events-auto"
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>

      {/* Secret Chapter Button */}
      <AnimatePresence>
        {scene >= 9 && (
          <motion.button
            key="secret-star"
            type="button"
            aria-label="Reveal the secret chapter"
            onClick={() => setSecretOpen(true)}
            className="absolute right-8 top-8 z-20 h-3 w-3 rounded-full bg-white/50 shadow-[0_0_12px_rgba(56,189,248,0.9)] cursor-pointer pointer-events-auto"
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] }}
            transition={{
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5 }
            }}
          />
        )}
      </AnimatePresence>

      {/* Secret Chapter Modal */}
      <AnimatePresence>
        {secretOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#020617]/95 px-6 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 text-left shadow-[0_0_60px_rgba(56,189,248,0.25)] sm:p-10"
            >
              <button
                type="button"
                onClick={() => setSecretOpen(false)}
                className="absolute right-6 top-6 text-xs uppercase tracking-[0.3em] text-white/70 cursor-pointer"
              >
                Close
              </button>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                    Secret Chapter
                  </p>
                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    You found the hidden star.
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-[#020617]/70 p-5 text-sm leading-7 text-white/80">
                    <p className="font-semibold text-white">Private Letter</p>
                    <p>
                      Every moment with you feels like a new constellation forming. I
                      wanted a secret place where only you could read this, so you can
                      feel how deeply you are cherished.
                    </p>
                    <p>
                      You are my calm in the chaos, my favorite story, and the reason
                      this universe exists at all.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-[#020617]/70 p-5">
                      <p className="mb-3 text-sm font-semibold text-white/90">
                        Voice Note
                      </p>
                      <audio
                        ref={audioRef}
                        src="/audio/secret-message.mp3"
                        preload="none"
                        onError={() => {}}
                      />
                      <button
                        type="button"
                        onClick={handleSecretPlay}
                        className="w-full rounded-full border border-transparent bg-[#38BDF8]/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-pointer"
                      >
                        Play Secret Message ❤️
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src="/images/humaima/secret.jpg"
                        alt="A rare memory"
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/80">
                  Which means you explored every corner of this universe. Thank you for
                  being part of mine.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
