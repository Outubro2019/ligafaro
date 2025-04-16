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
        // Comentado para usar diretamente o arquivo JSON como no Netlify
        // Em ambiente de desenvolvimento, executa o script Python para obter dados atualizados
        /*
        if (import.meta.env.DEV) {
          try {
            await this.fetchEventsFromPython();
          } catch (pythonError) {
            console.warn('Erro ao executar script Python:', pythonError);
            // Continuar mesmo com erro, pois o arquivo JSON pode já existir
          }
        }
        */
        
        // Tenta carregar o arquivo JSON diretamente (mesmo método usado no Netlify)
        try {
          console.log('Tentando carregar eventos do arquivo JSON...');
          
          // Adiciona timestamp para evitar cache
          const timestamp = new Date().getTime();
          
          // Tenta várias URLs possíveis para o arquivo JSON
          const urls = [
            `/events_data.json?url&t=${timestamp}`,
            `/public/events_data.json?url&t=${timestamp}`,
            `./events_data.json?url&t=${timestamp}`,
            `./public/events_data.json?url&t=${timestamp}`
          ];
          
          let loaded = false;
          let lastError = null;
          
          // Tenta cada URL até encontrar uma que funcione
          for (const url of urls) {
            try {
              console.log(`Tentando carregar eventos de: ${url}`);
              
              const response = await fetch(url, {
                headers: {
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
                }
              });
              
              if (response.ok) {
                events = await response.json();
                console.log(`Eventos carregados com sucesso de ${url}: ${events.length} eventos`);
                loaded = true;
                break;
              } else {
                console.warn(`Resposta não ok ao carregar eventos de ${url}: ${response.status}`);
              }
            } catch (urlError) {
              console.warn(`Erro ao carregar arquivo JSON de ${url}:`, urlError);
              lastError = urlError;
            }
          }
          
          if (!loaded) {
            throw lastError || new Error('Falha ao carregar eventos de todas as URLs tentadas');
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
   * Nota: Esta função está mantida apenas para referência, mas não é mais chamada
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