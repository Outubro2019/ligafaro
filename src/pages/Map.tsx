import { useState, useEffect } from 'react';
import StaticMap from '@/components/StaticMap';
import entidadesData from "../entidades_faro.json";

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

const MapPage = () => {
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todas");
  const [categorias, setCategorias] = useState<string[]>(["Todas"]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Carregar dados das associações
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
    
    setCarregando(false);
  }, []);

  // Filtrar associações com base na categoria selecionada
  const associacoesFiltradas = categoriaAtiva === "Todas"
    ? associacoes
    : associacoes.filter(associacao => associacao.categories.includes(categoriaAtiva));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Mapa de Faro</h1>
        <p className="text-muted-foreground">Visualize o mapa da cidade de Faro e região com a localização das associações.</p>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Filtrar por categoria:</div>
        <div className="flex flex-wrap gap-2">
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                categoriaAtiva === categoria
                  ? 'bg-primary text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
        {carregando ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <StaticMap associacoes={associacoesFiltradas} />
        )}
      </div>
    </div>
  );
};

export default MapPage;