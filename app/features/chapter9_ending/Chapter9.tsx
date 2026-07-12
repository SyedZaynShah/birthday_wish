"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSectionVisible } from "@/src/hooks/useSectionVisible";

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function rangeProgress(value: number, [start, end]: readonly [number, number]) {
  return smoothstep(clamp01((value - start) / (end - start)));
}

function mixColor(a: string, b: string, amount: number) {
  const parse = (hex: string) => {
    const normalized = hex.replace("#", "");
    return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16));
  };

  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const mixed = [ar, ag, ab].map((channel, index) =>
    Math.round(channel + ([br, bg, bb][index] - channel) * amount),
  );

  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function TextMoment({
  children,
  delay = 0,
  large = false,
}: {
  children: ReactNode;
  delay?: number;
  large?: boolean;
}) {
  return (
    <motion.p
      className={`max-w-2xl text-center text-pretty break-words px-4 ${
        large
          ? "text-3xl font-medium leading-relaxed text-white sm:text-4xl md:text-5xl"
          : "text-xl leading-relaxed text-white/86 sm:text-2xl md:text-3xl"
      }`}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.p>
  );
}

function ContentBlock({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[120vh] flex-col items-center justify-center px-4 py-32 sm:px-6">
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-16 sm:gap-20">
        {children}
      </div>
    </div>
  );
}

function AbandonedVillageScene({ progress }: { progress: number }) {
  const villageFade = rangeProgress(progress, [0.05, 0.35]);
  const nightFall = rangeProgress(progress, [0.2, 0.5]);
  const firefliesFade = rangeProgress(progress, [0.25, 0.48]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const camera = state.camera;
    camera.position.set(
      Math.sin(time * 0.05) * 0.1,
      1.2 - progress * 0.3,
      8 - progress * 3,
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={[mixColor("#1e293b", "#020617", nightFall)]} />
      <fog attach="fog" args={[mixColor("#4a5568", "#020617", nightFall), 3, 18]} />

      <ambientLight intensity={0.4 - nightFall * 0.25} />
      <hemisphereLight intensity={0.5 - nightFall * 0.3} color="#fde68a" groundColor="#0f172a" />
      <directionalLight
        position={[3, 4, 3]}
        intensity={0.8 - nightFall * 0.6}
        color={mixColor("#fcd34d", "#38BDF8", nightFall * 0.8)}
      />

      {/* Abandoned restaurant */}
      <group position={[-1.5, -0.2, -1.5]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2, 1.2, 1.2]} />
          <meshStandardMaterial
            color={mixColor("#6b5344", "#2d3748", nightFall * 0.9)}
            roughness={0.95}
            transparent
            opacity={1 - villageFade * 0.8}
          />
        </mesh>
        {/* Empty window - no lights */}
        <mesh position={[-0.3, 0.1, 0.62]}>
          <boxGeometry args={[0.35, 0.35, 0.05]} />
          <meshStandardMaterial color="#020617" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0.35, 0.1, 0.62]}>
          <boxGeometry args={[0.35, 0.35, 0.05]} />
          <meshStandardMaterial color="#020617" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Fireflies fading */}
      <Sparkles
        count={18}
        size={1.2}
        color="#fcd34d"
        speed={0.15}
        scale={[6, 3, 6]}
        opacity={Math.max(0, 0.25 - firefliesFade * 0.25)}
      />

      <Stars radius={35} depth={30} count={350} factor={2.5} fade speed={0.15} />

      <pointLight
        position={[0, 2, 3]}
        intensity={0.3 - nightFall * 0.2}
        color="#38BDF8"
        distance={8}
      />
    </>
  );
}

function Chapter9Canvas({ active, progress }: { active: boolean; progress: number }) {
  if (!active) {
    return <div className="absolute inset-0 bg-[#020617]" aria-hidden />;
  }

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 1.2, 8], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <AbandonedVillageScene progress={progress} />
    </Canvas>
  );
}

export default function Chapter9() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setRef: setVisibleRef, visible } = useSectionVisible();
  const [progress, setProgress] = useState(0);

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      setVisibleRef(node);
    },
    [setVisibleRef],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.05], [30, 0]);

  return (
    <section
      ref={mergedRef}
      id="chapter-9"
      className="relative bg-[#020617] text-white"
      style={{ height: "1400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Chapter9Canvas active={visible} progress={progress} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.1)_0%,rgba(2,6,23,0.6)_70%,rgba(2,6,23,0.95)_100%)]" />
      </div>

      <div className="relative z-10 -mt-[100vh]">
        {/* Title */}
        <div className="flex min-h-screen items-center justify-center px-4">
          <motion.header
            className="text-center"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/45 sm:text-sm">
              Chapter 9
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              The Road We Couldn&apos;t Walk Together
            </h2>
          </motion.header>
        </div>

        {/* Dream */}
        <ContentBlock>
          <TextMoment large>We once dreamed...</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>about opening a little restaurant...</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>in a village...</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>where life would finally slow down.</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>I really thought...</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>we&apos;d grow old there.</TextMoment>
        </ContentBlock>

        {/* Timeline */}
        <div className="h-[150vh]" aria-hidden />

        <ContentBlock>
          <TextMoment large>July 6.</TextMoment>
          <TextMoment delay={0.3}>The day started before sunrise.</TextMoment>
          <TextMoment delay={0.5}>I was exhausted.</TextMoment>
          <TextMoment delay={0.7}>But happy.</TextMoment>
          <TextMoment delay={0.9}>I wanted to tell you everything.</TextMoment>
        </ContentBlock>

        <div className="h-[100vh]" aria-hidden />

        <ContentBlock>
          <TextMoment large>July 7.</TextMoment>
          <TextMoment delay={0.3}>Something felt different.</TextMoment>
          <TextMoment delay={0.5}>Replies became shorter.</TextMoment>
          <TextMoment delay={0.7}>Silences became longer.</TextMoment>
        </ContentBlock>

        <div className="h-[100vh]" aria-hidden />

        <ContentBlock>
          <TextMoment large>July 8.</TextMoment>
          <TextMoment delay={0.3}>We were still talking.</TextMoment>
          <TextMoment delay={0.5}>But somehow...</TextMoment>
          <TextMoment delay={0.7}>we had already stopped understanding each other.</TextMoment>
        </ContentBlock>

        <div className="h-[100vh]" aria-hidden />

        <ContentBlock>
          <TextMoment large>July 9.</TextMoment>
          <TextMoment delay={0.3}>I kept trying to make you smile.</TextMoment>
          <TextMoment delay={0.5}>Sending reels.</TextMoment>
          <TextMoment delay={0.7}>Liking every reply.</TextMoment>
          <TextMoment delay={0.9}>Pretending everything was okay.</TextMoment>
          <TextMoment delay={1.1}>Even when it wasn&apos;t.</TextMoment>
        </ContentBlock>

        <div className="h-[100vh]" aria-hidden />

        <ContentBlock>
          <TextMoment large>July 10.</TextMoment>
          <TextMoment delay={0.3}>Everything changed.</TextMoment>
        </ContentBlock>

        <div className="h-[120vh]" aria-hidden />

        {/* The Conversation */}
        <ContentBlock>
          <TextMoment large>&ldquo;I changed for you.&rdquo;</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>&ldquo;I blocked everyone.&rdquo;</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>&ldquo;I changed my sleep.&rdquo;</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>&ldquo;I tried.&rdquo;</TextMoment>
        </ContentBlock>

        <div className="h-[150vh]" aria-hidden />

        <ContentBlock>
          <TextMoment large>Haan.</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>Nahi chorungi.</TextMoment>
        </ContentBlock>

        <ContentBlock>
          <TextMoment large>Kabhi.</TextMoment>
        </ContentBlock>

        <div className="h-[180vh]" aria-hidden />

        <ContentBlock>
          <TextMoment>I finally understood...</TextMoment>
          <TextMoment delay={0.4}>sometimes</TextMoment>
          <TextMoment delay={0.6}>love isn&apos;t what breaks people.</TextMoment>
          <TextMoment delay={0.8} large>Expectations do.</TextMoment>
        </ContentBlock>

        {/* Complete darkness - silence */}
        <div className="min-h-[200vh] bg-[#020617]" aria-hidden />
      </div>
    </section>
  );
}
