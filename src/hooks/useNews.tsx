import { useQuery } from "@tanstack/react-query";
import { fetchNews, NewsItem } from "@/services/newsService";
import { useToast } from "@/components/ui/use-toast";

interface UseNewsOptions {
  query?: string;
  pageSize?: number;
  refetchOnFocus?: boolean;
}

export const useNews = ({
  query = 'Faro Algarve',
  pageSize = 10,
  refetchOnFocus = true
}: UseNewsOptions = {}) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['news', query, pageSize],
    queryFn: async () => {
      try {
        console.log(`Fetching news for query: "${query}" with pageSize: ${pageSize}...`);

        const newsData = await fetchNews(query, pageSize);

        if (newsData.length === 0) {
          console.log('No news found.');
          toast({
            title: "Sem notícias",
            description: "Não foi possível encontrar notícias recentes.",
            variant: "destructive"
          });
        } else {
          console.log(`Found ${newsData.length} news items.`);
        }

        return newsData;
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao buscar as notícias. Tente novamente mais tarde.",
          variant: "destructive"
        });
        return [];
      }
    },
    staleTime: 0, // Força o recarregamento das notícias
    refetchOnWindowFocus: refetchOnFocus,
    refetchOnMount: true,
    retry: 2,
  });
};
