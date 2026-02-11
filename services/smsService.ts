
import { SalonSettings, Appointment } from '../types';

export const smsService = {
  sendConfirmation: async (settings: SalonSettings, appointment: Appointment) => {
    const { apiKey, apiSecret, senderId, smsTemplate } = settings.vonage;
    
    if (!apiKey || !apiSecret) {
      console.warn('Vonage API non configurata. Simulazione invio...');
    }

    const serviceName = settings.services.find(s => s.id === appointment.serviceId)?.name || 'Servizio';
    const manageLink = `${window.location.origin}?action=manage&id=${appointment.id}`;
    
    const message = smsTemplate
      .replace('[NOME]', appointment.customerName)
      .replace('[SERVIZIO]', serviceName)
      .replace('[DATA]', new Date(appointment.date).toLocaleDateString('it-IT'))
      .replace('[ORA]', appointment.time)
      .replace('[LINK]', manageLink);

    console.log(`[SMS PROFESSIONALE] A: ${appointment.customerPhone}\nMessaggio: ${message}`);
  }
};
