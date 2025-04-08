
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeaturedEventProps {
  event: {
    title: string;
    imageUrl: string;
    date: string;
    time: string;
    location: string;
  } | undefined;
}

const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximo Evento</CardTitle>
        <CardDescription>Não perca este evento em destaque</CardDescription>
      </CardHeader>
      <CardContent>
        {event ? (
          <div className="space-y-3">
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Não há eventos próximos. Volte em breve!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/events">Ver Todos os Eventos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedEvent;
