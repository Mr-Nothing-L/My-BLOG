"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/posts/${post.slug}`} className="group block">
        <div className="relative p-6 rounded-2xl bg-dark-card border border-white/5 hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent-light border border-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-light transition-colors duration-300">
            {post.title}
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.summary}
          </p>

          <div className="flex items-center justify-between">
            <time className="text-xs text-gray-500">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Read more &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
