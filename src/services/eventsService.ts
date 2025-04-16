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
      // Tenta carregar os eventos do arquivo JSON gerado pelo script Python
      let events: EventData[] = [];
      
      try {
        // Em ambiente de desenvolvimento, executa o script Python para obter dados atualizados
        if (import.meta.env.DEV) {
          try {
            await this.fetchEventsFromPython();
          } catch (pythonError) {
            console.warn('Erro ao executar script Python:', pythonError);
            // Continuar mesmo com erro, pois o arquivo JSON pode já existir
          }
        }
        
        // Tenta carregar o arquivo JSON diretamente
        try {
          // Adiciona timestamp para evitar cache
          const timestamp = new Date().getTime();
          
          // Tenta carregar o arquivo JSON da pasta public
          const response = await fetch(`/events_data.json?t=${timestamp}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (response.ok) {
            events = await response.json();
            console.log('Eventos carregados com sucesso do JSON:', events.length);
          } else {
            console.warn('Resposta não ok ao carregar eventos:', response.status);
            throw new Error('Falha ao carregar eventos');
          }
        } catch (fetchError) {
          console.warn('Erro ao carregar arquivo JSON:', fetchError);
          throw fetchError;
        }
      } catch (error) {
        console.warn('Erro ao carregar eventos do JSON, usando dados estáticos:', error);
        // Fallback para dados estáticos em caso de erro
        events = upcomingEvents;
      }
      
      return { events };
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
    // Em ambiente de produção, não tenta executar o script Python
    if (!import.meta.env.DEV) {
      console.log('Ambiente de produção: não executando script Python');
      return;
    }
    
    try {
      // Adiciona timestamp para evitar cache
      const timestamp = new Date().getTime();
      
      // Apenas em ambiente de desenvolvimento, tenta usar a API
      try {
        const response = await fetch(`/api/events?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
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
      
      // Fallback para o endpoint genérico (apenas em desenvolvimento)
      const response = await fetch(`/api/fetch-events?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
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