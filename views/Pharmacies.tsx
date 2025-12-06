
import React, { useState, useEffect } from 'react';
import { Language, Pharmacy } from '../types';
import { t } from '../constants/translations';
import { mockPharmacies as defaultMockPharmacies } from '../constants/mockData';
import { NavigationModal } from '../components/NavigationModal';
import { CarIcon, MapPinIcon, NavigationIcon } from '../components/Icons';
import { locationService, Coordinates } from '../services/locationService';
import { Spinner } from '../components/Spinner';

interface PharmaciesProps {
  language: Language;
}

export const Pharmacies: React.FC<PharmaciesProps> = ({ language }) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(defaultMockPharmacies);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const generateNearbyPharmacies = (coords: Coordinates) => {
      const nearbyPharmacies = defaultMockPharmacies.map((p) => {
         const nearbyLoc = locationService.generateNearbyLocation(coords.latitude, coords.longitude, 5);
         const distance = locationService.calculateDistance(coords.latitude, coords.longitude, nearbyLoc.lat, nearbyLoc.lng);
         
         return {
             ...p,
             lat: nearbyLoc.lat,
             lng: nearbyLoc.lng,
             distance: `${distance} km`
         };
      });

      nearbyPharmacies.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setPharmacies(nearbyPharmacies);
  };

  const handleLocateUser = async () => {
      setIsLocating(true);
      setLocationError(null);
      try {
          const coords = await locationService.getCurrentPosition();
          setUserLocation(coords);
          generateNearbyPharmacies(coords);
      } catch (err: any) {
          console.warn("Location error:", err.message || err);
          const defaultCoords = { latitude: 24.8607, longitude: 67.0011 };
          setUserLocation(defaultCoords);
          generateNearbyPharmacies(defaultCoords);
          setLocationError(`${t('locationError', language)} Using default location.`);
      } finally {
          setIsLocating(false);
      }
  };
  
  useEffect(() => {
      handleLocateUser();
  }, []);

  const handleDeliverySimulation = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };
  
  const handleRealNavigation = (pharmacy: Pharmacy) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
      window.open(url, '_blank');
  };

  const handleCloseModal = () => {
    setSelectedPharmacy(null);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{t('nearbyPharmacies', language)}</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">{t('pharmacySubtitle', language)}</p>
            
            <div className="mt-8">
                <button 
                    onClick={handleLocateUser}
                    disabled={isLocating}
                    className="inline-flex items-center px-8 py-3.5 bg-teal-50 text-teal-700 font-bold rounded-full hover:bg-teal-100 transition-all shadow-md hover:shadow-lg disabled:opacity-50 active:scale-95"
                >
                    {isLocating ? <Spinner className="w-5 h-5 mr-3" /> : <MapPinIcon className="w-5 h-5 mr-3" />}
                    {isLocating ? t('locating', language) : t('useMyLocation', language)}
                </button>
                {locationError && <p className="mt-4 text-sm text-amber-600 font-semibold bg-amber-50 inline-block px-4 py-1 rounded-full">{locationError}</p>}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {pharmacies.map((pharmacy) => {
            const isOpen24 = pharmacy.hours === '24 Hours';
            return (
                <div key={pharmacy.id} className="bg-white rounded-[2rem] p-1 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
                    <div className="p-7 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${isOpen24 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                {isOpen24 ? 'Open 24/7' : 'Open Now'}
                            </div>
                            <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                <NavigationIcon className="w-3 h-3 mr-1.5" />
                                {pharmacy.distance}
                            </span>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">{pharmacy.name}</h2>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium min-h-[40px]">{pharmacy.address}</p>
                        
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Hours</div>
                        <div className="text-slate-700 font-semibold">{pharmacy.hours}</div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-b-[1.8rem] flex gap-3 border-t border-slate-100">
                         <button 
                            onClick={() => handleRealNavigation(pharmacy)} 
                            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors shadow-sm"
                         >
                             <NavigationIcon className="w-4 h-4 mr-2" />
                             {t('navigate', language)}
                         </button>
                         <button 
                            onClick={() => handleDeliverySimulation(pharmacy)} 
                            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-colors shadow-md group-hover:shadow-lg"
                         >
                             <CarIcon className="w-4 h-4 mr-2" />
                             {t('orderDelivery', language)}
                         </button>
                    </div>
                </div>
            );
          })}
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
