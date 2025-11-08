import React, { useState } from 'react';
import { Language, Pharmacy } from '../types';
import { t } from '../constants/translations';
import { mockPharmacies } from '../constants/mockData';
import { NavigationModal } from '../components/NavigationModal';

interface PharmaciesProps {
  language: Language;
}

export const Pharmacies: React.FC<PharmaciesProps> = ({ language }) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const handleNavigate = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };

  const handleCloseModal = () => {
    setSelectedPharmacy(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{t('nearbyPharmacies', language)}</h1>
        <div className="space-y-4">
          {mockPharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-teal-700">{pharmacy.name}</h2>
                <p className="text-gray-600">{pharmacy.address}</p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2 text-sm">
                  <span className="text-gray-500">{pharmacy.distance}</span>
                  <span className={`font-semibold ${pharmacy.hours === '24 Hours' ? 'text-green-600' : 'text-yellow-600'}`}>{pharmacy.hours}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ms-4 flex-shrink-0">
                  <button onClick={() => handleNavigate(pharmacy)} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                      {t('navigate', language)}
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPharmacy && (
        <NavigationModal
          isOpen={!!selectedPharmacy}
          onClose={handleCloseModal}
          pharmacy={selectedPharmacy}
          language={language}
        />
      )}
    </>
  );
};