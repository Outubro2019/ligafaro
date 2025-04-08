
import { useState } from "react";
import { EventData } from "@/types/EventTypes";
import EventCard from "./EventCard";
import { useToast } from "@/hooks/use-toast";

interface EventListProps {
  initialEvents: EventData[];
}

const EventList = ({ initialEvents }: EventListProps) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  
  const handleInterest = (eventId: number) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, attendees: event.attendees + 1 } 
        : event
    ));
    
    toast({
      title: "Interesse registado!",
      description: "Vamos manter-te informado sobre este evento.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onInterestClick={handleInterest} 
        />
      ))}
    </div>
  );
};

export default EventList;
