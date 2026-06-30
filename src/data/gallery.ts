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
    title: "Gallery Wing I",
    subtitle: "Exhibits 01 - 03",
    focus: [-3.8, 1.2, 0],
  },
  {
    id: "zone-2",
    title: "Gallery Wing II",
    subtitle: "Exhibits 04 - 06",
    focus: [1.5, 1, -4],
  },
  {
    id: "zone-3",
    title: "Gallery Wing III",
    subtitle: "Exhibits 07 - 08",
    focus: [4.2, 0.9, 1.5],
  },
  {
    id: "zone-4",
    title: "Featured Exhibit",
    subtitle: "Exhibit 09",
    focus: [0, 1.5, 0],
  },
];

export const galleryImages: GalleryImage[] = [
  // Zone 1
  {
    id: 1,
    zoneId: "zone-1",
    title: "The Perfect Profile",
    caption:
      "I genuinely don't know how this is possible, but somehow every angle in this picture works. This is one of those photos where everything just came together perfectly. Calm, confident, and effortlessly beautiful.",
    image: img(7),
    position: [-4.5, 2, -1.2],
    rotation: [0, 0.45, 0.04],
    size: "large",
  },
  {
    id: 2,
    zoneId: "zone-1",
    title: "That Weird Little Smile",
    caption:
      "This smile makes absolutely no sense and yet somehow it's one of my favorites. Half smile, half chaos, and fully Humaima. Every time I look at it, I end up laughing.",
    image: img(8),
    position: [-3.6, 0.5, 0.6],
    rotation: [0, 0.3, -0.03],
    size: "medium",
  },
  {
    id: 3,
    zoneId: "zone-1",
    title: "Aunty Ji Era",
    caption:
      "The floral niqab, the serious look, the whole vibe. This picture always gives me strong aunty energy and I will never stop teasing you about it. Still adorable though.",
    image: img(9),
    position: [-4.8, -0.4, 0.2],
    rotation: [0, 0.55, 0.05],
    size: "small",
  },

  // Zone 2
  {
    id: 4,
    zoneId: "zone-2",
    title: "The Elegant Abaya Look",
    caption:
      "This is one of those pictures that feels graceful without even trying. Simple, elegant, and effortlessly beautiful. The kind of picture that makes you stop scrolling for a second.",
    image: img(10),
    position: [0.8, 2.2, -4.8],
    rotation: [0, -0.15, -0.02],
    size: "large",
  },
  {
    id: 5,
    zoneId: "zone-2",
    title: "The Selfie That Was Almost Perfect",
    caption:
      "This is easily one of your best selfies ever. Everything about it is perfect.\n\nEverything.\n\nExcept that bracelet.\n\nI still haven't forgiven that bracelet.",
    image: img(11),
    position: [2.8, 0.6, -4.2],
    rotation: [0, -0.35, 0.04],
    size: "medium",
  },
  {
    id: 6,
    zoneId: "zone-2",
    title: "The Great Nose Reveal",
    caption:
      "Ladies and gentlemen, after months of investigation, the evidence was finally revealed. The legendary nose in its full glory. And yes, I will continue making jokes about it forever.",
    image: img(12),
    position: [1.2, -0.8, -5.2],
    rotation: [0, -0.25, -0.03],
    size: "medium",
  },

  // Zone 3
  {
    id: 7,
    zoneId: "zone-3",
    title: "Toota Hua Saaz",
    caption:
      "There's something about this picture that feels different. A little quieter. A little softer. It looks like the cover of a sad novel that somehow ends happily.",
    image: img(13),
    position: [5, 1.8, 0.8],
    rotation: [0, -2.1, 0.02],
    size: "medium",
  },
  {
    id: 8,
    zoneId: "zone-3",
    title: "The Saree Masterpiece",
    caption:
      "I genuinely ran out of criticism for this one. The saree, the look, the confidence, everything works. This is one of those pictures that instantly becomes a favorite.",
    image: img(14),
    position: [4.2, 0.2, 2.8],
    rotation: [0, -2.35, -0.04],
    size: "large",
  },

  // Zone 4
  {
    id: 9,
    zoneId: "zone-4",
    title: "That Smile",
    caption:
      "If I had to describe this picture in one word, it would simply be happiness. The saree looks beautiful, the smile is perfect, and somehow the entire photo feels warm.\n\nA perfect ending to the gallery.",
    image: img(15),
    position: [0, 1.6, 0],
    rotation: [0, 0, 0],
    size: "centerpiece",
  },
];

export function getZoneImages(zoneId: string): GalleryImage[] {
  return galleryImages.filter((image) => image.zoneId === zoneId);
}
