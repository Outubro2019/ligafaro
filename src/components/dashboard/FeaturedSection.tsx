import useEvents from "@/hooks/useEvents";
import { forumPosts } from "@/data/forumData";
import { marketplaceItems } from "@/data/marketplaceData";
import FeaturedEvent from "./FeaturedEvent";
import FeaturedForumPost from "./FeaturedForumPost";
import FeaturedMarketplaceItem from "./FeaturedMarketplaceItem";

// Função para converter a primeira data do campo date
function parseEventDate(dateString: string): string | null {
  const firstDate = dateString.split('-')[0].trim();
  const match = firstDate.match(/^(\d{1,2}) (\w{3}) (\d{4})$/i);
  if (!match) return null;
  const [_, day, monthStr, year] = match;
  const months = {
    jan: "01", fev: "02", mar: "03", abr: "04", mai: "05", jun: "06",
    jul: "07", ago: "08", set: "09", out: "10", nov: "11", dez: "12"
  };
  const month = months[monthStr.toLowerCase()];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

const FeaturedSection = () => {
  const { events = [] } = useEvents();
  const today = new Date();

  // Converte e filtra eventos futuros
  const validEvents = events
    .map(ev => ({
      ...ev,
      dateISO: parseEventDate(ev.date) || "2025-04-20",
    }))
    .filter(ev => {
      const eventDate = new Date(ev.dateISO);
      return (
        eventDate.getFullYear() > today.getFullYear() ||
        (eventDate.getFullYear() === today.getFullYear() &&
          (eventDate.getMonth() > today.getMonth() ||
            (eventDate.getMonth() === today.getMonth() &&
              eventDate.getDate() >= today.getDate())))
      );
    });

  const featuredEvent = validEvents.length > 0 ? validEvents[0] : {
    title: "Evento Exemplo",
    imageUrl: "/placeholder.svg",
    date: "2025-04-20",
    time: "21:00",
    location: "Teatro Municipal"
  };

  const featuredPost = forumPosts[0];
  const featuredItem = marketplaceItems[0];

  const eventWithDefaults = {
    ...featuredEvent,
    imageUrl: featuredEvent.imageUrl || '/placeholder.svg',
    date: featuredEvent.dateISO || featuredEvent.date
  };

  const postWithDefaults = {
    ...featuredPost,
    avatarUrl: featuredPost.avatarUrl || '/placeholder.svg'
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <FeaturedEvent events={[eventWithDefaults]} />
      <FeaturedForumPost post={postWithDefaults} />
      <FeaturedMarketplaceItem item={featuredItem} />
    </div>
  );
};

export default FeaturedSection;