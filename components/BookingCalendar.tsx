
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isPast, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SalonSettings, Appointment } from '../types';

interface BookingCalendarProps {
  settings: SalonSettings;
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ settings, appointments, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const isHoliday = (date: Date) => {
    return settings.holidays.some(h => isSameDay(new Date(h), date));
  };

  const getDayConfig = (date: Date) => {
    const dayOfWeek = getDay(date);
    return settings.businessHours.find(h => h.day === dayOfWeek);
  };

  const isClosedDay = (date: Date) => {
    const dayConfig = getDayConfig(date);
    // Domenica (0) è sempre chiusa come da regola 4
    if (getDay(date) === 0) return true;
    return !dayConfig?.isOpen;
  };

  const isFullyBooked = (date: Date) => {
    const dayConfig = getDayConfig(date);
    if (!dayConfig || !dayConfig.isOpen) return false;

    // Calcolo slot totali per quel giorno (30 min l'uno)
    let totalAvailableSlots = 0;
    dayConfig.slots.forEach(range => {
      const [sh, sm] = range.open.split(':').map(Number);
      const [eh, em] = range.close.split(':').map(Number);
      totalAvailableSlots += ((eh * 60 + em) - (sh * 60 + sm)) / 30;
    });

    const dateStr = date.toISOString().split('T')[0];
    const activeAppointments = appointments.filter(a => 
      a.date.startsWith(dateStr) && a.status === 'confirmed'
    );
    
    return activeAppointments.length >= totalAvailableSlots; 
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: it })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: (getDay(days[0]) + 6) % 7 }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(date => {
          const past = isPast(date) && !isSameDay(date, new Date());
          const holiday = isHoliday(date);
          const closed = isClosedDay(date);
          const full = isFullyBooked(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          let bgColor = '';
          let textColor = '';
          let isDisabled = false;

          if (past || holiday || closed) {
            // GRIGIO CHIARO: Passato, Festivi, Chiuso, Domeniche
            bgColor = 'bg-slate-100 border-transparent';
            textColor = 'text-slate-400';
            isDisabled = true;
          } else if (full) {
            // ROSSO: Occupato
            bgColor = 'bg-red-500 border-red-600';
            textColor = 'text-white';
            isDisabled = true;
          } else {
            // VERDE: Disponibile
            bgColor = isSelected ? 'bg-green-600 border-green-700' : 'bg-green-500 border-green-600 hover:scale-105';
            textColor = 'text-white';
            isDisabled = false;
          }

          return (
            <button
              key={date.toISOString()}
              disabled={isDisabled}
              onClick={() => onDateSelect(date)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 shadow-sm ${bgColor} ${textColor} ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <span>{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
