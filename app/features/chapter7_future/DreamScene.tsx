"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LandscapePhase } from "@/src/data/futureDream";
import CountrysideBackground from "./CountrysideBackground";

type Props = {
  phase: LandscapePhase;
  children: ReactNode;
  visual?: ReactNode;
  className?: string;
};

export default function DreamScene({
  phase,
  children,
  visual,
  className = "",
}: Props) {
  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 ${className}`}
    >
      <CountrysideBackground phase={phase} />
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 text-center sm:gap-12">
        {visual}
        <div className="flex flex-col items-center gap-6 sm:gap-8">{children}</div>
      </div>
    </div>
  );
}
