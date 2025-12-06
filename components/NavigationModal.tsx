
import React, { useState, useEffect, useRef } from 'react';
import { Language, Pharmacy } from '../types';
import { t } from '../constants/translations';
import { XIcon, UserCircleIcon, NavigationIcon } from './Icons';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy;
  language: Language;
}

const getInitialEta = (distanceStr: string): number => {
    const distanceKm = parseFloat(distanceStr);
    if (isNaN(distanceKm)) {
        return Math.floor(Math.random() * 5) + 8; // fallback 8-12 mins
    }
    // Simulate ~3 mins per km + 2 mins base time
    return Math.max(1, Math.round(distanceKm * 3 + 2));
};

export const NavigationModal: React.FC<NavigationModalProps> = ({ isOpen, onClose, pharmacy, language }) => {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const initialEtaRef = useRef(0);

  // Effect to reset and initialize state when isOpen or pharmacy changes
  useEffect(() => {
    if (isOpen) {
      const initialEta = getInitialEta(pharmacy.distance);
      initialEtaRef.current = initialEta;
      setEta(initialEta);
      setProgress(0);
    }
  }, [isOpen, pharmacy]);

  // Effect for running timers
  useEffect(() => {
    if (!isOpen || initialEtaRef.current === 0) {
      return;
    }

    const totalDuration = initialEtaRef.current * 60 * 1000; // ETA in minutes to ms
    const intervalTime = 100;
    const increment = (intervalTime / totalDuration) * 100;

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(100, prev + increment));
    }, intervalTime);

    const etaInterval = setInterval(() => {
        setEta(prev => Math.max(0, prev - 1));
    }, 60000); // decrement every minute

    // Cleanup when component unmounts or modal is closed
    return () => {
      clearInterval(progressInterval);
      clearInterval(etaInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasArrived = progress >= 100 || eta === 0;
  // Use a real map embed focused on the pharmacy
  const mapSrc = `https://maps.google.com/maps?q=${pharmacy.lat},${pharmacy.lng}&z=15&output=embed&t=m`;

  const openRealMaps = () => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
      window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col text-white backdrop-blur-sm" role="dialog" aria-modal="true">
      {/* Map Background */}
      <div className="absolute inset-0 pointer-events-none">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale-[20%] opacity-80"
        ></iframe>
      </div>
       
       {/* Radar Pulse Effect */}
      {!hasArrived && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="relative flex h-32 w-32">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-32 w-32 border-2 border-teal-500 opacity-40"></span>
            </span>
         </div>
      )}

      <div className="relative flex-grow flex flex-col justify-end pointer-events-none">
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors pointer-events-auto"
            aria-label={t('close', language)}
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Bottom Panel */}
        <div className="bg-gray-900/90 backdrop-blur-md p-4 sm:p-6 rounded-t-3xl shadow-2xl pointer-events-auto border-t border-gray-700">
          <div className="max-w-3xl mx-auto">
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                 {/* Driver Info */}
                <div className="flex items-center space-x-4 rtl:space-x-reverse bg-gray-800 p-4 rounded-2xl flex-1 border border-gray-700">
                    <UserCircleIcon className="w-12 h-12 text-teal-400" />
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">{t('yourDriver', language)}</p>
                        <p className="font-bold text-lg text-white">{t('driverName', language)}</p>
                        <p className="text-gray-300 text-sm">{t('carDetails', language)}</p>
                    </div>
                </div>
                
                {/* Real Navigation Button */}
                 <button 
                    onClick={openRealMaps}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-4 flex items-center justify-center space-x-2 transition-all shadow-lg group"
                 >
                     <NavigationIcon className="w-6 h-6 group-hover:animate-bounce" />
                     <span className="font-bold">{t('trackInMaps', language)}</span>
                 </button>
            </div>

            {/* Progress Bar & ETA */}
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <p className="text-sm font-bold text-teal-400 mb-1">{hasArrived ? t('youHaveArrived', language) : t('onTheWay', language)}</p>
                        <p className="text-lg font-semibold text-white">{pharmacy.name}</p>
                    </div>
                    {!hasArrived && (
                         <div className="text-right">
                            <p className="text-3xl font-bold text-white leading-none">{eta}</p>
                            <p className="text-xs text-gray-400 uppercase font-bold">{t('minutes', language)}</p>
                        </div>
                    )}
                </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-300 ease-out relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                </div>
              </div>
            </div>

            {hasArrived && (
                <button onClick={onClose} className="w-full mt-4 px-4 py-3 font-semibold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                    {t('close', language)}
                </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
