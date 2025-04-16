import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  focusManager
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "./components/Layout";
import { lazy, Suspense, useEffect } from "react";

// Importação dinâmica das páginas
const Dashboard = lazy(() => import("./pages/Dashboard"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));
const Forum = lazy(() => import("./pages/Forum"));
const Associacoes = lazy(() => import("./pages/Associacoes"));
const Community = lazy(() => import("./pages/Community"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const Chatbot = lazy(() => import("./pages/LazyChatbot"));
const MapPage = lazy(() => import("./pages/Map"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configuração para detectar quando a janela está em foco
function onFocus() {
  focusManager.setFocused(true);
}

function onBlur() {
  focusManager.setFocused(false);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => {
  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    
    // Verificar se o documento já está em foco
    if (document.hasFocus()) {
      onFocus();
    }
    
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // Componente de loading para Suspense
  const PageLoading = () => (
    <div className="flex items-center justify-center w-full h-[70vh]">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Dashboard />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/events" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Events />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/news" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <News />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/forum" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Forum />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/community" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Community />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/associacoes" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Associacoes />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/marketplace" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Marketplace />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/volunteer" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Volunteer />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/chatbot" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Chatbot />
                    </Suspense>
                  </MainLayout>
                } />
                <Route path="/map" element={
                  <MainLayout>
                    <Suspense fallback={<PageLoading />}>
                      <MapPage />
                    </Suspense>
                  </MainLayout>
                } />
                {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
                <Route path="*" element={
                  <Suspense fallback={<PageLoading />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
