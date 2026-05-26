import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import EventHorizon from "../canvases/EventHorizon";
import AsciiText from "../components/AsciiText";
import { aboutConfig } from "../config";

gsap.registerPlugin(ScrollTrigger);

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && <span className="terminal-cursor" />}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll(".reveal");
    gsap.fromTo(
      elements,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: { each: 0.12, from: "start" },
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: sectionRef, dependencies: [] });

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
      <EventHorizon />

      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px 40px",
          maxWidth: "720px",
          pointerEvents: "none",
        }}
      >
        <div className="reveal" style={{ margin: "0 0 48px 0" }}>
          <AsciiText text="视界" fontSize={36} color="#ff2a2a" />
        </div>

        <div className="reveal" style={{ marginBottom: "48px" }}>
          {aboutConfig.bio.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.75)",
                margin: "0 0 16px 0",
              }}
            >
              <TypewriterText text={paragraph} delay={i * 800} />
            </p>
          ))}
        </div>

        <div className="reveal" style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 16px 0",
            }}
          >
            技术栈 / TECH STACK
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {aboutConfig.skills.map((skill) => (
              <span
                key={skill}
                className="tech-tag"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal">
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 24px 0",
            }}
          >
            时间线 / TIMELINE
          </p>
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                bottom: "0",
                width: "1px",
                background:
                  "linear-gradient(to bottom, #00e5ff, transparent)",
              }}
            />
            {aboutConfig.timeline.map((event, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  marginBottom: i < aboutConfig.timeline.length - 1 ? "24px" : 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "-28px",
                    top: "4px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#00e5ff",
                    boxShadow: "0 0 12px #00e5ff",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px",
                    color: "#00e5ff",
                    margin: "0 0 4px 0",
                    letterSpacing: "0.05em",
                  }}
                >
                  {event.year}
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "14px",
                    color: "#fff",
                    margin: "0 0 4px 0",
                    fontWeight: 400,
                  }}
                >
                  {event.title}
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
