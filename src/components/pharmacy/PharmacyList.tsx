import React, { useState, useMemo } from 'react';
import { Pharmacy } from '../../types/PharmacyTypes';
import { PharmacyCard } from './PharmacyCard';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Filter, MapPin, Clock } from 'lucide-react';

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  showDutyFilter?: boolean;
  showServiceFilter?: boolean;
}

export const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  showDutyFilter = true,
  showServiceFilter = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [showOnlyOnDuty, setShowOnlyOnDuty] = useState(false);

  // Extrair todos os serviços únicos
  const allServices = useMemo(() => {
    const services = new Set<string>();
    pharmacies.forEach(pharmacy => {
      pharmacy.services?.forEach(service => services.add(service));
    });
    return Array.from(services).sort();
  }, [pharmacies]);

  // Filtrar farmácias
  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter(pharmacy => {
      // Filtro de busca
      const matchesSearch = searchQuery === '' || 
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.services?.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Filtro de serviço
      const matchesService = selectedService === 'all' ||
        pharmacy.services?.some(service => service === selectedService);

      // Filtro de farmácias de serviço
      const matchesDuty = !showOnlyOnDuty || pharmacy.isOnDuty;

      return matchesSearch && matchesService && matchesDuty;
    });
  }, [pharmacies, searchQuery, selectedService, showOnlyOnDuty]);

  const dutyPharmacies = pharmacies.filter(p => p.isOnDuty);

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Total de Farmácias</p>
              <p className="text-2xl font-bold text-blue-800">{pharmacies.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600">De Serviço Hoje</p>
              <p className="text-2xl font-bold text-green-800">{dutyPharmacies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600">Resultados</p>
              <p className="text-2xl font-bold text-purple-800">{filteredPharmacies.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {/* Barra de pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar farmácias por nome, endereço ou serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros adicionais */}
        <div className="flex flex-wrap gap-4">
          {showDutyFilter && (
            <Button
              variant={showOnlyOnDuty ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyOnDuty(!showOnlyOnDuty)}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Apenas de Serviço</span>
            </Button>
          )}

          {showServiceFilter && allServices.length > 0 && (
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os serviços</SelectItem>
                {allServices.map(service => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Tags de filtros ativos */}
        <div className="flex flex-wrap gap-2">
          {showOnlyOnDuty && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>De Serviço</span>
              <button
                onClick={() => setShowOnlyOnDuty(false)}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            </Badge>
          )}
          
          {selectedService !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{selectedService}</span>
              <button
                onClick={() => setSelectedService('all')}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Lista de farmácias */}
      {filteredPharmacies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhuma farmácia encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de pesquisa</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPharmacies.map(pharmacy => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              showDutyStatus={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};