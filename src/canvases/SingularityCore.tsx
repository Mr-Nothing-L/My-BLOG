import { useEffect, useRef } from "react";
import { noise2D, clamp } from "./shared/math";

const DENSITY_CHARS = " .·:░▒▓█▓▒░:·. ";

export default function SingularityCore() {
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
    const mouse = { x: -1000, y: -1000, active: false };

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
      cols = width < 768 ? 80 : 140;
      const cellW = width / cols;
      const cellH = cellW * 1.15;
      rows = Math.ceil(height / cellH);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const draw = () => {
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);

      time += 0.008;

      const cellW = width / cols;
      const cellH = cellW * 1.15;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const maxRadius = Math.min(width, height) * 0.45;

      ctx.font = `${cellH * 0.75}px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW + cellW / 2;
          const y = r * cellH + cellH / 2;

          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.hypot(dx, dy);
          const normDist = dist / maxRadius;
          const angle = Math.atan2(dy, dx);

          // Mouse gravitational disturbance
          const mdx = x - mouse.x;
          const mdy = y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          const mField = mouse.active ? Math.exp(-mDist * 0.004) : 0;

          // Spiral rotation
          const spiralAngle = angle + time * (0.5 + normDist * 0.3);

          // Noise for organic variation
          const n = noise2D(c * 0.05 + time * 0.1, r * 0.05 + time * 0.1);

          // Density increases toward center
          let density = 1 - normDist;
          density = Math.pow(density, 1.5);

          // Add spiral arms
          const armCount = 3;
          const armPhase = spiralAngle * armCount;
          const armStrength = Math.sin(armPhase + time * 2) * 0.5 + 0.5;
          density *= (0.4 + armStrength * 0.6);

          // Mouse distorts density
          density += mField * 0.3;

          // Position offset from mouse gravity
          let drawX = x;
          let drawY = y;
          if (mField > 0.01) {
            drawX += Math.cos(angle + time * 3) * mField * 30;
            drawY += Math.sin(angle + time * 2.5) * mField * 20;
          }

          if (density < 0.05) continue;

          // Character selection based on density
          const charIdx = clamp(
            Math.floor(density * (DENSITY_CHARS.length - 1) + n * 2),
            0,
            DENSITY_CHARS.length - 1
          );
          const char = DENSITY_CHARS[charIdx];

          // Color: core = red/orange, mid = cyan, outer = dim
          let r_val: number, g_val: number, b_val: number;

          if (normDist < 0.15) {
            // Core: intense red-white
            const coreT = normDist / 0.15;
            r_val = 255;
            g_val = Math.floor(40 + coreT * 100);
            b_val = Math.floor(coreT * 80);
          } else if (normDist < 0.4) {
            // Inner ring: cyan-blue
            const ringT = (normDist - 0.15) / 0.25;
            r_val = Math.floor(255 * (1 - ringT));
            g_val = Math.floor(229 + (1 - ringT) * 26);
            b_val = 255;
          } else {
            // Outer: dim blue-gray
            const outerT = (normDist - 0.4) / 0.6;
            r_val = Math.floor(30 * (1 - outerT));
            g_val = Math.floor(80 * (1 - outerT));
            b_val = Math.floor(120 * (1 - outerT) + 40);
          }

          const opacity = clamp(density * 0.9 + n * 0.1, 0.1, 1);

          ctx.fillStyle = `rgba(${r_val}, ${g_val}, ${b_val}, ${opacity})`;
          ctx.fillText(char, drawX, drawY);
        }
      }

      // Central singularity glow
      const glowRadius = maxRadius * 0.08;
      const glow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, glowRadius * 3
      );
      glow.addColorStop(0, "rgba(255, 50, 50, 0.4)");
      glow.addColorStop(0.3, "rgba(255, 100, 50, 0.15)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
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
