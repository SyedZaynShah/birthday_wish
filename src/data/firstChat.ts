export type FirstChatMessage = {
  id: number;
  sender: "h" | "me";
  text: string;
  date: string;
  revealAt: number;
};

export const firstChatMeta = {
  username: "bellatrix_5",
  date: "Dec 24, 9:07 PM",
};

export const firstChat: FirstChatMessage[] = [
  {
    id: 1,
    sender: "h",
    text: "Sup prettyyy boy!?🌚🙃",
    date: "Dec 24 · 9:07 PM",
    revealAt: 2,
  },
  {
    id: 2,
    sender: "me",
    text: "Who's there?",
    date: "Dec 24 · 9:08 PM",
    revealAt: 3,
  },
  {
    id: 3,
    sender: "h",
    text: "Haha guess💀",
    date: "Dec 24 · 9:08 PM",
    revealAt: 4,
  },
  {
    id: 4,
    sender: "me",
    text: "Oh god, not again 😭",
    date: "Dec 24 · 9:09 PM",
    revealAt: 5,
  },
  {
    id: 5,
    sender: "me",
    text: "Why tf everyone wants me to make a guess without even knowing a single detail about them??? 😭😭",
    date: "Dec 24 · 9:09 PM",
    revealAt: 5.6,
  },
  {
    id: 6,
    sender: "me",
    text: "Just tell me you're not gay or lgbt kinda something",
    date: "Dec 24 · 9:10 PM",
    revealAt: 6,
  },
  {
    id: 7,
    sender: "h",
    text: "HAHAHAHAHAHA",
    date: "Dec 24 · 9:11 PM",
    revealAt: 7,
  },
  {
    id: 8,
    sender: "h",
    text: "For fuck sake I'm not gay",
    date: "Dec 24 · 9:11 PM",
    revealAt: 7.4,
  },
  {
    id: 9,
    sender: "h",
    text: "🙃",
    date: "Dec 24 · 9:11 PM",
    revealAt: 7.8,
  },
  {
    id: 10,
    sender: "me",
    text: "Oh thanks god",
    date: "Dec 24 · 9:12 PM",
    revealAt: 8,
  },
  {
    id: 11,
    sender: "me",
    text: "Now can you plz tell me about...",
    date: "Dec 24 · 9:12 PM",
    revealAt: 9,
  },
];
