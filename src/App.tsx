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
import { useEffect, Suspense } from "react";

// Importar componentes lazy centralizados
import {
  Dashboard,
  News,
  Events,
  Forum,
  Associacoes,
  Community,
  Marketplace,
  Volunteer,
  Chatbot,
  MapPage,
  Profile,
  Games,
  NotFound
} from "@/utils/lazyComponents";

// Componente de loading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/events" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Events />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/news" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <News />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/forum" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Forum />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/community" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Community />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/associacoes" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Associacoes />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/marketplace" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Marketplace />
                  </Suspense>
                </MainLayout>
              } />
              <Route path="/volunteer" element={
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Volunteer />
                  </Suspense>
                </MainLayout>
              } />
               <Route path="/chatbot" element={
                 <MainLayout>
                   <Suspense fallback={<PageLoader />}>
                     <Chatbot />
                   </Suspense>
                 </MainLayout>
               } />
               <Route path="/map" element={
                 <MainLayout>
                   <Suspense fallback={<PageLoader />}>
                     <MapPage />
                   </Suspense>
                 </MainLayout>
               } />
               <Route path="/games" element={
                 <MainLayout>
                   <Suspense fallback={<PageLoader />}>
                     <Games />
                   </Suspense>
                 </MainLayout>
               } />
               <Route path="/profile" element={
                 <MainLayout>
                   <Suspense fallback={<PageLoader />}>
                     <Profile />
                   </Suspense>
                 </MainLayout>
               } />
             {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
             <Route path="*" element={
               <Suspense fallback={<PageLoader />}>
                 <NotFound />
               </Suspense>
             } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
