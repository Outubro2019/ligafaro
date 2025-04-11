// functions/chatbot.js
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
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

  try {
    // Verificar se é uma requisição POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método não permitido' })
      };
    }

    // Obter a pergunta do corpo da requisição
    const { question } = JSON.parse(event.body);
    
    if (!question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Pergunta não fornecida' })
      };
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

    // Processar a pergunta
    const answer = processQuestion(question, events, news);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor', 
        details: error.message,
        answer: 'Desculpe, ocorreu um erro ao processar sua solicitação.' 
      })
    };
  }
};

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
  
  // Perguntas sobre o site/aplicação
  if (questionLower.includes('site') || 
      questionLower.includes('aplicação') || 
      questionLower.includes('ligafaro') || 
      questionLower.includes('plataforma')) {
    
    if (questionLower.includes('o que é') || questionLower.includes('sobre o site')) {
      return 'O LigaFaro é uma plataforma que conecta os cidadãos de Faro a informações locais, eventos, notícias e serviços comunitários. Nossa missão é fortalecer a comunidade local através da informação e participação.';
    }
    
    if (questionLower.includes('funcionalidades') || questionLower.includes('o que posso fazer')) {
      return 'No LigaFaro você pode:\n\n- Consultar eventos locais\n- Ler notícias sobre Faro e região\n- Participar do fórum comunitário\n- Acessar o marketplace local\n- Encontrar oportunidades de voluntariado';
    }
    
    if (questionLower.includes('contato') || questionLower.includes('suporte')) {
      return 'Para entrar em contato conosco, envie um email para contato@ligafaro.pt ou utilize o formulário de contato disponível no site.';
    }
    
    return 'O LigaFaro é sua plataforma comunitária para Faro. Posso ajudar com informações sobre eventos, notícias locais e funcionalidades do site.';
  }
  
  // Verificar se é uma pergunta sobre o tempo
  if (questionLower.includes('tempo') || questionLower.includes('clima')) {
    return 'A temperatura atual em Faro é de aproximadamente 22°C, com céu parcialmente nublado.';
  }
  
  // Verificar se é uma pergunta sobre data
  if (questionLower.includes('que dia é hoje') || questionLower.includes('data')) {
    const hoje = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `Hoje é ${hoje}.`;
  }
  
  // Resposta padrão
  return `Posso ajudar com informações sobre eventos em Faro, notícias locais ou sobre o LigaFaro. Temos ${events.length} eventos e ${news.length} notícias disponíveis.`;
}