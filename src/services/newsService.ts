import { NewsItem } from './types/newsTypes';
import { sortNewsByDate } from './utils/newsUtils';

// Função para buscar notícias usando o servidor como proxy
export const fetchNews = async (query = 'Faro', pageSize = 10): Promise<NewsItem[]> => {
  try {
    console.log('Fetching news with query:', query);
    console.log('Fetching news from server proxy...');
    
    const response = await fetch(
      `/api/news?query=${encodeURIComponent(query)}&pageSize=${pageSize}`
    );
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.articles && data.articles.length > 0) {
        console.log('Successfully fetched data from server');
        console.log('Number of articles:', data.articles.length);
        console.log('First article:', data.articles[0].title);
        return sortNewsByDate(data.articles);
      } else {
        console.error('No articles found in response data:', data);
      }
    } else {
      console.error('Response not OK:', response.status, response.statusText);
    }

    throw new Error('No news found from server');
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export type { NewsItem };
export { sortNewsByDate };
