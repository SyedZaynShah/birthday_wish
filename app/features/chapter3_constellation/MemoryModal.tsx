"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Memory } from "@/src/data/memories";

type Props = {
  memory: Memory | null;
  onClose: () => void;
};

export default function MemoryModal({ memory, onClose }: Props) {
  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-lg sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_0_60px_rgba(56,189,248,0.15)] backdrop-blur-2xl"
            initial={{ scale: 0.88, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close memory"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 transition hover:border-[#38BDF8]/50 hover:bg-black/60 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F172A]">
              <img
                src={memory.image}
                alt={memory.title}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
            </div>

            <div className="space-y-3 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#38BDF8]/80">
                Memory
              </p>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {memory.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                {memory.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
