import EventList from "@/components/events/EventList";
import useEvents from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

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

const Events = () => {
  const { events = [], loading, error } = useEvents();

  // Aplica o parsing de datas a todos os eventos
  const parsedEvents = events.map(ev => ({
    ...ev,
    date: parseEventDate(ev.date) || ev.date // substitui pelo formato ISO se possível
  }));

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
        <EventList initialEvents={parsedEvents} />
      )}
    </div>
  );
};

export default Events;