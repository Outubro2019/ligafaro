import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import path from 'path';

const execPromise = promisify(exec);

// Função para criar notícias padrão (fallback)
const criarNoticiasPadrao = () => {
  console.log('Criando notícias padrão');
  return [
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
};

// Função para buscar notícias do GNews
async function fetchNewsFromGNews(query, pageSize) {
  try {
    console.log(`Buscando notícias do GNews: ${query}, pageSize: ${pageSize}`);
    
    // GNews API gratuita
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&country=pt&max=${pageSize}`;
    console.log('URL da API:', url);
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Notícias obtidas com sucesso via GNews');
      console.log(`Total de notícias: ${data.articles ? data.articles.length : 0}`);
      
      // Verificar se há artigos
      if (!data.articles || data.articles.length === 0) {
        console.log('Nenhum artigo encontrado na resposta do GNews');
        return { articles: [] };
      }
      
      // Formatar os artigos para o formato esperado pelo cliente
      const formattedArticles = data.articles.map(article => ({
        source: article.source,
        author: article.source.name,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.image,
        publishedAt: article.publishedAt,
        content: article.content,
        origem_busca: 'GNews'
      }));
      
      return {
        status: 'ok',
        totalResults: formattedArticles.length,
        articles: formattedArticles
      };
    } else {
      console.error('Erro ao buscar notícias do GNews:', response.status, response.statusText);
      throw new Error(`Erro ao buscar notícias: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro ao buscar notícias do GNews:', error);
    throw error;
  }
}

// Função para buscar notícias da NewsAPI
async function fetchNewsFromNewsAPI(query, pageSize) {
  try {
    // Chave de API da NewsAPI (você precisará configurar isso no Netlify)
    const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
    
    if (!NEWS_API_KEY) {
      console.log('Chave de API da NewsAPI não configurada');
      return { articles: [] };
    }
    
    console.log(`Buscando notícias da NewsAPI: ${query}, pageSize: ${pageSize}`);
    
    // Domínios de fontes portuguesas
    const LOCAL_NEWS_DOMAINS = [
      'postal.pt',
      'sulinformacao.pt',
      'regiaosul.pt',
      'barlavento.pt',
      'jornaldoalgarve.pt'
    ];
    
    const NATIONAL_NEWS_DOMAINS = [
      'publico.pt',
      'expresso.pt',
      'sapo.pt',
      'jn.pt',
      'dn.pt',
      'observador.pt',
      'rtp.pt',
      'sicnoticias.pt',
      'tsf.pt'
    ];
    
    // Combinar domínios locais e nacionais portugueses
    const portugueseDomains = [...LOCAL_NEWS_DOMAINS, ...NATIONAL_NEWS_DOMAINS].join(',');
    
    // Usar apenas domínios portugueses
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&language=pt&domains=${portugueseDomains}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    console.log('URL da API:', url);
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Notícias obtidas com sucesso via NewsAPI');
      console.log(`Total de notícias: ${data.articles ? data.articles.length : 0}`);
      
      // Verificar se há artigos
      if (!data.articles || data.articles.length === 0) {
        console.log('Nenhum artigo encontrado na resposta da NewsAPI');
        return { articles: [] };
      }
      
      return data;
    } else {
      console.error('Erro ao buscar notícias da NewsAPI:', response.status, response.statusText);
      throw new Error(`Erro ao buscar notícias: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro ao buscar notícias da NewsAPI:', error);
    throw error;
  }
}

// Função para buscar notícias do Google usando web scraping
async function fetchNewsFromGoogle(query, pageSize) {
  try {
    console.log(`Buscando notícias do Google: ${query}, pageSize: ${pageSize}`);
    
    // URL para buscar notícias no Google
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-PT&gl=PT&ceid=PT:pt`;
    console.log('URL da API:', url);
    
    const response = await fetch(url);
    
    if (response.ok) {
      const text = await response.text();
      console.log('Resposta obtida do Google News RSS');
      
      // Extrair artigos do RSS
      const articles = [];
      const regex = /<item>([\s\S]*?)<\/item>/g;
      const titleRegex = /<title>([\s\S]*?)<\/title>/;
      const linkRegex = /<link>([\s\S]*?)<\/link>/;
      const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
      const sourceRegex = /<source url="([\s\S]*?)">([\s\S]*?)<\/source>/;
      const descriptionRegex = /<description>([\s\S]*?)<\/description>/;
      
      let match;
      while ((match = regex.exec(text)) !== null && articles.length < pageSize) {
        const item = match[1];
        
        const titleMatch = titleRegex.exec(item);
        const linkMatch = linkRegex.exec(item);
        const pubDateMatch = pubDateRegex.exec(item);
        const sourceMatch = sourceRegex.exec(item);
        const descriptionMatch = descriptionRegex.exec(item);
        
        if (titleMatch && linkMatch) {
          articles.push({
            source: {
              id: null,
              name: sourceMatch ? sourceMatch[2] : 'Google News'
            },
            author: sourceMatch ? sourceMatch[2] : 'Google News',
            title: titleMatch[1],
            description: descriptionMatch ? descriptionMatch[1] : '',
            url: linkMatch[1],
            urlToImage: null,
            publishedAt: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
            content: descriptionMatch ? descriptionMatch[1] : '',
            origem_busca: 'Google News'
          });
        }
      }
      
      console.log(`Extraídos ${articles.length} artigos do Google News RSS`);
      
      if (articles.length === 0) {
        console.log('Nenhum artigo encontrado no Google News RSS');
        return { articles: [] };
      }
      
      return {
        status: 'ok',
        totalResults: articles.length,
        articles: articles
      };
    } else {
      console.error('Erro ao buscar notícias do Google:', response.status, response.statusText);
      throw new Error(`Erro ao buscar notícias: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro ao buscar notícias do Google:', error);
    throw error;
  }
}

// Função para executar o script Python de eventos
async function fetchEventsFromPython() {
  try {
    console.log('Executando script Python para obter eventos');
    
    // Caminho para o script Python
    const scriptPath = path.join(__dirname, '../src/services/python/fetch_events.py');
    
    // Verificar se o script existe
    try {
      await fs.access(scriptPath);
      console.log(`Script encontrado em: ${scriptPath}`);
    } catch (error) {
      console.error(`Script não encontrado em: ${scriptPath}`, error);
      throw new Error('Script Python não encontrado');
    }
    
    // Executar o script Python
    console.log('Executando script Python...');
    const { stdout, stderr } = await execPromise(`python3 ${scriptPath}`);
    
    if (stderr) {
      console.error('Erro ao executar script Python:', stderr);
    }
    
    console.log('Saída do script Python:', stdout);
    
    // Verificar se o arquivo JSON foi gerado
    const jsonPath = path.join(__dirname, '../src/services/python/events_data.json');
    const publicJsonPath = path.join(__dirname, '../public/events_data.json');
    
    try {
      // Ler o arquivo JSON gerado
      const jsonData = await fs.readFile(jsonPath, 'utf8');
      const events = JSON.parse(jsonData);
      
      // Copiar o arquivo para a pasta public para acesso via frontend
      await fs.copyFile(jsonPath, publicJsonPath);
      console.log(`Arquivo JSON copiado para: ${publicJsonPath}`);
      
      return {
        success: true,
        message: 'Eventos obtidos com sucesso',
        count: events.length
      };
    } catch (error) {
      console.error('Erro ao ler ou copiar arquivo JSON:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao executar script Python de eventos:', error);
    throw error;
  }
}

export const handler = async (event, context) => {
  // Adicionar headers CORS para todas as respostas
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
  
  // Lidar com requisições OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  // Verifica o caminho da requisição
  const path = event.path.replace('/.netlify/functions/server', '');
  
  if (path === '/api/news' || path === '') {
    try {
      // Obter parâmetros da query
      const params = event.queryStringParameters || {};
      const query = params.query || 'Faro Algarve';
      const pageSize = parseInt(params.pageSize || '10', 10);
      
      console.log(`Processando requisição de notícias: query=${query}, pageSize=${pageSize}`);
      
      // Tentar buscar notícias do Google primeiro
      try {
        const googleData = await fetchNewsFromGoogle(query, pageSize);
        
        if (googleData.articles && googleData.articles.length > 0) {
          console.log(`Retornando ${googleData.articles.length} notícias do Google`);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(googleData)
          };
        }
      } catch (googleError) {
        console.error('Erro ao buscar notícias do Google:', googleError);
        // Continuar para o próximo método
      }
      
      // Tentar buscar notícias do GNews como segunda opção
      try {
        const gnewsData = await fetchNewsFromGNews(query, pageSize);
        
        if (gnewsData.articles && gnewsData.articles.length > 0) {
          console.log(`Retornando ${gnewsData.articles.length} notícias do GNews`);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(gnewsData)
          };
        }
      } catch (gnewsError) {
        console.error('Erro ao buscar notícias do GNews:', gnewsError);
        // Continuar para o próximo método
      }
      
      // Tentar buscar notícias da NewsAPI como terceira opção
      try {
        const newsApiData = await fetchNewsFromNewsAPI(query, pageSize);
        
        if (newsApiData.articles && newsApiData.articles.length > 0) {
          console.log(`Retornando ${newsApiData.articles.length} notícias da NewsAPI`);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(newsApiData)
          };
        }
      } catch (newsApiError) {
        console.error('Erro ao buscar notícias da NewsAPI:', newsApiError);
        // Continuar para o fallback
      }
      
      // Fallback para notícias estáticas se todos os métodos falharem
      const noticiasPadrao = criarNoticiasPadrao();
      console.log(`Retornando ${noticiasPadrao.length} notícias estáticas como fallback`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          totalResults: noticiasPadrao.length,
          articles: noticiasPadrao
        })
      };
    } catch (error) {
      console.error('Erro ao processar requisição de notícias:', error);
      
      // Retornar notícias estáticas em caso de erro
      const noticiasPadrao = criarNoticiasPadrao();
      
      return {
        statusCode: 200, // Retornar 200 mesmo em caso de erro para evitar problemas de CORS
        headers,
        body: JSON.stringify({
          status: 'ok',
          totalResults: noticiasPadrao.length,
          articles: noticiasPadrao
        })
      };
    }
  }
  
  // Rota para buscar eventos usando o script Python
  if (path === '/api/fetch-events') {
    try {
      console.log('Processando requisição para buscar eventos');
      
      const result = await fetchEventsFromPython();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    } catch (error) {
      console.error('Erro ao processar requisição de eventos:', error);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Erro ao obter eventos',
          error: error.message
        })
      };
    }
  }

  // Resposta padrão para rotas não encontradas
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Rota não encontrada' })
  };
};