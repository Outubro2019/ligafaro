
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventData } from "@/types/EventTypes";
import { getCategoryColor } from "@/utils/eventUtils";

interface EventCardProps {
  event: EventData;
  onInterestClick: (eventId: number) => void;
  onParticipateClick?: (eventId: number) => void;
}

const EventCard = ({ event, onInterestClick, onParticipateClick }: EventCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
      {event.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="h-3 bg-gradient-to-r from-purple-500 to-blue-500" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-display">{event.title}</CardTitle>
          <Badge className={`${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.attendees} pessoas a participar</span>
          </div>
          {event.organizer && (
            <div className="text-sm mt-2">
              <span className="font-medium">Organizado por:</span> {event.organizer}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={() => onInterestClick(event.id)}
            className="gap-2"
            size="sm"
            variant="outline"
          >
            <Heart className="h-4 w-4" />
            Tenho interesse
          </Button>
          
          {onParticipateClick && (
            <Button
              onClick={() => onParticipateClick(event.id)}
              className="gap-2"
              size="sm"
            >
              <CheckCircle className="h-4 w-4" />
              Participar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
