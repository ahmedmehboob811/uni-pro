import React, { useState, useEffect, useRef } from 'react';
import { Language, Pharmacy } from '../types';
import { t } from '../constants/translations';
import { XIcon, CarIcon, UserCircleIcon } from './Icons';

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
    // Simulate ~3 mins per km + 2 mins base time for traffic/stops
    // Ensure ETA is at least 1 minute
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
  }, [isOpen]); // Only depends on isOpen

  if (!isOpen) return null;

  const hasArrived = progress >= 100 || eta === 0;
  const mapSrc = `https://maps.google.com/maps?q=${pharmacy.lat},${pharmacy.lng}&z=16&output=embed&t=k`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col text-white" role="dialog" aria-modal="true">
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
          className="grayscale-[50%] contrast-125"
        ></iframe>
      </div>
       <div className="absolute inset-0 bg-black bg-opacity-25"></div>


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
        <div className="bg-gray-900 p-4 sm:p-6 rounded-t-2xl shadow-2xl pointer-events-auto">
          <div className="max-w-3xl mx-auto">
            {/* Driver Info */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
              <UserCircleIcon className="w-12 h-12 text-teal-400" />
              <div>
                <p className="text-gray-400 text-sm">{t('yourDriver', language)}</p>
                <p className="font-bold text-lg">{t('driverName', language)}</p>
                <p className="text-gray-300">{t('carDetails', language)}</p>
              </div>
            </div>

            {/* Progress Bar & ETA */}
            <div className="my-4">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-sm font-semibold">{hasArrived ? t('youHaveArrived', language) : `${t('onTheWay', language)} ${pharmacy.name}`}</p>
                        <p className="text-xs text-gray-400">{pharmacy.address}</p>
                    </div>
                    {!hasArrived && (
                         <div className="text-right flex-shrink-0 ms-4">
                            <p className="text-xs text-gray-400">{t('eta', language)}</p>
                            <p className="font-bold text-2xl text-teal-400">{eta} <span className="text-base font-normal">{t('minutes', language)}</span></p>
                        </div>
                    )}
                </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {hasArrived && (
                <button onClick={onClose} className="w-full mt-4 px-4 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                    {t('close', language)}
                </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};