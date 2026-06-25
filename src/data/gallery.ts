export type GalleryImage = {
  id: number;
  zoneId: string;
  title: string;
  caption: string;
  image: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: "small" | "medium" | "large" | "centerpiece";
};

export type GalleryZone = {
  id: string;
  title: string;
  subtitle?: string;
  focus: [number, number, number];
};

const img = (n: number) =>
  `/images/humaima/${String(n).padStart(2, "0")}.jpg`;

export const galleryZones: GalleryZone[] = [
  {
    id: "zone-1",
    title: "Her Smile",
    subtitle: "The one that changed everything",
    focus: [-3.8, 1.2, 0],
  },
  {
    id: "zone-2",
    title: "Favorite Pictures",
    subtitle: "The ones I keep coming back to",
    focus: [1.5, 1, -4],
  },
  {
    id: "zone-3",
    title: "Beautiful Memories",
    subtitle: "Moments that pull me back",
    focus: [4.2, 0.9, 1.5],
  },
  {
    id: "zone-4",
    title: "The Centerpiece",
    subtitle: "The most beautiful picture",
    focus: [0, 1.5, 0],
  },
];

export const galleryImages: GalleryImage[] = [
  // Zone 1 — Her Smile
  {
    id: 1,
    zoneId: "zone-1",
    title: "Favorite Smile",
    caption:
      "That smile — the kind that makes you forget what you were about to say.",
    image: img(1),
    position: [-4.5, 2, -1.2],
    rotation: [0, 0.45, 0.04],
    size: "large",
  },
  {
    id: 2,
    zoneId: "zone-1",
    title: "Soft Glow",
    caption: "Soft, genuine, and completely unaware of its power.",
    image: img(2),
    position: [-3.6, 0.5, 0.6],
    rotation: [0, 0.3, -0.03],
    size: "medium",
  },
  {
    id: 3,
    zoneId: "zone-1",
    title: "That Look",
    caption: "I could look at this forever and still not have enough.",
    image: img(3),
    position: [-4.8, -0.4, 0.2],
    rotation: [0, 0.55, 0.05],
    size: "small",
  },

  // Zone 2 — Favorite Pictures
  {
    id: 4,
    zoneId: "zone-2",
    title: "Always Her",
    caption:
      "I don't know if you realize it... but this has always been one of my favorite photos.",
    image: img(4),
    position: [0.8, 2.2, -4.8],
    rotation: [0, -0.15, -0.02],
    size: "large",
  },
  {
    id: 5,
    zoneId: "zone-2",
    title: "By Heart",
    caption: "Every detail here tells a story I already know by heart.",
    image: img(5),
    position: [2.8, 0.6, -4.2],
    rotation: [0, -0.35, 0.04],
    size: "medium",
  },
  {
    id: 6,
    zoneId: "zone-2",
    title: "Never Deleted",
    caption: "Saved. Starred. Never deleted.",
    image: img(6),
    position: [1.2, -0.8, -5.2],
    rotation: [0, -0.25, -0.03],
    size: "medium",
  },

  // Zone 3 — Beautiful Memories
  {
    id: 7,
    zoneId: "zone-3",
    title: "Quiet Moment",
    caption: "A quiet moment that felt louder than anything else.",
    image: img(7),
    position: [5, 1.8, 0.8],
    rotation: [0, -2.1, 0.02],
    size: "medium",
  },
  {
    id: 8,
    zoneId: "zone-3",
    title: "Hidden Favorite",
    caption: "I revisit this one more than I'd ever admit.",
    image: img(8),
    position: [4.2, 0.2, 2.8],
    rotation: [0, -2.35, -0.04],
    size: "large",
  },
  {
    id: 9,
    zoneId: "zone-3",
    title: "Soft Memory",
    caption: "Some memories don't fade. They just glow softer.",
    image: img(9),
    position: [5.3, -0.9, 1.6],
    rotation: [0, -2.0, 0.05],
    size: "small",
  },

  // Zone 4 — The Centerpiece
  {
    id: 10,
    zoneId: "zone-4",
    title: "The Most Beautiful Picture",
    caption:
      "I don't know if you realize it... but this has always been one of my favorite photos.",
    image: img(10),
    position: [0, 1.6, 0],
    rotation: [0, 0, 0],
    size: "centerpiece",
  },
];

export function getZoneImages(zoneId: string): GalleryImage[] {
  return galleryImages.filter((image) => image.zoneId === zoneId);
}
