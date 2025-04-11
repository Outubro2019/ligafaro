import { useState, useEffect } from "react";
import EventList from "@/components/events/EventList";
import useEvents from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const Events = () => {
  const { events, loading, error } = useEvents();

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
        <EventList initialEvents={events} />
      )}
    </div>
  );
};

export default Events;
