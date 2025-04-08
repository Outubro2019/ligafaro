
export interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  imageUrl?: string;
  featured?: boolean;
  organizer?: string;
}
