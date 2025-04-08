
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

interface VolunteerOpportunity {
  id: number;
  title: string;
  description: string;
  organization: string;
  location: string;
  date: string;
  time: string;
  imageUrl: string;
  category: string;
  participantsNeeded: number;
}

const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: 1,
    title: "Limpeza da Praia de Faro",
    description: "Junte-se a nós para ajudar a manter a nossa linda praia limpa e segura para todos. Fornecemos todo o equipamento necessário.",
    organization: "Ambiente Faro",
    location: "Praia de Faro",
    date: "15 de Julho, 2023",
    time: "09:00 - 13:00",
    imageUrl: "https://images.unsplash.com/photo-1618477462146-050d2767eac4?q=80&w=800",
    category: "Ambiente",
    participantsNeeded: 15
  },
  {
    id: 2,
    title: "Festival de Artes para Crianças",
    description: "Voluntários para supervisionar atividades artísticas para crianças durante o festival anual de artes de Faro.",
    organization: "Associação Cultural de Faro",
    location: "Jardim Manuel Bivar",
    date: "22-23 de Julho, 2023",
    time: "16:00 - 20:00",
    imageUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800",
    category: "Cultura",
    participantsNeeded: 8
  },
  {
    id: 3,
    title: "Apoio ao Centro de Idosos",
    description: "Procuramos voluntários para companhia e auxílio nas atividades diárias dos nossos residentes idosos.",
    organization: "Centro Social Sénior de Faro",
    location: "Rua da Solidariedade, 23",
    date: "Contínuo",
    time: "Flexível",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800",
    category: "Social",
    participantsNeeded: 10
  },
  {
    id: 4,
    title: "Distribuição de Alimentos",
    description: "Ajude na distribuição de refeições para pessoas necessitadas. Procuramos pessoas com carta de condução e disponibilidade.",
    organization: "Banco Alimentar de Faro",
    location: "Várias localizações",
    date: "Todos os Domingos",
    time: "11:00 - 14:00",
    imageUrl: "https://images.unsplash.com/photo-1541802645635-11f2286a7482?q=80&w=800",
    category: "Social",
    participantsNeeded: 6
  }
];

const Volunteer = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Voluntariado</h1>
      <p className="text-muted-foreground">Encontre oportunidades de voluntariado na área de Faro e faça a diferença na nossa comunidade.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {volunteerOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={opportunity.imageUrl} 
                alt={opportunity.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {opportunity.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{opportunity.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{opportunity.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{opportunity.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{opportunity.participantsNeeded} vagas</span>
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <p className="text-sm font-medium">Organização: {opportunity.organization}</p>
                <button className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                  Voluntariar-me
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Volunteer;
