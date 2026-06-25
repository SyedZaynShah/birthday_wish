"use client";

import { motion } from "framer-motion";
import { finalePhases } from "@/src/data/finale";

export default function EndScreen() {
  const { moon, title, heart, signature } = finalePhases.endScreen;

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#020617] px-6 py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 30 }, (_, i) => (
          <span
            key={i}
            className="letter-star absolute rounded-full bg-white"
            style={{
              left: `${(i * 19 + 5) % 96}%`,
              top: `${(i * 23 + 8) % 90}%`,
              width: i % 3 === 0 ? 2 : 1.5,
              height: i % 3 === 0 ? 2 : 1.5,
              animationDelay: `${(i % 6) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <motion.p
        className="relative z-10 text-5xl sm:text-6xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {moon}
      </motion.p>

      <motion.h2
        className="relative z-10 mt-8 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="relative z-10 mt-6 text-4xl sm:text-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {heart}
      </motion.p>

      <motion.p
        className="relative z-10 mt-10 whitespace-pre-line text-sm uppercase tracking-[0.35em] text-white/55 sm:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        {signature}
      </motion.p>
    </motion.div>
  );
}
