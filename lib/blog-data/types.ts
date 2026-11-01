export interface BlogPostFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostHowToStep {
  name: string;
  text: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  date: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  category: 'Pinterest' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Tutorials' | 'General';
  author: {
    name: string;
    role: string;
    avatar: string;
    url: string;
  };
  coverImage: string;
  coverImageAlt: string;
  toolSlug: string;
  toolName: string;
  content: string;
  tags: string[];
  faq: BlogPostFaqItem[];
  steps: BlogPostHowToStep[];
}
