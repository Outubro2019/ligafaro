
import { upcomingEvents } from "@/data/eventsData";
import { forumPosts } from "@/data/forumData";
import { marketplaceItems } from "@/data/marketplaceData";
import FeaturedEvent from "./FeaturedEvent";
import FeaturedForumPost from "./FeaturedForumPost";
import FeaturedMarketplaceItem from "./FeaturedMarketplaceItem";

const FeaturedSection = () => {
  // Featured items
  const featuredEvent = upcomingEvents[0];
  const featuredPost = forumPosts[0];
  const featuredItem = marketplaceItems[0];

  // Ensure required properties exist, providing defaults if needed
  const eventWithDefaults = {
    ...featuredEvent,
    imageUrl: featuredEvent.imageUrl || '/placeholder.svg'
  };

  const postWithDefaults = {
    ...featuredPost,
    avatarUrl: featuredPost.avatarUrl || '/placeholder.svg'
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <FeaturedEvent event={eventWithDefaults} />
      <FeaturedForumPost post={postWithDefaults} />
      <FeaturedMarketplaceItem item={featuredItem} />
    </div>
  );
};

export default FeaturedSection;
