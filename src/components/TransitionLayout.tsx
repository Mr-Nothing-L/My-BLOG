import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

interface TransitionLayoutProps {
  children: ReactNode;
}

export default function TransitionLayout({ children }: TransitionLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const pendingRef = useRef<{ path: string; dir: 'next' | 'prev' } | null>(null);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const drawCollapse = (
    ctx: CanvasRenderingContext2D,
    progress: number,
    width: number,
    height: number,
    reverse: boolean,
    direction: 'next' | 'prev'
  ) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    const cols = 50;
    const rows = 35;
    const cellW = width / cols;
    const cellH = height / rows;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.hypot(width, height) / 2;
    const chars = " .·:░▒▓█▓▒░:·. ";
    const t = reverse ? 1 - progress : progress;
    const slideDir = direction === 'next' ? -1 : 1;

    ctx.font = `${cellH * 0.65}px "IBM Plex Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * cellW + cellW / 2;
        const oy = r * cellH + cellH / 2;
        const dx = ox - centerX;
        const dy = oy - centerY;
        const distVal = Math.hypot(dx, dy);
        const normDist = distVal / maxDist;

        const delay = normDist * 0.2;
        let localT = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));

        let drawX: number, drawY: number, opacity: number;

        if (!reverse) {
          const eased = 1 - Math.pow(1 - localT, 3);
          drawX = centerX + dx * (1 - eased);
          drawY = centerY + dy * (1 - eased);
          // Slide offset increases with progress
          const slideOffset = slideDir * height * 0.15 * progress;
          drawY += slideOffset;
          opacity = 1 - eased;
        } else {
          const eased = localT * localT * (3 - 2 * localT);
          drawX = centerX + dx * eased;
          drawY = centerY + dy * eased;
          // Start from offset, return to normal
          const slideOffset = slideDir * height * 0.15 * (1 - progress);
          drawY += slideOffset;
          opacity = eased;
        }

        if (opacity <= 0.02) continue;

        const spiral = Math.atan2(dy, dx) + t * Math.PI * 3;
        const charIdx = Math.floor(
          ((normDist + Math.sin(spiral) * 0.1) * 0.5 + 0.5) * (chars.length - 1)
        );
        const char = chars[Math.max(0, Math.min(chars.length - 1, charIdx))];

        const g = Math.floor(lerp(229, 80, normDist));
        const b = Math.floor(lerp(255, 120, normDist));

        ctx.fillStyle = `rgba(0, ${g}, ${b}, ${Math.min(1, opacity)})`;
        ctx.fillText(char, drawX, drawY);
      }
    }

    const glowR = reverse ? t * 250 : (1 - t) * 250;
    if (glowR > 1) {
      const grad = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, glowR
      );
      grad.addColorStop(0, `rgba(0, 229, 255, ${0.25 * (reverse ? t : 1 - t)})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  };

  const runTransition = useCallback(
    async (toPath: string, direction: 'next' | 'prev' = 'next') => {
      if (isRunningRef.current) {
        pendingRef.current = { path: toPath, dir: direction };
        return;
      }
      isRunningRef.current = true;

      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      const content = contentRef.current;

      if (!canvas || !overlay) {
        navigate(toPath);
        isRunningRef.current = false;
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        navigate(toPath);
        isRunningRef.current = false;
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Slide current content out
      if (content) {
        gsap.to(content, {
          y: direction === 'next' ? '-15vh' : '15vh',
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.4,
          ease: 'power2.in',
        });
      }

      overlay.style.pointerEvents = "auto";
      overlay.style.opacity = "1";

      // Phase 1: collapse
      await gsap.to(
        { p: 0 },
        {
          p: 1,
          duration: 0.5,
          ease: "power3.in",
          onUpdate: function () {
            drawCollapse(ctx, this.targets()[0].p, w, h, false, direction);
          },
        }
      );

      // Navigate
      navigate(toPath);
      window.scrollTo(0, 0);

      // Wait for React to render new route
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      // Prepare new content: start from offset position
      if (content) {
        gsap.set(content, {
          y: direction === 'next' ? '25vh' : '-25vh',
          opacity: 0,
          filter: 'blur(8px)',
        });
      }

      // Phase 2: expand
      await gsap.to(
        { p: 0 },
        {
          p: 1,
          duration: 0.7,
          ease: "power2.out",
          onUpdate: function () {
            drawCollapse(ctx, this.targets()[0].p, w, h, true, direction);
          },
        }
      );

      // Slide new content in
      if (content) {
        await gsap.to(content, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      isRunningRef.current = false;

      if (pendingRef.current) {
        const { path, dir } = pendingRef.current;
        pendingRef.current = null;
        runTransition(path, dir);
      }
    },
    [navigate]
  );

  useEffect(() => {
    (window as any).__transitionTo = (path: string, direction: 'next' | 'prev' = 'next') => {
      if (path === location.pathname) return;
      runTransition(path, direction);
    };
  }, [location.pathname, runTransition]);

  return (
    <>
      <div
        ref={overlayRef}
        className="transition-overlay"
        style={{ opacity: 0 }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  );
}

export function transitionTo(path: string, direction: 'next' | 'prev' = 'next') {
  const fn = (window as any).__transitionTo;
  if (fn) {
    fn(path, direction);
  } else {
    window.location.href = path;
  }
}
