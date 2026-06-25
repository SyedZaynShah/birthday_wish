export const finaleMeta = {
  chapter: "Chapter 8",
  title: "Happy Birthday Humaima 🌙✨",
};

export const finalePhases = {
  phase1: {
    lines: [
      "Every memory...",
      "...every laugh...",
      "...every late-night conversation...",
      "...led here.",
    ],
  },
  phase3: {
    line1: "Happy Birthday",
    line2: "Humaima",
  },
  phase4: {
    lines: [
      "Thank you for every memory.",
      "Thank you for every laugh.",
      "Thank you for every conversation.",
      "Thank you for being you.",
      "❤️",
    ],
  },
  phase6: {
    lines: [
      "No matter where life takes us...",
      "No matter how many years pass...",
      "You'll always have a place in my universe.",
      "❤️",
    ],
  },
  phase7: {
    buttonLabel: "One Last Thing...",
  },
  secret: {
    lines: [
      "I love you.",
      "Happy Birthday, my beautiful girl.",
      "Forever yours,",
      "Zain ❤️",
    ],
  },
  endScreen: {
    moon: "🌙",
    title: "Happy Birthday Humaima",
    heart: "❤️",
    signature: "Forever Yours,\nZain",
  },
} as const;

/** Scroll ranges (0–1) for canvas choreography */
export const finaleTimeline = {
  starsGather: [0, 0.12] as const,
  nameForm: [0.14, 0.36] as const,
  moonRise: [0.32, 0.52] as const,
  skyBrighten: [0.4, 0.55] as const,
  orbit: [0.58, 0.78] as const,
  peakGlow: [0.75, 0.88] as const,
};
