
import React from 'react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className={`font-semibold text-lg ${language === Language.UR ? 'urdu' : ''}`}>{t('tagline', language)}</p>
        <p className="text-sm text-gray-400 mt-2">{t('copyright', language)}</p>
      </div>
    </footer>
  );
};
