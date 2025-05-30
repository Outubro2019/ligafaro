export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isOnDuty: boolean;
  dutySchedule?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  services?: string[];
  website?: string;
  email?: string;
  schedule?: string;
}

export interface PharmacyDutySchedule {
  date: string;
  pharmacies: Pharmacy[];
}