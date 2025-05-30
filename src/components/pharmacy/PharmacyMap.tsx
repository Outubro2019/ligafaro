import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Pharmacy } from '../../types/PharmacyTypes';
import { Cross, Phone, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

// Corrigir o problema dos ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Criar ícones personalizados para farmácias
const createPharmacyIcon = (isOnDuty: boolean) => {
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-8 h-8 ${isOnDuty ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 5h3v2H4v-2zm0 5h5v2H4v-2z"/>
          </svg>
        </div>
        ${isOnDuty ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white animate-pulse"></div>' : ''}
      </div>
    `,
    className: 'pharmacy-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  className?: string;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({ pharmacies, className = '' }) => {
  // Coordenadas de Faro
  const center: [number, number] = [37.0193548, -7.9304397];

  // Filtrar farmácias que têm coordenadas
  const pharmaciesWithCoords = pharmacies.filter(pharmacy => 
    pharmacy.coordinates && 
    pharmacy.coordinates.lat && 
    pharmacy.coordinates.lng
  );

  const formatServices = (services: string[]) => {
    if (!services || services.length === 0) return 'Medicamentos';
    return services.slice(0, 3).join(', ') + (services.length > 3 ? '...' : '');
  };

  const formatSchedule = (schedule?: string) => {
    if (!schedule) return 'Horário não disponível';
    return schedule;
  };

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        className="relative"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pharmaciesWithCoords.map((pharmacy) => (
          <Marker 
            key={pharmacy.id} 
            position={[pharmacy.coordinates!.lat, pharmacy.coordinates!.lng]}
            icon={createPharmacyIcon(pharmacy.isOnDuty)}
          >
            <Popup maxWidth={320} className="pharmacy-popup">
              <div className="p-2 max-w-sm">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cross className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 leading-tight">
                      {pharmacy.name}
                    </h3>
                  </div>
                  {pharmacy.isOnDuty && (
                    <Badge variant="default" className="bg-green-500 text-xs">
                      Serviço
                    </Badge>
                  )}
                </div>

                {/* Endereço */}
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pharmacy.address}
                  </p>
                </div>

                {/* Telefone */}
                {pharmacy.phone && (
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a 
                      href={`tel:${pharmacy.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {pharmacy.phone}
                    </a>
                  </div>
                )}

                {/* Horário */}
                {pharmacy.schedule && (
                  <div className="flex items-start gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {formatSchedule(pharmacy.schedule)}
                    </p>
                  </div>
                )}

                {/* Serviços */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Serviços:</p>
                  <p className="text-xs text-gray-600">
                    {formatServices(pharmacy.services)}
                  </p>
                </div>

                {/* Website */}
                {pharmacy.website && (
                  <div className="pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => window.open(pharmacy.website, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver Website
                    </Button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legenda */}
      <div className="bg-gray-50 px-4 py-2 border-t">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>De serviço</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Horário normal</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{pharmaciesWithCoords.length} farmácias no mapa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyMap;