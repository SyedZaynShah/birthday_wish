"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import ChatPhone from "./ChatPhone";
import { firstChat, firstChatMeta } from "@/src/data/firstChat";

const theme = {
  background: "#020617",
  primary: "#0F172A",
  accent: "#38BDF8",
  text: "#FFFFFF",
};

const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  top: `${10 + index * 7}%`,
  left: `${index % 2 === 0 ? 18 : 72}%`,
}));

const starfield = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  top: `${8 + (index * 5) % 70}%`,
  left: `${10 + (index * 9) % 80}%`,
}));

export default function Chapter2() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const stage = useTransform(scrollYProgress, [0, 1], [1, 12]);
  const [stageValue, setStageValue] = useState(1);

  useMotionValueEvent(stage, "change", (value) => {
    const nextStage = Math.min(12, Math.max(1, value));
    setStageValue(Number(nextStage.toFixed(2)));
  });

  const phoneOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const phoneScale = useTransform(scrollYProgress, [0.7, 0.85], [1, 0.92]);
  const phoneParallax = useTransform(scrollYProgress, [0, 0.6], [24, -24]);
  const raysOpacity = useTransform(scrollYProgress, [0.05, 0.5], [0.2, 0.6]);
  const starsOpacity = useTransform(scrollYProgress, [0.76, 0.9], [0, 1]);
  const lineOneOpacity = useTransform(scrollYProgress, [0.78, 0.84], [0, 1]);
  const lineTwoOpacity = useTransform(scrollYProgress, [0.84, 0.9], [0, 1]);
  const lineThreeOpacity = useTransform(scrollYProgress, [0.9, 0.96], [0, 1]);
  const lineFourOpacity = useTransform(scrollYProgress, [0.96, 1], [0, 1]);
  const constellationOpacity = useTransform(scrollYProgress, [0.86, 0.98], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="chapter-2"
      className="relative w-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at 20% 20%, ${theme.primary} 0%, ${theme.background} 60%)`,
        color: theme.text,
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#38BDF8_0%,transparent_55%)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#0F172A_0%,transparent_60%)] opacity-80" />
      </div>
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
            style={{ top: particle.top, left: particle.left }}
            animate={{ y: [0, -18, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 6 + particle.id, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="relative z-10 mx-auto flex min-h-[240vh] w-full max-w-6xl flex-col gap-16 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-4 text-center"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Chapter 2</p>
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">The Beginning ✨</h2>
          <p className="mx-auto max-w-2xl text-base text-white/80 sm:text-lg">
            Every story starts somewhere. Ours started with a simple message.
          </p>
        </motion.div>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">
              Scroll to relive the first night
            </p>
            <div className="space-y-3 text-lg text-white/80">
              <p>Stage 1: The notification lights up the screen.</p>
              <p>Stage 2: The very first hello arrives.</p>
              <p>Stage 3: A curious reply follows.</p>
              <p>Stage 4: The moment turns playful.</p>
            </div>
          </motion.div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-8 rounded-full bg-[#38BDF8]/20 blur-3xl" />
            <div className="sticky top-24 flex flex-col items-center gap-10">
              <motion.div style={{ opacity: phoneOpacity, scale: phoneScale, y: phoneParallax }}>
                <motion.div
                  className="pointer-events-none absolute -inset-16 rounded-full bg-[conic-gradient(from_20deg,rgba(56,189,248,0.25),transparent_40%,rgba(56,189,248,0.18),transparent_70%)] blur-3xl"
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
        </div>
        <div className="relative mt-16 flex flex-col items-center gap-6">
          <motion.p
            className="text-sm uppercase tracking-[0.35em] text-white/70"
            style={{ opacity: lineOneOpacity }}
          >
            Neither of us knew it then.
          </motion.p>
          <motion.p
            className="text-sm uppercase tracking-[0.35em] text-white/70"
            style={{ opacity: lineTwoOpacity }}
          >
            It was just another conversation.
          </motion.p>
          <motion.p
            className="text-sm uppercase tracking-[0.35em] text-white/70"
            style={{ opacity: lineThreeOpacity }}
          >
            Until it wasn't.
          </motion.p>
          <motion.p
            className="text-sm uppercase tracking-[0.35em] text-white/70"
            style={{ opacity: lineFourOpacity }}
          >
            And somehow... that chat became a universe.
          </motion.p>
        </div>
        <motion.div
          className="relative mt-24 flex flex-col items-center gap-6"
          style={{ opacity: constellationOpacity }}
        >
          <svg viewBox="0 0 400 120" className="h-32 w-full max-w-3xl">
            <motion.path
              d="M20 80 L120 30 L220 60 L320 20 L380 70"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
            {[20, 120, 220, 320, 380].map((x, index) => (
              <circle key={index} cx={x} cy={index % 2 === 0 ? 80 : 30} r="4" fill="#38BDF8" />
            ))}
          </svg>
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">
            Every memory became a star.
          </p>
        </motion.div>
      </div>
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: starsOpacity }}>
        {starfield.map((star) => (
          <span
            key={star.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
            style={{ top: star.top, left: star.left }}
          />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,6,23,0)_40%,rgba(2,6,23,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.2),transparent_45%)] opacity-50" />
    </section>
  );
}
