import { lazy, Suspense } from 'react';

// Importação dinâmica do componente LeafletMap
const LeafletMapComponent = lazy(() => import('./LeafletMap'));

// Interface para os marcadores no mapa
interface MapMarker {
  id: number;
  position: [number, number];
  associacao: {
    nome: string;
    categories: string[];
    image_url?: string;
    cmf_url?: string;
    morada: string;
    codigo_postal: string;
    localidade: string;
    email?: string;
    has_more_categories?: boolean;
  };
}

interface LeafletMapProps {
  markers: MapMarker[];
}

// Componente de loading para o mapa
const MapLoading = () => (
  <div className="flex justify-center items-center h-full w-full bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Componente wrapper que usa lazy loading
const LazyLeafletMap = (props: LeafletMapProps) => {
  return (
    <Suspense fallback={<MapLoading />}>
      <LeafletMapComponent {...props} />
    </Suspense>
  );
};

export default LazyLeafletMap;