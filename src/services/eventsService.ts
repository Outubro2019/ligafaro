import { EventData } from "@/types/EventTypes";
import { EventResponse } from "./types/eventTypes";
import { upcomingEvents } from "@/data/eventsData";
import eventsDataJson from "@/events_data.json";

/**
 * Serviço para gerenciar eventos
 */
export const eventsService = {
  /**
   * Obtém eventos da Câmara Municipal de Faro através de scraping
   */
  async getEvents(): Promise<EventResponse> {
    try {
      // Tenta carregar os eventos do arquivo JSON
      let events: EventData[] = [];
      
      try {
        console.log('Carregando eventos do arquivo JSON importado...');
        
        // Usa diretamente o arquivo JSON importado
        events = eventsDataJson as EventData[];
        console.log('Eventos reais carregados com sucesso:', events.length);
        
        // Adiciona um campo attendees se não existir
        events = events.map(event => ({
          ...event,
          attendees: event.attendees || 0
        }));
        
        return { events };
      } catch (error) {
        console.warn('Erro ao carregar eventos do JSON, usando dados estáticos:', error);
        // Fallback para dados estáticos em caso de erro
        events = upcomingEvents;
        return {
          events,
          error: 'Usando dados estáticos devido a erro ao carregar eventos reais.'
        };
      }
    } catch (error) {
      console.error('Erro ao obter eventos:', error);
      return { 
        events: upcomingEvents,
        error: 'Não foi possível carregar os eventos. Usando dados estáticos.'
      };
    }
  },
  
  /**
   * Executa o script Python para obter eventos atualizados
   */
  async fetchEventsFromPython(): Promise<void> {
    try {
      // Primeiro, tenta usar o endpoint específico para eventos
      try {
        const response = await fetch('/api/events');
        
        if (response.ok) {
          const result = await response.json();
          console.log('Eventos obtidos com sucesso via API:', result);
          return;
        } else {
          console.warn(`Erro ao obter eventos via API: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('Erro ao acessar API de eventos:', apiError);
      }
      
      // Fallback para o endpoint genérico
      const response = await fetch('/execute-python?script=src/services/python/fetch_events.py');
      
      if (!response.ok) {
        throw new Error(`Erro ao executar script Python: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Script Python executado com sucesso:', result);
    } catch (error) {
      console.error('Erro ao executar script Python:', error);
      throw error;
    }
  }
};