import React, { useState, useEffect, useRef } from 'react';
import eventsData from '../events_data.json';
import noticiasData from '../noticias_faro.json';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface Event {
  title: string;
  date: string;
  time?: string;
  location: string;
  category?: string;
}

interface NewsItem {
  title: string;
  description?: string;
  source?: {
    name: string;
  };
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Olá! Sou o assistente virtual da Liga Faro. Como posso ajudar você hoje?',
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  // Carregar dados de eventos e notícias
  useEffect(() => {
    try {
      setEvents(eventsData as Event[]);
      setNews(noticiasData as NewsItem[]);
      console.log(`Carregados ${eventsData.length} eventos e ${noticiasData.length} notícias`);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }, []);

  // Função para processar perguntas diretamente no componente
  const processQuestion = (question: string): string => {
    const questionLower = question.toLowerCase();
    console.log('Processando pergunta:', questionLower);
    
    // Perguntas sobre data e hora
    if (questionLower.includes('dia') ||
        questionLower.includes('data') ||
        questionLower.includes('hoje')) {
      
      const hoje = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const dataFormatada = hoje.toLocaleDateString('pt-BR', options);
      
      return `Hoje é ${dataFormatada}.`;
    }
    
    // Perguntas sobre o tempo/clima
    if (questionLower.includes('tempo') ||
        questionLower.includes('clima') ||
        questionLower.includes('temperatura')) {
      
      return `Atualmente não tenho acesso em tempo real aos dados meteorológicos de Faro. Para obter informações precisas sobre o tempo, recomendo consultar um serviço meteorológico como o IPMA (Instituto Português do Mar e da Atmosfera) ou outro serviço de previsão do tempo.`;
    }
    
    // Perguntas sobre eventos
    if (questionLower.includes('evento') ||
        questionLower.includes('acontecendo') ||
        questionLower.includes('programação')) {
      
      if (events.length === 0) {
        return 'Desculpe, não tenho informações sobre eventos no momento.';
      }
      
      // Eventos de hoje
      if (questionLower.includes('hoje')) {
        const hoje = new Date();
        const dataHoje = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        const eventosHoje = events.filter(event => {
          // Simplificação para demonstração - idealmente faria uma comparação mais robusta de datas
          return event.date && event.date.includes(hoje.getDate().toString());
        });
        
        if (eventosHoje.length > 0) {
          const eventList = eventosHoje
            .slice(0, 5)
            .map(event => `- ${event.title} (${event.time || 'Horário não especificado'} em ${event.location})`)
            .join('\n');
          
          return `Aqui estão os eventos para hoje em Faro:\n\n${eventList}\n\n${eventosHoje.length > 5 ? `Há um total de ${eventosHoje.length} eventos hoje.` : ''}`;
        } else {
          return `Não encontrei eventos específicos para hoje. Aqui estão os próximos eventos:\n\n${events
            .slice(0, 3)
            .map(event => `- ${event.title} (${event.date})`)
            .join('\n')}`;
        }
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
      if (questionLower.includes('quando')) {
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
      const eventList = events
        .slice(0, 5)
        .map(event => `- ${event.title} (${event.date}${event.time ? ', ' + event.time : ''} em ${event.location})`)
        .join('\n');
      
      return `Aqui estão os próximos eventos em Faro:\n\n${eventList}\n\nEstes são apenas os 5 próximos eventos. Há um total de ${events.length} eventos disponíveis.`;
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
    
    // Perguntas sobre o LigaFaro
    if (questionLower.includes('ligafaro') ||
        questionLower.includes('liga faro') ||
        questionLower.includes('o que é') ||
        questionLower.includes('quem é')) {
      return `O LigaFaro é um centro comunitário virtual para tudo relacionado a Faro! Conectamos residentes, visitantes e entusiastas da cidade com eventos locais, notícias, oportunidades de voluntariado e recursos comunitários. Nosso objetivo é fortalecer a comunidade de Faro e promover o engajamento cívico.`;
    }
    
    // Resposta padrão
    return `Posso ajudar com informações sobre eventos em Faro, notícias locais, voluntariado, comunidade ou sobre o LigaFaro. Temos ${events.length} eventos e ${news.length} notícias disponíveis. Também posso informar sobre o tempo atual e a data em Faro.`;
  };

  const handleSend = () => {
    console.log('handleSend chamado, input:', input);
    if (input.trim() && !isProcessing) {
      console.log('Iniciando processamento da pergunta');
      setIsProcessing(true);
      const userMessage: Message = { text: input, sender: 'user' };
      console.log('Adicionando mensagem do usuário:', userMessage);
      setMessages((prev) => {
        console.log('Estado anterior de mensagens:', prev.length);
        return [...prev, userMessage];
      });
      
      // Guardar o valor atual do input antes de limpá-lo
      const currentInput = input;
      setInput('');

      try {
        console.log('Chamando processQuestion');
        // Processamento síncrono diretamente no componente
        const botResponseText = processQuestion(currentInput);
        console.log('Resposta obtida:', botResponseText);
        const botResponse: Message = { text: botResponseText, sender: 'bot' };
        console.log('Adicionando resposta do bot:', botResponse);
        setMessages((prev) => {
          console.log('Estado anterior de mensagens (antes da resposta):', prev.length);
          return [...prev, botResponse];
        });
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        const errorResponse: Message = {
          text: 'Desculpe, ocorreu um erro ao processar sua pergunta.',
          sender: 'bot'
        };
        console.log('Adicionando mensagem de erro:', errorResponse);
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        console.log('Finalizando processamento');
        setIsProcessing(false);
      }
    } else {
      console.log('Input vazio ou já está processando');
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
