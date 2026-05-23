import { getPosts, getPostBySlug } from "@/lib/notion";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <AnimatedSection>
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-accent-light transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to home
        </Link>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent-light border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <time className="text-sm text-gray-500 block mb-12">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </AnimatedSection>

      <AnimatedSection delay={0.4}>
        <div className="prose prose-invert prose-lg max-w-none">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h2
                  key={index}
                  className="text-2xl font-bold text-white mt-8 mb-4"
                >
                  {paragraph.replace("# ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h3
                  key={index}
                  className="text-xl font-semibold text-white mt-6 mb-3"
                >
                  {paragraph.replace("## ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <li key={index} className="text-gray-300 ml-4 mb-1">
                  {paragraph.replace("- ", "")}
                </li>
              );
            }
            if (paragraph.trim() === "") {
              return <div key={index} className="h-4" />;
            }
            return (
              <p key={index} className="text-gray-300 leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.5}>
        <div className="mt-16 pt-8 border-t border-white/5">
          <Link
            href="/"
            className="inline-flex items-center text-accent hover:text-accent-light transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Read more articles
          </Link>
        </div>
      </AnimatedSection>
    </article>
  );
}
