
import React, { useState } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Settings as SettingsIcon, LogOut, Save, Plus, Trash2, Shield, Download, Info, Clock, Smartphone, XCircle, CheckCircle, Users, History, UserCheck, MessageSquare } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { SalonSettings, Appointment, Service, Staff } from '../types';

interface AdminDashboardProps {
  settings: SalonSettings;
  setSettings: (s: SalonSettings) => void;
  appointments: Appointment[];
  setAppointments: (a: Appointment[]) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, setSettings, appointments, setAppointments, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings' | 'hours' | 'services' | 'clients' | 'staff'>('appointments');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const days = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

  const getDayAppointments = (date: Date) => appointments.filter(a => isSameDay(new Date(a.date), date)).sort((a, b) => a.time.localeCompare(b.time));

  const updateSetting = (key: keyof SalonSettings, value: any) => setSettings({ ...settings, [key]: value });

  const addStaff = () => {
    const newStaff: Staff = { id: crypto.randomUUID(), name: 'Nuova Operatrice', isActive: true };
    updateSetting('staff', [...settings.staff, newStaff]);
  };

  // Raggruppamento per cliente (Database Clienti)
  const clientDatabase = appointments.reduce((acc: any, app) => {
    if (!acc[app.customerPhone]) acc[app.customerPhone] = { name: app.customerName, history: [] };
    acc[app.customerPhone].history.push(app);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-pink-600" /><h1 className="font-bold text-slate-800 text-lg">Salon Manager</h1></div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
        </div>
        <nav className="flex-grow p-4 space-y-1 text-slate-900">
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'appointments' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}><CalendarIcon className="w-5 h-5" /> Agenda</button>
          <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'clients' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}><Users className="w-5 h-5" /> Clienti</button>
          <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'staff' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}><UserCheck className="w-5 h-5" /> Staff</button>
          <button onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'services' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}><Smartphone className="w-5 h-5" /> Servizi</button>
          <button onClick={() => setActiveTab('hours')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'hours' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}><Clock className="w-5 h-5" /> Orari</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}><SettingsIcon className="w-5 h-5" /> Impostazioni</button>
        </nav>
      </aside>

      <main className="flex-grow overflow-auto p-4 md:p-8 text-slate-900">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in">
              <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="grid grid-cols-7 gap-2">
                  {days.map(date => {
                    const daily = getDayAppointments(date);
                    return (
                      <button key={date.toISOString()} onClick={() => setSelectedDay(date)} className={`aspect-square flex flex-col items-center justify-center rounded-xl border ${isSameDay(date, selectedDay) ? 'border-pink-600 bg-pink-50' : 'border-slate-100'}`}>
                        <span className="text-sm font-bold">{format(date, 'd')}</span>
                        {daily.length > 0 && <div className="flex gap-1 mt-1"><div className="w-1 h-1 bg-green-500 rounded-full"></div></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-5 space-y-3">
                <h3 className="font-bold text-slate-800 text-lg uppercase">{format(selectedDay, 'EEEE d MMMM', { locale: it })}</h3>
                {getDayAppointments(selectedDay).map(app => (
                  <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-pink-600">{app.time}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold uppercase">{settings.staff.find(s=>s.id===app.staffId)?.name}</span>
                    </div>
                    <div className="font-bold text-slate-800">{app.customerName}</div>
                    <div className="text-xs text-slate-500">{settings.services.find(s=>s.id===app.serviceId)?.name}</div>
                    {app.notes && <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg italic flex gap-1"><MessageSquare className="w-3 h-3" /> {app.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Database Clienti</h2>
              {Object.keys(clientDatabase).map(phone => (
                <div key={phone} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4 text-slate-900">
                    <div><div className="font-bold text-lg">{clientDatabase[phone].name}</div><div className="text-slate-500 text-sm">{phone}</div></div>
                    <div className="text-pink-600 font-bold text-sm bg-pink-50 px-3 py-1 rounded-full">{clientDatabase[phone].history.length} Appuntamenti</div>
                  </div>
                  <div className="text-xs space-y-1 text-slate-900">
                    <div className="font-bold text-slate-400 uppercase tracking-widest mb-1">Storico:</div>
                    {clientDatabase[phone].history.slice(-3).map((h: any) => (
                      <div key={h.id} className="text-slate-600">• {format(new Date(h.date), 'dd/MM/yy')} - {settings.services.find(s=>s.id===h.serviceId)?.name}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 animate-in fade-in text-slate-900">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Gestione Operatrici</h2>
                <button onClick={addStaff} className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Aggiungi</button>
              </div>
              <div className="space-y-4">
                {settings.staff.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <input type="text" value={s.name} onChange={e => {
                      const updated = settings.staff.map(item => item.id === s.id ? { ...item, name: e.target.value } : item);
                      updateSetting('staff', updated);
                    }} className="bg-transparent font-bold text-slate-800 outline-none" />
                    <button onClick={() => {
                       const updated = settings.staff.filter(item => item.id !== s.id);
                       updateSetting('staff', updated);
                    }} className="text-slate-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in pb-12 text-slate-900">
               <div className="bg-white p-8 rounded-3xl border border-slate-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Info className="w-5 h-5" /> Marketing e Annullamento</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Storia del Salone (Chi Siamo)</label>
                    <textarea value={settings.aboutUs} onChange={e => updateSetting('aboutUs', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl h-24 focus:outline-pink-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Limite Annullamento Cliente (Ore preavviso)</label>
                    <input type="number" value={settings.cancellationLimit} onChange={e => updateSetting('cancellationLimit', parseInt(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-pink-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end"><button onClick={() => alert('Salvato!')} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-green-700 transition-colors"><Save className="w-5 h-5" /> Salva Tutto</button></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
