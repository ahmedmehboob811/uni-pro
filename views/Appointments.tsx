import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../constants/translations';
import { mockAppointments } from '../constants/mockData';
import { CheckCircleIcon } from '../components/Icons';

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">{t('bookNewAppointment', language)}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Existing Appointments */}
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">{t('myAppointments', language)}</h2>
            <div className="space-y-4">
                {mockAppointments.map((appt, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold">{appt.doctorName} <span className="text-sm font-normal text-gray-500">- {appt.specialty}</span></p>
                    <p className="text-gray-700">{appt.date} @ {appt.time} ({appt.type})</p>
                </div>
                ))}
            </div>
        </div>

        {/* New Appointment Form */}
        <div className="p-6 bg-white rounded-xl shadow-md">
            {isBooked ? (
                <div className="flex flex-col items-center justify-center text-center h-full">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">{t('bookingSuccessTitle', language)}</h2>
                    <p className="mt-2 text-gray-600">{t('bookingSuccessMessage', language)}</p>
                    <p className="font-semibold mt-2">{doctor}</p>
                    <p className="text-gray-600">{date} @ {time}</p>
                    <button onClick={handleReset} className="mt-6 w-full px-4 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                        {t('bookAnotherAppointment', language)}
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">{t('bookNewAppointment', language)}</h2>
                    <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-800 p-3 rounded-r-lg mb-4">
                        <p className="font-semibold">{t('aiRecommendation', language)}</p>
                        <p>Dr. Ali Raza (Cardiologist)</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">{t('selectDoctor', language)}</label>
                            <select 
                                id="doctor"
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md ${errors.doctor ? 'border-red-500' : ''}`}
                            >
                                <option>Dr. Fatima Ahmed (GP)</option>
                                <option>Dr. Ali Raza (Cardiologist)</option>
                                <option>Dr. Aisha Khan (Dermatologist)</option>
                            </select>
                            {errors.doctor && <p className="mt-1 text-sm text-red-600">{errors.doctor}</p>}
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">{t('selectDate', language)}</label>
                            <input 
                                type="date" 
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md ${errors.date ? 'border-red-500' : ''}`}
                            />
                            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">{t('selectTime', language)}</label>
                            <input 
                                type="time"
                                id="time" 
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className={`mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md ${errors.time ? 'border-red-500' : ''}`} 
                            />
                            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                        </div>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                            {t('confirmBooking', language)}
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
};