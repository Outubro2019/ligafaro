import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import entidadesData from "../entidades_faro.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, MapPin, ExternalLink, Info } from "lucide-react";

// Tipo para as associações
interface Associacao {
  nome: string;
  categories: string[];
  image_url: string;
  cmf_url: string;
  morada: string;
  codigo_postal: string;
  localidade: string;
  email: string;
  has_more_categories: boolean;
}

// Importar dados das associações
const Associacoes = () => {
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [activeTab, setActiveTab] = useState("Todas");
  const [categorias, setCategorias] = useState<string[]>(["Todas"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usar os dados importados diretamente
    setAssociacoes(entidadesData);
    
    // Extrair categorias únicas
    const todasCategorias = new Set<string>();
    entidadesData.forEach((associacao: Associacao) => {
      associacao.categories.forEach(categoria => {
        todasCategorias.add(categoria);
      });
    });
    
    // Ordenar categorias alfabeticamente e adicionar "Todas" no início
    const categoriasOrdenadas = Array.from(todasCategorias).sort();
    setCategorias(["Todas", ...categoriasOrdenadas]);
    
    setLoading(false);
  }, []);

  // Ordenar associações por nome
  const associacoesOrdenadas = [...associacoes].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR')
  );

  // Filtrar associações com base na categoria selecionada
  const associacoesFiltradas = activeTab === "Todas"
    ? associacoesOrdenadas
    : associacoes.filter(associacao => associacao.categories.includes(activeTab));

  // Função para obter uma imagem padrão se a URL da imagem for a padrão
  const getImageUrl = (url: string) => {
    if (url.includes("cardDefault.png")) {
      return "/Logo_Liga_Faro.png"; // Usar o logo da Liga Faro como imagem padrão
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Associações Locais</h1>
        <p className="text-muted-foreground">Conheça as associações e organizações que atuam em Faro e região.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="Todas" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap gap-2">
            {categorias.map(categoria => (
              <TabsTrigger key={categoria} value={categoria}>
                {categoria}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {associacoesFiltradas.map((associacao, index) => (
                  <Card key={index} className="hover:bg-muted/50 transition-colors overflow-hidden flex flex-row">
                    <div className="w-48 h-48 overflow-hidden flex-shrink-0">
                      <img 
                        src={getImageUrl(associacao.image_url)}
                        alt={`Logo de ${associacao.nome}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback para o logo da Liga Faro se houver erro
                          (e.target as HTMLImageElement).src = "/Logo_Liga_Faro.png";
                        }}
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl line-clamp-2">{associacao.nome}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {associacao.categories.map(categoria => (
                            <span key={categoria} className="bg-muted px-2 py-0.5 rounded-full text-sm">
                              {categoria}
                            </span>
                          ))}
                          {associacao.has_more_categories && (
                            <span className="bg-muted px-2 py-0.5 rounded-full text-sm text-muted-foreground">
                              +
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {associacao.morada && (
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-start gap-1">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{associacao.morada}, {associacao.codigo_postal} {associacao.localidade}</span>
                              </div>
                            </div>
                          )}
                          
                          {associacao.email && associacao.email !== "N/A" && (
                            <div className="text-sm">
                              <a href={`mailto:${associacao.email}`} className="flex items-center gap-1 text-primary hover:underline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                                {associacao.email}
                              </a>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-auto">
                            <div className="flex items-center gap-1">
                              <Building size={16} />
                              <span>Associação Local</span>
                            </div>
                            
                            {associacao.cmf_url && (
                              <a
                                href={associacao.cmf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink size={16} />
                                <span>Mais informações</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
              
              {associacoesFiltradas.length === 0 && (
                <div className="text-center py-10">
                  <Info className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Não foram encontradas associações nesta categoria.</p>
                </div>
              )}
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Associacoes;