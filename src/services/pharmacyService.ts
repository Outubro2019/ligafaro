import { Pharmacy, PharmacyDutySchedule } from '../types/PharmacyTypes';

export class PharmacyService {
  private static instance: PharmacyService;
  private pharmacies: Pharmacy[] = [];
  private dutySchedules: PharmacyDutySchedule[] = [];

  private constructor() {}

  public static getInstance(): PharmacyService {
    if (!PharmacyService.instance) {
      PharmacyService.instance = new PharmacyService();
    }
    return PharmacyService.instance;
  }

  async loadPharmacies(): Promise<void> {
    try {
      const response = await fetch('/farmacias_faro.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.pharmacies = data.farmacias || [];
      
      // Processar escalas de serviço
      if (data.escalas_servico) {
        this.dutySchedules = data.escalas_servico.map((schedule: any) => ({
          date: schedule.date,
          pharmacies: schedule.pharmacies.map((pharmacyId: string) =>
            this.pharmacies.find(p => p.id === pharmacyId)
          ).filter(Boolean)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar farmácias:', error);
      throw error;
    }
  }

  getAllPharmacies(): Pharmacy[] {
    return this.pharmacies;
  }

  getPharmaciesOnDuty(): Pharmacy[] {
    return this.pharmacies.filter(pharmacy => pharmacy.isOnDuty);
  }

  getPharmaciesOnDutyByDate(date: string): Pharmacy[] {
    const schedule = this.dutySchedules.find(s => s.date === date);
    return schedule ? schedule.pharmacies : [];
  }

  getTodayDutyPharmacies(): Pharmacy[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getPharmaciesOnDutyByDate(today);
  }

  getPharmacyById(id: string): Pharmacy | undefined {
    return this.pharmacies.find(pharmacy => pharmacy.id === id);
  }

  searchPharmacies(query: string): Pharmacy[] {
    const lowercaseQuery = query.toLowerCase();
    return this.pharmacies.filter(pharmacy =>
      pharmacy.name.toLowerCase().includes(lowercaseQuery) ||
      pharmacy.address.toLowerCase().includes(lowercaseQuery) ||
      pharmacy.services?.some(service => 
        service.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  getPharmaciesByService(service: string): Pharmacy[] {
    return this.pharmacies.filter(pharmacy =>
      pharmacy.services?.some(s => 
        s.toLowerCase().includes(service.toLowerCase())
      )
    );
  }

  getDutyScheduleForWeek(startDate: string): PharmacyDutySchedule[] {
    const start = new Date(startDate);
    const schedules: PharmacyDutySchedule[] = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const schedule = this.dutySchedules.find(s => s.date === dateString);
      if (schedule) {
        schedules.push(schedule);
      }
    }
    
    return schedules;
  }

  getPharmaciesWithCoordinates(): Pharmacy[] {
    return this.pharmacies.filter(pharmacy => 
      pharmacy.coordinates && 
      pharmacy.coordinates.lat && 
      pharmacy.coordinates.lng
    );
  }
}

export const pharmacyService = PharmacyService.getInstance();