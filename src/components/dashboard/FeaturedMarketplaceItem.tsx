
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeaturedMarketplaceItemProps {
  item: {
    imageUrl: string;
    title: string;
    price: number;
    description: string;
    location: string;
  } | undefined;
}

const FeaturedMarketplaceItem = ({ item }: FeaturedMarketplaceItemProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Oportunidade no Mercado</CardTitle>
        <CardDescription>Item em destaque à venda</CardDescription>
      </CardHeader>
      <CardContent>
        {item ? (
          <div className="space-y-3">
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
          </div>
        ) : (
          <p>Ainda não há anúncios no mercado. Volte em breve!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/marketplace">Ver Mercado</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedMarketplaceItem;
