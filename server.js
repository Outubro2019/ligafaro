import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
app.use(cors());
app.use(express.json());
app.use(express.static('.'));  // Servir arquivos estáticos do diretório atual
app.use(express.json());

// Função para obter a data atual formatada
const getFormattedDate = () => {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const getWeather = async (city = 'Faro') => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=37.0194&longitude=-7.9304&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
    const data = await response.json();
    return `A temperatura atual em ${city} é de ${data.current.temperature_2m}°C, com uma velocidade do vento de ${data.current.wind_speed_10m} m/s.`;
  } catch (error) {
    console.error('Erro ao obter o tempo:', error);
    return 'Não consegui obter a previsão do tempo.';
  }
};

const getNews = async () => {
  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=pt&apiKey=${NEWS_API_KEY}`);
    const data = await response.json();
    return data.articles.slice(0, 3).map(article => `📰 ${article.title}`).join('\n');
  } catch (error) {
    console.error('Erro ao obter notícias:', error);
    return 'Não consegui obter as últimas notícias.';
  }
};

const chatWithGPT = async (message) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao comunicar com a IA:', error);
    return 'Ocorreu um erro ao comunicar com a IA.';
  }
};
app.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ answer: 'Por favor, forneça uma pergunta.' });
  }

  try {
    console.log('Processando pergunta:', question);
    
    // Executar o script Python do chatbot
    try {
      // Escapar aspas duplas para evitar problemas com o comando
      const escapedQuestion = question.replace(/"/g, '\\"');
      
      console.log('Executando script Python do chatbot...');
      const { stdout, stderr } = await execPromise(`python3 src/services/python/chatbot.py "${escapedQuestion}"`);
      
      if (stderr) {
        console.log('Logs do script Python (stderr):', stderr);
      }
      
      console.log('Resposta do script Python:', stdout);
      
      // Processar a resposta
      const data = JSON.parse(stdout);
      return res.json(data);
    } catch (pythonError) {
      console.error('Erro ao executar script Python do chatbot:', pythonError);
      
      // Fallback para o método anterior
      let response;
      
      if (question.toLowerCase().includes('tempo')) {
        response = await getWeather();
      } else if (question.toLowerCase().includes('notícias')) {
        response = await getNews();
      } else if (question.toLowerCase().includes('que dia é hoje')) {
        response = `Hoje é ${getFormattedDate()}.`;
      } else {
        response = await chatWithGPT(question);
      }
      
      return res.json({ answer: response });
    }
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ answer: 'Ocorreu um erro ao processar sua solicitação.' });
  }
});

// Endpoint para executar scripts Python
app.get('/execute-python', async (req, res) => {
  const { script } = req.query;
  
  if (!script) {
    return res.status(400).json({ error: 'Nome do script não fornecido' });
  }
  
  // Verificar se o script é permitido (por segurança)
  const allowedScripts = ['gerar_noticias_json.py', 'src/services/python/fetch_events.py'];
  if (!allowedScripts.includes(script)) {
    return res.status(403).json({ error: 'Script não permitido' });
  }
  
  try {
    console.log(`Executando script Python: ${script}`);
    const { stdout, stderr } = await execPromise(`python3 ${script}`);
    
    if (stderr) {
      console.error(`Erro no script Python ${script}:`, stderr);
    }
    
    console.log(`Script Python ${script} executado com sucesso`);
    res.json({ success: true, message: 'Script executado com sucesso' });
  } catch (error) {
    console.error(`Erro ao executar script Python ${script}:`, error);
    res.status(500).json({ error: 'Erro ao executar script Python', details: error.message });
  }
});

// Importar domínios de fontes portuguesas
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

// Endpoint para buscar notícias usando Python e GNews
app.get('/api/news', async (req, res) => {
  const { query = 'Faro Algarve', pageSize = 10 } = req.query;
  
  console.log(`Buscando notícias com Python/GNews: ${query}, pageSize: ${pageSize}`);
  
  try {
    // Executar o script Python para gerar o arquivo JSON
    try {
      console.log('Executando script Python para gerar notícias...');
      await execPromise('python3 gerar_noticias_json.py');
      console.log('Script Python executado com sucesso!');
    } catch (pythonError) {
      console.error('Erro ao executar script Python:', pythonError);
      // Continuar mesmo com erro, pois o arquivo JSON pode já existir
    }
    
    // Ler o arquivo JSON gerado pelo script Python
    try {
      // Usar a API de sistema de arquivos do ESM
      const { readFile } = await import('fs/promises');
      const jsonData = await readFile('noticias_faro.json', 'utf8');
      const newsData = JSON.parse(jsonData);
      
      console.log('Notícias obtidas com sucesso do arquivo JSON');
      console.log(`Total de notícias: ${newsData.length}`);
      console.log('Primeira notícia:', newsData.length > 0 ? newsData[0].title : 'Nenhuma notícia encontrada');
      
      // Verificar se há artigos
      if (!newsData || newsData.length === 0) {
        console.log('Nenhum artigo encontrado no arquivo JSON');
        // Fallback para a NewsAPI com domínios portugueses
        return await fetchNewsFromNewsAPI(query, pageSize, res);
      }
      
      // Retornar no formato esperado pelo cliente
      return res.json({
        status: 'ok',
        totalResults: newsData.length,
        articles: newsData
      });
    } catch (readError) {
      console.error('Erro ao ler arquivo JSON:', readError);
      // Fallback para a NewsAPI
      return await fetchNewsFromNewsAPI(query, pageSize, res);
    }
  } catch (error) {
    console.error('Erro ao executar o script Python:', error);
    // Fallback para a NewsAPI
    return await fetchNewsFromNewsAPI(query, pageSize, res);
  }
});

// Endpoint para executar o script Python de notícias e retornar os resultados
app.get('/api/news-local', async (req, res) => {
  console.log('Processando requisição para buscar notícias locais');
  
  try {
    // Executar o script Python para gerar o arquivo JSON
    try {
      console.log('Executando script Python para gerar notícias...');
      await execPromise('python3 gerar_noticias_json.py');
      console.log('Script Python executado com sucesso!');
    } catch (pythonError) {
      console.error('Erro ao executar script Python:', pythonError);
      // Continuar mesmo com erro, pois o arquivo JSON pode já existir
    }
    
    // Ler o arquivo JSON gerado pelo script Python
    try {
      // Usar a API de sistema de arquivos do ESM
      const { readFile } = await import('fs/promises');
      const jsonData = await readFile('noticias_faro.json', 'utf8');
      const newsData = JSON.parse(jsonData);
      
      console.log('Notícias obtidas com sucesso do arquivo JSON');
      console.log(`Total de notícias: ${newsData.length}`);
      
      // Verificar se há notícias
      if (!newsData || newsData.length === 0) {
        console.log('Nenhuma notícia encontrada no arquivo JSON');
        return res.json({ articles: [] });
      }
      
      // Retornar no formato esperado pelo cliente
      return res.json({
        status: 'ok',
        totalResults: newsData.length,
        articles: newsData
      });
    } catch (readError) {
      console.error('Erro ao ler arquivo JSON de notícias:', readError);
      return res.status(500).json({
        error: 'Erro ao ler arquivo JSON de notícias',
        details: readError.message
      });
    }
  } catch (error) {
    console.error('Erro ao processar requisição de notícias locais:', error);
    return res.status(500).json({
      error: 'Erro ao processar requisição de notícias locais',
      details: error.message
    });
  }
});

// Endpoint para buscar eventos
app.get('/api/events', async (req, res) => {
  console.log('Processando requisição para buscar eventos');
  
  try {
    // Executar o script Python para gerar o arquivo JSON
    try {
      console.log('Executando script Python para gerar eventos...');
      await execPromise('python3 src/services/python/fetch_events.py');
      console.log('Script Python executado com sucesso!');
    } catch (pythonError) {
      console.error('Erro ao executar script Python:', pythonError);
      // Continuar mesmo com erro, pois o arquivo JSON pode já existir
    }
    
    // Ler o arquivo JSON gerado pelo script Python
    try {
      // Usar a API de sistema de arquivos do ESM
      const { readFile } = await import('fs/promises');
      const jsonData = await readFile('public/events_data.json', 'utf8');
      const eventsData = JSON.parse(jsonData);
      
      console.log('Eventos obtidos com sucesso do arquivo JSON');
      console.log(`Total de eventos: ${eventsData.length}`);
      
      // Verificar se há eventos
      if (!eventsData || eventsData.length === 0) {
        console.log('Nenhum evento encontrado no arquivo JSON');
        return res.json({ events: [] });
      }
      
      // Retornar no formato esperado pelo cliente
      return res.json({
        success: true,
        events: eventsData
      });
    } catch (readError) {
      console.error('Erro ao ler arquivo JSON de eventos:', readError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao ler arquivo JSON de eventos',
        details: readError.message
      });
    }
  } catch (error) {
    console.error('Erro ao processar requisição de eventos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar requisição de eventos',
      details: error.message
    });
  }
});

// Função de fallback para buscar notícias da NewsAPI
async function fetchNewsFromNewsAPI(query, pageSize, res) {
  try {
    console.log(`Fallback: Buscando notícias da NewsAPI: ${query}, pageSize: ${pageSize}`);
    
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
      console.log('Primeira notícia:', data.articles && data.articles.length > 0 ? data.articles[0].title : 'Nenhuma notícia encontrada');
      
      // Verificar se há artigos
      if (!data.articles || data.articles.length === 0) {
        console.log('Nenhum artigo encontrado na resposta da NewsAPI');
        return res.json({ articles: [] });
      }
      
      return res.json(data);
    } else {
      const errorText = await response.text();
      console.error('Erro ao buscar notícias da NewsAPI:', errorText);
      return res.status(response.status).json({ error: 'Erro ao buscar notícias', details: errorText });
    }
  } catch (error) {
    console.error('Erro ao buscar notícias da NewsAPI:', error);
    return res.status(500).json({ error: 'Erro ao buscar notícias', details: error.message });
  }
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Escutando na porta ${PORT}`);
});