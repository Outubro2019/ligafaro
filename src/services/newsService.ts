import { NewsItem } from './types/newsTypes';
import { sortNewsByDate } from './utils/newsUtils';

// Notícias estáticas para fallback em caso de erro
const staticNews: NewsItem[] = [
  {
    source: { id: null, name: 'Liga Faro' },
    author: 'Administrador',
    title: 'Bem-vindo ao Portal de Notícias de Faro',
    description: 'Estamos trabalhando para trazer as últimas notícias sobre Faro e Farense.',
    url: 'https://ligafaro.netlify.app',
    urlToImage: null,
    publishedAt: new Date().toISOString(),
    content: 'Aguarde mais notícias em breve.',
    origem_busca: 'Sistema'
  },
  {
    source: { id: null, name: 'Liga Faro' },
    author: 'Administrador',
    title: 'Farense prepara-se para a nova temporada',
    description: 'O clube de Faro está em preparação para os próximos desafios.',
    url: 'https://ligafaro.netlify.app/farense',
    urlToImage: null,
    publishedAt: new Date().toISOString(),
    content: 'O Farense está em fase de preparação para a nova temporada.',
    origem_busca: 'Sistema'
  },
  {
    source: { id: null, name: 'Liga Faro' },
    author: 'Administrador',
    title: 'Eventos culturais em Faro este mês',
    description: 'Confira os principais eventos culturais que acontecerão em Faro.',
    url: 'https://ligafaro.netlify.app/eventos',
    urlToImage: null,
    publishedAt: new Date().toISOString(),
    content: 'Faro recebe diversos eventos culturais este mês.',
    origem_busca: 'Sistema'
  }
];

// Função para buscar notícias usando a função serverless do Netlify
export const fetchNews = async (query = 'Faro', pageSize = 10): Promise<NewsItem[]> => {
  try {
    console.log('Fetching news with query:', query);
    
    // Primeiro, tenta carregar o arquivo JSON local
    try {
      console.log('Tentando carregar notícias do arquivo JSON local...');
      const response = await fetch('/src/noticias_faro.json');
      
      if (response.ok) {
        const newsData = await response.json();
        console.log('Notícias carregadas com sucesso do JSON local');
        console.log('Número de notícias:', newsData.length);
        
        if (newsData.length > 0) {
          console.log('Primeira notícia:', newsData[0].title);
          return sortNewsByDate(newsData);
        }
      } else {
        console.warn('Falha ao carregar notícias do JSON local:', response.status);
      }
    } catch (localError) {
      console.warn('Erro ao carregar notícias do JSON local:', localError);
    }
    
    // Se não conseguir carregar do arquivo local, tenta usar a API
    console.log('Tentando carregar notícias da API...');
    
    // Tentar usar o endpoint local primeiro
    try {
      const localApiUrl = `/api/news-local`;
      console.log('Tentando carregar notícias do endpoint local:', localApiUrl);
      
      const localResponse = await fetch(localApiUrl);
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        console.log('Notícias carregadas com sucesso do endpoint local');
        
        if (localData.articles && localData.articles.length > 0) {
          console.log('Número de notícias do endpoint local:', localData.articles.length);
          console.log('Primeira notícia do endpoint local:', localData.articles[0].title);
          return sortNewsByDate(localData.articles);
        } else {
          console.warn('Nenhuma notícia encontrada no endpoint local');
        }
      } else {
        console.warn('Falha ao carregar notícias do endpoint local:', localResponse.status);
      }
    } catch (localApiError) {
      console.warn('Erro ao acessar endpoint local de notícias:', localApiError);
    }
    
    // Se não conseguir carregar do endpoint local, tenta usar a função serverless
    const apiUrl = `/api/news?query=${encodeURIComponent(query)}&pageSize=${pageSize}`;
    console.log('Fetching from URL:', apiUrl);
    
    const response = await fetch(apiUrl);
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

    throw new Error('No news found from serverless function');
  } catch (error) {
    console.error('Error fetching news:', error);
    return staticNews; // Fallback para notícias estáticas em caso de erro
  }
};

export type { NewsItem };
export { sortNewsByDate };
