import { useState, useEffect } from 'react';
import AssociacoesMap from '@/components/AssociacoesMap';
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
  coordenadas?: {
    lat: number;
    lon: number;
  };
}

const MapPage = () => {
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Carregar dados das associações
    setAssociacoes(entidadesData);
    setCarregando(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Mapa de Faro</h1>
        <p className="text-muted-foreground">Visualize o mapa da cidade de Faro e região com a localização das associações.</p>
      </div>
      
      {carregando ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AssociacoesMap associacoes={associacoes} />
      )}
    </div>
  );
};

export default MapPage;