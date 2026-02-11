
import { SalonSettings, Appointment } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const SETTINGS_KEY = 'salon_settings_v1';
const APPOINTMENTS_KEY = 'salon_appointments_v1';

export const storageService = {
  getSettings: (): SalonSettings => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      // Assicura che nuove proprietà non presenti nel vecchio salvataggio vengano integrate dai default
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.error("Errore nel caricamento impostazioni:", e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: SalonSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getAppointments: (): Appointment[] => {
    try {
      const data = localStorage.getItem(APPOINTMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Errore nel caricamento appuntamenti:", e);
      return [];
    }
  },

  saveAppointments: (appointments: Appointment[]): void => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  },

  addAppointment: (appointment: Appointment): void => {
    const current = storageService.getAppointments();
    storageService.saveAppointments([...current, appointment]);
  }
};
