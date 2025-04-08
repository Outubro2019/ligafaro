
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/hooks/useNews";

const LatestNews = () => {
  const { data: news = [], isLoading } = useNews({
    pageSize: 3,
    refetchOnFocus: true
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight mt-8">Últimas Notícias</h2>
      
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {news.map((item, index) => (
              <Card key={index} className="w-full">
                <div className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <p className="text-xs font-medium mt-1">Fonte: {item.source.name || "Desconhecida"}</p>
                  </CardHeader>
                  {/* Descrição removida conforme solicitado */}
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 p-0 h-auto text-xs text-primary"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      Ler mais <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/news">
                Ver todas as notícias <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LatestNews;
