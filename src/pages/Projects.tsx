import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GravitationalGrid from "../canvases/GravitationalGrid";
import AsciiText from "../components/AsciiText";
import { projectsConfig } from "../config";
import { transitionTo } from "../components/TransitionLayout";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".project-card-wrapper");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
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
      <GravitationalGrid />

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
          <AsciiText text="吸积盘" fontSize={36} color="#2a5fff" />
        </div>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {projectsConfig.items.map((project) => (
            <div
              key={project.slug}
              className="project-card-wrapper"
              onClick={() => transitionTo(`/project/${project.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="project-card"
                style={{
                  padding: "32px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = project.color;
                  el.style.boxShadow = `0 0 20px ${project.color}20`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.1)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Geist Pixel', monospace",
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "#fff",
                      margin: 0,
                      textWrap: "balance",
                    }}
                  >
                    {project.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      color: project.color,
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                      marginLeft: "12px",
                    }}
                  >
                    {project.code}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                    margin: "0 0 12px 0",
                    letterSpacing: "0.05em",
                  }}
                >
                  {project.year} · {project.status}
                </p>

                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.55)",
                    margin: "0 0 20px 0",
                    flex: 1,
                  }}
                >
                  {project.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "16px",
                  }}
                >
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        padding: "2px 8px",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: project.color,
                  }}
                >
                  查看详情 →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
