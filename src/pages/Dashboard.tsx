
import FeaturedSection from "@/components/dashboard/FeaturedSection";
import LatestNews from "@/components/dashboard/LatestNews";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
      <p className="text-muted-foreground">Bem-vindo ao LigaFaro, o seu centro comunitário para tudo relacionado com Faro!</p>
      
      <FeaturedSection />
      <LatestNews />
    </div>
  );
};

export default Dashboard;
