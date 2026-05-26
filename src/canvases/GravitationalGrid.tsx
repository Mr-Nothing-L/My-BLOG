import { useEffect, useRef } from "react";
import { noise2D, clamp, dist } from "./shared/math";

export default function GravitationalGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
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

    const gravitationalDistort = (
      x: number,
      y: number,
      massX: number,
      massY: number,
      mass: number
    ) => {
      const dx = x - massX;
      const dy = y - massY;
      const d = Math.hypot(dx, dy);
      if (d < 1) return { x, y };

      const force = mass / (d * d * 0.001 + d * 0.1 + 10);
      const maxForce = 80;
      const f = Math.min(force, maxForce);

      return {
        x: x - (dx / d) * f,
        y: y - (dy / d) * f,
      };
    };

    const draw = () => {
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);

      time += 0.005;

      const gridSpacing = width < 768 ? 40 : 60;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const centerMass = 400;

      // Draw horizontal grid lines with distortion
      ctx.strokeStyle = "rgba(42, 95, 255, 0.12)";
      ctx.lineWidth = 0.5;

      for (let y = 0; y <= height + gridSpacing; y += gridSpacing) {
        ctx.beginPath();
        let first = true;
        for (let x = 0; x <= width; x += 5) {
          const distorted = gravitationalDistort(x, y, centerX, centerY, centerMass);

          // Mouse also distorts
          const final = mouse.active
            ? gravitationalDistort(distorted.x, distorted.y, mouse.x, mouse.y, 150)
            : distorted;

          if (first) {
            ctx.moveTo(final.x, final.y);
            first = false;
          } else {
            ctx.lineTo(final.x, final.y);
          }
        }
        ctx.stroke();
      }

      // Draw vertical grid lines with distortion
      for (let x = 0; x <= width + gridSpacing; x += gridSpacing) {
        ctx.beginPath();
        let first = true;
        for (let y = 0; y <= height; y += 5) {
          const distorted = gravitationalDistort(x, y, centerX, centerY, centerMass);

          const final = mouse.active
            ? gravitationalDistort(distorted.x, distorted.y, mouse.x, mouse.y, 150)
            : distorted;

          if (first) {
            ctx.moveTo(final.x, final.y);
            first = false;
          } else {
            ctx.lineTo(final.x, final.y);
          }
        }
        ctx.stroke();
      }

      // Grid intersection points (bright spots)
      ctx.font = `8px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let y = 0; y <= height + gridSpacing; y += gridSpacing) {
        for (let x = 0; x <= width + gridSpacing; x += gridSpacing) {
          const distorted = gravitationalDistort(x, y, centerX, centerY, centerMass);
          const final = mouse.active
            ? gravitationalDistort(distorted.x, distorted.y, mouse.x, mouse.y, 150)
            : distorted;

          const dFromCenter = dist(final.x, final.y, centerX, centerY);
          const brightness = clamp(1 - dFromCenter / 400, 0, 1);

          if (brightness < 0.05) continue;

          const n = noise2D(x * 0.02 + time, y * 0.02);
          const char = brightness > 0.6 ? "+" : brightness > 0.3 ? "·" : ".";

          ctx.fillStyle = `rgba(42, 95, 255, ${brightness * 0.6 + n * 0.2})`;
          ctx.fillText(char, final.x, final.y);
        }
      }

      // Central singularity glow
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
      glow.addColorStop(0, "rgba(42, 95, 255, 0.15)");
      glow.addColorStop(0.5, "rgba(42, 95, 255, 0.05)");
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
