"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import ChatPhone from "./ChatPhone";
import { firstChat, firstChatMeta } from "@/src/data/firstChat";

const theme = {
  background: "#020617",
  primary: "#0F172A",
  accent: "#38BDF8",
  text: "#FFFFFF",
};

const ambientParticles = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  top: `${10 + (index * 6) % 76}%`,
  left: `${8 + (index * 11) % 84}%`,
  size: index % 4 === 0 ? "h-1.5 w-1.5" : "h-1 w-1",
}));

const endingStars = Array.from({ length: 24 }, (_, index) => {
  const angle = (index / 24) * Math.PI * 2;
  const t = (index / 24) * Math.PI * 2;
  const targetX = 6.4 * 16 * Math.sin(t) ** 3;
  const targetY =
    -5.8 *
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t));

  return {
    id: index + 1,
    startX:
      Math.cos(angle) * (88 + (index % 5) * 16) +
      Math.sin(angle * 1.7) * 24,
    startY:
      Math.sin(angle) * (72 + (index % 4) * 14) -
      Math.cos(angle * 1.2) * 26,
    targetX,
    targetY,
    delay: index * 0.08,
    size: index % 6 === 0 ? 5 : index % 2 === 0 ? 4 : 3,
  };
});

const bridgeStars = [
  { id: 1, x: -22, y: 0, delay: 0 },
  { id: 2, x: 6, y: 22, delay: 0.18 },
  { id: 3, x: -12, y: 48, delay: 0.32 },
  { id: 4, x: 18, y: 78, delay: 0.5 },
  { id: 5, x: -8, y: 112, delay: 0.68 },
  { id: 6, x: 10, y: 148, delay: 0.86 },
];

type EndingStar = (typeof endingStars)[number];
type BridgeStarData = (typeof bridgeStars)[number];

function GatheringStar({
  star,
  awakenProgress,
  formationProgress,
}: {
  star: EndingStar;
  awakenProgress: MotionValue<number>;
  formationProgress: MotionValue<number>;
}) {
  const x = useTransform(formationProgress, [0, 1], [star.startX, star.targetX]);
  const y = useTransform(formationProgress, [0, 1], [star.startY, star.targetY]);
  const opacity = useTransform(awakenProgress, [0, 0.22, 1], [0, 0.34, 0.95]);
  const scale = useTransform(formationProgress, [0, 0.82, 1], [0.82, 0.94, 1.08]);

  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-[42%] will-change-transform"
      style={{ x, y, opacity, scale }}
    >
      <motion.span
        className="block rounded-full bg-white"
        style={{
          width: `${star.size}px`,
          height: `${star.size}px`,
          boxShadow: "0 0 14px rgba(125, 211, 252, 0.9)",
        }}
        animate={{
          opacity: [0.45, 1, 0.45],
          scale: [1, 1.18, 1],
        }}
        transition={{
          duration: 3.4 + star.delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: star.delay,
        }}
      />
    </motion.span>
  );
}

function BridgeStar({
  star,
  progress,
}: {
  star: BridgeStarData;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], [star.y, star.y + 34]);
  const opacity = useTransform(progress, [0, 0.2, 1], [0, 0.42, 0.88]);
  const scale = useTransform(progress, [0, 1], [0.8, 1.05]);

  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-[70%] will-change-transform"
      style={{ x: star.x, y, opacity, scale }}
    >
      <motion.span
        className="block h-1.5 w-1.5 rounded-full bg-[#dbeafe]"
        style={{ boxShadow: "0 0 14px rgba(56, 189, 248, 0.9)" }}
        animate={{ y: [0, 8, 0], opacity: [0.55, 1, 0.55] }}
        transition={{
          duration: 3 + star.delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: star.delay,
        }}
      />
    </motion.span>
  );
}

export default function Chapter2() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.35,
  });

  const stage = useTransform(smoothProgress, [0, 0.08, 0.56, 1], [1, 1, 9.15, 9.15]);
  const [stageValue, setStageValue] = useState(1);

  useMotionValueEvent(stage, "change", (value) => {
    const nextStage = Math.min(9.15, Math.max(1, value));
    setStageValue(Number(nextStage.toFixed(2)));
  });

  const headerOpacity = useTransform(smoothProgress, [0, 0.14, 0.24], [1, 1, 0.18]);
  const headerY = useTransform(smoothProgress, [0, 1], [0, -18]);
  const introOpacity = useTransform(smoothProgress, [0.04, 0.18, 0.3], [1, 1, 0]);
  const introY = useTransform(smoothProgress, [0.04, 0.3], [0, -16]);
  const phoneOpacity = useTransform(smoothProgress, [0, 0.72, 0.84, 1], [1, 1, 0.42, 0.06]);
  const phoneScale = useTransform(smoothProgress, [0, 0.72, 0.84, 1], [1, 1, 0.96, 0.89]);
  const phoneY = useTransform(smoothProgress, [0, 0.08, 0.72, 0.84, 1], [18, 0, 0, -18, -40]);
  const phoneRotate = useTransform(smoothProgress, [0.76, 1], [0, -3]);
  const raysOpacity = useTransform(smoothProgress, [0.03, 0.24, 0.72], [0.18, 0.62, 0.28]);

  const endingOpacity = useTransform(smoothProgress, [0.74, 0.8], [0, 1]);
  const lineOneOpacity = useTransform(smoothProgress, [0.76, 0.82, 1], [0, 1, 1]);
  const lineTwoOpacity = useTransform(smoothProgress, [0.82, 0.88, 1], [0, 1, 1]);
  const lineThreeOpacity = useTransform(smoothProgress, [0.88, 0.94, 1], [0, 1, 1]);
  const lineFourOpacity = useTransform(smoothProgress, [0.94, 0.985, 1], [0, 1, 1]);
  const lineOneY = useTransform(smoothProgress, [0.76, 0.82], [20, 0]);
  const lineTwoY = useTransform(smoothProgress, [0.82, 0.88], [20, 0]);
  const lineThreeY = useTransform(smoothProgress, [0.88, 0.94], [20, 0]);
  const lineFourY = useTransform(smoothProgress, [0.94, 0.985], [22, 0]);

  const starsAwakenProgress = useTransform(smoothProgress, [0.94, 1], [0, 1]);
  const heartFormationProgress = useTransform(smoothProgress, [0.952, 1], [0, 1]);
  const heartGlowOpacity = useTransform(smoothProgress, [0.958, 1], [0, 0.9]);
  const memoryTextOpacity = useTransform(smoothProgress, [0.968, 0.99, 1], [0, 1, 1]);
  const bridgeProgress = useTransform(smoothProgress, [0.976, 1], [0, 1]);
  const bridgeGlowOpacity = useTransform(smoothProgress, [0.982, 1], [0, 0.7]);

  return (
    <section
      ref={sectionRef}
      id="chapter-2"
      className="relative min-h-[280vh] w-full overflow-hidden sm:min-h-[300vh]"
      style={{
        background: `radial-gradient(circle at 20% 20%, ${theme.primary} 0%, ${theme.background} 60%)`,
        color: theme.text,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(15,23,42,0.92)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0.36)_62%,rgba(2,6,23,0.88)_100%)]" />
        </div>

        <div className="pointer-events-none absolute inset-0">
          {ambientParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className={`absolute rounded-full bg-white/65 ${particle.size}`}
              style={{
                top: particle.top,
                left: particle.left,
                boxShadow: "0 0 12px rgba(56, 189, 248, 0.55)",
              }}
              animate={{ y: [0, -14, 0], opacity: [0.2, 0.85, 0.2] }}
              transition={{
                duration: 6.5 + particle.id * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-6 py-16 sm:py-20">
          <motion.div
            className="space-y-4 text-center"
            style={{ opacity: headerOpacity, y: headerY, willChange: "transform" }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">Chapter 2</p>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">The Beginning</h2>
            <p className="mx-auto max-w-2xl text-base text-white/80 sm:text-lg">
              Every story starts somewhere. Ours started with a simple message.
            </p>
          </motion.div>

          <div className="relative flex flex-1 items-center">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <motion.div
                className="space-y-6"
                style={{ opacity: introOpacity, y: introY, willChange: "transform" }}
              >
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Scroll to relive the first night
                </p>
                <div className="space-y-4 text-base leading-7 text-white/80 sm:text-lg">
                  <p>The notification lights up the screen.</p>
                  <p>A hello turns into a joke, then another reply, then one more.</p>
                  <p>It still looks ordinary. That is what makes it beautiful.</p>
                </div>
              </motion.div>

              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-8 rounded-full bg-[#38BDF8]/16 blur-3xl" />
                <motion.div
                  className="relative"
                  style={{
                    opacity: phoneOpacity,
                    scale: phoneScale,
                    y: phoneY,
                    rotate: phoneRotate,
                    willChange: "transform, opacity",
                  }}
                >
                  <motion.div
                    className="pointer-events-none absolute -inset-16 rounded-full bg-[conic-gradient(from_20deg,rgba(56,189,248,0.24),transparent_40%,rgba(56,189,248,0.16),transparent_70%)] blur-3xl"
                    style={{ opacity: raysOpacity }}
                  />
                  <ChatPhone
                    progress={stageValue}
                    messages={firstChat}
                    username={firstChatMeta.username}
                    dateLabel={firstChatMeta.date}
                  />
                </motion.div>
              </div>
            </div>

            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto flex max-w-4xl flex-col items-center px-2 text-center sm:bottom-12"
              style={{ opacity: endingOpacity }}
            >
              <motion.p
                className="text-base text-white/72 sm:text-lg"
                style={{ opacity: lineOneOpacity, y: lineOneY }}
              >
                Neither of us knew it then.
              </motion.p>
              <motion.p
                className="mt-5 text-base text-white/72 sm:mt-6 sm:text-lg"
                style={{ opacity: lineTwoOpacity, y: lineTwoY }}
              >
                It was just another conversation.
              </motion.p>
              <motion.p
                className="mt-5 text-lg font-medium text-white/84 sm:mt-6 sm:text-[1.55rem]"
                style={{ opacity: lineThreeOpacity, y: lineThreeY }}
              >
                Until it wasn&apos;t.
              </motion.p>

              <motion.div
                className="relative mt-8 flex min-h-[18rem] w-full flex-col items-center justify-start sm:mt-10 sm:min-h-[20rem]"
                style={{ opacity: lineFourOpacity, y: lineFourY }}
              >
                <motion.p className="max-w-2xl text-2xl font-medium leading-tight text-white sm:text-4xl">
                  And somehow...
                  <br />
                  <span className="text-[#dbeafe]">that chat became a universe.</span>
                </motion.p>

                <motion.div
                  className="pointer-events-none absolute left-1/2 top-[42%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#38BDF8]/18 blur-3xl sm:h-52 sm:w-52"
                  style={{ opacity: heartGlowOpacity }}
                />

                <div className="pointer-events-none absolute inset-0">
                  {endingStars.map((star) => (
                    <GatheringStar
                      key={star.id}
                      star={star}
                      awakenProgress={starsAwakenProgress}
                      formationProgress={heartFormationProgress}
                    />
                  ))}
                </div>

                <motion.p
                  className="absolute top-[64%] max-w-xl text-sm tracking-[0.18em] text-white/76 sm:text-base"
                  style={{ opacity: memoryTextOpacity }}
                >
                  Every memory became a star.
                </motion.p>

                <motion.div
                  className="pointer-events-none absolute left-1/2 top-[72%] h-40 w-24 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(56,189,248,0.24)_0%,rgba(56,189,248,0.06)_45%,rgba(56,189,248,0)_100%)] blur-2xl"
                  style={{ opacity: bridgeGlowOpacity }}
                />

                <div className="pointer-events-none absolute inset-0">
                  {bridgeStars.map((star) => (
                    <BridgeStar key={star.id} star={star} progress={bridgeProgress} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,6,23,0)_42%,rgba(2,6,23,0.85)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.14),transparent_45%)] opacity-50" />
      </div>
    </section>
  );
}
