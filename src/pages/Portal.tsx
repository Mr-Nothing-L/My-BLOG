import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SingularityCore from "../canvases/SingularityCore";
import AsciiText from "../components/AsciiText";
import { heroConfig } from "../config";

export default function Portal() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: { duration: 0.8, ease: "power2.out" },
    });

    if (eyebrowRef.current) {
      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0 },
        0
      );
    }
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.2 },
        "-=0.4"
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0 },
        "-=0.6"
      );
    }
    if (leadRef.current) {
      tl.fromTo(
        leadRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 0.7, y: 0, duration: 1 },
        "-=0.4"
      );
    }
    if (scrollIndicatorRef.current) {
      tl.fromTo(
        scrollIndicatorRef.current,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        "+=0.3"
      );
    }
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !glowRef.current) return;

    const section = sectionRef.current;
    const glow = glowRef.current;

    const xTo = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX - 150);
      yTo(e.clientY - 150);
    };

    section.addEventListener("mousemove", handleMove);
    return () => {
      section.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0,
        }}
      />

      <SingularityCore />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "40px",
          paddingBottom: "80px",
          pointerEvents: "none",
        }}
      >
        <p
          ref={eyebrowRef}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.42)",
            margin: "0 0 16px 0",
            visibility: "hidden",
          }}
        >
          {heroConfig.eyebrow}
        </p>

        <div ref={titleRef} style={{ visibility: "hidden", margin: "0 0 16px 0" }}>
          <AsciiText text="MR.L\n信息奇点" fontSize={72} color="#ffffff" />
        </div>

        <p
          ref={subtitleRef}
          className="hero-subtitle"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            color: "#00e5ff",
            margin: "0 0 24px 0",
            visibility: "hidden",
          }}
        >
          {heroConfig.subtitle}
        </p>

        <p
          ref={leadRef}
          className="hero-lead"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: 1.9,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            maxWidth: "48ch",
            visibility: "hidden",
          }}
        >
          {heroConfig.leadText}
        </p>
      </div>

      <div
        ref={scrollIndicatorRef}
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "linear-gradient(to bottom, rgba(0,229,255,0.4), transparent)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
