
import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../constants/translations';
import { mockAppointments } from '../constants/mockData';
import { CheckCircleIcon, UserCircleIcon } from '../components/Icons';

interface AppointmentsProps {
  language: Language;
}

interface FormErrors {
    doctor?: string;
    date?: string;
    time?: string;
}

export const Appointments: React.FC<AppointmentsProps> = ({ language }) => {
  const [doctor, setDoctor] = useState('Dr. Ali Raza (Cardiologist)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isBooked, setIsBooked] = useState(false);

  const validateForm = (): boolean => {
      const newErrors: FormErrors = {};
      if (!doctor) {
          newErrors.doctor = t('errorDoctorRequired', language);
      }
      if (!date) {
          newErrors.date = t('errorDateRequired', language);
      } else if (new Date(date) < new Date(new Date().toDateString())) {
          newErrors.date = t('errorDateInPast', language);
      }
      if (!time) {
          newErrors.time = t('errorTimeRequired', language);
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
          // In a real app, you'd call an API here.
          console.log({ doctor, date, time });
          setIsBooked(true);
      }
  };
  
  const handleReset = () => {
    setDoctor('Dr. Ali Raza (Cardiologist)');
    setDate('');
    setTime('');
    setErrors({});
    setIsBooked(false);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{t('appointments', language)}</h1>
          <p className="text-gray-500">Manage your schedule and book consultations with top specialists.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Existing Appointments (Left Side - 4 Columns) */}
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                    <span className="w-2 h-6 bg-teal-500 rounded-full mr-3"></span>
                    {t('myAppointments', language)}
                </h2>
                <div className="space-y-4">
                    {mockAppointments.map((appt, index) => (
                    <div key={index} className="group p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-all hover:bg-white hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${appt.type === 'Online' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                                {appt.type}
                            </span>
                            <span className="text-gray-400 text-sm font-mono">{appt.date}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-teal-600 transition-colors">{appt.doctorName}</h3>
                        <p className="text-gray-500 text-sm mb-3">{appt.specialty}</p>
                        <div className="flex items-center text-sm font-medium text-gray-700 bg-white px-3 py-2 rounded-lg inline-block border border-gray-100">
                             🕔 {appt.time}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* New Appointment Form (Right Side - 8 Columns) */}
        <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 h-full">
            {isBooked ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-12 animate-fade-in">
                    <div className="bg-green-50 p-6 rounded-full mb-6">
                        <CheckCircleIcon className="w-20 h-20 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('bookingSuccessTitle', language)}</h2>
                    <p className="text-gray-500 max-w-md mb-8">{t('bookingSuccessMessage', language)}</p>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl w-full max-w-sm border border-slate-200 mb-8">
                        <p className="font-bold text-lg text-teal-700 mb-1">{doctor}</p>
                        <div className="flex justify-center items-center text-gray-600 space-x-2">
                             <span>{date}</span>
                             <span>•</span>
                             <span>{time}</span>
                        </div>
                    </div>

                    <button onClick={handleReset} className="w-full max-w-sm px-6 py-4 font-bold text-white bg-gray-900 rounded-xl hover:bg-teal-600 transition-colors shadow-lg">
                        {t('bookAnotherAppointment', language)}
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('bookNewAppointment', language)}</h2>
                    <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100 p-4 rounded-xl mb-8 flex items-start">
                        <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                            <UserCircleIcon className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <p className="font-bold text-teal-800 text-sm uppercase tracking-wide mb-1">{t('aiRecommendation', language)}</p>
                            <p className="text-gray-700 font-medium">Based on your recent BP trends, we recommend seeing <span className="text-gray-900 font-bold">Dr. Ali Raza (Cardiologist)</span>.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div>
                            <label htmlFor="doctor" className="block text-sm font-bold text-gray-700 mb-2">{t('selectDoctor', language)}</label>
                            <div className="relative">
                                <select 
                                    id="doctor"
                                    value={doctor}
                                    onChange={(e) => setDoctor(e.target.value)}
                                    className={`block w-full pl-4 pr-10 py-3.5 text-base border bg-gray-50 focus:bg-white transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.doctor ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                >
                                    <option>Dr. Fatima Ahmed (GP)</option>
                                    <option>Dr. Ali Raza (Cardiologist)</option>
                                    <option>Dr. Aisha Khan (Dermatologist)</option>
                                </select>
                            </div>
                            {errors.doctor && <p className="mt-2 text-sm text-red-600 flex items-center">⚠ {errors.doctor}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2">{t('selectDate', language)}</label>
                                <input 
                                    type="date" 
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={`block w-full px-4 py-3.5 text-base border bg-gray-50 focus:bg-white transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.date && <p className="mt-2 text-sm text-red-600 flex items-center">⚠ {errors.date}</p>}
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm font-bold text-gray-700 mb-2">{t('selectTime', language)}</label>
                                <input 
                                    type="time"
                                    id="time" 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={`block w-full px-4 py-3.5 text-base border bg-gray-50 focus:bg-white transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.time ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                                />
                                {errors.time && <p className="mt-2 text-sm text-red-600 flex items-center">⚠ {errors.time}</p>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-4 font-bold text-lg text-white bg-gray-900 rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                {t('confirmBooking', language)}
                            </button>
                        </div>
                    </form>
                </>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};
