import { lazy, Suspense } from 'react';

// Importação dinâmica do componente Chatbot
const ChatbotComponent = lazy(() => import('./Chatbot'));

// Componente de loading para o chatbot
const ChatbotLoading = () => (
  <div className="max-w-4xl mx-auto p-4">
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-bold">Assistente LigaFaro</h1>
      </div>
      <div className="flex justify-center items-center min-h-[350px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </div>
  </div>
);

// Componente wrapper que usa lazy loading
const LazyChatbot = () => {
  return (
    <Suspense fallback={<ChatbotLoading />}>
      <ChatbotComponent />
    </Suspense>
  );
};

export default LazyChatbot;