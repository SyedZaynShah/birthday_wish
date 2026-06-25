import * as THREE from "three";

let cached: THREE.CanvasTexture | null = null;

export function getPlaceholderTexture(): THREE.CanvasTexture {
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0F172A");
  gradient.addColorStop(0.5, "#1E293B");
  gradient.addColorStop(1, "#0F172A");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.shadowColor = "rgba(56, 189, 248, 0.6)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
  ctx.font = "bold 120px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("H", canvas.width / 2, canvas.height / 2 - 30);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText("Photo Coming Soon", canvas.width / 2, canvas.height / 2 + 70);

  cached = new THREE.CanvasTexture(canvas);
  cached.colorSpace = THREE.SRGBColorSpace;
  return cached;
}
