export type ReasonLayout = {
  left: string;
  top: string;
  depth: number;
  rotate: number;
  revealAt: number;
};

export type Reason = {
  id: number;
  title: string;
  expandedText: string;
  layout: ReasonLayout;
  isSecret?: boolean;
};

const COLS = 4;
const ROWS = 3;

/** Shuffled grid slots — one card per cell, evenly covers the stage */
const SHUFFLED_SLOTS: { col: number; row: number }[] = [
  { col: 0, row: 0 },
  { col: 3, row: 1 },
  { col: 1, row: 2 },
  { col: 2, row: 0 },
  { col: 0, row: 1 },
  { col: 3, row: 0 },
  { col: 1, row: 0 },
  { col: 2, row: 2 },
  { col: 0, row: 2 },
  { col: 3, row: 2 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
];

function jitter(id: number) {
  const x = ((id * 37 + 11) % 11) - 5;
  const y = ((id * 53 + 7) % 11) - 5;
  const rotate = ((id * 17 + 3) % 15) - 7;
  const depth = 0.28 + ((id * 5) % 8) * 0.09;
  return { x, y, rotate, depth };
}

function cellToLayout(
  id: number,
  col: number,
  row: number,
  revealAt: number,
): ReasonLayout {
  const { x, y, rotate, depth } = jitter(id);
  const marginX = 3;
  const marginY = 4;
  const cellW = 94 / COLS;
  const cellH = 68 / ROWS;
  const left = marginX + col * cellW + cellW * 0.1 + x * 0.75;
  const top = marginY + row * cellH + cellH * 0.06 + y * 0.65;

  return {
    left: `${Math.min(76, Math.max(2, left)).toFixed(1)}%`,
    top: `${Math.min(66, Math.max(3, top)).toFixed(1)}%`,
    depth,
    rotate,
    revealAt,
  };
}

function buildLayouts(reasonIds: number[]): Map<number, ReasonLayout> {
  const layouts = new Map<number, ReasonLayout>();

  reasonIds.forEach((id, index) => {
    const slot = SHUFFLED_SLOTS[index];
    layouts.set(id, cellToLayout(id, slot.col, slot.row, 0.03 + index * 0.038));
  });

  return layouts;
}

const REASON_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const reasonLayouts = buildLayouts([...REASON_IDS]);

function withLayout(
  reason: Omit<Reason, "layout"> & { layout?: ReasonLayout },
): Reason {
  const layout = reasonLayouts.get(reason.id);
  if (!layout) throw new Error(`Missing layout for reason ${reason.id}`);
  return { ...reason, layout };
}

const reasonData = [
  {
    id: 1,
    title: "Your Cuteness",
    expandedText:
      "No matter how serious I try to be,\nyou somehow make me smile.",
  },
  {
    id: 2,
    title: "Your Labubu Energy",
    expandedText:
      "You have this adorable chaotic energy that makes every conversation feel alive.",
  },
  {
    id: 3,
    title: "Your Never-Give-Up Nature",
    expandedText:
      "Whenever life becomes difficult,\nyou keep moving forward.\n\nI genuinely admire that.",
  },
  {
    id: 4,
    title: "Your Kindness",
    expandedText:
      "The way you care about people says a lot about who you are.",
  },
  {
    id: 5,
    title: "Your Devotion",
    expandedText:
      "Being loved by someone who genuinely cares is one of the greatest blessings.",
  },
  {
    id: 6,
    title: "Your Conversations",
    expandedText:
      "Some people talk.\n\nYou make conversations memorable.",
  },
  {
    id: 7,
    title: "Your Intellectual Side",
    expandedText:
      "Your love for books,\nideas,\nphilosophy,\nand deeper thoughts\nis one of the most attractive things about you.",
  },
  {
    id: 8,
    title: "Your Pathan Voice",
    expandedText:
      "There is something uniquely comforting about hearing your voice.",
  },
  {
    id: 9,
    title: "Your Big Nose",
    expandedText:
      "I know you might laugh at this one,\nbut I genuinely find it adorable.",
  },
  {
    id: 10,
    title: "Your Small Height",
    expandedText: "Somehow it just adds to your charm.",
  },
  {
    id: 11,
    title: "Your Possessiveness",
    expandedText:
      "Sometimes it makes me laugh.\n\nSometimes it makes me smile.\n\nBut it always reminds me that I matter to you.",
  },
] as const;

export const reasons: Reason[] = reasonData.map(withLayout);

export const secretReason: Reason = withLayout({
  id: 12,
  title: "Something More",
  expandedText: "",
  isSecret: true,
});

export const allReasons: Reason[] = [...reasons, secretReason];
