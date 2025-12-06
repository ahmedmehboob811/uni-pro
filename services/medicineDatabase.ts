
export type PriceLevel = 'Budget' | 'Moderate' | 'Premium';

export interface SuggestionItem {
  name: string;
  level: PriceLevel;
}

export const commonMedicinesDB: SuggestionItem[] = [
  // Pain Relief & Fever
  { name: 'Panadol', level: 'Budget' },
  { name: 'Disprin', level: 'Budget' },
  { name: 'Brufen', level: 'Budget' },
  { name: 'Ponstan', level: 'Moderate' },
  { name: 'Caflam', level: 'Moderate' },
  { name: 'Synflex', level: 'Moderate' },
  
  // Antibiotics
  { name: 'Augmentin', level: 'Premium' },
  { name: 'Amoxil', level: 'Moderate' },
  { name: 'Velosef', level: 'Moderate' },
  { name: 'Ciproxin', level: 'Premium' },
  { name: 'Leflox', level: 'Premium' },
  { name: 'Flagyl', level: 'Budget' },

  // Stomach & Digestion
  { name: 'Risek', level: 'Premium' },
  { name: 'Omeprazole', level: 'Budget' },
  { name: 'Nexium', level: 'Premium' },
  { name: 'Gaviscon', level: 'Moderate' },
  { name: 'Eno', level: 'Budget' },

  // Allergy
  { name: 'Rigix', level: 'Moderate' },
  { name: 'Zyrtec', level: 'Moderate' },
  { name: 'Fexet', level: 'Moderate' },
  { name: 'Softin', level: 'Budget' },
  { name: 'Arinac', level: 'Moderate' },

  // Vitamins & Supplements
  { name: 'Surbex Z', level: 'Moderate' },
  { name: 'Cac-1000', level: 'Moderate' },
  { name: 'Neurobion', level: 'Moderate' },
  
  // Chronic Conditions
  { name: 'Glucophage', level: 'Budget' },
  { name: 'Tenormin', level: 'Budget' },
  { name: 'Lipiget', level: 'Moderate' },
  { name: 'Concor', level: 'Moderate' },
  { name: 'Norvasc', level: 'Moderate' },
  { name: 'Lowplat', level: 'Budget' }
];

export const getMedicineSuggestions = (query: string): SuggestionItem[] => {
    if (!query || query.length < 1) return [];
    
    const lowerQuery = query.toLowerCase();
    return commonMedicinesDB.filter(item => 
        item.name.toLowerCase().startsWith(lowerQuery)
    ).slice(0, 6); // Limit to 6 suggestions
};
