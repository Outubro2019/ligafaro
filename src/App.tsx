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
import Chatbot from "./pages/Chatbot";
import MainLayout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import Events from "./pages/Events";
import Forum from "./pages/Forum";
import Associacoes from "./pages/Associacoes";
import Community from "./pages/Community";
import Marketplace from "./pages/Marketplace";
import Volunteer from "./pages/Volunteer";
import MapPage from "./pages/Map";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

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
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/events" element={
                <MainLayout>
                  <Events />
                </MainLayout>
              } />
              <Route path="/news" element={
                <MainLayout>
                  <News />
                </MainLayout>
              } />
              <Route path="/forum" element={
                <MainLayout>
                  <Forum />
                </MainLayout>
              } />
              <Route path="/community" element={
                <MainLayout>
                  <Community />
                </MainLayout>
              } />
              <Route path="/associacoes" element={
                <MainLayout>
                  <Associacoes />
                </MainLayout>
              } />
              <Route path="/marketplace" element={
                <MainLayout>
                  <Marketplace />
                </MainLayout>
              } />
              <Route path="/volunteer" element={
                <MainLayout>
                  <Volunteer />
                </MainLayout>
              } />
               <Route path="/chatbot" element={
                 <MainLayout>
                   <Chatbot />
                 </MainLayout>
               } />
               <Route path="/map" element={
                 <MainLayout>
                   <MapPage />
                 </MainLayout>
               } />
               <Route path="/games" element={
                 <MainLayout>
                   <Games />
                 </MainLayout>
               } />
               <Route path="/profile" element={
                 <MainLayout>
                   <Profile />
                 </MainLayout>
               } />
              {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
