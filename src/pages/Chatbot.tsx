import React, { useState, useEffect, useRef } from 'react';
import { EventData } from '@/types/EventTypes';
import { NewsItem } from '@/services/types/newsTypes';

// Adicionar logs globais para debug
console.log('Chatbot component loaded');

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  console.log('Chatbot component rendering');
  // Dados estáticos de eventos para teste
  const staticEvents: EventData[] = [
    {
      id: 1,
      title: "Festival de Verão de Faro",
      description: "Festival anual com música, arte e cultura",
      date: "2025-07-15",
      time: "18:00",
      location: "Parque Municipal de Faro",
      category: "Cultura",
      attendees: 500,
      imageUrl: "/placeholder.svg",
      featured: true,
      organizer: "Câmara Municipal de Faro"
    },
    {
      id: 2,
      title: "Feira de Artesanato",
      description: "Exposição e venda de artesanato local",
      date: "2025-05-20",
      time: "10:00",
      location: "Praça da Liberdade",
      category: "Artesanato",
      attendees: 200,
      imageUrl: "/placeholder.svg",
      featured: false,
      organizer: "Associação de Artesãos do Algarve"
    },
    {
      id: 3,
      title: "Concerto Filarmónica",
      description: "Concerto da Banda Filarmónica de Faro",
      date: "2025-06-10",
      time: "21:00",
      location: "Teatro Municipal de Faro",
      category: "Música",
      attendees: 300,
      imageUrl: "/placeholder.svg",
      featured: false,
      organizer: "Banda Filarmónica de Faro"
    },
    {
      id: 4,
      title: "Exposição de Arte Contemporânea",
      description: "Exposição de artistas locais e internacionais",
      date: "2025-05-25",
      time: "14:00",
      location: "Galeria Municipal",
      category: "Arte",
      attendees: 150,
      imageUrl: "/placeholder.svg",
      featured: true,
      organizer: "Associação Cultural de Faro"
    },
    {
      id: 5,
      title: "Torneio de Futebol Juvenil",
      description: "Competição entre equipes juvenis da região",
      date: "2025-06-05",
      time: "09:00",
      location: "Estádio Municipal",
      category: "Esporte",
      attendees: 400,
      imageUrl: "/placeholder.svg",
      featured: false,
      organizer: "Associação de Futebol do Algarve"
    }
  ];

  // Dados estáticos de notícias para teste
  const staticNews: NewsItem[] = [
    {
      source: { id: null, name: 'Jornal de Faro' },
      author: 'Maria Silva',
      title: 'Câmara Municipal anuncia novo projeto de revitalização urbana',
      description: 'Projeto visa melhorar áreas centrais da cidade com investimento de 2 milhões de euros',
      url: 'https://ligafaro.netlify.app',
      urlToImage: '/placeholder.svg',
      publishedAt: new Date().toISOString(),
      content: 'A Câmara Municipal de Faro anunciou hoje um novo projeto de revitalização urbana que irá transformar o centro histórico da cidade.',
      origem_busca: 'Local'
    },
    {
      source: { id: null, name: 'Diário do Algarve' },
      author: 'João Santos',
      title: 'Festival de Gastronomia atrai milhares de visitantes a Faro',
      description: 'Evento celebrou a culinária tradicional algarvia com grande sucesso',
      url: 'https://ligafaro.netlify.app',
      urlToImage: '/placeholder.svg',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
      content: 'O Festival de Gastronomia de Faro atraiu mais de 5 mil visitantes no último fim de semana, superando todas as expectativas dos organizadores.',
      origem_busca: 'Local'
    },
    {
      source: { id: null, name: 'RTP Algarve' },
      author: 'Ana Costa',
      title: 'Universidade do Algarve lança novo curso de Tecnologias Marinhas',
      description: 'Curso visa formar profissionais especializados em tecnologias sustentáveis para o mar',
      url: 'https://ligafaro.netlify.app',
      urlToImage: '/placeholder.svg',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
      content: 'A Universidade do Algarve anunciou o lançamento de um novo curso de licenciatura em Tecnologias Marinhas, que começará no próximo ano letivo.',
      origem_busca: 'Regional'
    },
    {
      source: { id: null, name: 'Observador' },
      author: 'Carlos Mendes',
      title: 'Farense garante permanência na primeira divisão',
      description: 'Equipe de Faro vence jogo decisivo e garante mais um ano na elite do futebol português',
      url: 'https://ligafaro.netlify.app',
      urlToImage: '/placeholder.svg',
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
      content: 'O Sporting Clube Farense garantiu matematicamente a permanência na primeira divisão do futebol português após vitória por 2-0 no último domingo.',
      origem_busca: 'Nacional'
    },
    {
      source: { id: null, name: 'Jornal Económico' },
      author: 'Pedro Alves',
      title: 'Turismo em Faro bate recordes no primeiro trimestre',
      description: 'Cidade registra aumento de 15% no número de visitantes em comparação com o mesmo período do ano passado',
      url: 'https://ligafaro.netlify.app',
      urlToImage: '/placeholder.svg',
      publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 dias atrás
      content: 'O setor de turismo em Faro registrou números recordes no primeiro trimestre de 2025, com um aumento de 15% no número de visitantes.',
      origem_busca: 'Nacional'
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Olá! Eu sou o assistente do LigaFaro. Em que posso ajudar?',
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Usar dados estáticos em vez de carregar dados externos
  const [eventsCache] = useState<EventData[]>(staticEvents);
  const [newsCache] = useState<NewsItem[]>(staticNews);

  // Log para debug
  useEffect(() => {
    console.log('Chatbot inicializado com dados estáticos:');
    console.log('Eventos:', staticEvents.length);
    console.log('Notícias:', staticNews.length);
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

  // Função principal para processar perguntas - versão simplificada para debug
  const processQuestion = async (question: string): Promise<string> => {
    try {
      console.log('Processando pergunta:', question);
      
      // Resposta estática para qualquer pergunta - para teste
      return `Resposta de teste para: "${question}"\n\nTemos ${eventsCache.length} eventos e ${newsCache.length} notícias disponíveis.`;
    } catch (error) {
      console.error('Erro ao processar pergunta:', error);
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  };

  const handleSend = async () => {
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
      setInput('');

      try {
        console.log('Chamando processQuestion');
        const botResponseText = await processQuestion(input);
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
