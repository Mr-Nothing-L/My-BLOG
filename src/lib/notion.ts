import { Client } from "@notionhq/client";
import { Post } from "@/types/post";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

const mockPosts: Post[] = [
  {
    id: "mock-1",
    title: "Hello, World! Welcome to My Blog",
    slug: "hello-world",
    date: "2025-05-20",
    tags: ["Welcome", "Blog"],
    summary:
      "This is the first post on my new blog. Built with Next.js and Notion, featuring a sleek dark theme with particle animations.",
    published: true,
    content: `Welcome to my blog!

This is a sample post to show you how the blog looks and works.

# Features

- Dark theme with particle background
- Smooth scroll animations
- Notion CMS integration
- Responsive design

# How to Add Posts

1. Open your Notion database
2. Add a new row with your post content
3. Mark it as Published
4. The post will appear here automatically

Enjoy writing!`,
  },
  {
    id: "mock-2",
    title: "Building with Next.js and Notion",
    slug: "nextjs-notion",
    date: "2025-05-18",
    tags: ["Next.js", "Notion", "Tutorial"],
    summary:
      "A guide on how to build a modern blog using Next.js 14, Tailwind CSS, and Notion as a CMS. Learn the best practices and tips.",
    published: true,
    content: `Next.js and Notion make a powerful combination for building blogs.

## Why Next.js?

Next.js provides server-side rendering, static generation, and a great developer experience.

## Why Notion?

Notion is a flexible, user-friendly content management system that's free for personal use.

## Getting Started

Install the Notion client and start querying your database.

Happy coding!`,
  },
  {
    id: "mock-3",
    title: "The Art of Minimal Design",
    slug: "minimal-design",
    date: "2025-05-15",
    tags: ["Design", "Minimalism"],
    summary:
      "Exploring the principles of minimal design in web development. Less is more when it comes to creating impactful user experiences.",
    published: true,
    content: `Minimal design is about removing the unnecessary.

## Core Principles

- White space is your friend
- Typography matters
- Colors should be intentional
- Animation should serve a purpose

## Conclusion

A well-designed minimal interface can be more powerful than a cluttered one.

Keep it simple.`,
  },
];

function getRichText(property: any): string {
  if (!property) return "";
  if (property.type === "rich_text") {
    return property.rich_text.map((t: any) => t.plain_text).join("");
  }
  if (property.type === "title") {
    return property.title.map((t: any) => t.plain_text).join("");
  }
  return "";
}

function getDate(property: any): string {
  if (!property || property.type !== "date") return "";
  return property.date?.start || "";
}

function getMultiSelect(property: any): string[] {
  if (!property || property.type !== "multi_select") return [];
  return property.multi_select.map((t: any) => t.name);
}

function getCheckbox(property: any): boolean {
  if (!property || property.type !== "checkbox") return false;
  return property.checkbox;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: getRichText(page.properties.Name),
      slug: getRichText(page.properties.Slug),
      date: getDate(page.properties.Date),
      tags: getMultiSelect(page.properties.Tags),
      summary: getRichText(page.properties.Summary),
      published: getCheckbox(page.properties.Published),
      content: getRichText(page.properties.Content),
    }));
  } catch (error) {
    console.warn("Notion API error, using mock data:", error);
    return mockPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0] as any;
    return {
      id: page.id,
      title: getRichText(page.properties.Name),
      slug: getRichText(page.properties.Slug),
      date: getDate(page.properties.Date),
      tags: getMultiSelect(page.properties.Tags),
      summary: getRichText(page.properties.Summary),
      published: getCheckbox(page.properties.Published),
      content: getRichText(page.properties.Content),
    };
  } catch (error) {
    console.warn("Notion API error, using mock data:", error);
    return mockPosts.find((p) => p.slug === slug) || null;
  }
}
