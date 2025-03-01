
export type WordPressPostStatus = "draft" | "publish" | "private" | "pending" | "future";

export interface WordPressAccount {
  id: string;
  siteUrl: string;
  username: string;
  password: string;
  seoKeywords?: string;
}

export interface WordPressPost {
  id: string;
  title: string;
  content: string;
  status: WordPressPostStatus;
  date: string;
  modified: string;
  excerpt?: string;
  featuredImage?: string;
  link?: string;
}

export interface PublishSettings {
  title: string;
  status: WordPressPostStatus;
  scheduledDate?: string; // ISO date string for scheduled posts
  categoryIds?: string[];
  tagIds?: string[];
  featuredImageId?: string;
}

export interface WordPressTemplate {
  id: string;
  title: string;
  content: string;
  accountId: string;
  createdAt: string;
  description?: string;
}

export interface WordPressMedia {
  id: string;
  title: string;
  url: string;
  alt?: string;
  date: string;
  type: string;
  accountId: string;
}
