import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const StaticMap: React.FC = () => {
  const [useUserLocation, setUseUserLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  
  // Coordenadas de Faro
  const faroCoordinates: [number, number] = [37.0193548, -7.9304397];
  
  // Solicitar a localização do usuário
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setUseUserLocation(true);
          setShowLocationPrompt(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setShowLocationPrompt(false);
        }
      );
    } else {
      console.error('Geolocalização não suportada pelo navegador');
      setShowLocationPrompt(false);
    }
  };
  
  // Recusar usar a localização do usuário
  const declineUserLocation = () => {
    setShowLocationPrompt(false);
  };
  
  // Coordenadas a serem usadas no mapa
  const coordinates = useUserLocation && userLocation ? userLocation : faroCoordinates;
  
  // Criar a URL do OpenStreetMap com zoom específico para o concelho de Faro
  const createOsmUrl = () => {
    // Definir os limites do concelho de Faro (bbox)
    // Estes valores foram ajustados para mostrar apenas o concelho de Faro
    const faroBbox = "-8.0304397,36.9693548,-7.8304397,37.0693548";
    
    let url = `https://www.openstreetmap.org/export/embed.html?bbox=${faroBbox}&layer=mapnik`;
    
    // Adicionar marcador
    url += `&marker=${coordinates[0]},${coordinates[1]}`;
    
    return url;
  };
  
  return (
    <div className="w-full h-full relative">
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
      
      {showLocationPrompt && (
        <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-white p-3 rounded-md shadow-md border border-gray-200 z-10">
          <p className="text-sm mb-2">Deseja usar a sua localização atual?</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="default" 
              onClick={requestUserLocation}
              className="flex items-center gap-1"
            >
              <MapPin size={16} />
              Sim
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={declineUserLocation}
            >
              Não
            </Button>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10">
        <a 
          href={`https://www.openstreetmap.org/?mlat=${coordinates[0]}&mlon=${coordinates[1]}#map=12/${coordinates[0]}/${coordinates[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white px-3 py-1.5 rounded-md shadow-md text-sm text-primary hover:underline border border-gray-200"
        >
          Ver mapa maior
        </a>
      </div>
    </div>
  );
};

export default StaticMap;