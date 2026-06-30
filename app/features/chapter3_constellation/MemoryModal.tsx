"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Memory } from "@/src/data/memories";

type Props = {
  memory: Memory | null;
  onClose: () => void;
};

const specialParticles = [
  { id: 1, top: "12%", left: "14%", duration: 6.2, delay: 0.2 },
  { id: 2, top: "24%", left: "78%", duration: 7.1, delay: 0.8 },
  { id: 3, top: "38%", left: "22%", duration: 6.8, delay: 1.1 },
  { id: 4, top: "52%", left: "70%", duration: 7.6, delay: 0.5 },
  { id: 5, top: "70%", left: "18%", duration: 6.4, delay: 1.4 },
  { id: 6, top: "78%", left: "82%", duration: 7.3, delay: 0.9 },
];

export default function MemoryModal({ memory, onClose }: Props) {
  const isSpecial = Boolean(memory?.special);

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-lg sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isSpecial ? 0.5 : 0.35, ease: "easeOut" }}
          onClick={onClose}
        >
          {isSpecial && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16)_0%,rgba(56,189,248,0.08)_30%,transparent_72%)] blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,rgba(251,191,36,0.04)_35%,transparent_72%)] blur-3xl" />
              {specialParticles.map((particle) => (
                <motion.span
                  key={particle.id}
                  className="absolute h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_12px_rgba(56,189,248,0.35)]"
                  style={{ top: particle.top, left: particle.left }}
                  animate={{
                    y: [0, -14, 0],
                    x: [0, 4, 0],
                    opacity: [0.15, 0.55, 0.15],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            className={`relative flex max-h-[90vh] w-fit max-w-[92vw] min-w-[18rem] flex-col overflow-hidden rounded-3xl border backdrop-blur-2xl ${
              isSpecial
                ? "border-white/20 bg-slate-950/70 shadow-[0_0_90px_rgba(56,189,248,0.24)]"
                : "border-white/15 bg-white/5 shadow-[0_0_60px_rgba(56,189,248,0.15)]"
            }`}
            initial={{ scale: 0.88, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={
              isSpecial
                ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                : { type: "spring", stiffness: 260, damping: 24 }
            }
            onClick={(event) => event.stopPropagation()}
          >
            {isSpecial && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14)_0%,transparent_42%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12)_0%,transparent_38%)]" />
                <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              </>
            )}

            <button
              type="button"
              aria-label="Close memory"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 transition hover:border-[#38BDF8]/50 hover:bg-black/60 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative shrink-0 px-4 pt-4 sm:px-5 sm:pt-5">
              <div className="relative flex max-h-[48vh] max-w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0F172A] p-2 sm:max-h-[52vh] sm:p-3">
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="block h-auto max-h-[44vh] w-auto max-w-full object-contain sm:max-h-[46vh]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/72 via-transparent to-transparent" />
                {isSpecial && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.18)_0%,transparent_40%,transparent_60%,rgba(251,191,36,0.14)_100%)]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#020617] via-[#020617]/55 to-transparent" />
                  </>
                )}
              </div>
            </div>

            <div className="relative min-h-0 max-w-xl overflow-y-auto p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#38BDF8]/80">
                Memory
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                {memory.title}
              </h3>
              <p
                className={`mt-4 text-sm leading-7 text-white/75 sm:text-base ${
                  isSpecial ? "text-white/82" : ""
                } break-words whitespace-pre-line text-pretty`}
              >
                {memory.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
