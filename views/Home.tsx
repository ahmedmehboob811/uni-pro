
import React, { useState, useEffect, useRef } from 'react';
import { Medicine, Language, User } from '../types';
import { t } from '../constants/translations';
import { findMedicineAlternatives } from '../services/geminiService';
import { MedicineCard } from '../components/MedicineCard';
import { Spinner } from '../components/Spinner';
import { db } from '../services/db';
import { CameraIcon, XIcon, LightningIcon, ShieldCheckIcon, DocumentSearchIcon, SearchIcon, UsersIcon, BadgeCheckIcon, StarIcon, PillIcon, HeartIcon, SmartphoneIcon } from '../components/Icons';
import { getMedicineSuggestions, SuggestionItem, PriceLevel } from '../services/medicineDatabase';

interface HomeProps {
  language: Language;
  onAddToCart: (medicine: Medicine) => void;
  onOrderNow: (medicine: Medicine) => void;
  onAskAI?: (medicine: Medicine) => void;
  user?: User | null;
}

type SortOrder = 'default' | 'asc' | 'desc';

export const Home: React.FC<HomeProps> = ({ language, onAddToCart, onOrderNow, onAskAI, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalMedicine, setOriginalMedicine] = useState<Medicine | null>(null);
  const [results, setResults] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedMedicineName, setSearchedMedicineName] = useState('');
  const [savedMedicineIds, setSavedMedicineIds] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  
  // Suggestion State
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load saved medicines on mount or when user changes
  useEffect(() => {
    const fetchSaved = async () => {
        if (user) {
            const saved = await db.getSavedMedicines(user.email);
            setSavedMedicineIds(new Set(saved.map(m => m.brandName)));
        } else {
            setSavedMedicineIds(new Set());
        }
    };
    fetchData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchData() {
        if (user) {
            const saved = await db.getSavedMedicines(user.email);
            setSavedMedicineIds(new Set(saved.map(m => m.brandName)));
        }
    }
  }, [user]);

  // Handle autocomplete input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      
      if (value.length > 0) {
          const matched = getMedicineSuggestions(value);
          setSuggestions(matched);
          setShowSuggestions(matched.length > 0);
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
      setSearchTerm(item.name);
      setShowSuggestions(false);
      setTimeout(() => triggerSearch(item.name), 0);
  };

  const handleQuickSearch = (term: string) => {
      setSearchTerm(term);
      triggerSearch(term);
  }

  const triggerSearch = async (term: string) => {
    if (!term.trim() && !selectedImage) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setOriginalMedicine(null);
    setShowSuggestions(false);
    setSortOrder('default'); // Reset sort order on new search
    setSearchedMedicineName(term || (selectedImage ? 'Prescription Image' : ''));

    try {
      const data = await findMedicineAlternatives(term, selectedImage || undefined);
      setOriginalMedicine(data.original);
      setResults(data.alternatives);
    } catch (err) {
      setError(t('error', language));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => triggerSearch(searchTerm);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  const handleToggleSave = async (medicine: Medicine) => {
      if (!user) {
          alert(t('loginToSave', language));
          return;
      }
      
      const isSaved = savedMedicineIds.has(medicine.brandName);
      // Optimistic update
      const newSet = new Set(savedMedicineIds);
      if (isSaved) {
          newSet.delete(medicine.brandName);
      } else {
          newSet.add(medicine.brandName);
      }
      setSavedMedicineIds(newSet);

      try {
          if (isSaved) {
              await db.removeMedicine(user.email, medicine.brandName);
          } else {
              await db.saveMedicine(user.email, medicine);
          }
      } catch (e) {
          // Revert on error
          console.error("Failed to save/unsave medicine", e);
          const revertSet = new Set(savedMedicineIds);
          setSavedMedicineIds(revertSet);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const clearImage = () => {
      setSelectedImage(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPriceLevelBadge = (level: PriceLevel) => {
      switch(level) {
          case 'Budget':
              return <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold">{t('Budget', language)}</span>;
          case 'Moderate':
              return <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-bold">{t('Moderate', language)}</span>;
          case 'Premium':
              return <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg font-bold">{t('Premium', language)}</span>;
      }
  };

  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const matches = priceStr.match(/(\d+)/);
    return matches ? parseInt(matches[0], 10) : 0;
  };

  const calculateSavings = (originalPriceStr: string, altPriceStr: string): number | null => {
      const originalPrice = parsePrice(originalPriceStr);
      const altPrice = parsePrice(altPriceStr);
      if (originalPrice <= 0 || altPrice <= 0) return null;
      if (altPrice >= originalPrice) return null;
      return Math.round(((originalPrice - altPrice) / originalPrice) * 100);
  };

  const sortedResults = [...results].sort((a, b) => {
      if (sortOrder === 'default') return 0;
      const priceA = parsePrice(a.priceRange);
      const priceB = parsePrice(b.priceRange);
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  const hasResults = !isLoading && (originalMedicine || results.length > 0);

  return (
    <div className="">
      {/* Hero / Search Section */}
      <div className={`relative bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-700 py-20 sm:py-28 rounded-[2.5rem] mb-12 transition-all duration-500 overflow-hidden ${hasResults ? 'py-10 sm:py-12 mb-8' : ''} shadow-2xl shadow-teal-900/20`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[30rem] h-[30rem] bg-white opacity-10 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[24rem] h-[24rem] bg-indigo-900 opacity-20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {!hasResults && !isLoading && !error && (
            <>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg tracking-tight">
                    {t('heroTitle', language)}
                </h1>
                <p className="text-lg md:text-2xl text-teal-50 mb-12 max-w-3xl mx-auto font-medium opacity-90 leading-relaxed">
                    {t('heroSubtitle', language)}
                </p>
            </>
          )}

          <div className={`max-w-3xl mx-auto transition-all duration-500 ${hasResults ? 'max-w-4xl' : ''}`}>
             {selectedImage && (
                <div className="mb-6 relative w-32 h-32 mx-auto shadow-xl rounded-2xl overflow-hidden border-4 border-white">
                    <img src={selectedImage} alt="Selected prescription" className="w-full h-full object-cover" />
                    <button 
                        onClick={clearImage}
                        className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-colors"
                        title={t('removeImage', language)}
                    >
                        <XIcon className="w-3 h-3" />
                    </button>
                </div>
            )}

            <div className="relative" ref={searchInputRef}>
                <div className={`bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-3 relative z-20 transition-all border border-white/50 ${hasResults ? 'shadow-lg border-slate-200' : ''}`}>
                    <div className="relative flex-grow w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onFocus={() => { if(searchTerm.length > 0 && suggestions.length > 0) setShowSuggestions(true); }}
                            onKeyPress={handleKeyPress}
                            placeholder={t('searchPlaceholder', language)}
                            className="w-full pl-12 pr-12 py-4 text-lg text-slate-800 bg-transparent border-none focus:ring-0 placeholder-slate-400 font-medium"
                            autoComplete="off"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all focus:outline-none"
                            title={t('uploadPrescription', language)}
                        >
                            <CameraIcon className="w-6 h-6" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isLoading || (!searchTerm.trim() && !selectedImage)}
                        className="w-full sm:w-auto px-8 py-4 text-lg bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/30 flex items-center justify-center whitespace-nowrap active:scale-95"
                    >
                        {isLoading ? <Spinner className="w-6 h-6 text-white" /> : t('searchButton', language)}
                    </button>
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 sm:right-32 mt-3 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden z-30 animate-fade-in text-left">
                        <ul>
                            {suggestions.map((item, index) => (
                                <li 
                                    key={index}
                                    onClick={() => handleSuggestionClick(item)}
                                    className="px-6 py-3.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center transition-colors group"
                                >
                                    <span className="font-semibold text-slate-700 group-hover:text-teal-700">{item.name}</span>
                                    {getPriceLevelBadge(item.level)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

             {/* Quick Search Chips - Only show when no results */}
             {!hasResults && !isLoading && !error && (
                <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-100">
                    <span className="text-teal-100 font-medium text-sm py-2 mr-1">{t('popularCategories', language)}</span>
                    {[
                        { label: t('categoryPain', language), term: 'Panadol' },
                        { label: t('categoryAntibiotics', language), term: 'Augmentin' },
                        { label: t('categoryVitamins', language), term: 'Surbex Z' },
                        { label: t('categoryStomach', language), term: 'Risek' }
                    ].map((chip, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleQuickSearch(chip.term)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold border border-white/20 transition-all active:scale-95"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Stats Strip - Only show when no results */}
      {!hasResults && !isLoading && !error && (
         <div className="container mx-auto px-4 -mt-20 mb-20 relative z-20">
             <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="flex items-center justify-center space-x-4">
                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                        <UsersIcon className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-extrabold text-slate-800">10k+</p>
                        <p className="text-slate-500 font-medium text-sm">{t('statUsers', language)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <div className="bg-teal-50 p-4 rounded-2xl text-teal-600">
                        <BadgeCheckIcon className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-extrabold text-slate-800">5,000+</p>
                        <p className="text-slate-500 font-medium text-sm">{t('statProducts', language)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <div className="bg-rose-50 p-4 rounded-2xl text-rose-600">
                        <StarIcon className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-extrabold text-slate-800">4.9/5</p>
                        <p className="text-slate-500 font-medium text-sm">{t('statPharmacies', language)}</p>
                    </div>
                </div>
             </div>
         </div>
      )}

      {/* Features Section (Hidden when searching/showing results) */}
      {!hasResults && !isLoading && !error && (
        <div className="container mx-auto px-4 mb-24 animate-fade-in-up">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('whyChooseUs', language)}</h2>
                <div className="h-1.5 w-24 bg-teal-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
                <div className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <LightningIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('featureAI', language)}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{t('featureAIDesc', language)}</p>
                </div>
                <div className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-teal-100/50 hover:-translate-y-2 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-50 text-teal-600 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <DocumentSearchIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('featureScan', language)}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{t('featureScanDesc', language)}</p>
                </div>
                <div className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-2 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheckIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('featureSave', language)}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{t('featureSaveDesc', language)}</p>
                </div>
            </div>

             {/* How it works simple steps */}
             <div className="mt-32 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-16">{t('howItWorks', language)}</h2>
                <div className="flex flex-col md:flex-row justify-between items-center relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-8 left-20 right-20 h-0.5 bg-slate-200 -z-10"></div>
                    
                    <div className="flex flex-col items-center max-w-xs mb-10 md:mb-0 relative z-10 bg-slate-50 md:px-4">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-teal-100 text-teal-600 flex items-center justify-center text-2xl font-bold shadow-md mb-6">1</div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">Search</h4>
                        <p className="text-sm text-slate-500 font-medium">Enter name or upload prescription</p>
                    </div>
                    
                    <div className="flex flex-col items-center max-w-xs mb-10 md:mb-0 relative z-10 bg-slate-50 md:px-4">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-md mb-6">2</div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">Compare</h4>
                        <p className="text-sm text-slate-500 font-medium">See alternatives & prices</p>
                    </div>
                    
                    <div className="flex flex-col items-center max-w-xs relative z-10 bg-slate-50 md:px-4">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold shadow-md mb-6">3</div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">Save</h4>
                        <p className="text-sm text-slate-500 font-medium">Order delivery or find pharmacy</p>
                    </div>
                </div>
             </div>

             {/* Mobile App CTA Section */}
             <div className="mt-32 bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{t('ctaTitle', language)}</h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">{t('ctaDesc', language)}</p>
                        <button className="inline-flex items-center px-8 py-4 bg-teal-500 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-500/40 active:scale-95">
                            <SmartphoneIcon className="w-6 h-6 mr-3" />
                            {t('getApp', language)}
                        </button>
                    </div>
                    <div className="mt-12 md:mt-0 flex space-x-4 opacity-80 grayscale-[20%]">
                        {/* Mock App Screens or Icons */}
                        <div className="w-32 h-64 bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl rotate-[-10deg] flex items-center justify-center">
                            <HeartIcon className="w-12 h-12 text-teal-500" />
                        </div>
                        <div className="w-32 h-64 bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl rotate-[5deg] translate-y-8 flex items-center justify-center">
                            <PillIcon className="w-12 h-12 text-indigo-500" />
                        </div>
                    </div>
                </div>
             </div>
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-20 animate-fade-in">
          <Spinner className="w-16 h-16 mx-auto text-teal-600" />
          <p className="mt-6 text-xl text-slate-600 font-semibold animate-pulse">{t('searching', language)}</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto mt-10 p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center shadow-sm">
            <p className="text-rose-600 font-bold">{error}</p>
        </div>
      )}
      
      {hasResults && (
          <div className="container mx-auto px-4 mt-8 pb-12 animate-fade-in">
             
             {/* Original Medicine Section */}
             {originalMedicine && (
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
                        <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold tracking-wide uppercase mr-4 px-4 py-1.5 rounded-full shadow-md shadow-indigo-200">
                            {t('searchedMedicine', language)}
                        </span>
                    </h2>
                    <div className="rounded-3xl shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
                        <MedicineCard 
                            medicine={originalMedicine} 
                            language={language} 
                            onAddToCart={onAddToCart}
                            onOrderNow={onOrderNow}
                            onToggleSave={handleToggleSave}
                            onAskAI={onAskAI}
                            isSaved={savedMedicineIds.has(originalMedicine.brandName)}
                        />
                    </div>
                </div>
             )}

             {/* Alternatives Section */}
             {results.length > 0 && (
                 <div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-slate-200 pb-6">
                        <h2 className="text-3xl font-bold text-center sm:text-left text-slate-800">
                            {t('resultsTitle', language)} <span className="text-teal-600 block sm:inline mt-2 sm:mt-0">"{searchedMedicineName}"</span>
                        </h2>
                        
                        {/* Sort Dropdown */}
                        <div className="flex items-center space-x-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                             <span className="text-slate-500 font-semibold text-sm pl-3 whitespace-nowrap">{t('sortBy', language)}</span>
                             <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                className="bg-slate-50 border-0 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                             >
                                <option value="default">{t('sortDefault', language)}</option>
                                <option value="asc">{t('sortLowHigh', language)}</option>
                                <option value="desc">{t('sortHighLow', language)}</option>
                             </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {sortedResults.map((med, index) => (
                            <MedicineCard 
                                key={`${med.brandName}-${index}`} 
                                medicine={med} 
                                language={language} 
                                onAddToCart={onAddToCart}
                                onOrderNow={onOrderNow}
                                onToggleSave={handleToggleSave}
                                onAskAI={onAskAI}
                                isSaved={savedMedicineIds.has(med.brandName)}
                                savings={originalMedicine ? calculateSavings(originalMedicine.priceRange, med.priceRange) : null}
                            />
                        ))}
                    </div>
                 </div>
             )}
          </div>
      )}

      {!isLoading && searchedMedicineName && results.length === 0 && !originalMedicine && !error && (
         <div className="text-center py-24 bg-white rounded-[2.5rem] mx-4 shadow-sm border border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentSearchIcon className="w-10 h-10 text-slate-400" />
             </div>
             <p className="text-xl text-slate-600 font-bold mb-2">{t('noResults', language)}</p>
             <p className="text-slate-400 mb-6">We couldn't find any exact matches.</p>
             <button onClick={() => {setSearchTerm(''); setSearchedMedicineName('')}} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Clear Search</button>
         </div>
      )}

    </div>
  );
};
