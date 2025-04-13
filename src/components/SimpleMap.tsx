import { useEffect, useRef } from 'react';

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

interface SimpleMapProps {
  markers: MapMarker[];
}

const SimpleMap = ({ markers }: SimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Função para obter uma imagem padrão se a URL da imagem for a padrão
  const getImageUrl = (url: string) => {
    if (url.includes("cardDefault.png")) {
      return "/Logo_Liga_Faro.png"; // Usar o logo da Liga Faro como imagem padrão
    }
    return url;
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Verificar se o Leaflet já está carregado
    if (typeof window !== 'undefined') {
      // Importar Leaflet
      import('leaflet').then((L) => {
        // Importar o CSS do Leaflet
        import('leaflet/dist/leaflet.css');
        
        // Limpar o container para evitar problemas com múltiplas instâncias
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
        
        // Corrigir o problema dos ícones do Leaflet
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        // Coordenadas de Faro
        const center: [number, number] = [37.0193548, -7.9304397];
        
        // Criar o mapa
        const map = L.map(mapRef.current).setView(center, 13);
        
        // Adicionar o tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Adicionar os marcadores
        markers.forEach((marker) => {
          const popup = L.popup().setContent(`
            <div class="max-w-xs">
              <div class="flex items-center gap-2 mb-2">
                <img 
                  src="${getImageUrl(marker.associacao.image_url)}" 
                  alt="${marker.associacao.nome}"
                  class="w-10 h-10 object-cover rounded"
                />
                <h3 class="font-semibold">${marker.associacao.nome}</h3>
              </div>
              
              <div class="text-sm">
                <p class="text-gray-600">
                  ${marker.associacao.morada}, ${marker.associacao.codigo_postal} ${marker.associacao.localidade}
                </p>
                
                ${marker.associacao.email && marker.associacao.email !== "N/A" ? `
                  <a 
                    href="mailto:${marker.associacao.email}" 
                    class="text-primary hover:underline block mt-1"
                  >
                    ${marker.associacao.email}
                  </a>
                ` : ''}
                
                ${marker.associacao.cmf_url ? `
                  <a
                    href="${marker.associacao.cmf_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline block mt-1"
                  >
                    Ver mais informações
                  </a>
                ` : ''}
              </div>
            </div>
          `);
          
          L.marker(marker.position).addTo(map).bindPopup(popup);
        });
      }).catch(error => {
        console.error('Erro ao carregar o Leaflet:', error);
      });
    }
    
    // Limpar o mapa quando o componente for desmontado
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [markers]);

  return <div ref={mapRef} className="h-full w-full"></div>;
};

export default SimpleMap;