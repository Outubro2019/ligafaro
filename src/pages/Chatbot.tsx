import React, { useState, useEffect, useRef } from 'react';
import { fetchNews, NewsItem } from '@/services/newsService';
import { eventsService } from '@/services/eventsService';
import { EventData } from '@/types/EventTypes';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Olá! Eu sou o assistente do LigaFaro. Em que posso ajudar?',
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Cache para armazenar dados de eventos e notícias
  const [eventsCache, setEventsCache] = useState<EventData[]>([]);
  const [newsCache, setNewsCache] = useState<NewsItem[]>([]);

  // Carregar dados de eventos e notícias ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar eventos
        const eventResponse = await eventsService.getEvents();
        if (eventResponse.events && eventResponse.events.length > 0) {
          setEventsCache(eventResponse.events);
          console.log('Eventos carregados para o chatbot:', eventResponse.events.length);
        }

        // Carregar notícias
        const newsData = await fetchNews('Faro Algarve', 20);
        if (newsData && newsData.length > 0) {
          setNewsCache(newsData);
          console.log('Notícias carregadas para o chatbot:', newsData.length);
        }
      } catch (error) {
        console.error('Erro ao carregar dados para o chatbot:', error);
      }
    };

    loadData();
  }, []);

  // Função para processar perguntas sobre eventos
  const processEventQuestion = (question: string): string => {
    if (eventsCache.length === 0) {
      return 'Desculpe, não tenho informações sobre eventos no momento.';
    }

    const questionLower = question.toLowerCase();
    
    // Listar todos os eventos
    if (questionLower.includes('listar eventos') ||
        questionLower.includes('quais eventos') ||
        questionLower.includes('mostrar eventos')) {
      const eventList = eventsCache
        .slice(0, 5)
        .map(event => `- ${event.title} (${event.date}${event.time ? ', ' + event.time : ''} em ${event.location})`)
        .join('\n');
      
      return `Aqui estão os próximos eventos em Faro:\n\n${eventList}\n\nEstes são apenas os 5 próximos eventos. Há um total de ${eventsCache.length} eventos disponíveis.`;
    }
    
    // Buscar eventos por categoria
    const categoryMatch = questionLower.match(/eventos de (.*?)[\?\.]/);
    if (categoryMatch || questionLower.includes('categoria')) {
      let category = '';
      
      if (categoryMatch && categoryMatch[1]) {
        category = categoryMatch[1].trim();
      } else if (questionLower.includes('categoria')) {
        // Extrair possível categoria após a palavra "categoria"
        const parts = questionLower.split('categoria');
        if (parts.length > 1) {
          category = parts[1].trim().split(/[\s\?\.,]/)[0];
        }
      }
      
      if (category) {
        const filteredEvents = eventsCache.filter(event =>
          event.category.toLowerCase().includes(category)
        );
        
        if (filteredEvents.length > 0) {
          const eventList = filteredEvents
            .slice(0, 3)
            .map(event => `- ${event.title} (${event.date}${event.time ? ', ' + event.time : ''})`)
            .join('\n');
          
          return `Encontrei ${filteredEvents.length} eventos na categoria "${category}":\n\n${eventList}`;
        } else {
          return `Não encontrei eventos na categoria "${category}".`;
        }
      }
    }
    
    // Buscar eventos por local
    if (questionLower.includes('local') || questionLower.includes('onde')) {
      const locations = [...new Set(eventsCache.map(event => event.location))];
      
      return `Os eventos acontecem nos seguintes locais:\n\n${locations.join('\n')}`;
    }
    
    // Buscar eventos por data
    if (questionLower.includes('quando') || questionLower.includes('data')) {
      const nextEvents = eventsCache
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      
      const eventList = nextEvents
        .map(event => `- ${event.title}: ${event.date}${event.time ? ', ' + event.time : ''}`)
        .join('\n');
      
      return `Os próximos eventos são:\n\n${eventList}`;
    }
    
    // Resposta genérica sobre eventos
    return `Temos ${eventsCache.length} eventos disponíveis. Você pode perguntar sobre eventos por categoria, local ou data.`;
  };

  // Função para processar perguntas sobre notícias
  const processNewsQuestion = (question: string): string => {
    if (newsCache.length === 0) {
      return 'Desculpe, não tenho informações sobre notícias no momento.';
    }

    const questionLower = question.toLowerCase();
    
    // Listar notícias recentes
    if (questionLower.includes('notícias recentes') ||
        questionLower.includes('últimas notícias') ||
        questionLower.includes('notícias atuais')) {
      const newsList = newsCache
        .slice(0, 5)
        .map(news => `- ${news.title} (${news.source.name})`)
        .join('\n');
      
      return `Aqui estão as notícias mais recentes sobre Faro:\n\n${newsList}`;
    }
    
    // Buscar notícias por fonte
    if (questionLower.includes('fonte') || questionLower.includes('jornal')) {
      const sources = [...new Set(newsCache.map(news => news.source.name))];
      
      return `As notícias são de diversas fontes, incluindo:\n\n${sources.join('\n')}`;
    }
    
    // Buscar notícias por tema específico
    const keywords = ['cultura', 'esporte', 'política', 'economia', 'turismo', 'farense'];
    
    for (const keyword of keywords) {
      if (questionLower.includes(keyword)) {
        const filteredNews = newsCache.filter(news =>
          (news.title.toLowerCase().includes(keyword) ||
           (news.description && news.description.toLowerCase().includes(keyword)))
        );
        
        if (filteredNews.length > 0) {
          const newsList = filteredNews
            .slice(0, 3)
            .map(news => `- ${news.title}`)
            .join('\n');
          
          return `Encontrei ${filteredNews.length} notícias sobre "${keyword}":\n\n${newsList}`;
        } else {
          return `Não encontrei notícias específicas sobre "${keyword}".`;
        }
      }
    }
    
    // Resposta genérica sobre notícias
    return `Tenho ${newsCache.length} notícias disponíveis sobre Faro e região. Você pode perguntar sobre notícias recentes ou por temas específicos como cultura, esporte, política, etc.`;
  };

  // Função para processar perguntas sobre a aplicação
  const processAppQuestion = (question: string): string => {
    const questionLower = question.toLowerCase();
    
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
  };

  // Função principal para processar perguntas
  const processQuestion = async (question: string): Promise<string> => {
    try {
      const questionLower = question.toLowerCase();
      
      // Determinar o tipo de pergunta
      if (questionLower.includes('evento') ||
          questionLower.includes('acontecendo') ||
          questionLower.includes('programação')) {
        return processEventQuestion(question);
      }
      
      if (questionLower.includes('notícia') ||
          questionLower.includes('jornal') ||
          questionLower.includes('informação')) {
        return processNewsQuestion(question);
      }
      
      if (questionLower.includes('site') ||
          questionLower.includes('aplicação') ||
          questionLower.includes('ligafaro') ||
          questionLower.includes('plataforma')) {
        return processAppQuestion(question);
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
      
      // Para outras perguntas, tentar identificar se está relacionada a eventos ou notícias
      if (eventsCache.some(event => questionLower.includes(event.title.toLowerCase()))) {
        return processEventQuestion(question);
      }
      
      if (newsCache.some(news => questionLower.includes(news.title.toLowerCase()))) {
        return processNewsQuestion(question);
      }
      
      // Resposta padrão
      return 'Posso ajudar com informações sobre eventos em Faro, notícias locais ou sobre o LigaFaro. Como posso ajudar?';
    } catch (error) {
      console.error('Erro ao processar pergunta:', error);
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isProcessing) {
      setIsProcessing(true);
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      try {
        const botResponseText = await processQuestion(input);
        const botResponse: Message = { text: botResponseText, sender: 'bot' };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        const errorResponse: Message = {
          text: 'Desculpe, ocorreu um erro ao processar sua pergunta.',
          sender: 'bot'
        };
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-500 text-white">
          <h1 className="text-2xl font-bold">Assistente LigaFaro</h1>
        </div>
        
        <div className="messages p-4 space-y-4 min-h-[350px] max-h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                <p>Processando sua pergunta...</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite a sua pergunta..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={isProcessing}
            >
              Enviar
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Dica: Pergunte sobre eventos, notícias locais ou informações sobre o LigaFaro.
          </p>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chatbot;
