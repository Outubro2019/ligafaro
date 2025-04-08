
// Serviço de API do GNews

import { NewsItem } from '../types/newsTypes';
import { GNEWS_API } from '../config/newsApiConfig';

export const fetchGnewsNews = async (pageSize: number): Promise<NewsItem[]> => {
  try {
    // Foco específico em notícias de Faro com idioma português
    const gnewsResponse = await fetch(
      `${GNEWS_API.baseUrl}/search?q=Faro Algarve&max=${pageSize}&lang=pt&country=pt&sortby=publishedAt&apikey=${GNEWS_API.apiKey}`
    );
    
    if (gnewsResponse.ok) {
      const gnewsData = await gnewsResponse.json();
      
      if (gnewsData.articles && gnewsData.articles.length > 0) {
        console.log('Successfully fetched data from GNews API');
        
        // Mapear resposta do GNews para nosso formato NewsItem
        return gnewsData.articles.map(article => ({
          source: { 
            id: null, 
            name: article.source?.name || "Desconhecido" 
          },
          author: article.source?.name || null,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          content: article.content
        }));
      }
    }
    return [];
  } catch (error) {
    console.error('Error with GNews API:', error);
    return [];
  }
};
