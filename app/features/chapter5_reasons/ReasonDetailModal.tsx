"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import type { Reason } from "@/src/data/reasons";

type Props = {
  reason: Reason;
  secretRevealed: boolean;
  onClose: () => void;
};

export default function ReasonDetailModal({
  reason,
  secretRevealed,
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      key={reason.id}
      className="fixed inset-0 z-[200] flex items-center justify-center p-5 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
        <motion.div
          className="absolute inset-0 bg-[#020617]/75 backdrop-blur-xl"
          aria-hidden
        />

        <motion.div
          className={`relative z-10 w-full max-w-md rounded-3xl border px-7 py-10 text-center shadow-2xl backdrop-blur-2xl sm:px-10 sm:py-12 ${
            reason.isSecret
              ? "border-[#F472B6]/20 bg-gradient-to-b from-[#0F172A]/95 to-[#1a0f24]/95 shadow-[0_0_80px_rgba(244,114,182,0.15)]"
              : "border-white/10 bg-white/5 shadow-[0_0_60px_rgba(56,189,248,0.12)]"
          }`}
          initial={{ scale: 0.92, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/60 transition hover:text-white"
          >
            <X size={16} />
          </button>

          {reason.isSecret && secretRevealed ? (
            <div className="space-y-6">
              <motion.p
                className="text-lg text-white/85 sm:text-xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                The truth is...
              </motion.p>
              <motion.p
                className="text-xl font-medium text-white sm:text-2xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                You are my favorite reason.
              </motion.p>
              <motion.p
                className="text-3xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.9, duration: 0.6 }}
              >
                ❤️
              </motion.p>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.35em] text-[#38BDF8]/80">
                Reason
              </p>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {reason.title}
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/75 sm:text-base">
                {reason.expandedText}
              </p>
            </div>
          )}
        </motion.div>
    </motion.div>,
    document.body,
  );
}
