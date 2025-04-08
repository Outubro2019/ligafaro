
// Utilidades para processamento de notícias

import { NewsItem } from '../types/newsTypes';

// Função para ordenar notícias por data (mais recentes primeiro)
export const sortNewsByDate = (news: NewsItem[]): NewsItem[] => {
  return [...news].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA; // Ordem decrescente (mais recentes primeiro)
  });
};

// Função para ordenar notícias por fonte
export const sortNewsBySource = (news: NewsItem[]): NewsItem[] => {
  return [...news].sort((a, b) => {
    return a.source.name.localeCompare(b.source.name);
  });
};

// Função para ordenar notícias por título
export const sortNewsByTitle = (news: NewsItem[]): NewsItem[] => {
  return [...news].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
};

// Função para filtrar notícias por fonte
export const filterNewsBySource = (news: NewsItem[], sourceName: string): NewsItem[] => {
  if (!sourceName) return news;
  return news.filter(item => 
    item.source.name.toLowerCase().includes(sourceName.toLowerCase())
  );
};

// Função para filtrar notícias por tema/palavras-chave no título ou descrição
export const filterNewsByTopic = (news: NewsItem[], topic: string): NewsItem[] => {
  if (!topic) return news;
  const lowercaseTopic = topic.toLowerCase();
  
  return news.filter(item => 
    (item.title && item.title.toLowerCase().includes(lowercaseTopic)) || 
    (item.description && item.description.toLowerCase().includes(lowercaseTopic)) ||
    (item.content && item.content.toLowerCase().includes(lowercaseTopic))
  );
};

// Função para filtrar notícias por intervalo de datas
export const filterNewsByDateRange = (
  news: NewsItem[], 
  startDate?: Date | string,
  endDate?: Date | string
): NewsItem[] => {
  if (!startDate && !endDate) return news;
  
  const start = startDate ? new Date(startDate).getTime() : 0;
  const end = endDate ? new Date(endDate).getTime() : Date.now();
  
  return news.filter(item => {
    const publishDate = new Date(item.publishedAt).getTime();
    return publishDate >= start && publishDate <= end;
  });
};

// Função para filtrar notícias por autor
export const filterNewsByAuthor = (news: NewsItem[], author: string): NewsItem[] => {
  if (!author) return news;
  return news.filter(item => 
    item.author && item.author.toLowerCase().includes(author.toLowerCase())
  );
};

// Função combinada para aplicar múltiplos filtros
interface NewsFilters {
  source?: string;
  topic?: string;
  author?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export const filterNews = (news: NewsItem[], filters: NewsFilters): NewsItem[] => {
  let filteredNews = [...news];
  
  if (filters.source) {
    filteredNews = filterNewsBySource(filteredNews, filters.source);
  }
  
  if (filters.topic) {
    filteredNews = filterNewsByTopic(filteredNews, filters.topic);
  }
  
  if (filters.author) {
    filteredNews = filterNewsByAuthor(filteredNews, filters.author);
  }
  
  if (filters.startDate || filters.endDate) {
    filteredNews = filterNewsByDateRange(filteredNews, filters.startDate, filters.endDate);
  }
  
  return filteredNews;
};

// Função para obter fontes únicas das notícias
export const getUniqueSources = (news: NewsItem[]): string[] => {
  const sources = news.map(item => item.source.name);
  return [...new Set(sources)].sort();
};

// Função para obter autores únicos das notícias
export const getUniqueAuthors = (news: NewsItem[]): string[] => {
  const authors = news
    .filter(item => item.author) // Filtrar valores nulos
    .map(item => item.author as string);
  return [...new Set(authors)].sort();
};

// Função para limitar número de notícias
export const limitNewsItems = (news: NewsItem[], limit: number): NewsItem[] => {
  return news.slice(0, limit);
};
