export const futureMeta = {
  chapter: "Chapter 7",
  title: "The Future I Dream About 🌿✨",
  subtitle: "Not all dreams are made of castles.\nSome are made of peace.",
};

export const futureScenes = {
  scene1: {
    lines: [
      "What does my favorite future look like?",
      "It doesn't start with success.",
      "It starts with you.",
    ],
  },
  scene2: {
    lines: ["Somewhere far away...", "In a quiet village in Ireland."],
  },
  scene3: {
    lines: ["A small restaurant.", "Nothing fancy.", "Just enough."],
  },
  scene4: {
    lines: ["A slow life.", "A peaceful life.", "A life shared together."],
  },
  scene5: {
    lines: [
      "Regardless of what life brings.",
      "Regardless of every challenge.",
      "My favorite future...",
      "...is the one that has you in it.",
      "❤️",
    ],
  },
  ending: {
    lines: [
      "Maybe it never happens exactly like this.",
      "Maybe life writes a different story.",
      "But if I get to walk through it with you...",
      "I'll still be grateful.",
      "❤️",
    ],
  },
  finale: {
    line: "And before this dream ends...",
  },
} as const;

export type LandscapePhase =
  | "space"
  | "clouds"
  | "dawn"
  | "countryside"
  | "village"
  | "evening"
  | "night-return";
