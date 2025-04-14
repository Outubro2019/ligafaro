// chatbot_server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Implementação da função de processamento do chatbot diretamente no servidor
// para evitar problemas de importação

// Função para processar perguntas
function processQuestion(question, events, news) {
  const questionLower = question.toLowerCase();
  console.log('Processando pergunta:', questionLower);
  
  // Perguntas sobre eventos
  if (questionLower.includes('evento') ||
      questionLower.includes('acontecendo') ||
      questionLower.includes('programação')) {
    
    if (events.length === 0) {
      return 'Desculpe, não tenho informações sobre eventos no momento.';
    }
    
    // Listar eventos
    if (questionLower.includes('listar') ||
        questionLower.includes('quais') ||
        questionLower.includes('mostrar')) {
      
      const eventList = events
        .slice(0, 5)
        .map(event => `- ${event.title} (${event.date}${event.time ? ', ' + event.time : ''} em ${event.location})`)
        .join('\n');
      
      return `Aqui estão os próximos eventos em Faro:\n\n${eventList}\n\nEstes são apenas os 5 próximos eventos. Há um total de ${events.length} eventos disponíveis.`;
    }
    
    // Buscar por categoria
    const categoryMatch = questionLower.match(/categoria\s+(\w+)/) || questionLower.match(/eventos\s+de\s+(\w+)/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      const filteredEvents = events.filter(event =>
        event.category && event.category.toLowerCase().includes(category)
      );
      
      if (filteredEvents.length > 0) {
        const eventList = filteredEvents
          .slice(0, 3)
          .map(event => `- ${event.title} (${event.date})`)
          .join('\n');
        
        return `Encontrei ${filteredEvents.length} eventos na categoria '${category}':\n\n${eventList}`;
      } else {
        return `Não encontrei eventos na categoria '${category}'.`;
      }
    }
    
    // Buscar por local
    if (questionLower.includes('local') || questionLower.includes('onde')) {
      const locations = [...new Set(events
        .filter(event => event.location)
        .map(event => event.location)
      )];
      
      return `Os eventos acontecem nos seguintes locais:\n\n${locations.join('\n')}`;
    }
    
    // Buscar por data
    if (questionLower.includes('quando') || questionLower.includes('data')) {
      // Ordenar eventos por data
      const sortedEvents = [...events].sort((a, b) =>
        new Date(a.date || '9999-99-99').getTime() - new Date(b.date || '9999-99-99').getTime()
      );
      
      const eventList = sortedEvents
        .slice(0, 3)
        .map(event => `- ${event.title}: ${event.date}${event.time ? ', ' + event.time : ''}`)
        .join('\n');
      
      return `Os próximos eventos são:\n\n${eventList}`;
    }
    
    // Resposta genérica sobre eventos
    return `Temos ${events.length} eventos disponíveis. Você pode perguntar sobre eventos por categoria, local ou data.`;
  }
  
  // Perguntas sobre notícias
  if (questionLower.includes('notícia') ||
      questionLower.includes('jornal') ||
      questionLower.includes('informação')) {
    
    if (news.length === 0) {
      return 'Desculpe, não tenho informações sobre notícias no momento.';
    }
    
    // Listar notícias recentes
    if (questionLower.includes('recentes') ||
        questionLower.includes('últimas') ||
        questionLower.includes('atuais')) {
      
      const newsList = news
        .slice(0, 5)
        .map(item => `- ${item.title} (${item.source && item.source.name ? item.source.name : 'Fonte desconhecida'})`)
        .join('\n');
      
      return `Aqui estão as notícias mais recentes sobre Faro:\n\n${newsList}`;
    }
    
    // Buscar por fonte
    if (questionLower.includes('fonte') || questionLower.includes('jornal')) {
      const sources = [...new Set(news
        .filter(item => item.source && item.source.name)
        .map(item => item.source.name)
      )];
      
      return `As notícias são de diversas fontes, incluindo:\n\n${sources.join('\n')}`;
    }
    
    // Buscar por tema
    const keywords = ['cultura', 'esporte', 'política', 'economia', 'turismo', 'farense'];
    for (const keyword of keywords) {
      if (questionLower.includes(keyword)) {
        const filteredNews = news.filter(item =>
          (item.title && item.title.toLowerCase().includes(keyword)) ||
          (item.description && item.description.toLowerCase().includes(keyword))
        );
        
        if (filteredNews.length > 0) {
          const newsList = filteredNews
            .slice(0, 3)
            .map(item => `- ${item.title}`)
            .join('\n');
          
          return `Encontrei ${filteredNews.length} notícias sobre '${keyword}':\n\n${newsList}`;
        } else {
          return `Não encontrei notícias específicas sobre '${keyword}'.`;
        }
      }
    }
    
    // Resposta genérica sobre notícias
    return `Tenho ${news.length} notícias disponíveis sobre Faro e região. Você pode perguntar sobre notícias recentes ou por temas específicos como cultura, esporte, política, etc.`;
  }
  
  // Resposta padrão
  return `Posso ajudar com informações sobre eventos em Faro, notícias locais, voluntariado, comunidade ou sobre o LigaFaro. Temos ${events.length} eventos e ${news.length} notícias disponíveis. Também posso informar sobre o tempo atual e a data em Faro.`;
}


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Configurar CORS para permitir solicitações da aplicação React
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Rota principal para a interface web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'interface.html'));
});

// Rota específica para /chatbot
app.get('/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'interface.html'));
});

// Endpoint da API do chatbot (para compatibilidade com a interface web existente)
app.post('/api/chatbot', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Pergunta não fornecida' });
    }
    
    console.log('Processando pergunta:', question);
    
    // Carregar dados de eventos e notícias
    let events = [];
    let news = [];
    
    try {
      // Caminho para os arquivos JSON
      const eventsPath = path.join(__dirname, '../public/events_data.json');
      const newsPath = path.join(__dirname, '../public/noticias_faro.json');
      
      // Verificar se os arquivos existem
      if (fs.existsSync(eventsPath)) {
        const eventsData = fs.readFileSync(eventsPath, 'utf8');
        events = JSON.parse(eventsData);
        console.log(`Carregados ${events.length} eventos`);
      } else {
        console.log(`Arquivo de eventos não encontrado: ${eventsPath}`);
      }
      
      if (fs.existsSync(newsPath)) {
        const newsData = fs.readFileSync(newsPath, 'utf8');
        news = JSON.parse(newsData);
        console.log(`Carregadas ${news.length} notícias`);
      } else {
        console.log(`Arquivo de notícias não encontrado: ${newsPath}`);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    
    // Processar a pergunta usando a função do chatbot
    const answer = processQuestion(question, events, news);
    
    res.json({ answer });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message,
      answer: 'Desculpe, ocorreu um erro ao processar sua solicitação.'
    });
  }
});

// Endpoint para teste da API
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'API do chatbot está funcionando!' });
});

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor do chatbot rodando em http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar');
  console.log('Endpoints disponíveis:');
  console.log(`- http://localhost:${PORT}/`);
  console.log(`- http://localhost:${PORT}/chatbot`);
  console.log(`- http://localhost:${PORT}/api/chatbot (POST)`);
  console.log(`- http://localhost:${PORT}/api/test (GET)`);
});

// Tratamento de erros
server.on('error', (error) => {
  console.error('Erro ao iniciar o servidor:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`A porta ${PORT} já está em uso. Tente uma porta diferente.`);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Erro não tratado:', error);
});