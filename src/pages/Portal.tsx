import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SingularityCore from "../canvases/SingularityCore";
import AsciiText from "../components/AsciiText";
import { heroConfig } from "../config";

export default function Portal() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    if (eyebrowRef.current) {
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        "-=0.4"
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }
    if (leadRef.current) {
      tl.fromTo(
        leadRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.7, y: 0, duration: 1, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
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
            opacity: 0,
          }}
        >
          {heroConfig.eyebrow}
        </p>

        <div ref={titleRef} style={{ opacity: 0, margin: "0 0 16px 0" }}>
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
            opacity: 0,
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
            opacity: 0,
          }}
        >
          {heroConfig.leadText}
        </p>
      </div>
    </section>
  );
}
