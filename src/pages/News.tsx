import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/hooks/useNews";

const News = () => {
  const { data: news = [], isLoading, error } = useNews({
    refetchOnFocus: true,
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data desconhecida";
      }
      return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return "Data desconhecida";
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const publishDate = new Date(dateString);
      const now = new Date();
      
      if (isNaN(publishDate.getTime())) {
        return "";
      }
      
      const diffInSeconds = Math.floor((now.getTime() - publishDate.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return "Agora mesmo";
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
      } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`;
      } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `Há ${years} ${years === 1 ? 'ano' : 'anos'}`;
      }
    } catch (e) {
      console.error("Erro ao calcular tempo relativo:", e);
      return "";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Notícias de Faro</h1>
      <p className="text-muted-foreground">Fique por dentro das últimas notícias da nossa cidade e região.</p>
      
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mt-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <div className="px-6 pb-4">
                <Skeleton className="h-9 w-24" />
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {error && (
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Falha ao carregar notícias. Por favor, tente novamente mais tarde.</p>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col gap-4">
        {news.map((item, index) => (
          <Card key={index} className="w-full hover:shadow-md transition-all">
            <div className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {item.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.publishedAt)}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      Fonte: {item.source.name || "Desconhecida"}
                    </span>
                  </CardDescription>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {getTimeAgo(item.publishedAt)}
                  </span>
                </div>
              </CardHeader>
              {/* Descrição removida conforme solicitado */}
              <div className="px-6 pb-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  Ler mais <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {!isLoading && news.length === 0 && !error && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p>Não foram encontradas notícias. Tente novamente mais tarde.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default News;
