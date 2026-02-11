
import React, { useState, useEffect } from 'react';
import { format, differenceInHours } from 'date-fns';
import { it } from 'date-fns/locale';
import { Scissors, Settings as SettingsIcon, Phone, MapPin, Instagram, Facebook, CheckCircle, Clock, User, MessageSquare, AlertCircle, Star } from 'lucide-react';
import { SalonSettings, Appointment, ViewMode } from './types';
import { storageService } from './services/storageService';
import BookingCalendar from './components/BookingCalendar';
import TimeSlots from './components/TimeSlots';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.CLIENT);
  const [settings, setSettings] = useState<SalonSettings>(storageService.getSettings());
  const [appointments, setAppointments] = useState<Appointment[]>(storageService.getAppointments());
  
  // Booking State
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Manage State (Cancellation)
  const [manageApp, setManageApp] = useState<Appointment | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const id = params.get('id');

    if (action === 'manage' && id) {
      const app = appointments.find(a => a.id === id);
      if (app) {
        setManageApp(app);
        setView(ViewMode.MANAGE);
      }
    }
  }, [appointments]);

  useEffect(() => storageService.saveSettings(settings), [settings]);
  useEffect(() => storageService.saveAppointments(appointments), [appointments]);

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone || !selectedStaff) return;

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      customerName,
      customerPhone,
      serviceId: selectedService,
      staffId: selectedStaff,
      date: selectedDate.toISOString(),
      time: selectedTime,
      status: 'confirmed',
      notes: customerNotes,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowSuccess(true);
  };

  const cancelAppointment = (id: string) => {
    const app = appointments.find(a => a.id === id);
    if (!app) return;

    const hoursDiff = differenceInHours(new Date(app.date), new Date());
    if (hoursDiff < settings.cancellationLimit) {
      alert(`Spiacenti, l'annullamento è possibile solo fino a ${settings.cancellationLimit} ore prima.`);
      return;
    }

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    alert("Appuntamento annullato con successo.");
    window.location.href = window.location.origin;
  };

  if (view === ViewMode.MANAGE && manageApp) {
    const service = settings.services.find(s => s.id === manageApp.serviceId);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Gestione Appuntamento</h2>
          <p className="text-slate-500 text-sm mb-6">Ciao {manageApp.customerName}, qui puoi gestire la tua prenotazione.</p>
          
          <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-2">
            <div className="flex justify-between font-bold text-slate-700"><span>Servizio:</span> <span>{service?.name}</span></div>
            <div className="flex justify-between text-slate-600"><span>Data:</span> <span>{format(new Date(manageApp.date), 'd MMMM yyyy', { locale: it })}</span></div>
            <div className="flex justify-between text-slate-600"><span>Ora:</span> <span>{manageApp.time}</span></div>
            <div className="flex justify-between text-slate-600"><span>Stato:</span> <span className={manageApp.status === 'confirmed' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{manageApp.status === 'confirmed' ? 'Confermato' : 'Annullato'}</span></div>
          </div>

          {manageApp.status === 'confirmed' && (
            <button 
              onClick={() => cancelAppointment(manageApp.id)}
              className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5" /> Annulla Prenotazione
            </button>
          )}
          <button onClick={() => window.location.href = window.location.origin} className="w-full mt-4 text-slate-400 font-bold py-2">Torna alla Home</button>
        </div>
      </div>
    );
  }

  if (view === ViewMode.ADMIN) {
    return (
      <AdminDashboard 
        settings={settings} 
        setSettings={setSettings} 
        appointments={appointments} 
        setAppointments={setAppointments}
        onLogout={() => setView(ViewMode.CLIENT)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 text-white rounded-xl flex items-center justify-center shadow-lg">
              <Scissors className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{settings.name}</h1>
          </div>
          <button onClick={() => setView(ViewMode.ADMIN)} className="p-2.5 text-slate-400 hover:text-pink-600 transition-all"><SettingsIcon className="w-6 h-6" /></button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        {showSuccess ? (
          <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-12 h-12" /></div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-slate-900">Ci vediamo in salone!</h2>
            <p className="text-slate-500 mb-8">Il tuo appuntamento è stato confermato con successo. Ti aspettiamo!</p>
            <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Torna alla Home</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Servizio */}
              <section className={step > 1 ? 'opacity-40 pointer-events-none' : ''}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> Scegli il servizio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {settings.services.map(s => (
                    <button key={s.id} onClick={() => { setSelectedService(s.id); setStep(2); }} className="p-5 rounded-2xl border-2 border-slate-100 text-left hover:border-pink-300 transition-all bg-white">
                      <div className="font-bold text-lg text-slate-900">{s.name}</div>
                      <div className="text-sm text-slate-500 font-medium">€ {s.price} • {s.duration} min</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Step 2: Calendario e Operatrice */}
              {step >= 2 && selectedService && (
                <section className={step > 2 ? 'opacity-40 pointer-events-none' : 'animate-in fade-in slide-in-from-top-4'}>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> Quando vuoi venire?</h2>
                  <BookingCalendar settings={settings} appointments={appointments} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                  {selectedDate && (
                    <div className="mt-8">
                      <TimeSlots 
                        date={selectedDate} 
                        settings={settings} 
                        appointments={appointments} 
                        selectedServiceId={selectedService}
                        selectedTime={selectedTime}
                        selectedStaffId={selectedStaff}
                        onSlotSelect={(t, s) => { setSelectedTime(t); setSelectedStaff(s); setStep(3); }} 
                      />
                    </div>
                  )}
                </section>
              )}

              {/* Step 3: Dati e Note */}
              {step >= 3 && (
                <section className="animate-in fade-in slide-in-from-top-4">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> I tuoi recapiti</h2>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                    <input type="text" placeholder="Nome Completo" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-pink-500" />
                    <input type="tel" placeholder="Cellulare" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-pink-500" />
                    <textarea placeholder="Note particolari (es. allergie, richieste colore...)" value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24 focus:outline-pink-500" />
                    <button onClick={handleBooking} disabled={!customerName || !customerPhone} className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-100 disabled:bg-slate-300">Conferma Appuntamento</button>
                  </div>
                </section>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><User className="w-5 h-5 text-pink-400" /> Chi Siamo</h3>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{settings.aboutUs}"</p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-pink-400" /> {settings.address}</div>
                  <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-pink-400" /> {settings.phone}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900"><Star className="w-5 h-5 text-yellow-500" /> Recensioni</h3>
                <div className="space-y-4">
                  {settings.reviews.map(r => (
                    <div key={r.id} className="border-b border-slate-50 pb-4 last:border-0 text-slate-900">
                      <div className="flex items-center gap-1 mb-1">{Array.from({length: r.rating}).map((_,i)=><Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}</div>
                      <p className="text-xs text-slate-600 italic">"{r.text}"</p>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">- {r.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
