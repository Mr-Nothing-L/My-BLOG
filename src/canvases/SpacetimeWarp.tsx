import { useEffect, useRef } from "react";
import { clamp } from "./shared/math";

interface Star {
  x: number;
  y: number;
  z: number;
  brightness: number;
  size: number;
}

export default function SpacetimeWarp() {
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
    let stars: Star[] = [];
    const numStars = 300;

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

      // Reinitialize stars
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * width * 2,
          y: (Math.random() - 0.5) * height * 2,
          z: Math.random() * 1000 + 100,
          brightness: Math.random(),
          size: Math.random() * 2 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);

      time += 0.008;

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Draw wormhole tunnel effect
      const tunnelRings = 12;
      for (let i = 0; i < tunnelRings; i++) {
        const t = (i / tunnelRings + time * 0.1) % 1;
        const radius = t * Math.min(width, height) * 0.45;
        const opacity = (1 - t) * 0.15;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw stars with lens distortion
      for (const star of stars) {
        // Move stars toward viewer (warp speed)
        star.z -= 2;
        if (star.z <= 10) {
          star.z = 1100;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        // Project 3D to 2D
        const scale = 500 / star.z;
        const sx = centerX + star.x * scale;
        const sy = centerY + star.y * scale;

        // Skip if off screen
        if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) continue;

        // Lens distortion: stars near center are stretched
        const dx = sx - centerX;
        const dy = sy - centerY;
        const d = Math.hypot(dx, dy);
        const lensStrength = Math.exp(-d * 0.005) * 0.3;

        // Trail effect for fast-moving stars
        const trailLen = (1100 - star.z) / 1100 * 40 * scale;
        const trailX = centerX + star.x * (500 / (star.z + 30));
        const trailY = centerY + star.y * (500 / (star.z + 30));

        // Star color based on brightness
        const r = Math.floor(200 + star.brightness * 55);
        const g = Math.floor(200 + star.brightness * 55);
        const b = 255;
        const alpha = clamp((1 - star.z / 1100) * star.brightness, 0.1, 1);

        // Draw star trail
        if (trailLen > 2) {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(trailX, trailY);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`;
          ctx.lineWidth = star.size * scale * 0.5;
          ctx.stroke();
        }

        // Draw star point
        const size = star.size * scale * (1 + lensStrength * 3);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fill();
      }

      // Central wormhole glow
      const wormholeGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.min(width, height) * 0.2
      );
      wormholeGlow.addColorStop(0, "rgba(0, 229, 255, 0.08)");
      wormholeGlow.addColorStop(0.5, "rgba(0, 100, 200, 0.04)");
      wormholeGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = wormholeGlow;
      ctx.fillRect(0, 0, width, height);

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
