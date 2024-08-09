export type Post = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags?: string[];
};