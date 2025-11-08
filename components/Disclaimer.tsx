
import React from 'react';
import { Language } from '../types';
import { t } from '../constants/translations';
import { InfoIcon } from './Icons';

interface DisclaimerProps {
  language: Language;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ language }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 my-6 rounded-r-lg" role="alert">
      <div className="flex items-start">
        <div className="py-1">
          <InfoIcon />
        </div>
        <div className="ms-3">
          <p className="font-bold">{t('disclaimer', language)}</p>
        </div>
      </div>
    </div>
  );
};
