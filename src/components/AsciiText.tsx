import { useEffect, useRef, useCallback } from "react";

interface AsciiTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  className?: string;
  animate?: boolean;
  density?: number;
}

const DENSITY_CHARS = [" ", "·", ":", "░", "▒", "▓", "█"];

export default function AsciiText({
  text,
  fontSize = 48,
  color = "#00e5ff",
  className,
  animate = true,
  density = 6,
}: AsciiTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  const renderAscii = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    const lines = text.split("\n");
    const lineHeight = fontSize * 1.2;

    offCtx.font = `bold ${fontSize}px "Geist Pixel", "IBM Plex Mono", monospace`;

    let maxWidth = 0;
    for (const line of lines) {
      const w = offCtx.measureText(line).width;
      if (w > maxWidth) maxWidth = w;
    }

    const padding = fontSize * 0.5;
    const offWidth = Math.ceil(maxWidth + padding * 2);
    const offHeight = Math.ceil(lines.length * lineHeight + padding * 2);

    offCanvas.width = offWidth;
    offCanvas.height = offHeight;

    offCtx.font = `bold ${fontSize}px "Geist Pixel", "IBM Plex Mono", monospace`;
    offCtx.fillStyle = "#ffffff";
    offCtx.textBaseline = "top";

    lines.forEach((line, i) => {
      offCtx.fillText(line, padding, padding + i * lineHeight);
    });

    const imageData = offCtx.getImageData(0, 0, offWidth, offHeight);
    const data = imageData.data;

    const cols = Math.floor(offWidth / density);
    const rows = Math.floor(offHeight / density);

    const charWidth = fontSize * 0.6;
    const charHeight = fontSize * 0.8;
    const outWidth = Math.ceil(cols * charWidth);
    const outHeight = Math.ceil(rows * charHeight);

    canvas.width = outWidth;
    canvas.height = outHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${fontSize * 0.65}px "IBM Plex Mono", monospace`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";

    const chars: { x: number; y: number; char: string; idx: number }[] = [];
    let idx = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = Math.floor(col * density + density / 2);
        const py = Math.floor(row * density + density / 2);
        if (px >= offWidth || py >= offHeight) continue;

        const i = (py * offWidth + px) * 4;
        const brightness = data[i] / 255;

        if (brightness > 0.05) {
          const charIndex = Math.min(
            Math.floor(brightness * (DENSITY_CHARS.length - 1)),
            DENSITY_CHARS.length - 1
          );
          const char = DENSITY_CHARS[charIndex];
          const x = col * charWidth;
          const y = row * charHeight;
          chars.push({ x, y, char, idx: idx++ });
        }
      }
    }

    if (animate && !renderedRef.current) {
      renderedRef.current = true;
      const shuffled = [...chars].sort(() => Math.random() - 0.5);
      const total = shuffled.length;
      const duration = Math.min(1200, total * 8);

      let startTime: number | null = null;
      const revealed = new Set<number>();

      const step = (ts: number) => {
        if (startTime === null) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, outWidth, outHeight);
        ctx.fillStyle = color;

        const revealCount = Math.floor(progress * total);
        for (let i = 0; i < revealCount; i++) {
          const c = shuffled[i];
          ctx.fillText(c.char, c.x, c.y);
          revealed.add(c.idx);
        }

        for (const c of chars) {
          if (revealed.has(c.idx)) continue;
          ctx.fillStyle = `${color}15`;
          ctx.fillText(c.char, c.x, c.y);
          ctx.fillStyle = color;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          ctx.clearRect(0, 0, outWidth, outHeight);
          ctx.fillStyle = color;
          for (const c of chars) {
            ctx.fillText(c.char, c.x, c.y);
          }
        }
      };

      requestAnimationFrame(step);
    } else {
      ctx.clearRect(0, 0, outWidth, outHeight);
      for (const c of chars) {
        ctx.fillText(c.char, c.x, c.y);
      }
    }
  }, [text, fontSize, color, animate, density]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      renderAscii();
    });
  }, [renderAscii]);

  useEffect(() => {
    const handleResize = () => renderAscii();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderAscii]);

  return (
    <div ref={containerRef} className={className} style={{ display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
