"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  large?: boolean;
};

export default function DreamLine({
  children,
  className = "",
  delay = 0,
  large = false,
}: Props) {
  return (
    <motion.p
      className={`max-w-xl text-pretty break-words px-2 ${
        large
          ? "text-xl font-medium leading-relaxed text-white sm:text-2xl md:text-3xl"
          : "text-base leading-relaxed text-white/88 sm:text-lg md:text-xl"
      } ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.75, ease: "easeOut", delay }}
    >
      {children}
    </motion.p>
  );
}
