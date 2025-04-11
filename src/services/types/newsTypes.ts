
// Tipos relacionados às notícias

export interface NewsItem {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  origem_busca?: string; // Campo opcional para rastrear a origem da notícia
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsItem[];
}

export interface NewsApiConfig {
  baseUrl: string;
  apiKey: string;
}
