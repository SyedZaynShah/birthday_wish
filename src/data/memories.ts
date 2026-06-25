export type Memory = {
  id: number;
  title: string;
  description: string;
  image: string;
};

/** Subtle heart-shaped constellation — the shape reveals itself slowly. */
export const memoryPositions: Record<number, [number, number, number]> = {
  1: [-1.1, 1.3, 0.2],
  2: [1.1, 1.2, -0.2],
  3: [0, 0.5, 0.3],
  4: [-1.4, -0.2, 0.1],
  5: [1.4, -0.2, -0.1],
  6: [0, -1.6, 0],
};

/** Constellation edges that trace a soft heart silhouette. */
export const constellationEdges: [number, number][] = [
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
];

/** Hidden star — dim, unconnected, off the heart silhouette. */
export const secretStarPosition: [number, number, number] = [2.1, 0.85, -1.3];

export const memories: Memory[] = [
  {
    id: 1,
    title: "The First Message",
    description:
      "The very first words that crossed the screen — innocent, curious, and completely unaware of the universe they were about to create.",
    image: "/images/humaima/01.jpg",
  },
  {
    id: 2,
    title: "The Guessing Game",
    description:
      "Playful questions, clever answers, and that electric feeling when every reply made you want to keep talking.",
    image: "/images/humaima/02.jpg",
  },
  {
    id: 3,
    title: "Priorities",
    description:
      "When the conversation stopped being casual and started meaning something — when you became a priority without either of us saying it.",
    image: "/images/humaima/03.jpg",
  },
  {
    id: 4,
    title: "The Laugh",
    description:
      "That moment laughter filled the space between messages — the kind of laugh that makes you realize this person is different.",
    image: "/images/humaima/04.jpg",
  },
  {
    id: 5,
    title: "Favorite Picture",
    description:
      "A single image that captured everything — a smile, a look, a feeling you wanted to hold onto forever.",
    image: "/images/humaima/05.jpg",
  },
  {
    id: 6,
    title: "Special Memory",
    description:
      "The memory that shines brightest — the one that reminds you why every star in this constellation matters.",
    image: "/images/humaima/06.jpg",
  },
];
