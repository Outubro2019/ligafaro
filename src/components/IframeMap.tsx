import React from 'react';

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
}

// Interface para os marcadores no mapa
interface MapMarker {
  id: number;
  position: [number, number];
  associacao: Associacao;
}

interface IframeMapProps {
  markers: MapMarker[];
}

const IframeMap: React.FC<IframeMapProps> = ({ markers }) => {
  // Coordenadas de Faro
  const center: [number, number] = [37.0193548, -7.9304397];
  
  // Criar a URL do OpenStreetMap com os marcadores
  const createOsmUrl = () => {
    // URL base do OpenStreetMap
    let url = `https://www.openstreetmap.org/export/embed.html?bbox=-8.0304397,36.9193548,-7.8304397,37.1193548&layer=mapnik`;
    
    // Adicionar marcadores se houver
    if (markers.length > 0) {
      url += '&marker=';
      
      // Adicionar até 10 marcadores (limite para não sobrecarregar a URL)
      const limitedMarkers = markers.slice(0, 10);
      
      // Adicionar cada marcador
      url += limitedMarkers.map(marker => `${marker.position[0]},${marker.position[1]}`).join('%7C');
    }
    
    return url;
  };
  
  return (
    <div className="w-full h-full">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={createOsmUrl()}
        style={{ border: '1px solid #ccc' }}
        title="Mapa das Associações"
      ></iframe>
    </div>
  );
};

export default IframeMap;