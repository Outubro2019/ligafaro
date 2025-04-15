import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrigir o problema dos ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Interface para as associações
interface Associacao {
  nome: string;
  categories: string[];
  image_url?: string;
  cmf_url?: string;
  morada: string;
  codigo_postal: string;
  localidade: string;
  email?: string;
  has_more_categories?: boolean;
}

// Interface para os marcadores no mapa
interface MapMarker {
  id: number;
  position: [number, number];
  associacao: Associacao;
}

interface LeafletMapProps {
  markers: MapMarker[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ markers }) => {
  // Função para obter uma imagem padrão se a URL da imagem for a padrão
  const getImageUrl = (url?: string) => {
    if (!url || url.includes("cardDefault.png")) {
      return "/Logo_Liga_Faro.png"; // Usar o logo da Liga Faro como imagem padrão
    }
    return url;
  };

  // Coordenadas de Faro
  const center: [number, number] = [37.0193548, -7.9304397];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '600px', width: '100%' }}
      className="z-0" // Garantir que o mapa tenha um z-index menor que o menu lateral
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={getImageUrl(marker.associacao.image_url)}
                  alt={marker.associacao.nome}
                  className="w-10 h-10 object-cover rounded"
                />
                <h3 className="font-semibold">{marker.associacao.nome}</h3>
              </div>
              
              <div className="text-sm">
                <p className="text-gray-600">
                  {marker.associacao.morada}, {marker.associacao.codigo_postal} {marker.associacao.localidade}
                </p>
                
                {marker.associacao.email && marker.associacao.email !== "N/A" && (
                  <a
                    href={`mailto:${marker.associacao.email}`}
                    className="text-primary hover:underline block mt-1"
                  >
                    {marker.associacao.email}
                  </a>
                )}
                
                {marker.associacao.cmf_url && (
                  <a
                    href={marker.associacao.cmf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block mt-1"
                  >
                    Ver mais informações
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;