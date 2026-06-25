"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  large?: boolean;
  hero?: boolean;
};

export default function FinaleLine({
  children,
  className = "",
  delay = 0,
  large = false,
  hero = false,
}: Props) {
  return (
    <motion.p
      className={`max-w-xl text-pretty break-words px-3 text-center ${
        hero
          ? "text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
          : large
            ? "text-xl font-medium leading-relaxed text-white sm:text-2xl md:text-3xl"
            : "text-base leading-relaxed text-white/88 sm:text-lg md:text-xl"
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.p>
  );
}
