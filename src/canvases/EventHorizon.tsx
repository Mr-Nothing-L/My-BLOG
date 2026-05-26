import { useEffect, useRef } from "react";
import { noise3D, clamp } from "./shared/math";

const DISK_CHARS = " ·∙:⋆✦✧✶✷✸✹✺·∙:⋆";

interface JetParticle {
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function EventHorizon() {
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

    // Particle pools for jets
    const topJets: JetParticle[] = [];
    const bottomJets: JetParticle[] = [];

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
      const cellH = cellW * 1.12;
      rows = Math.ceil(height / cellH);
    };

    const spawnJetParticle = (centerX: number, centerY: number, isTop: boolean): JetParticle => {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.min(width, height) * 0.015;
      return {
        x: centerX + Math.cos(angle) * spread * Math.random(),
        y: centerY + (isTop ? -1 : 1) * Math.random() * 3,
        vy: (isTop ? -1 : 1) * (1.5 + Math.random() * 2.5),
        life: 0,
        maxLife: 40 + Math.random() * 60,
        size: 1 + Math.random() * 2,
      };
    };

    const updateJets = (jets: JetParticle[], centerX: number, centerY: number, isTop: boolean) => {
      // Spawn new particles
      const spawnRate = 3;
      for (let i = 0; i < spawnRate; i++) {
        jets.push(spawnJetParticle(centerX, centerY, isTop));
      }

      // Update existing
      for (let i = jets.length - 1; i >= 0; i--) {
        const p = jets[i];
        p.y += p.vy;
        p.life++;

        // Slight horizontal drift
        p.x += Math.sin(p.life * 0.05 + p.y * 0.01) * 0.3;

        if (p.life >= p.maxLife) {
          jets.splice(i, 1);
        }
      }

      // Cap pool size
      if (jets.length > 200) {
        jets.splice(0, jets.length - 200);
      }
    };

    const drawJets = (jets: JetParticle[]) => {
      for (const p of jets) {
        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.8;
        const size = p.size * (1 + progress * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);

      time += 0.006;

      const cellW = width / cols;
      const cellH = cellW * 1.12;
      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const a = Math.min(width, height) * 0.38;
      const b = a * 0.18;
      const tiltAngle = 0.15;

      ctx.font = `${cellH * 0.7}px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Multi-layer accretion disk: 3 concentric rings with different rotation speeds
      const rings = [
        { innerR: 0.15, outerR: 0.45, speed: 2.0, label: "inner" },
        { innerR: 0.45, outerR: 0.75, speed: 1.2, label: "mid" },
        { innerR: 0.75, outerR: 1.15, speed: 0.6, label: "outer" },
      ];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW + cellW / 2;
          const y = r * cellH + cellH / 2;

          // Transform to disk coordinates (tilted ellipse)
          const dx = x - centerX;
          const dy = y - centerY;
          const rotX = dx * Math.cos(-tiltAngle) - dy * Math.sin(-tiltAngle);
          const rotY = dx * Math.sin(-tiltAngle) + dy * Math.cos(-tiltAngle);

          // Distance from ellipse center
          const ellipseDist = Math.sqrt((rotX / a) ** 2 + (rotY / b) ** 2);
          if (ellipseDist > 1.4) continue;

          // Orbit position
          const orbitAngle = Math.atan2(rotY, rotX);

          // Determine which ring this cell belongs to
          let ringSpeed = 1.0;
          let ringIndex = -1;
          for (let i = 0; i < rings.length; i++) {
            if (ellipseDist >= rings[i].innerR && ellipseDist < rings[i].outerR) {
              ringSpeed = rings[i].speed;
              ringIndex = i;
              break;
            }
          }

          // Event horizon (very center)
          if (ellipseDist < 0.15) {
            ringIndex = -2;
          }

          // Orbit speed: inner ring fastest, outer ring slowest
          const orbitSpeed = ringSpeed / (0.5 + ellipseDist * 0.8);
          void orbitSpeed;

          // Density: thicker near the disk plane
          const planeDist = Math.abs(rotY) / (b * 0.3);
          let density = Math.exp(-planeDist * planeDist);

          // Ring gap density modulation
          if (ringIndex >= 0) {
            const ringCenter = (rings[ringIndex].innerR + rings[ringIndex].outerR) / 2;
            const ringWidth = rings[ringIndex].outerR - rings[ringIndex].innerR;
            const distFromCenter = Math.abs(ellipseDist - ringCenter) / (ringWidth * 0.5);
            density *= 1.0 - distFromCenter * 0.3;
          }

          // Doppler beaming: approaching side (rotX > 0, moving toward viewer) brighter
          if (rotX > 0 && ellipseDist < 0.9) {
            density *= 1.3;
          }

          // Dynamic noise texture using noise3D for time-varying patterns
          const noiseT = time * ringSpeed;
          const n = noise3D(orbitAngle * 3 + noiseT, ellipseDist * 5, time * 0.5);
          density *= (0.6 + n * 0.4);

          if (density < 0.08) continue;

          // Character selection
          const charIdx = clamp(
            Math.floor(density * (DISK_CHARS.length - 1)),
            0,
            DISK_CHARS.length - 1
          );
          const char = DISK_CHARS[charIdx];

          // Color with Doppler redshift/blueshift
          let r_val: number, g_val: number, b_val: number;

          // Doppler shift factor: approaching side (rotX > 0) = blue, receding (rotX < 0) = red
          const dopplerStrength = 0.35;
          const doppler = rotX > 0 ? dopplerStrength : -dopplerStrength;

          if (ellipseDist < 0.15) {
            // Event horizon: intense red-white
            const t = ellipseDist / 0.15;
            r_val = Math.floor(255);
            g_val = Math.floor(t * 80);
            b_val = Math.floor(t * 30);
          } else if (ellipseDist < 0.45) {
            // Inner disk: bright cyan-white with Doppler
            const t = (ellipseDist - 0.15) / 0.3;
            r_val = Math.floor(255 - t * 50 + doppler * 80);
            g_val = Math.floor(255 - t * 20 + Math.abs(doppler) * 30);
            b_val = Math.floor(255 + doppler * 60);
          } else if (ellipseDist < 0.75) {
            // Mid disk: cyan-blue with Doppler
            const t = (ellipseDist - 0.45) / 0.3;
            r_val = Math.floor(200 * (1 - t) + doppler * 100);
            g_val = Math.floor(230 * (1 - t) + 80 * t + Math.abs(doppler) * 40);
            b_val = Math.floor(255 * (1 - t) + 200 * t + doppler * 80);
          } else {
            // Outer disk: dim blue with Doppler
            const t = (ellipseDist - 0.75) / 0.65;
            r_val = Math.floor(80 * (1 - t) + doppler * 120);
            g_val = Math.floor(150 * (1 - t) + 60 * t + Math.abs(doppler) * 30);
            b_val = Math.floor(220 * (1 - t) + 120 * t + doppler * 60);
          }

          // Clamp color values
          r_val = clamp(r_val, 0, 255);
          g_val = clamp(g_val, 0, 255);
          b_val = clamp(b_val, 0, 255);

          const opacity = clamp(density * 0.85, 0.1, 1);

          ctx.fillStyle = `rgba(${r_val}, ${g_val}, ${b_val}, ${opacity})`;
          ctx.fillText(char, x, y);
        }
      }

      // Update and draw particle jets
      updateJets(topJets, centerX, centerY - b * 0.5, true);
      updateJets(bottomJets, centerX, centerY + b * 0.5, false);
      drawJets(topJets);
      drawJets(bottomJets);

      // Floating information particles (skills as drifting text)
      const particles = [
        { text: "Python", x: 0.15, y: 0.25, speed: 0.3, color: "#ff9500" },
        { text: "PyTorch", x: 0.75, y: 0.2, speed: 0.25, color: "#2a5fff" },
        { text: "OpenCV", x: 0.2, y: 0.7, speed: 0.35, color: "#00e5ff" },
        { text: "CUDA", x: 0.8, y: 0.75, speed: 0.2, color: "#a855f7" },
        { text: "CV", x: 0.1, y: 0.5, speed: 0.4, color: "#ff2a2a" },
        { text: "Deep Learning", x: 0.85, y: 0.5, speed: 0.28, color: "#22c55e" },
      ];

      for (const p of particles) {
        const px = width * p.x + Math.sin(time * p.speed + p.x * 10) * 30;
        const py = height * p.y + Math.cos(time * p.speed * 0.7 + p.y * 10) * 20;
        const pulse = 0.6 + Math.sin(time * 2 + p.x * 5) * 0.4;

        ctx.font = `10px "IBM Plex Mono", monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulse * 0.7;
        ctx.fillText(p.text, px, py);
        ctx.globalAlpha = 1;
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
