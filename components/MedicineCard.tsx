
import React from 'react';
import { Medicine, Language } from '../types';
import { t } from '../constants/translations';
import { PlusIcon } from './Icons';

interface MedicineCardProps {
  medicine: Medicine;
  language: Language;
  onAddToCart: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, language, onAddToCart }) => {
  
  const getStockColor = () => {
    switch (medicine.stock) {
      case 'In Stock':
        return 'text-green-600 bg-green-100';
      case 'Low Stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'Out of Stock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const isOutOfStock = medicine.stock === 'Out of Stock';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden p-5 flex flex-col justify-between transition-shadow hover:shadow-lg ${isOutOfStock ? 'opacity-60' : ''}`}>
      <div>
        <h3 className="text-xl font-bold text-teal-800">{medicine.brandName}</h3>
        <p className="text-sm text-gray-500 mt-1">{medicine.genericFormula}</p>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">{t('manufacturer', language)}:</span>
            <span className="text-gray-800 text-right">{medicine.manufacturer}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">{t('priceRange', language)}:</span>
            <span className="text-gray-800 font-mono text-right">{medicine.priceRange}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">{t('form', language)}:</span>
            <span className="text-gray-800 text-right">{medicine.form}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">{t('stockStatus', language)}:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStockColor()}`}>
              {t(medicine.stock?.replace(' ', '').toLowerCase() as any, language) || medicine.stock}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => onAddToCart(medicine)}
          disabled={isOutOfStock}
          className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 me-2"/>
          {t('addToCart', language)}
        </button>
      </div>
    </div>
  );
};
