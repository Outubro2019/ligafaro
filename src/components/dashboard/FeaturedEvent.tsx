import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define o tipo de evento
interface Event {
  title: string;
  imageUrl: string;
  date: string; // Formato: "YYYY-MM-DD"
  time: string; // Ex: "10:00 - 23:00"
  location: string;
}

interface FeaturedEventProps {
  events: Event[];
}

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isTomorrow(date: Date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

const FeaturedEvent = ({ events }: FeaturedEventProps) => {
  const today = useMemo(() => new Date(), []);

  // Filtra eventos futuros (hoje ou depois)
  const futureEvents = useMemo(() => {
    return events
      .map(event => ({
        ...event,
        dateObj: new Date(event.date)
      }))
      .filter(event => {
        // Só eventos a partir de hoje
        const eventDate = event.dateObj;
        return (
          eventDate.getFullYear() > today.getFullYear() ||
          (eventDate.getFullYear() === today.getFullYear() &&
            (eventDate.getMonth() > today.getMonth() ||
              (eventDate.getMonth() === today.getMonth() && eventDate.getDate() >= today.getDate())))
        );
      });
  }, [events, today]);

  // Agrupa por data, encontra a data mais próxima
  const featuredEvent = useMemo(() => {
    if (futureEvents.length === 0) return undefined;

    // Agrupa eventos por data (string)
    const eventsByDate: { [date: string]: Event[] } = {};
    futureEvents.forEach(event => {
      const key = event.date;
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push(event);
    });

    // Ordena as datas
    const sortedDates = Object.keys(eventsByDate).sort();

    // Data mais próxima
    const nearestDate = sortedDates[0];
    const candidates = eventsByDate[nearestDate];

    // Escolhe um aleatório se houver mais do que um
    const randomIdx = Math.floor(Math.random() * candidates.length);
    return candidates[randomIdx];
  }, [futureEvents]);

  // Renderização
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximo Evento</CardTitle>
        <CardDescription>Não perca este evento em destaque</CardDescription>
      </CardHeader>
      <CardContent>
        {featuredEvent ? (
          <div className="space-y-3">
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img
                src={featuredEvent.imageUrl}
                alt={featuredEvent.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">{featuredEvent.title}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {featuredEvent.date}
                  {" "}
                  {isToday(new Date(featuredEvent.date)) && (
                    <span style={{ color: "red", fontWeight: "bold", marginLeft: 8 }}>HOJE!</span>
                  )}
                  {isTomorrow(new Date(featuredEvent.date)) && (
                    <span style={{ color: "black", fontWeight: "bold", marginLeft: 8 }}>AMANHÃ</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{featuredEvent.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{featuredEvent.location}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Nenhum evento futuro encontrado.</div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/events">Ver Todos os Eventos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedEvent;