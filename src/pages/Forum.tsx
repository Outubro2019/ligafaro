
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Calendar, ThumbsUp } from "lucide-react";

// Sample forum data
const sampleTopics = [
  {
    id: 1,
    title: "Melhores praias em Faro para famílias",
    content: "Estou a planear umas férias em família e gostaria de saber quais são as melhores praias em Faro para crianças pequenas. Procuro locais com águas calmas e boas infraestruturas.",
    author: "Maria Silva",
    date: "2023-09-15",
    replies: 7,
    category: "Turismo",
    likes: 12
  },
  {
    id: 2,
    title: "Eventos culturais este verão",
    content: "Alguém sabe quais são os principais eventos culturais a acontecer em Faro durante os meses de verão? Estou especialmente interessado em festivais de música e exposições de arte.",
    author: "João Mendes",
    date: "2023-09-10",
    replies: 5,
    category: "Cultura",
    likes: 8
  },
  {
    id: 3,
    title: "Recomendações de restaurantes tradicionais",
    content: "Gostaria de conhecer a gastronomia local. Podem recomendar restaurantes que sirvam pratos típicos algarvios com boa relação qualidade-preço?",
    author: "Carlos Duarte",
    date: "2023-09-05",
    replies: 10,
    category: "Gastronomia",
    likes: 15
  },
  {
    id: 4,
    title: "Dicas para alugar casa em Faro",
    content: "Estou a mudar-me para Faro por motivos profissionais e procuro dicas sobre zonas residenciais, preços médios e onde procurar anúncios confiáveis para alugar casa.",
    author: "Ana Costa",
    date: "2023-09-01",
    replies: 12,
    category: "Habitação",
    likes: 6
  },
  {
    id: 5,
    title: "Escolas de surf recomendadas",
    content: "Quero aprender a surfar durante a minha estadia em Faro. Alguém pode recomendar boas escolas de surf na região, especialmente para iniciantes?",
    author: "Pedro Nunes",
    date: "2023-08-29",
    replies: 4,
    category: "Desporto",
    likes: 9
  },
  {
    id: 6,
    title: "Transporte público em Faro",
    content: "Como funciona o sistema de transporte público em Faro? Estou a planear uma visita e gostaria de saber sobre horários, rotas e opções de bilhetes.",
    author: "Sofia Martins",
    date: "2023-08-25",
    replies: 6,
    category: "Transportes",
    likes: 4
  }
];

const categories = ["Todos", "Turismo", "Cultura", "Gastronomia", "Habitação", "Desporto", "Transportes"];

const Forum = () => {
  const [activeTab, setActiveTab] = useState("Todos");
  
  const filteredTopics = activeTab === "Todos" 
    ? sampleTopics 
    : sampleTopics.filter(topic => topic.category === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Fórum</h1>
        <p className="text-muted-foreground">Participe em discussões sobre a vida em Faro e conecte-se com os vizinhos.</p>
      </div>
      
      <Tabs defaultValue="Todos" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">{topic.content}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{topic.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(topic.date).toLocaleDateString('pt-PT')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>{topic.replies} {topic.replies === 1 ? 'resposta' : 'respostas'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    <span>{topic.likes}</span>
                  </div>
                  <span className="bg-muted px-2 py-0.5 rounded-full">{topic.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Não foram encontrados tópicos nesta categoria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forum;
