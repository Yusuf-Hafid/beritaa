export type CategorySlug =
  | 'nasional'
  | 'internasional'
  | 'ekonomi'
  | 'olahraga'
  | 'teknologi'
  | 'hiburan'
  | 'gaya-hidup'
  | 'hukum';

export interface Category {
  slug: CategorySlug;
  name: string;
  color: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: ArticleContent[];
  category: CategorySlug;
  author: Author;
  publishedAt: string;
  readTime: number;
  thumbnailUrl: string;
  thumbnailAlt: string;
  tags: string[];
  isBreaking: boolean;
  isFeatured: boolean;
}

export interface ArticleContent {
  type: 'paragraph' | 'heading' | 'quote' | 'image';
  text?: string;
  caption?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface SearchIndexItem {
  slug: string;
  title: string;
  category: CategorySlug;
  publishedAt: string;
  thumbnailUrl: string;
}

export interface NavItem {
  label: string;
  href: string;
  megaMenu?: {
    title: string;
    description: string;
  };
}

export interface SubTopik {
  label: string;
  href: string;
}
