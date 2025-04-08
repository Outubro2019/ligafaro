import React, { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Olá! Eu sou o assistente do LigaFaro. Como posso ajudar hoje?',
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const processQuestion = async (question: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error('Erro ao obter resposta da API');
      }

      const data = await response.json();
      return data.answer;
    } catch (error) {
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);

      const botResponseText = await processQuestion(input);
      const botResponse: Message = { text: botResponseText, sender: 'bot' };
      setMessages((prev) => [...prev, botResponse]);
      setInput('');
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
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Enviar
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Dica: Pode perguntar sobre eventos, locais ou categorias específicas.
          </p>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chatbot;
