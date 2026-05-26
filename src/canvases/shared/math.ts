// Shared math utilities for all ASCII canvas scenes

export const MOON_CHARS =
  " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";

export const DENSITY_CHARS = "  ..::--==++**##@@";

export const SINGULARITY_CHARS = " .·:░▒▓█▓▒░:·. ";

export const WARP_CHARS = " ·∙:⋆✦✧✶✷✸✹✺·∙:⋆";

export const STREAM_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const smooth = (t: number) => t * t * (3 - 2 * t);

export const noise2D = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  const ux = smooth(fx);
  const uy = smooth(fy);

  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
};

export const noise3D = (x: number, y: number, z: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = smooth(fx);
  const uy = smooth(fy);
  const uz = smooth(fz);

  const corners = [];
  for (let dx = 0; dx <= 1; dx++) {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dz = 0; dz <= 1; dz++) {
        const h = hash(ix + dx + (iy + dy) * 57 + (iz + dz) * 131, 0);
        corners.push(h);
      }
    }
  }

  let result = 0;
  for (let i = 0; i < 8; i++) {
    const dx = i & 1 ? ux : 1 - ux;
    const dy = i & 2 ? uy : 1 - uy;
    const dz = i & 4 ? uz : 1 - uz;
    result += corners[i] * dx * dy * dz;
  }
  return result;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const dist = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x2 - x1, y2 - y1);

export const angle = (x1: number, y1: number, x2: number, y2: number) =>
  Math.atan2(y2 - y1, x2 - x1);

export const remap = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) => toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);

// Easing functions
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const easeInOutSine = (t: number) =>
  -(Math.cos(Math.PI * t) - 1) / 2;

// Color utilities for sci-fi theme
export const ACCENT_RED = "#ff2a2a";
export const ACCENT_BLUE = "#2a5fff";
export const ACCENT_CYAN = "#00e5ff";
export const ACCENT_AMBER = "#ff9500";

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };
