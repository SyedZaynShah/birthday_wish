"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { finalePhases } from "@/src/data/finale";

type Props = {
  open: boolean;
  onComplete: () => void;
  onBurst: () => void;
};

export default function SecretFinale({ open, onComplete, onBurst }: Props) {
  const [step, setStep] = useState(0);
  const burstFired = useRef(false);
  const lines = finalePhases.secret.lines;

  useEffect(() => {
    if (!open) {
      setStep(0);
      burstFired.current = false;
      return;
    }
    if (step >= lines.length) {
      if (!burstFired.current) {
        burstFired.current = true;
        onBurst();
      }
      const t = setTimeout(onComplete, 2800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 1200 : 2000);
    return () => clearTimeout(t);
  }, [open, step, lines.length, onComplete, onBurst]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020617]/95 px-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex max-w-lg flex-col items-center gap-8 text-center">
            {lines.slice(0, step).map((line, i) => (
              <motion.p
                key={line}
                className={`whitespace-pre-line ${
                  i === lines.length - 1
                    ? "text-2xl font-medium text-[#38BDF8] sm:text-3xl"
                    : "text-xl text-white/90 sm:text-2xl"
                }`}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                style={{
                  textShadow: "0 0 24px rgba(56,189,248,0.35)",
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
