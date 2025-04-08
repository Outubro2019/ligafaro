
import { upcomingEvents } from "@/data/eventsData";
import EventList from "@/components/events/EventList";

const Events = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Eventos</h1>
        <p className="text-muted-foreground">Descubra eventos e atividades locais que acontecem em Faro.</p>
      </div>
      
      <EventList initialEvents={upcomingEvents} />
    </div>
  );
};

export default Events;
