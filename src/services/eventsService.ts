import { EventData } from "@/types/EventTypes";
import { EventResponse } from "./types/eventTypes";
import { upcomingEvents } from "@/data/eventsData";

/**
 * Serviço para gerenciar eventos
 */
export const eventsService = {
  /**
   * Obtém eventos da Câmara Municipal de Faro através de scraping
   */
  async getEvents(): Promise<EventResponse> {
    try {
      // Tenta carregar os eventos do arquivo JSON público
      let events: EventData[] = [];
      
      try {
        console.log('Carregando eventos do arquivo JSON público...');
        
        const response = await fetch('/events_data.json');
        
        if (response.ok) {
          const eventsData = await response.json();
          console.log('Eventos carregados com sucesso do JSON público');
          
          if (Array.isArray(eventsData) && eventsData.length > 0) {
            events = eventsData.map(event => ({
              ...event,
              attendees: event.attendees || 0
            }));
            console.log('Número de eventos:', events.length);
            console.log('Primeiro evento:', events[0].title);
            return { events };
          }
        } else {
          console.warn('Falha ao carregar eventos do JSON público:', response.status);
        }
      } catch (error) {
        console.warn('Erro ao carregar eventos do JSON público:', error);
      }
      
      // Fallback para dados estáticos em caso de erro
      console.log('Usando dados estáticos como fallback');
      events = upcomingEvents;
      return {
        events,
        error: 'Usando dados estáticos devido a erro ao carregar eventos reais.'
      };
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