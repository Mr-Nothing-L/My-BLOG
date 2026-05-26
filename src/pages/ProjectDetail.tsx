import { useMemo } from "react";
import { useParams } from "react-router-dom";
import GravitationalGrid from "../canvases/GravitationalGrid";
import AsciiText from "../components/AsciiText";
import { projectsConfig } from "../config";
import { transitionTo } from "../components/TransitionLayout";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const project = useMemo(
    () => projectsConfig.items.find((p) => p.slug === slug) ?? null,
    [slug]
  );

  if (!project) {
    return (
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#000",
        }}
      >
        <GravitationalGrid />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "120px 40px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "24px",
            }}
          >
            未找到该项目
          </p>
          <button
            onClick={() => transitionTo("/projects")}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: "#2a5fff",
              background: "transparent",
              border: "1px solid rgba(42,95,255,0.3)",
              padding: "8px 20px",
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ← 返回项目列表
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      <GravitationalGrid />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "120px 40px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => transitionTo("/projects")}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "48px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = project.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          }}
        >
          ← 返回项目列表
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ margin: 0 }}>
            <AsciiText text={project.name} fontSize={42} color={project.color} />
          </div>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: project.color,
              letterSpacing: "0.1em",
              flexShrink: 0,
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
            margin: "0 0 32px 0",
            letterSpacing: "0.05em",
          }}
        >
          {project.year} · {project.status}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "32px",
          }}
        >
          {project.techStack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: project.color,
                border: `1px solid ${project.color}40`,
                padding: "3px 10px",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "32px",
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "14px",
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.75)",
              margin: "0 0 32px 0",
            }}
          >
            {project.description}
          </p>
        </div>

        {project.github && (
          <div style={{ marginTop: "32px" }}>
            <a
              href={`https://github.com/${project.github}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: project.color,
                textDecoration: "none",
                border: `1px solid ${project.color}40`,
                padding: "10px 24px",
                display: "inline-block",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${project.color}15`;
                e.currentTarget.style.borderColor = project.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = `${project.color}40`;
              }}
            >
              查看 GitHub →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
