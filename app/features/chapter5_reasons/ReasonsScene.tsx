"use client";

import { motion, type MotionValue } from "framer-motion";
import { allReasons } from "@/src/data/reasons";
import type { Reason } from "@/src/data/reasons";
import ReasonCard from "./ReasonCard";

const heartParticles = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  left: `${18 + i * 22}%`,
  top: `${20 + (i % 2) * 35}%`,
  size: i % 2 === 0 ? 8 : 6,
  delay: `${i * 0.8}s`,
  duration: `${6 + i}s`,
}));

type Props = {
  active: boolean;
  scrollYProgress: MotionValue<number>;
  selectedReason: Reason | null;
  secretRevealed: boolean;
  onSelectReason: (reason: Reason) => void;
};

export default function ReasonsScene({
  active,
  scrollYProgress,
  selectedReason,
  secretRevealed,
  onSelectReason,
}: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(56,189,248,0.07)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(244,114,182,0.05)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-14 h-16 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent sm:bottom-16" />

      {active &&
        heartParticles.map((particle) => (
          <span
            key={`heart-${particle.id}`}
            className="reason-float-heart pointer-events-none absolute select-none text-[#F472B6]/35"
            style={{
              left: particle.left,
              top: particle.top,
              fontSize: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          >
            ♥
          </span>
        ))}

      <motion.div
        className="absolute inset-x-3 inset-y-0 bottom-14 sm:inset-x-6"
        animate={{
          opacity: selectedReason ? 0.45 : 1,
          scale: selectedReason ? 0.97 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {active &&
          allReasons.map((reason) => (
            <ReasonCard
              key={reason.id}
              reason={reason}
              scrollYProgress={scrollYProgress}
              secretRevealed={secretRevealed}
              onSelect={onSelectReason}
            />
          ))}
      </motion.div>
    </div>
  );
}
