import { useState, useEffect } from 'react';
import { Pharmacy, PharmacyDutySchedule } from '../types/PharmacyTypes';
import { pharmacyService } from '../services/pharmacyService';

export const usePharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        setLoading(true);
        await pharmacyService.loadPharmacies();
        setPharmacies(pharmacyService.getAllPharmacies());
        setError(null);
      } catch (err) {
        setError('Erro ao carregar farmácias');
        console.error('Erro ao carregar farmácias:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, []);

  const getPharmaciesOnDuty = () => {
    return pharmacyService.getPharmaciesOnDuty();
  };

  const getTodayDutyPharmacies = () => {
    return pharmacyService.getTodayDutyPharmacies();
  };

  const searchPharmacies = (query: string) => {
    return pharmacyService.searchPharmacies(query);
  };

  const getPharmaciesByService = (service: string) => {
    return pharmacyService.getPharmaciesByService(service);
  };

  const getDutyScheduleForWeek = (startDate: string): PharmacyDutySchedule[] => {
    return pharmacyService.getDutyScheduleForWeek(startDate);
  };

  const getPharmaciesWithCoordinates = () => {
    return pharmacyService.getPharmaciesWithCoordinates();
  };

  return {
    pharmacies,
    loading,
    error,
    getPharmaciesOnDuty,
    getTodayDutyPharmacies,
    searchPharmacies,
    getPharmaciesByService,
    getDutyScheduleForWeek,
    getPharmaciesWithCoordinates,
  };
};