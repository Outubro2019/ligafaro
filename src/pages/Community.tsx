
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Community = () => {
  const communityMembers = [
    {
      id: 1,
      name: "Maria Santos",
      role: "Costureira",
      location: "Penha",
      interests: ["Costura", "Educação"],
      avatar: "MS"
    },
    {
      id: 2,
      name: "João Silva",
      role: "Carpinteiro",
      location: "Montenegro",
      interests: ["Carpintaria", "Artesanato"],
      avatar: "JS"
    },
    {
      id: 3,
      name: "Ana Oliveira",
      role: "Costureira",
      location: "Praia de Faro",
      interests: ["Costura", "Educação"],
      avatar: "AO"
    },
    {
      id: 4,
      name: "Miguel Costa",
      role: "Informático",
      location: "Bom João",
      interests: ["Tecnologia", "Desporto"],
      avatar: "MC"
    },
    {
      id: 5,
      name: "Sofia Martins",
      role: "Professora",
      location: "Gambelas",
      interests: ["Educação", "Literatura"],
      avatar: "SM"
    },
    {
      id: 6,
      name: "Francisco Pereira",
      role: "Jardineiro",
      location: "São Pedro",
      interests: ["Jardinagem", "História"],
      avatar: "FP"
    },
    {
      id: 7,
      name: "Carla Nunes",
      role: "Enfermeira",
      location: "Penha",
      interests: ["Saúde", "Culinária"],
      avatar: "CN"
    },
    {
      id: 8,
      name: "Ricardo Alves",
      role: "Guia Turístico",
      location: "Marina",
      interests: ["Viagens", "Línguas"],
      avatar: "RA"
    }
  ];

  const getAvatarColor = (id: number) => {
    const colors = [
      "from-purple-500 to-blue-500",
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500",
      "from-amber-500 to-orange-500",
      "from-green-500 to-emerald-500",
      "from-indigo-500 to-violet-500",
      "from-red-500 to-pink-500",
      "from-teal-500 to-green-500"
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Comunidade</h1>
        <p className="text-muted-foreground">Conheça e conecte-se com outros membros da comunidade de Faro.</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {communityMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center pt-6 pb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(member.id)} flex items-center justify-center text-white font-semibold text-xl mb-3`}>
                {member.avatar}
              </div>
              <CardTitle className="font-display text-lg">{member.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              
              <div className="flex gap-1 mt-2">
                {member.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs bg-soft-gray">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <CardContent className="bg-soft-gray/50 pt-3 pb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span>{member.location}</span>
              </div>
              
              <div className="flex justify-between gap-2 mt-2">
                <Button size="sm" variant="ghost" className="w-full h-8 text-xs">
                  <Mail className="h-3 w-3 mr-1" /> Mensagem
                </Button>
                <Button size="sm" variant="ghost" className="w-full h-8 text-xs">
                  <Link2 className="h-3 w-3 mr-1" /> Conectar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;
