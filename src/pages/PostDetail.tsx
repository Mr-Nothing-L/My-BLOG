import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataAbyss from "../canvases/DataAbyss";
import AsciiText from "../components/AsciiText";
import { transitionTo } from "../components/TransitionLayout";

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data: Post[]) => {
        const found = data.find((p) => p.slug === slug);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DataAbyss />
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
            position: "relative",
            zIndex: 10,
          }}
        >
          数据流同步中...
        </p>
      </section>
    );
  }

  if (!post) {
    return (
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#000",
        }}
      >
        <DataAbyss />
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
            未找到该文章
          </p>
          <button
            onClick={() => transitionTo("/articles")}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: "#00e5ff",
              background: "transparent",
              border: "1px solid rgba(0,229,255,0.3)",
              padding: "8px 20px",
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ← 返回文章列表
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
      <DataAbyss />

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
          onClick={() => transitionTo("/articles")}
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
            e.currentTarget.style.color = "#00e5ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          }}
        >
          ← 返回文章列表
        </button>

        {post.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(0,229,255,0.6)",
                  border: "1px solid rgba(0,229,255,0.2)",
                  padding: "2px 8px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ margin: "0 0 16px 0" }}>
          <AsciiText text={post.title} fontSize={36} color="#00e5ff" />
        </div>

        {post.date && (
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 48px 0",
              letterSpacing: "0.05em",
            }}
          >
            {new Date(post.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "14px",
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.75)",
            }}
            dangerouslySetInnerHTML={{
              __html: post.content
                .split("\n")
                .map((p) =>
                  p.trim()
                    ? `<p style="margin: 0 0 1.5em 0;">${p}</p>`
                    : ""
                )
                .join(""),
            }}
          />
        </div>
      </div>
    </section>
  );
}
