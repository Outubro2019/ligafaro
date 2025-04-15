import { useState, useEffect } from 'react';
import LeafletMap from './LeafletMap';
import { associacoesCoordinates } from '@/data/associacoesCoordinates';

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
  coordenadas?: {
    lat: number;
    lon: number;
  };
}

// Interface para os marcadores no mapa
interface MapMarker {
  id: number;
  position: [number, number];
  associacao: Associacao;
}

interface AssociacoesMapProps {
  associacoes: Associacao[];
}

const AssociacoesMap = ({ associacoes }: AssociacoesMapProps) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todas");
  const [categorias, setCategorias] = useState<string[]>(["Todas"]);
  const [associacoesFiltradas, setAssociacoesFiltradas] = useState<Associacao[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [carregandoMarcadores, setCarregandoMarcadores] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Extrair categorias únicas
  useEffect(() => {
    const todasCategorias = new Set<string>();
    associacoes.forEach((associacao: Associacao) => {
      associacao.categories.forEach(categoria => {
        todasCategorias.add(categoria);
      });
    });
    
    // Ordenar categorias alfabeticamente e adicionar "Todas" no início
    const categoriasOrdenadas = Array.from(todasCategorias).sort();
    setCategorias(["Todas", ...categoriasOrdenadas]);
    
    setCarregando(false);
  }, [associacoes]);
  
  // Filtrar associações com base na categoria selecionada
  useEffect(() => {
    const filtradas = categoriaAtiva === "Todas"
      ? associacoes
      : associacoes.filter(associacao => associacao.categories.includes(categoriaAtiva));
    
    setAssociacoesFiltradas(filtradas);
  }, [categoriaAtiva, associacoes]);
  
  // Criar marcadores usando coordenadas
  useEffect(() => {
    if (associacoesFiltradas.length === 0) return;
    
    setCarregandoMarcadores(true);
    
    const novosMarkers: MapMarker[] = [];
    
    // Criar marcadores para as associações filtradas
    associacoesFiltradas.forEach((associacao, index) => {
      // Verificar se temos coordenadas no objeto associacao
      if (associacao.coordenadas) {
        novosMarkers.push({
          id: index,
          position: [associacao.coordenadas.lat, associacao.coordenadas.lon],
          associacao
        });
      }
      // Verificar se temos coordenadas no dicionário associacoesCoordinates
      else if (associacoesCoordinates[associacao.nome]) {
        novosMarkers.push({
          id: index,
          position: associacoesCoordinates[associacao.nome],
          associacao
        });
      }
    });
    
    setMarkers(novosMarkers);
    setCarregandoMarcadores(false);
  }, [associacoesFiltradas]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Mapa das Associações</h2>
      
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
      
      {carregando || carregandoMarcadores ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 relative z-0">
          <LeafletMap markers={markers} />
        </div>
      )}
    </div>
  );
};

export default AssociacoesMap;