
import React from 'react';
import { Medicine, Language } from '../types';
import { t } from '../constants/translations';
import { PlusIcon, BookmarkIcon, CreditCardIcon, SparklesIcon } from './Icons';

interface MedicineCardProps {
  medicine: Medicine;
  language: Language;
  onAddToCart: (medicine: Medicine) => void;
  onOrderNow: (medicine: Medicine) => void;
  onToggleSave?: (medicine: Medicine) => void;
  onAskAI?: (medicine: Medicine) => void;
  isSaved?: boolean;
  savings?: number | null;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ 
  medicine, 
  language, 
  onAddToCart, 
  onOrderNow,
  onToggleSave,
  onAskAI,
  isSaved = false,
  savings
}) => {
  
  const getStockColor = () => {
    switch (medicine.stock) {
      case 'In Stock':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Low Stock':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'Out of Stock':
        return 'text-rose-700 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };
  
  const isOutOfStock = medicine.stock === 'Out of Stock';

  return (
    <div className={`group bg-white rounded-3xl border border-slate-100 overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 h-full ${isOutOfStock ? 'opacity-75 grayscale-[20%]' : ''}`}>
      <div className="relative">
        <div className="flex justify-between items-start mb-3">
            <div>
                 <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1 group-hover:text-teal-700 transition-colors">{medicine.brandName}</h3>
                 <p className="text-sm font-semibold text-teal-600 bg-teal-50 inline-block px-2 py-0.5 rounded-md">{medicine.genericFormula}</p>
            </div>
            {onToggleSave && (
                <button 
                    onClick={() => onToggleSave(medicine)}
                    className={`p-2.5 rounded-full transition-all duration-200 shadow-sm ${isSaved ? 'text-white bg-teal-500 hover:bg-teal-600' : 'text-slate-300 hover:text-teal-600 hover:bg-slate-50'}`}
                    title={isSaved ? t('saved', language) : t('save', language)}
                >
                    <BookmarkIcon filled={isSaved} className="w-5 h-5" />
                </button>
            )}
        </div>
        
        <div className="mt-5 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('priceRange', language)}</span>
                <div className="text-right">
                     <span className="block font-extrabold text-slate-900 text-lg">{medicine.priceRange}</span>
                     {savings && savings > 0 && (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                            {t('saveBadge', language)} {savings}%
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-2 rounded-xl">
                     <span className="block text-xs text-slate-400 font-semibold mb-0.5">{t('manufacturer', language)}</span>
                     <span className="font-semibold text-slate-700 truncate block" title={medicine.manufacturer}>{medicine.manufacturer}</span>
                </div>
                <div className="bg-white p-2 rounded-xl text-right">
                     <span className="block text-xs text-slate-400 font-semibold mb-0.5">{t('form', language)}</span>
                     <span className="font-semibold text-slate-700">{medicine.form}</span>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
                <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wide">{t('dosage', language)}</span>
                <p className={`text-sm font-medium leading-relaxed ${!medicine.dosage ? 'text-slate-400 italic' : 'text-slate-600'}`}>
                    {medicine.dosage || t('consultDoctor', language)}
                </p>
            </div>

            <div className="pt-1">
                 <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold border ${getStockColor()}`}>
                    {t(medicine.stock?.replace(' ', '').toLowerCase() as any, language) || medicine.stock}
                 </span>
            </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
            <button 
                onClick={() => onAddToCart(medicine)}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg shadow-slate-200 active:scale-95 text-sm"
            >
                <PlusIcon className="w-5 h-5 sm:me-2"/>
                <span className="hidden sm:inline">{t('addToCart', language)}</span>
            </button>
            <button 
                onClick={() => onOrderNow(medicine)}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all disabled:from-teal-200 disabled:to-teal-200 disabled:cursor-not-allowed shadow-lg shadow-teal-200 active:scale-95 text-sm"
            >
                <CreditCardIcon className="w-5 h-5 sm:me-2"/>
                <span className="hidden sm:inline">{t('orderNow', language)}</span>
            </button>
        </div>
        {onAskAI && (
            <button 
                onClick={() => onAskAI(medicine)}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all active:scale-95 text-sm"
            >
                <SparklesIcon className="w-4 h-4 me-2" />
                {t('askAI', language)}
            </button>
        )}
      </div>
    </div>
  );
};
