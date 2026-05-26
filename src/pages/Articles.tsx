import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DataAbyss from "../canvases/DataAbyss";
import AsciiText from "../components/AsciiText";
import { articlesConfig } from "../config";
import { transitionTo } from "../components/TransitionLayout";

gsap.registerPlugin(ScrollTrigger);

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

export default function Articles() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  useGSAP(() => {
    if (!gridRef.current || posts.length === 0) return;

    const cards = gridRef.current.querySelectorAll(".article-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: sectionRef, dependencies: [posts] });

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
      <DataAbyss />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "120px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ margin: "0 0 16px 0" }}>
          <AsciiText text="流束" fontSize={36} color="#ff9500" />
        </div>

        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 48px 0",
          }}
        >
          {articlesConfig.subtitle}
        </p>

        {loading ? (
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            数据流同步中...
          </p>
        ) : posts.length === 0 ? (
          <div
            style={{
              padding: "60px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "13px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              暂无已发布文章。在 Notion 数据库中添加文章后重新部署即可显示。
            </p>
          </div>
        ) : (
          <div
            ref={gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {posts.map((post) => (
              <article
                key={post.id}
                className="article-card"
                onClick={() => transitionTo(`/posts/${post.slug}`)}
                style={{
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(4px)",
                  padding: "32px",
                  cursor: "pointer",
                  transition: "background 0.3s, border-color 0.3s",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor =
                    "rgba(0,229,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                {post.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "16px",
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
                          color: "rgba(255,255,255,0.3)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          padding: "2px 8px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {post.date && (
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      margin: "0 0 12px 0",
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

                <h3
                  style={{
                    fontFamily: "'Geist Pixel', monospace",
                    fontSize: "18px",
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: "#fff",
                    margin: "0 0 12px 0",
                    textWrap: "balance",
                  }}
                >
                  {post.title || "无标题"}
                </h3>

                {post.summary && (
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "11px",
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.4)",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.summary}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "20px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(0,229,255,0.6)",
                  }}
                >
                  阅读更多 →
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
