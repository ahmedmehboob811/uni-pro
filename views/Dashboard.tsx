
import React, { useState, useEffect } from 'react';
import { Language, User, Medicine, HealthRecord, View } from '../types';
import { t } from '../constants/translations';
import { mockAppointments, mockOrders, mockHealthData } from '../constants/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { db } from '../services/db';
import { MedicineCard } from '../components/MedicineCard';
import { UserCircleIcon, CheckCircleIcon, LightningIcon, ClipboardListIcon } from '../components/Icons';

interface DashboardProps {
  language: Language;
  user: User | null;
  setView?: (view: View) => void;
  onAddToCart: (medicine: Medicine) => void;
  onOrderNow: (medicine: Medicine) => void;
  onAskAI?: (medicine: Medicine) => void;
}

const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-xl">
                <p className="font-bold text-slate-800 mb-2">{label}</p>
                <p className="text-indigo-600 text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Systolic: {payload[0].value}
                </p>
                <p className="text-teal-600 text-sm font-bold flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    Diastolic: {payload[1].value}
                </p>
            </div>
        );
    }
    return null;
};


export const Dashboard: React.FC<DashboardProps> = ({ language, user, setView, onAddToCart, onOrderNow, onAskAI }) => {
  const [savedMedicines, setSavedMedicines] = useState<Medicine[]>([]);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        if (user) {
            const saved = await db.getSavedMedicines(user.email);
            setSavedMedicines(saved);
            const record = await db.getHealthRecord(user.email);
            setHealthRecord(record);
        }
    };
    fetchData();
  }, [user]);

  const handleRemoveSaved = async (medicine: Medicine) => {
      if (user) {
          // Optimistic update
          setSavedMedicines(prev => prev.filter(m => m.brandName !== medicine.brandName));
          await db.removeMedicine(user.email, medicine.brandName);
      }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500 opacity-20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500 opacity-20 rounded-full blur-[60px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
                    {t('welcomeUser', language)}, <span className="text-teal-400">{user ? user.name.split(' ')[0] : 'User'}</span>
                </h1>
                <p className="text-slate-300 text-lg font-medium">Here is your daily health overview.</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 min-w-[120px] text-center">
                    <p className="text-3xl font-bold text-white">120/80</p>
                    <p className="text-xs uppercase tracking-widest text-teal-300 font-bold mt-1">Avg. BP</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 min-w-[120px] text-center">
                    <p className="text-3xl font-bold text-white">{savedMedicines.length}</p>
                    <p className="text-xs uppercase tracking-widest text-teal-300 font-bold mt-1">Saved Meds</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Health Record Summary or Prompt */}
        <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                        <ClipboardListIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    {t('yourHealthRecord', language)}
                </h2>
                {setView && (
                    <button onClick={() => setView(View.HEALTH_PROFILE)} className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1 rounded-full hover:bg-teal-100 transition-colors">
                        {healthRecord ? 'Edit' : 'Create'}
                    </button>
                )}
            </div>
            
            {healthRecord ? (
                <div className="space-y-4 flex-grow">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                 <p className="font-bold text-slate-800 text-lg">{healthRecord.fullName}</p>
                                 <p className="text-sm text-slate-500 font-medium">{healthRecord.age} years • {healthRecord.gender}</p>
                             </div>
                             <UserCircleIcon className="w-10 h-10 text-slate-300" />
                        </div>
                    </div>
                    {healthRecord.medicines && healthRecord.medicines.length > 0 && (
                        <div className="pt-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Current Medication</p>
                            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                                <div>
                                    <p className="font-bold text-indigo-900 text-lg">{healthRecord.medicines[0].name}</p>
                                    <p className="text-sm text-indigo-700 font-medium mt-1">{healthRecord.medicines[0].dosage} • {healthRecord.medicines[0].frequency}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <ClipboardListIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 mb-6 font-medium">You haven't set up your health profile yet.</p>
                    {setView && (
                        <button 
                            onClick={() => setView(View.HEALTH_PROFILE)}
                            className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-colors shadow-lg"
                        >
                            {t('completeProfile', language)}
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Health History Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <div className="p-2 bg-amber-50 rounded-lg mr-3">
                        <LightningIcon className="w-5 h-5 text-amber-500" />
                    </div>
                    {t('healthHistory', language)}
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-wide">Last 6 Months</span>
            </div>
            
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockHealthData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                    <Tooltip content={renderCustomTooltip} cursor={{stroke: '#e2e8f0', strokeWidth: 2}} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '14px', fontWeight: 600}} />
                    <Area type="monotone" dataKey="systolic" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSystolic)" name="Systolic BP" activeDot={{r: 6, strokeWidth: 0}} />
                    <Area type="monotone" dataKey="diastolic" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorDiastolic)" name="Diastolic BP" activeDot={{r: 6, strokeWidth: 0}} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
           {/* Appointments Section */}
           <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{t('myAppointments', language)}</h2>
                    <button className="text-sm font-bold text-teal-600 hover:text-teal-700">View All</button>
               </div>
              <div className="space-y-4">
                {mockAppointments.map((appt, index) => (
                  <div key={index} className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors cursor-pointer group">
                    <div className="bg-white p-3 rounded-xl shadow-sm mr-4 text-center min-w-[64px] border border-slate-100 group-hover:border-teal-100">
                        <span className="block text-xs font-bold text-slate-400 uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-2xl font-bold text-slate-800 group-hover:text-teal-600">{new Date(appt.date).getDate()}</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{appt.doctorName}</p>
                        <p className="text-sm text-slate-500 font-medium mb-1.5">{appt.specialty}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${appt.type === 'Online' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {appt.type} • {appt.time}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full py-3.5 font-bold text-white bg-slate-900 rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-500/30">
                {t('bookAppointment', language)}
              </button>
           </div>

            {/* Saved Medicines Section */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-8">
                     <h2 className="text-xl font-bold text-slate-800">{t('savedMedicines', language)}</h2>
                     <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">{savedMedicines.length} Saved</span>
                 </div>
                 
                {savedMedicines.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-56 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">{t('noSavedMedicines', language)}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedMedicines.slice(0, 4).map(med => (
                            <div key={med.brandName} className="h-full">
                                <MedicineCard 
                                    medicine={med} 
                                    language={language} 
                                    onAddToCart={onAddToCart}
                                    onOrderNow={onOrderNow}
                                    onToggleSave={handleRemoveSaved}
                                    onAskAI={onAskAI}
                                    isSaved={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
      </div>
    </div>
  );
};
