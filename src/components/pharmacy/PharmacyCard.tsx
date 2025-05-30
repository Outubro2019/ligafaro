import React from 'react';
import { Pharmacy } from '../../types/PharmacyTypes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Phone, MapPin, Clock, Globe, Mail, Stethoscope } from 'lucide-react';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  showDutyStatus?: boolean;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ 
  pharmacy, 
  showDutyStatus = true 
}) => {
  const handlePhoneCall = () => {
    window.open(`tel:${pharmacy.phone}`, '_self');
  };

  const handleEmailClick = () => {
    if (pharmacy.email) {
      window.open(`mailto:${pharmacy.email}`, '_self');
    }
  };

  const handleWebsiteClick = () => {
    if (pharmacy.website) {
      window.open(pharmacy.website, '_blank');
    }
  };

  const handleDirections = () => {
    if (pharmacy.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.address)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {pharmacy.name}
          </CardTitle>
          {showDutyStatus && pharmacy.isOnDuty && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <Clock className="w-3 h-3 mr-1" />
              De Serviço
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Endereço */}
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600">{pharmacy.address}</span>
        </div>

        {/* Telefone */}
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{pharmacy.phone}</span>
        </div>

        {/* Horário Normal */}
        {pharmacy.schedule && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Horário: {pharmacy.schedule}
            </span>
          </div>
        )}

        {/* Horário de Serviço */}
        {pharmacy.dutySchedule && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Serviço: {pharmacy.dutySchedule.startTime} - {pharmacy.dutySchedule.endTime}
            </span>
          </div>
        )}

        {/* Serviços */}
        {pharmacy.services && pharmacy.services.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Serviços:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pharmacy.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePhoneCall}
            className="flex items-center space-x-1"
          >
            <Phone className="w-3 h-3" />
            <span>Ligar</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDirections}
            className="flex items-center space-x-1"
          >
            <MapPin className="w-3 h-3" />
            <span>Direções</span>
          </Button>

          {pharmacy.email && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailClick}
              className="flex items-center space-x-1"
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </Button>
          )}

          {pharmacy.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWebsiteClick}
              className="flex items-center space-x-1"
            >
              <Globe className="w-3 h-3" />
              <span>Website</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};