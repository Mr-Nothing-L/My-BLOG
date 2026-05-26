import { useEffect, useRef } from "react";

const STREAM_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンXYZxyz+-*/=<>[]{}|~^";

interface StreamColumn {
  x: number;
  speed: number;
  length: number;
  head: number;
  chars: string[];
  brightness: number[];
  highlight: boolean;
  highlightText: string;
}

export default function DataAbyss() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let time = 0;
    let rafId = 0;
    let streams: StreamColumn[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = width < 768 ? 40 : 70;
      const cellW = width / cols;
      const cellH = cellW * 1.2;
      rows = Math.ceil(height / cellH);

      // Initialize streams
      streams = [];
      for (let c = 0; c < cols; c++) {
        const length = 10 + Math.floor(Math.random() * 25);
        const chars: string[] = [];
        const brightness: number[] = [];
        for (let i = 0; i < length; i++) {
          chars.push(STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)]);
          brightness.push(0);
        }

        // Some columns have highlight text
        const highlight = Math.random() < 0.08;
        const highlights = ["BLOG", "CV", "AI", "CODE", "DATA", "2025", "MR.L"];
        const highlightText = highlight
          ? highlights[Math.floor(Math.random() * highlights.length)]
          : "";

        streams.push({
          x: c,
          speed: 0.5 + Math.random() * 1.5,
          length,
          head: Math.random() * rows * 2 - rows,
          chars,
          brightness,
          highlight,
          highlightText,
        });
      }
    };

    const draw = () => {
      // Fade trail
      ctx.fillStyle = "rgba(2, 2, 4, 0.15)";
      ctx.fillRect(0, 0, width, height);

      time += 0.016;

      const cellW = width / cols;
      const cellH = cellW * 1.2;

      ctx.font = `${cellH * 0.8}px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const stream of streams) {
        stream.head += stream.speed;

        // Reset if off screen
        if (stream.head - stream.length > rows + 5) {
          stream.head = -5;
          stream.speed = 0.5 + Math.random() * 1.5;
          // Regenerate chars
          for (let i = 0; i < stream.length; i++) {
            stream.chars[i] = STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)];
          }
        }

        for (let i = 0; i < stream.length; i++) {
          const row = Math.floor(stream.head - i);
          if (row < 0 || row >= rows) continue;

          const x = stream.x * cellW + cellW / 2;
          const y = row * cellH + cellH / 2;

          // Brightness: head is brightest
          const headDist = i / stream.length;
          let brightness = 1 - headDist;
          brightness = Math.pow(brightness, 0.7);

          // Highlight text overrides
          if (stream.highlight && stream.highlightText) {
            const textStart = Math.floor(stream.head - stream.length / 2);
            if (row >= textStart && row < textStart + stream.highlightText.length) {
              const textIdx = row - textStart;
              stream.chars[i] = stream.highlightText[textIdx];
              brightness = 0.8 + Math.sin(time * 3 + stream.x) * 0.2;
            }
          }

          if (brightness < 0.02) continue;

          // Color gradient: head = bright cyan, tail = dim green
          let r_val: number, g_val: number, b_val: number;

          if (stream.highlight) {
            // Highlighted text: amber
            r_val = 255;
            g_val = Math.floor(149 + brightness * 100);
            b_val = Math.floor(brightness * 50);
          } else if (headDist < 0.15) {
            // Head: bright cyan-white
            const t = headDist / 0.15;
            r_val = Math.floor(255 - t * 100);
            g_val = 255;
            b_val = 255;
          } else if (headDist < 0.5) {
            // Mid: cyan
            const t = (headDist - 0.15) / 0.35;
            r_val = Math.floor(100 * (1 - t));
            g_val = Math.floor(229 + (1 - t) * 26);
            b_val = 255;
          } else {
            // Tail: dim green
            const t = (headDist - 0.5) / 0.5;
            r_val = Math.floor(50 * (1 - t));
            g_val = Math.floor(200 * (1 - t) + 50);
            b_val = Math.floor(100 * (1 - t) + 40);
          }

          ctx.fillStyle = `rgba(${r_val}, ${g_val}, ${b_val}, ${brightness})`;
          ctx.fillText(stream.chars[i], x, y);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
