"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";
import type { Memory } from "@/src/data/memories";
import { useSectionVisible } from "@/src/hooks/useSectionVisible";
import ConstellationScene from "./ConstellationScene";
import MemoryModal from "./MemoryModal";
import SecretStarModal from "./SecretStarModal";

const theme = {
  background: "#020617",
  primary: "#0F172A",
  accent: "#38BDF8",
  text: "#FFFFFF",
};

const ambientParticles = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  top: `${8 + index * 9}%`,
  left: `${12 + (index * 11) % 76}%`,
}));

const pathParticles = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  delay: index * 0.12,
}));

export default function Chapter3() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setRef: setVisibleRef, visible } = useSectionVisible();
  const [selected, setSelected] = useState<Memory | null>(null);
  const [secretRevealed, setSecretRevealed] = useState(false);

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

  const lineOneOpacity = useTransform(scrollYProgress, [0.72, 0.8], [0, 1]);
  const lineTwoOpacity = useTransform(scrollYProgress, [0.8, 0.88], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0.84, 0.94], [0, 1]);

  const [pathProgress, setPathProgress] = useState(0);
  useMotionValueEvent(pathOpacity, "change", (value) => {
    setPathProgress(value);
  });

  return (
    <section
      ref={mergedRef}
      id="chapter-3"
      className="relative w-full overflow-hidden"
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      <div className="sticky top-0 h-screen w-full">
        {visible ? (
          <ConstellationScene
            selectedMemory={selected}
            secretRevealed={secretRevealed}
            onSelect={(memory) => {
              setSecretRevealed(false);
              setSelected(memory);
            }}
            onSelectSecret={() => {
              setSelected(null);
              setSecretRevealed(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#020617]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(15,23,42,0.9)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(2,6,23,0.85)_100%)]" />

        {visible && (
          <div className="pointer-events-none absolute inset-0">
            {ambientParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute h-1 w-1 rounded-full bg-white/60 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              style={{ top: particle.top, left: particle.left }}
              animate={{ y: [0, -14, 0], opacity: [0.25, 0.9, 0.25] }}
              transition={{
                duration: 5 + particle.id * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            ))}
          </div>
        )}

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-16 text-center sm:pt-20"
          initial={{ opacity: 0, y: 18 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            Chapter 3
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Memory Constellation ✨
          </h2>
          <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
            Every memory became a star.
          </p>
        </motion.div>

        <motion.p
          className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-white/50 sm:bottom-32"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          Tap a star to explore
        </motion.p>
      </div>

      <div className="relative z-20 -mt-[35vh] flex min-h-[65vh] flex-col items-center justify-end px-6 pb-24 pt-[35vh]">
        <motion.p
          className="text-center text-sm uppercase tracking-[0.35em] text-white/70"
          style={{ opacity: lineOneOpacity }}
        >
          Some memories shine brighter than others.
        </motion.p>

        <motion.p
          className="mt-6 text-center text-sm uppercase tracking-[0.35em] text-white/70"
          style={{ opacity: lineTwoOpacity }}
        >
          But every one of them matters.
        </motion.p>

        <motion.div
          className="relative mt-16 flex h-48 w-full max-w-xs flex-col items-center"
          style={{ opacity: pathOpacity }}
        >
          <div className="absolute top-0 h-px w-24 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent" />

          {pathParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_14px_rgba(56,189,248,0.9)]"
              style={{
                top: `${particle.id * 6}%`,
                opacity: Math.max(0, pathProgress - particle.delay * 0.08),
              }}
              animate={{
                y: [0, 8, 0],
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2.4 + particle.id * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}

          <motion.div
            className="absolute bottom-0 h-24 w-px bg-gradient-to-b from-[#38BDF8]/80 via-[#38BDF8]/40 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          <motion.p
            className="absolute -bottom-2 text-[10px] uppercase tracking-[0.45em] text-[#38BDF8]/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            Enter the museum
          </motion.p>
        </motion.div>
      </div>

      <MemoryModal memory={selected} onClose={() => setSelected(null)} />
      <SecretStarModal
        isOpen={secretRevealed}
        onClose={() => setSecretRevealed(false)}
      />
    </section>
  );
}
