import { lazy, Suspense } from 'react';

// Importação dinâmica do componente AssociacoesMap
const AssociacoesMapComponent = lazy(() => import('./AssociacoesMap'));

// Interface para as associações
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

interface AssociacoesMapProps {
  associacoes: Associacao[];
}

// Componente de loading para o mapa
const MapLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Componente wrapper que usa lazy loading
const LazyAssociacoesMap = (props: AssociacoesMapProps) => {
  return (
    <Suspense fallback={<MapLoading />}>
      <AssociacoesMapComponent {...props} />
    </Suspense>
  );
};

export default LazyAssociacoesMap;