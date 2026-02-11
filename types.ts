
export interface Service {
  id: string;
  name: string;
  duration: number; // minuti
  price: number;
}

export interface Staff {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  staffId: string; // Collegato all'operatrice
  date: string; // ISO format
  time: string; // HH:mm
  status: 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface BusinessHours {
  day: number; // 0-6 (Sun-Sat)
  isOpen: boolean;
  slots: { open: string; close: string }[];
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
}

export interface SalonSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  aboutUs: string;
  services: Service[];
  staff: Staff[];
  businessHours: BusinessHours[];
  holidays: string[]; // ISO dates
  cancellationLimit: number; // ore di preavviso
  socials: {
    instagram?: string;
    facebook?: string;
  };
  security: {
    enabled: boolean;
    username?: string;
    password?: string;
  };
  reviews: Review[];
  // Fix: Added vonage property to SalonSettings to satisfy services/smsService.ts requirements
  vonage: {
    apiKey: string;
    apiSecret: string;
    senderId: string;
    smsTemplate: string;
  };
}

export enum ViewMode {
  CLIENT = 'client',
  ADMIN = 'admin',
  MANAGE = 'manage' // Nuova vista per annullamento cliente
}
