import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SpacetimeWarp from "../canvases/SpacetimeWarp";
import AsciiText from "../components/AsciiText";
import { worksConfig } from "../config";

gsap.registerPlugin(ScrollTrigger);

export default function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".work-item");
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 50, scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: { each: 0.08, from: "start" },
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: sectionRef, dependencies: [] });

  const handleWorkEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      background: "rgba(255,255,255,0.04)",
      scale: 1.01,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleWorkLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      background: "rgba(0,0,0,0.7)",
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

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
      <SpacetimeWarp />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "120px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ margin: "0 0 48px 0" }}>
          <AsciiText text="透镜" fontSize={36} color="#00e5ff" />
        </div>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {worksConfig.items.map((work, index) => (
            <div
              key={index}
              className="work-item"
              onMouseEnter={(e) => {
                setHoveredIndex(index);
                handleWorkEnter(e);
              }}
              onMouseLeave={(e) => {
                setHoveredIndex(null);
                handleWorkLeave(e);
              }}
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
                padding: "32px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                willChange: "transform",
                visibility: "hidden",
              }}
            >
              {/* Placeholder image area */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  background:
                    hoveredIndex === index
                      ? "rgba(0,229,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderColor:
                    hoveredIndex === index
                      ? "rgba(0,229,255,0.3)"
                      : "rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {work.category}
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                  margin: "0 0 8px 0",
                  letterSpacing: "0.05em",
                }}
              >
                {work.year} · {work.category}
              </p>

              <p
                style={{
                  fontFamily: "'Geist Pixel', monospace",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#fff",
                  margin: 0,
                  textWrap: "balance",
                }}
              >
                {work.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
