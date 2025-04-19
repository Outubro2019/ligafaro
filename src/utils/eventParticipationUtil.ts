import { EventData } from "@/types/EventTypes";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook para usar as funções de simulação de participação em eventos
 */
export const useEventParticipation = () => {
  const {
    user,
    refreshUserExtendedInfo,
    registerUserEventParticipation,
    registerUserEventInterest
  } = useAuth();
  
  /**
   * Função para simular a participação do usuário em eventos passados
   * Isso é útil para demonstração e teste do sistema de pontuação
   */
  const simulateParticipation = async (events: EventData[], count: number = 3): Promise<boolean> => {
    if (!user) {
      console.error("Usuário não autenticado");
      return false;
    }
    
    try {
      // Seleciona eventos aleatórios para simular a participação
      const randomEvents = [...events]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
      
      // Registra a participação em cada evento
      for (const event of randomEvents) {
        await registerUserEventParticipation({
          id: event.id,
          title: event.title,
          date: event.date,
          category: event.category,
          imageUrl: event.imageUrl
        }, 10); // 10 pontos por participação
      }
      
      // Atualiza as informações do usuário
      await refreshUserExtendedInfo();
      
      return true;
    } catch (error) {
      console.error("Erro ao simular participação em eventos:", error);
      return false;
    }
  };
  
  /**
   * Função para simular o interesse do usuário em eventos futuros
   */
  const simulateInterest = async (events: EventData[], count: number = 5): Promise<boolean> => {
    if (!user) {
      console.error("Usuário não autenticado");
      return false;
    }
    
    try {
      // Seleciona eventos aleatórios para simular o interesse
      const randomEvents = [...events]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
      
      // Registra o interesse em cada evento
      for (const event of randomEvents) {
        await registerUserEventInterest({
          id: event.id,
          title: event.title,
          date: event.date,
          category: event.category,
          imageUrl: event.imageUrl
        }, 2); // 2 pontos por interesse
      }
      
      // Atualiza as informações do usuário
      await refreshUserExtendedInfo();
      
      return true;
    } catch (error) {
      console.error("Erro ao simular interesse em eventos:", error);
      return false;
    }
  };
  
  return {
    simulateParticipation,
    simulateInterest
  };
};