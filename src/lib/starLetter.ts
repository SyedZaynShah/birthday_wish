/** 5×7 dot grids for star-letter formation (1 = lit) */
const GLYPHS: Record<string, number[][]> = {
  H: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  U: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
  ],
  M: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  A: [
    [0, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
};

const NAME = "HUMAIMA";
const CELL = 0.22;
const LETTER_GAP = 0.35;

export type StarPoint = { x: number; y: number; z: number };

export function buildNameStarPositions(): StarPoint[] {
  const points: StarPoint[] = [];
  let cursorX = 0;

  for (const char of NAME) {
    const grid = GLYPHS[char];
    if (!grid) continue;
    const cols = grid[0].length;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === 1) {
          points.push({
            x: cursorX + col * CELL,
            y: (grid.length - 1 - row) * CELL,
            z: 0,
          });
        }
      }
    }
    cursorX += cols * CELL + LETTER_GAP;
  }

  const totalWidth = cursorX - LETTER_GAP;
  const offsetX = -totalWidth / 2;

  return points.map((p) => ({
    x: p.x + offsetX,
    y: p.y - 0.7,
    z: p.z,
  }));
}

export function buildScatterPositions(count: number): StarPoint[] {
  const points: StarPoint[] = [];
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2 + i * 0.17;
    const radius = 2.5 + (i % 7) * 0.35;
    points.push({
      x: Math.cos(theta) * radius,
      y: Math.sin(theta * 1.3) * radius * 0.5 + 1.2,
      z: Math.sin(theta) * radius * 0.33 - 2,
    });
  }
  return points;
}

export const FINALE_STAR_COUNT = 220;
