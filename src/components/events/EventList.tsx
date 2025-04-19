
import { useState } from "react";
import { EventData } from "@/types/EventTypes";
import EventCard from "./EventCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EventListProps {
  initialEvents: EventData[];
}

const EventList = ({ initialEvents }: EventListProps) => {
  const { toast } = useToast();
  const { user, registerUserEventInterest, registerUserEventParticipation } = useAuth();
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  
  const handleInterest = async (eventId: number) => {
    // Encontra o evento pelo ID
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Atualiza o contador de participantes localmente
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, attendees: event.attendees + 1 }
        : event
    ));
    
    // Exibe mensagem de confirmação
    toast({
      title: "Interesse registado!",
      description: "Vamos manter-te informado sobre este evento.",
    });
    
    // Se o usuário estiver logado, registra o interesse no perfil
    if (user) {
      try {
        // Registra o interesse no perfil do usuário com os dados do evento real
        await registerUserEventInterest({
          id: event.id,
          title: event.title,
          date: event.date,
          category: event.category,
          imageUrl: event.imageUrl
        });
        
        toast({
          title: "Pontos adicionados!",
          description: "Você ganhou 2 pontos por demonstrar interesse neste evento.",
          variant: "default"
        });
      } catch (error) {
        console.error("Erro ao registrar interesse no perfil:", error);
      }
    } else {
      // Se o usuário não estiver logado, sugere que faça login
      toast({
        title: "Faça login para ganhar pontos",
        description: "Registre-se ou faça login para acumular pontos ao demonstrar interesse em eventos.",
        variant: "default"
      });
    }
  };

  const handleParticipate = async (eventId: number) => {
    // Encontra o evento pelo ID
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Atualiza o contador de participantes localmente
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, attendees: event.attendees + 1 }
        : event
    ));
    
    // Exibe mensagem de confirmação
    toast({
      title: "Participação registrada!",
      description: "Sua participação neste evento foi registrada com sucesso.",
    });
    
    // Se o usuário estiver logado, registra a participação no perfil
    if (user) {
      try {
        // Registra a participação no perfil do usuário com os dados do evento real
        await registerUserEventParticipation({
          id: event.id,
          title: event.title,
          date: event.date,
          category: event.category,
          imageUrl: event.imageUrl
        });
        
        toast({
          title: "Pontos adicionados!",
          description: "Você ganhou 10 pontos por participar deste evento.",
          variant: "default"
        });
      } catch (error) {
        console.error("Erro ao registrar participação no perfil:", error);
      }
    } else {
      // Se o usuário não estiver logado, sugere que faça login
      toast({
        title: "Faça login para ganhar pontos",
        description: "Registre-se ou faça login para acumular pontos ao participar de eventos.",
        variant: "default"
      });
    }
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onInterestClick={handleInterest}
          onParticipateClick={handleParticipate}
        />
      ))}
    </div>
  );
};

export default EventList;
