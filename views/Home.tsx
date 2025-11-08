import React, { useState } from 'react';
import { Medicine, Language } from '../types';
import { t } from '../constants/translations';
import { findMedicineAlternatives } from '../services/geminiService';
import { MedicineCard } from '../components/MedicineCard';
import { Spinner } from '../components/Spinner';

interface HomeProps {
  language: Language;
  onAddToCart: (medicine: Medicine) => void;
}

export const Home: React.FC<HomeProps> = ({ language, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedMedicine, setSearchedMedicine] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearchedMedicine(searchTerm);

    try {
      const alternatives = await findMedicineAlternatives(searchTerm);
      setResults(alternatives);
    } catch (err) {
      setError(t('error', language));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800">{t('searchTitle', language)}</h1>
      </div>

      <div className="mt-8 max-w-xl mx-auto flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('searchPlaceholder', language)}
          className="w-full px-5 py-3 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-teal-300"
        >
          {isLoading ? <Spinner /> : t('searchButton', language)}
        </button>
      </div>
      
      {isLoading && (
        <div className="text-center mt-10">
          <Spinner className="w-12 h-12 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">{t('searching', language)}</p>
        </div>
      )}

      {error && <p className="text-center mt-10 text-red-600">{error}</p>}
      
      {!isLoading && results.length > 0 && (
          <div className="mt-10">
             <h2 className="text-2xl font-bold text-center mb-6">
                {t('resultsTitle', language)} <span className="text-teal-600">"{searchedMedicine}"</span>
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((med, index) => (
                    <MedicineCard key={`${med.brandName}-${index}`} medicine={med} language={language} onAddToCart={onAddToCart} />
                ))}
             </div>
          </div>
      )}

      {!isLoading && searchedMedicine && results.length === 0 && !error && (
         <p className="text-center mt-10 text-gray-500">{t('noResults', language)}</p>
      )}

    </div>
  );
};