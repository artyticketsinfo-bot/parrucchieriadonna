
import React from 'react';
import { getDay } from 'date-fns';
import { SalonSettings, Appointment, Staff } from '../types';

interface TimeSlotsProps {
  date: Date;
  settings: SalonSettings;
  appointments: Appointment[];
  selectedServiceId: string;
  selectedTime: string | null;
  selectedStaffId: string | null;
  onSlotSelect: (time: string, staffId: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ 
  date, settings, appointments, selectedServiceId, selectedTime, selectedStaffId, onSlotSelect 
}) => {
  const dayOfWeek = getDay(date);
  const dayConfig = settings.businessHours.find(h => h.day === dayOfWeek);
  const service = settings.services.find(s => s.id === selectedServiceId);

  if (!dayConfig || !dayConfig.isOpen || !service) return null;

  // Genera tutti i possibili punti di inizio (ogni 30 min)
  const allPossibleStarts: string[] = [];
  dayConfig.slots.forEach(range => {
    let [h, m] = range.open.split(':').map(Number);
    const [endH, endM] = range.close.split(':').map(Number);
    const start = h * 60 + m;
    const end = endH * 60 + endM;

    for (let time = start; time < end; time += 30) {
      const hh = Math.floor(time / 60).toString().padStart(2, '0');
      const mm = (time % 60).toString().padStart(2, '0');
      allPossibleStarts.push(`${hh}:${mm}`);
    }
  });

  const dateStr = date.toISOString().split('T')[0];

  // Funzione per verificare se un'operatrice è libera per l'INTERA durata del servizio
  const isStaffAvailable = (staff: Staff, startTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const serviceMinutes = service.duration;
    const sessionStart = startH * 60 + startM;
    const sessionEnd = sessionStart + serviceMinutes;

    // 1. Verifica che la sessione finisca entro l'orario di lavoro
    const isWithinWorkingHours = dayConfig.slots.some(range => {
      const [rh, rm] = range.open.split(':').map(Number);
      const [reh, rem] = range.close.split(':').map(Number);
      return sessionStart >= (rh * 60 + rm) && sessionEnd <= (reh * 60 + rem);
    });

    if (!isWithinWorkingHours) return false;

    // 2. Verifica sovrapposizioni con altri appuntamenti della stessa operatrice
    const staffApps = appointments.filter(a => 
      a.date.startsWith(dateStr) && 
      a.staffId === staff.id && 
      a.status === 'confirmed'
    );

    for (const app of staffApps) {
      const [ah, am] = app.time.split(':').map(Number);
      const appService = settings.services.find(s => s.id === app.serviceId);
      const appStart = ah * 60 + am;
      const appEnd = appStart + (appService?.duration || 30);

      // Controllo collisione range
      if (sessionStart < appEnd && sessionEnd > appStart) return false;
    }

    return true;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {allPossibleStarts.map(time => {
          // Trova la prima operatrice disponibile per questo orario
          const availableStaff = settings.staff.filter(s => s.isActive && isStaffAvailable(s, time));
          const isOccupied = availableStaff.length === 0;
          const isSelected = selectedTime === time;

          return (
            <button
              key={time}
              disabled={isOccupied}
              onClick={() => onSlotSelect(time, availableStaff[0].id)}
              className={`
                py-3 px-2 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center
                ${isOccupied 
                  ? 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed opacity-50' 
                  : isSelected
                    ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-green-400 hover:text-green-600'}
              `}
            >
              <span>{time}</span>
              {!isOccupied && <span className="text-[9px] opacity-70 uppercase tracking-tighter mt-0.5">Disponibile</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlots;
