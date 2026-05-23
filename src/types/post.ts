export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary: string;
  published: boolean;
  content: string;
}
