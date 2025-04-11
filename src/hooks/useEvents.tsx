import { useState, useEffect } from "react";
import { EventData } from "@/types/EventTypes";
import { eventsService } from "@/services/eventsService";

export const useEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsService.getEvents();
        
        if (response.error) {
          setError(response.error);
        } else {
          setError(null);
        }
        
        setEvents(response.events);
      } catch (err) {
        setError("Erro ao carregar eventos. Por favor, tente novamente mais tarde.");
        console.error("Erro ao carregar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export default useEvents;