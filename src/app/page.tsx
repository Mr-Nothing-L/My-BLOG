import { getPosts } from "@/lib/notion";
import PostCard from "@/components/PostCard";
import AnimatedSection from "@/components/AnimatedSection";
export const revalidate = 60;

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <AnimatedSection>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-accent-light to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              My Blog
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Writing about technology, design, and everything in between.
            Powered by{" "}
            <span className="text-accent-light">Next.js</span> and{" "}
            <span className="text-accent-light">Notion</span>.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-accent/50 to-transparent" />
          </div>
        </AnimatedSection>
      </section>

      {/* Posts Grid */}
      <section className="pb-12">
        {posts.length === 0 ? (
          <AnimatedSection>
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No published posts yet.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Add some articles in your Notion database and mark them as
                published.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
