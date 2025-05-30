import React, { useState } from 'react';
import { PharmacyList } from '../components/pharmacy/PharmacyList';
import { PharmacyCard } from '../components/pharmacy/PharmacyCard';
import PharmacyMap from '../components/pharmacy/PharmacyMap';
import { usePharmacies } from '../hooks/usePharmacies';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Cross,
  Clock,
  MapPin,
  Calendar,
  Phone,
  AlertCircle,
  Info,
  Map
} from 'lucide-react';

export const Pharmacies: React.FC = () => {
  const {
    pharmacies,
    loading,
    error,
    getTodayDutyPharmacies,
    getDutyScheduleForWeek,
    getPharmaciesWithCoordinates
  } = usePharmacies();

  const [selectedTab, setSelectedTab] = useState('map');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Tente recarregar a página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const todayDutyPharmacies = getTodayDutyPharmacies();
  const weekSchedule = getDutyScheduleForWeek(new Date().toISOString().split('T')[0]);
  const pharmaciesWithCoordinates = getPharmaciesWithCoordinates();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Cross className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Farmácias de Faro
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Encontre farmácias no concelho de Faro, consulte as escalas de serviço 
            e obtenha informações de contacto e serviços disponíveis.
          </p>
        </div>

        {/* Alerta de farmácias de serviço */}
        {todayDutyPharmacies.length > 0 && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Clock className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Farmácias de serviço hoje:</strong>{' '}
              {todayDutyPharmacies.map(p => p.name).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Informação importante */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> As farmácias de serviço funcionam fora do horário normal 
            para situações de urgência. Confirme sempre os horários antes de se deslocar.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Todas</span>
            </TabsTrigger>
            <TabsTrigger value="duty" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>De Serviço</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Escalas</span>
            </TabsTrigger>
          </TabsList>

          {/* Mapa das farmácias */}
          <TabsContent value="map">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    <span>Localização das Farmácias</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <PharmacyMap pharmacies={pharmacies} />
                </CardContent>
              </Card>

              {/* Cartões das farmácias por baixo do mapa */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Todas as Farmácias ({pharmacies.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pharmacies.map(pharmacy => (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      showDutyStatus={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Todas as farmácias */}
          <TabsContent value="all">
            <PharmacyList
              pharmacies={pharmacies}
              showDutyFilter={true}
              showServiceFilter={true}
            />
          </TabsContent>

          {/* Farmácias de serviço */}
          <TabsContent value="duty">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span>Farmácias de Serviço Hoje</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayDutyPharmacies.length === 0 ? (
                    <p className="text-gray-500">
                      Não há farmácias de serviço registadas para hoje.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todayDutyPharmacies.map(pharmacy => (
                        <PharmacyCard
                          key={pharmacy.id}
                          pharmacy={pharmacy}
                          showDutyStatus={false}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Contactos de Emergência
                </h3>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>INEM: 112</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Saúde 24: 808 24 24 24</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Escalas de serviço */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Escalas de Serviço da Semana</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weekSchedule.length === 0 ? (
                  <p className="text-gray-500">
                    Não há escalas de serviço disponíveis para esta semana.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {weekSchedule.map(schedule => (
                      <div
                        key={schedule.date}
                        className={`p-4 rounded-lg border ${
                          isToday(schedule.date)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {formatDate(schedule.date)}
                          </h3>
                          {isToday(schedule.date) && (
                            <Badge variant="default" className="bg-green-500">
                              Hoje
                            </Badge>
                          )}
                        </div>
                        
                        {schedule.pharmacies.length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            Nenhuma farmácia de serviço
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {schedule.pharmacies.map(pharmacy => (
                              <div
                                key={pharmacy.id}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                              >
                                <div>
                                  <p className="font-medium">{pharmacy.name}</p>
                                  <p className="text-sm text-gray-600">{pharmacy.address}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`tel:${pharmacy.phone}`, '_self')}
                                >
                                  <Phone className="w-3 h-3 mr-1" />
                                  {pharmacy.phone}
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default Pharmacies;