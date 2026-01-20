export enum Sentiment {
  POSITIVE = 'Positive',
  NEUTRAL = 'Neutral',
  NEGATIVE = 'Negative',
}

export enum Category {
  BUG = 'Bug Report',
  FEATURE = 'Feature Request',
  PRAISE = 'Praise',
  GENERAL = 'General Feedback',
}

export enum Source {
  REDDIT = 'Reddit',
  TWITTER = 'Twitter',
  PRODUCT_HUNT = 'Product Hunt',
  HACKER_NEWS = 'Hacker News',
}

export interface Review {
  id: string;
  source: Source;
  author: string;
  content: string;
  sentiment: Sentiment;
  category: Category;
  likes: number;
  date: string;
}

export interface FeatureSuggestion {
  id: string;
  title: string;
  description: string;
  impactScore: number; // 1-10
  effortScore: number; // 1-10
  priority: 'High' | 'Medium' | 'Low';
  relatedReviewIds: string[];
}

export interface ProductAnalysis {
  productName: string;
  summary: string;
  reviews: Review[];
  features: FeatureSuggestion[];
  sentimentStats: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export type AppState = 'LANDING' | 'SCRAPING' | 'DASHBOARD' | 'ERROR';
