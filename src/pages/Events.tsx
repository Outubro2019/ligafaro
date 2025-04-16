import { useState } from "react";
import EventList from "@/components/events/EventList";
import useEvents from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventData } from "@/types/EventTypes";

// Função para converter a primeira data do campo date
function parseEventDate(dateString: string): string | null {
  const firstDate = dateString.split('-')[0].trim();
  const match = firstDate.match(/^(\d{1,2}) (\w{3}) (\d{4})$/i);
  if (!match) return null;
  const [_, day, monthStr, year] = match;
  const months = {
    jan: "01", fev: "02", mar: "03", abr: "04", mai: "05", jun: "06",
    jul: "07", ago: "08", set: "09", out: "10", nov: "11", dez: "12"
  };
  const month = months[monthStr.toLowerCase()];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

// Função para verificar se um evento está em exibição (começou mas não terminou)
function isOngoing(dateString: string): boolean {
  // Verifica se a string de data contém um intervalo (com hífen)
  if (!dateString.includes('-')) return false;
  
  try {
    // Divide a string em data de início e fim
    const dates = dateString.split('-').map(d => d.trim());
    if (dates.length !== 2) return false;
    
    // Função auxiliar para converter mês em formato texto para número
    const getMonthNumber = (monthStr: string): number => {
      const months: Record<string, number> = {
        'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11,
        'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
        'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
      };
      return months[monthStr.toLowerCase()] || 0;
    };
    
    // Função para analisar uma data no formato "DD MMM YYYY" ou "DD MMM YYYY"
    const parseDate = (dateStr: string): Date | null => {
      // Tenta o formato "DD MMM YYYY"
      let match = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/i);
      if (match) {
        const [_, day, month, year] = match;
        return new Date(parseInt(year), getMonthNumber(month), parseInt(day));
      }
      
      // Tenta o formato "DD MMM YYYY"
      match = dateStr.match(/(\d{1,2})\s+(\w{3,4})\s+(\d{4})/i);
      if (match) {
        const [_, day, month, year] = match;
        return new Date(parseInt(year), getMonthNumber(month.substring(0, 3)), parseInt(day));
      }
      
      return null;
    };
    
    // Analisa as datas de início e fim
    const startDate = parseDate(dates[0]);
    
    // Para a data de fim, se não tiver o ano, usa o ano da data de início
    let endDateStr = dates[1];
    if (!endDateStr.includes('20')) {
      const startYear = dates[0].match(/(\d{4})/)?.[1] || new Date().getFullYear().toString();
      endDateStr += ` ${startYear}`;
    }
    const endDate = parseDate(endDateStr);
    
    if (!startDate || !endDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Evento está em exibição se a data atual está entre a data de início e fim
    return startDate <= today && today <= endDate;
  } catch (error) {
    console.error("Erro ao analisar data:", dateString, error);
    return false;
  }
}

// Função para verificar se um evento é hoje
function isToday(dateString: string): boolean {
  const dateStr = parseEventDate(dateString.split('-')[0].trim());
  if (!dateStr) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  
  return eventDate.getTime() === today.getTime();
}

// Função para verificar se um evento é amanhã
function isTomorrow(dateString: string): boolean {
  const dateStr = parseEventDate(dateString.split('-')[0].trim());
  if (!dateStr) return false;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  
  return eventDate.getTime() === tomorrow.getTime();
}

// Função para verificar se um evento é futuro (hoje ou depois)
function isUpcoming(dateString: string): boolean {
  try {
    // Para eventos com intervalo de datas, considera apenas a data de início
    const firstDateStr = dateString.split('-')[0].trim();
    
    // Função auxiliar para converter mês em formato texto para número
    const getMonthNumber = (monthStr: string): number => {
      const months: Record<string, number> = {
        'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11,
        'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
        'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
      };
      return months[monthStr.toLowerCase()] || 0;
    };
    
    // Função para analisar uma data no formato "DD MMM YYYY" ou "DD MMM YYYY"
    const parseDate = (dateStr: string): Date | null => {
      // Tenta o formato "DD MMM YYYY"
      let match = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/i);
      if (match) {
        const [_, day, month, year] = match;
        return new Date(parseInt(year), getMonthNumber(month), parseInt(day));
      }
      
      // Tenta o formato "DD MMM YYYY"
      match = dateStr.match(/(\d{1,2})\s+(\w{3,4})\s+(\d{4})/i);
      if (match) {
        const [_, day, month, year] = match;
        return new Date(parseInt(year), getMonthNumber(month.substring(0, 3)), parseInt(day));
      }
      
      return null;
    };
    
    const eventDate = parseDate(firstDateStr);
    if (!eventDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventDate >= today;
  } catch (error) {
    console.error("Erro ao analisar data para evento futuro:", dateString, error);
    return false;
  }
}

// Função para adicionar marcadores de HOJE e AMANHÃ aos eventos
function addDateMarkers(events: EventData[]): EventData[] {
  return events.map(event => {
    let dateWithMarker = event.date;
    
    if (isToday(event.date)) {
      dateWithMarker = `${event.date} <span class="text-red-600 font-bold">HOJE</span>`;
    } else if (isTomorrow(event.date)) {
      dateWithMarker = `${event.date} <span class="text-black font-bold">AMANHÃ</span>`;
    }
    
    return {
      ...event,
      date: dateWithMarker
    };
  });
}

const Events = () => {
  const { events = [], loading, error } = useEvents();

  // Aplica o parsing de datas a todos os eventos
  const parsedEvents = events.map(ev => ({
    ...ev,
    parsedDate: parseEventDate(ev.date) || ev.date // adiciona campo parsedDate para ordenação
  }));
  
  // Filtra eventos em exibição (começaram mas não terminaram)
  const ongoingEvents = addDateMarkers(
    parsedEvents.filter(event => isOngoing(event.date) && !isUpcoming(event.date))
  );
  
  // Filtra eventos futuros (hoje ou depois)
  const upcomingEvents = addDateMarkers(
    parsedEvents
      .filter(event => isUpcoming(event.date))
      .sort((a, b) => {
        // Ordena por data, com a mais próxima primeiro
        const dateA = new Date(a.parsedDate);
        const dateB = new Date(b.parsedDate);
        return dateA.getTime() - dateB.getTime();
      })
  );

  console.log("Eventos em exibição:", ongoingEvents.length);
  console.log("Eventos futuros:", upcomingEvents.length);

  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Eventos</h1>
        <p className="text-muted-foreground">Descubra eventos e atividades locais que acontecem em Faro.</p>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger
              value="upcoming"
              onClick={() => setActiveTab("upcoming")}
            >
              Próximos Eventos
            </TabsTrigger>
            <TabsTrigger
              value="ongoing"
              onClick={() => setActiveTab("ongoing")}
            >
              Em Exibição
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <EventList initialEvents={upcomingEvents} />
            ) : (
              <div className="p-4 border border-gray-200 bg-gray-50 text-gray-700 rounded-md">
                Não há próximos eventos agendados.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ongoing">
            {ongoingEvents.length > 0 ? (
              <EventList initialEvents={ongoingEvents} />
            ) : (
              <div className="p-4 border border-gray-200 bg-gray-50 text-gray-700 rounded-md">
                Não há eventos em exibição no momento.
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Events;