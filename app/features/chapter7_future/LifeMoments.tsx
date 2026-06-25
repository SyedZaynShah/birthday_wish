"use client";

import { motion } from "framer-motion";

const MOMENTS = [
  { id: "tea", label: "Two cups of tea", icon: "☕" },
  { id: "books", label: "Open books", icon: "📖" },
  { id: "lights", label: "Lights turning on", icon: "✨" },
  { id: "chairs", label: "Chairs waiting", icon: "🪑" },
  { id: "flowers", label: "Flowers on tables", icon: "🌸" },
  { id: "window", label: "A warm window", icon: "🪟" },
];

export default function LifeMoments() {
  return (
    <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-5">
      {MOMENTS.map((moment, i) => (
        <motion.div
          key={moment.id}
          className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
        >
          <span className="text-2xl sm:text-3xl" aria-hidden>
            {moment.icon}
          </span>
          <span className="text-center text-xs text-white/60 sm:text-sm">
            {moment.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
