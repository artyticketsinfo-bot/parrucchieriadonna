
import { SalonSettings } from './types';

export const INITIAL_SERVICES = [
  { id: '1', name: 'Taglio e Piega', duration: 60, price: 45 },
  { id: '2', name: 'Solo Taglio', duration: 30, price: 25 },
  { id: '3', name: 'Taglio e Colore', duration: 120, price: 85 },
  { id: '4', name: 'Solo Colore', duration: 90, price: 50 },
  { id: '5', name: 'Piega', duration: 45, price: 20 },
];

export const INITIAL_STAFF = [
  { id: 's1', name: 'Elena (Senior)', isActive: true },
  { id: 's2', name: 'Giulia (Stylist)', isActive: true },
];

export const INITIAL_HOURS = [
  { day: 0, isOpen: false, slots: [] },
  { day: 1, isOpen: false, slots: [] },
  { day: 2, isOpen: true, slots: [{ open: '08:30', close: '12:30' }, { open: '14:30', close: '19:30' }] },
  { day: 3, isOpen: true, slots: [{ open: '08:30', close: '12:30' }, { open: '14:30', close: '19:30' }] },
  { day: 4, isOpen: true, slots: [{ open: '08:30', close: '12:30' }, { open: '14:30', close: '19:30' }] },
  { day: 5, isOpen: true, slots: [{ open: '08:30', close: '12:30' }, { open: '14:30', close: '19:30' }] },
  { day: 6, isOpen: true, slots: [{ open: '08:30', close: '19:30' }] },
];

export const DEFAULT_SETTINGS: SalonSettings = {
  name: 'Chic & Shine Parrucchieria',
  address: 'Via della Moda 123, Milano',
  phone: '02 1234567',
  email: 'info@chicnshine.it',
  aboutUs: 'Da oltre 15 anni, ci prendiamo cura della bellezza dei vostri capelli con passione e prodotti biologici certificati.',
  services: INITIAL_SERVICES,
  staff: INITIAL_STAFF,
  businessHours: INITIAL_HOURS,
  holidays: [],
  cancellationLimit: 24, // 24 ore predefinite
  socials: {
    instagram: 'chicnshine_salon',
    facebook: 'chicnshine.milano'
  },
  security: {
    enabled: false,
    username: '',
    password: ''
  },
  reviews: [
    { id: 'r1', author: 'Marta R.', text: 'Elena è bravissima col colore, consigliatissimo!', rating: 5 },
    { id: 'r2', author: 'Sofia V.', text: 'Ambiente rilassante e molta professionalità.', rating: 5 }
  ],
  // Fix: Added default vonage configuration to match updated SalonSettings interface
  vonage: {
    apiKey: '',
    apiSecret: '',
    senderId: 'Salon',
    smsTemplate: 'Ciao [NOME], confermiamo il tuo appuntamento per [SERVIZIO] il [DATA] alle [ORA]. Gestisci qui: [LINK]'
  }
};
