import { EventData } from "@/types/EventTypes";

export interface EventResponse {
  events: EventData[];
  error?: string;
}