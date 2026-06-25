"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { Lock } from "lucide-react";
import type { Reason } from "@/src/data/reasons";

const REVEAL_WINDOW = 0.065;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

type Props = {
  reason: Reason;
  scrollYProgress: MotionValue<number>;
  secretRevealed: boolean;
  onSelect: (reason: Reason) => void;
};

export default function ReasonCard({
  reason,
  scrollYProgress,
  secretRevealed,
  onSelect,
}: Props) {
  const { layout } = reason;
  const isLocked = reason.isSecret && !secretRevealed;

  const reveal = useTransform(scrollYProgress, (v) => {
    const raw = Math.min(
      1,
      Math.max(0, (v - layout.revealAt) / REVEAL_WINDOW),
    );
    return smoothstep(raw);
  });

  const opacity = reveal;
  const scale = useTransform(reveal, (p) => {
    const base = 0.9 + layout.depth * 0.08;
    return base + p * 0.08;
  });
  const y = useTransform(reveal, (p) => (1 - p) * 18);
  const pointerEvents = useTransform(reveal, (p) =>
    p > 0.35 ? "auto" : "none",
  );

  return (
    <motion.button
      type="button"
      className="absolute w-[36vw] max-w-[148px] touch-manipulation will-change-transform sm:w-36 sm:max-w-none md:w-44"
      style={{
        left: layout.left,
        top: layout.top,
        rotate: layout.rotate,
        zIndex: Math.round(layout.depth * 100),
        opacity,
        scale,
        y,
        pointerEvents,
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      onClick={() => onSelect(reason)}
    >
      <motion.div
        className={`group relative overflow-hidden rounded-2xl border px-4 py-4 text-left shadow-lg backdrop-blur-md transition-shadow duration-300 sm:px-5 sm:py-5 ${
          reason.isSecret
            ? "border-[#F472B6]/30 bg-gradient-to-br from-[#0F172A]/95 to-[#1E1030]/90 shadow-[0_8px_32px_rgba(244,114,182,0.12)]"
            : "border-white/12 bg-white/[0.07] shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
        } ${isLocked ? "opacity-90" : ""}`}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#38BDF8]/[0.07] via-transparent to-[#F472B6]/[0.05]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {isLocked ? (
          <div className="relative flex flex-col items-center gap-2 py-1 text-center">
            <Lock size={17} className="text-[#F472B6]/75" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">
              Locked
            </p>
          </div>
        ) : (
          <div className="relative space-y-1.5">
            <p className="text-[9px] uppercase tracking-[0.38em] text-[#38BDF8]/75">
              Reason
            </p>
            <p className="text-sm font-medium leading-snug text-white/95 sm:text-[15px]">
              {reason.title}
            </p>
          </div>
        )}

        <div
          className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            reason.isSecret
              ? "bg-gradient-to-br from-[#F472B6]/12 to-transparent"
              : "bg-gradient-to-br from-[#38BDF8]/10 to-transparent"
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
