import { useEffect, useState } from 'react';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/posts.json')
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

  const hasContent = posts.length > 0 || loading;

  if (!hasContent) {
    return null;
  }

  return (
    <section
      id="articles"
      style={{
        position: 'relative',
        width: '100%',
        background: '#000',
        padding: '120px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Label */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
            margin: '0 0 48px 0',
          }}
        >
          文章 / ARTICLES
        </p>

        {/* Section Title */}
        <h2
          style={{
            fontFamily: "'Geist Pixel', monospace",
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 400,
            lineHeight: 0.96,
            color: '#fff',
            textTransform: 'uppercase',
            margin: '0 0 64px 0',
            textWrap: 'balance',
            letterSpacing: '0.015em',
          }}
        >
          观测记录
        </h2>

        {/* Posts List */}
        {loading ? (
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            加载中...
          </p>
        ) : posts.length === 0 ? (
          <div
            style={{
              padding: '60px 0',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              暂无已发布文章。在 Notion 数据库中添加文章并勾选 Published 后，重新部署即可显示。
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            {posts.map((post) => (
              <article
                key={post.id}
                style={{
                  background: '#000',
                  padding: '32px',
                  transition: 'background 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#000';
                }}
              >
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.35)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          padding: '3px 10px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                {post.date && (
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.35)',
                      margin: '0 0 12px 0',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {new Date(post.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Geist Pixel', monospace",
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: '#fff',
                    margin: '0 0 12px 0',
                    textWrap: 'balance',
                  }}
                >
                  {post.title || '无标题'}
                </h3>

                {/* Summary */}
                {post.summary && (
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '12px',
                      lineHeight: 1.8,
                      color: 'rgba(255,255,255,0.45)',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.summary}
                  </p>
                )}

                {/* Read more */}
                <div
                  style={{
                    marginTop: '20px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  <span style={{ transition: 'color 0.2s' }}>
                    阅读更多 →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
