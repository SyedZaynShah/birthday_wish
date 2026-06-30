"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

const LIGHT_COLUMNS = [
  { left: "18%" },
  { left: "36%" },
  { left: "50%" },
  { left: "64%" },
  { left: "82%" },
];

const STARS = [
  { left: "10%", top: "8%", size: "h-1 w-1", opacity: "0.5" },
  { left: "22%", top: "16%", size: "h-1 w-1", opacity: "0.35" },
  { left: "78%", top: "12%", size: "h-1.5 w-1.5", opacity: "0.45" },
  { left: "88%", top: "20%", size: "h-1 w-1", opacity: "0.35" },
  { left: "14%", top: "34%", size: "h-1 w-1", opacity: "0.3" },
  { left: "85%", top: "42%", size: "h-1 w-1", opacity: "0.32" },
  { left: "26%", top: "68%", size: "h-1 w-1", opacity: "0.28" },
  { left: "70%", top: "72%", size: "h-1.5 w-1.5", opacity: "0.4" },
];

type Props = {
  scrollProgress: MotionValue<number>;
};

export default function MuseumScene({ scrollProgress }: Props) {
  const atmosphereOpacity = useTransform(scrollProgress, [0, 0.5, 1], [0.4, 0.7, 0.48]);
  const walkwayOpacity = useTransform(scrollProgress, [0, 0.3, 0.85, 1], [0.22, 0.4, 0.42, 0.28]);
  const glowY = useTransform(scrollProgress, [0, 1], [24, -16]);
  const wallOpacity = useTransform(scrollProgress, [0, 1], [0.72, 0.92]);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),linear-gradient(180deg,rgba(3,7,18,0.94)_0%,rgba(2,6,23,0.98)_100%)]"
        style={{ opacity: atmosphereOpacity }}
      />

      <motion.div
        className="absolute inset-y-0 left-0 w-[24%] bg-[linear-gradient(90deg,rgba(7,11,22,0.95),rgba(7,11,22,0.46),transparent)]"
        style={{ opacity: wallOpacity }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-[24%] bg-[linear-gradient(270deg,rgba(7,11,22,0.95),rgba(7,11,22,0.46),transparent)]"
        style={{ opacity: wallOpacity }}
      />

      <div className="absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="absolute inset-x-[18%] top-6 h-px bg-gradient-to-r from-transparent via-[#7DD3FC]/28 to-transparent" />

      {LIGHT_COLUMNS.map((light) => (
        <div
          key={light.left}
          className="pointer-events-none absolute top-0"
          style={{ left: light.left }}
        >
          <div className="h-14 w-px bg-gradient-to-b from-[#dbeafe] via-[#7dd3fc]/75 to-transparent" />
          <div className="ml-[-72px] h-28 w-36 bg-[linear-gradient(180deg,rgba(125,211,252,0.18),rgba(56,189,248,0.06)_32%,rgba(2,6,23,0)_100%)] blur-2xl" />
        </div>
      ))}

      {STARS.map((star, index) => (
        <div
          key={index}
          className={`absolute rounded-full bg-white ${star.size}`}
          style={{ left: star.left, top: star.top, opacity: Number(star.opacity) }}
        />
      ))}

      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[84%] w-[76%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(56,189,248,0.04)_0%,rgba(56,189,248,0.02)_28%,rgba(2,6,23,0)_100%)]"
        style={{
          opacity: walkwayOpacity,
          clipPath: "polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-[-4%] left-1/2 h-[34%] w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle,rgba(14,165,233,0.16)_0%,rgba(14,165,233,0.05)_34%,rgba(2,6,23,0)_72%)] blur-[56px]"
        style={{ y: glowY, opacity: 0.9 }}
      />

      <div className="pointer-events-none absolute inset-x-[14%] bottom-[8%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
