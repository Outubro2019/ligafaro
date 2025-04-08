
import FeaturedSection from "@/components/dashboard/FeaturedSection";
import LatestNews from "@/components/dashboard/LatestNews";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
      <p className="text-muted-foreground">Bem-vindo ao LigaFaro, o seu centro comunitário para tudo relacionado com Faro!</p>
      
      <FeaturedSection />
      <div id="latest-news-container" className="mt-8 border-t pt-8">
        <LatestNews />
      </div>
    </div>
  );
};

export default Dashboard;
