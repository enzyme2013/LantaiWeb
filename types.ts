
export type LanguageVariant = 'zh-hans' | 'zh-hant';

export interface WikiSearchResult {
  title: string;
  pageid: number;
  snippet: string;
  timestamp: string;
}

export interface BookContent {
  title: string;
  content: string;
  pageid: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface BiographyData {
  isPerson: boolean;
  name: string;
  courtesyName?: string;
  years?: string;
  bio?: string;
  historicalSignificance?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  image: string;
  pricePerSqFt: number;
}
