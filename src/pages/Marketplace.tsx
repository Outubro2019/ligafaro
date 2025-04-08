
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { marketplaceItems } from "@/data/marketplaceData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Marketplace = () => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Mercado</h1>
      <p className="text-muted-foreground">Compre, venda e troque itens com a comunidade local de Faro.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {marketplaceItems.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {formatPrice(item.price)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {item.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{item.category}</Badge>
                <Badge variant="outline">{item.condition}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(item.postedDate)}
              </div>
              <Button size="sm">Ver detalhes</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
