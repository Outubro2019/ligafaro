import React, { useState, useEffect, useRef } from 'react';

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

  // Função para processar perguntas usando o endpoint da API
  const processQuestion = async (question: string): Promise<string> => {
    try {
      console.log('Enviando pergunta para o servidor:', question);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter resposta da API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Resposta recebida do servidor:', data);
      
      return data.answer || 'Não foi possível obter uma resposta.';
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
