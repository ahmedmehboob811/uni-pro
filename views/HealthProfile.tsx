
import React, { useState, useEffect } from 'react';
import { Language, User, HealthRecord, View } from '../types';
import { t } from '../constants/translations';
import { db } from '../services/db';
import { UserCircleIcon, ClipboardListIcon, CheckCircleIcon } from '../components/Icons';
import { Spinner } from '../components/Spinner';

interface HealthProfileProps {
  language: Language;
  user: User | null;
  setView: (view: View) => void;
}

export const HealthProfile: React.FC<HealthProfileProps> = ({ language, user, setView }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Personal Info
  const [fullName, setFullName] = useState(user?.name || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');

  // Health Info
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');

  // Medicine Info (Single entry as per request, but stored as array for extensibility)
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [reason, setReason] = useState('');

  // Load existing data if available
  useEffect(() => {
    const fetchRecord = async () => {
        if (user) {
            setLoading(true);
            const record = await db.getHealthRecord(user.email);
            if (record) {
                setFullName(record.fullName);
                setAge(record.age);
                setGender(record.gender);
                setConditions(record.conditions);
                setAllergies(record.allergies);
                
                // Load first medicine if exists
                if (record.medicines && record.medicines.length > 0) {
                    const med = record.medicines[0];
                    setMedicineName(med.name);
                    setDosage(med.dosage);
                    setFrequency(med.frequency);
                    setReason(med.reason);
                }
            }
            setLoading(false);
        }
    };
    fetchRecord();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccess(false);

    try {
        const medicines = medicineName ? [{
            name: medicineName,
            dosage,
            frequency,
            reason
        }] : [];

        const record: HealthRecord = {
            fullName,
            age,
            gender,
            conditions,
            allergies,
            medicines
        };

        await db.saveHealthRecord(user.email, record);
        setSuccess(true);
        setTimeout(() => setView(View.DASHBOARD), 2000); // Redirect after success
    } catch (error) {
        console.error("Failed to save health record", error);
    } finally {
        setLoading(false);
    }
  };

  if (!user) {
      return (
          <div className="flex justify-center items-center min-h-[50vh]">
              <p className="text-gray-500">Please login to access your health profile.</p>
          </div>
      );
  }

  if (success) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
             <div className="bg-green-50 p-6 rounded-full mb-6">
                <CheckCircleIcon className="w-24 h-24 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('profileSaved', language)}</h2>
            <p className="text-gray-500">Redirecting to Dashboard...</p>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
             <ClipboardListIcon className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('healthProfileTitle', language)}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('healthProfileSubtitle', language)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
        
        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center mb-6 border-b border-gray-50 pb-4">
                 <UserCircleIcon className="w-6 h-6 text-teal-600 mr-3" />
                 <h2 className="text-xl font-bold text-gray-800">{t('personalInfo', language)}</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('fullName', language)}</label>
                     <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Ali Khan"
                     />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('age', language)}</label>
                        <input 
                            type="number" 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            placeholder="25"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('gender', language)}</label>
                        <select 
                            value={gender}
                            onChange={(e) => setGender(e.target.value as any)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
                        >
                            <option value="">Select</option>
                            <option value="Male">{t('male', language)}</option>
                            <option value="Female">{t('female', language)}</option>
                            <option value="Other">{t('other', language)}</option>
                        </select>
                    </div>
                 </div>
             </div>
        </div>

        {/* Section 2: Health Information */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center mb-6 border-b border-gray-50 pb-4">
                 <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3">
                     <span className="text-red-500 font-bold text-xs">H</span>
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">{t('healthInfo', language)}</h2>
             </div>
             
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('medicalConditions', language)}</label>
                     <textarea 
                        rows={2}
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder={t('medicalConditionsPlaceholder', language)}
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('allergies', language)}</label>
                     <textarea 
                        rows={2}
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder={t('allergiesPlaceholder', language)}
                     />
                 </div>
             </div>
        </div>

        {/* Section 3: Medicine Information */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center mb-6 border-b border-gray-50 pb-4">
                 <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                     <span className="text-indigo-500 font-bold text-xs">Rx</span>
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">{t('medicineInfo', language)}</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('medicineName', language)}</label>
                     <input 
                        type="text" 
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Panadol"
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('medicineDosage', language)}</label>
                     <input 
                        type="text" 
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., 500mg"
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('dailyFrequency', language)}</label>
                     <input 
                        type="text" 
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Twice a day"
                     />
                 </div>
                 <div className="md:col-span-2">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('reasonForTaking', language)}</label>
                     <input 
                        type="text" 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Headache relief"
                     />
                 </div>
             </div>
        </div>

        <div className="pt-4 flex justify-end">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400"
            >
                {loading ? <Spinner className="w-6 h-6 text-white" /> : t('saveProfile', language)}
            </button>
        </div>

      </form>
    </div>
  );
};
