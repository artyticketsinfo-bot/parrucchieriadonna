import { SalonSettings, Appointment } from '../types';

/**
 * Servizio SMS rimosso su richiesta dell'utente.
 * Le prenotazioni vengono confermate solo a video.
 */
export const smsService = {
  sendConfirmation: async (settings: SalonSettings, appointment: Appointment) => {
    // No-op: Servizio disabilitato
    console.log(`[LOG] Appuntamento confermato localmente per ${appointment.customerName}.`);
  }
};