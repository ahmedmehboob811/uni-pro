
import { GoogleGenAI, Type } from "@google/genai";
import { Medicine } from '../types';

const API_KEY = process.env.API_KEY;

// Conditionally initialize GoogleGenAI to avoid errors when API_KEY is missing.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      brandName: {
        type: Type.STRING,
        description: 'The brand name of the medicine.',
      },
      genericFormula: {
        type: Type.STRING,
        description: 'The active generic formula of the medicine.',
      },
      manufacturer: {
        type: Type.STRING,
        description: 'The name of the pharmaceutical company that manufactures it.',
      },
      priceRange: {
        type: Type.STRING,
        description: 'An estimated price range in Pakistani Rupees (PKR), e.g., "PKR 150 - 200".',
      },
      form: {
        type: Type.STRING,
        description: 'The form of the medicine, e.g., "Tablet", "Syrup", "Inhaler", "Injection".',
      },
    },
    required: ["brandName", "genericFormula", "manufacturer", "priceRange", "form"],
  },
};

export const findMedicineAlternatives = async (medicineName: string): Promise<Medicine[]> => {
  // Check if the `ai` instance was successfully initialized.
  if (!ai) {
      // Simulate a delay and return mock data if API key is not present
      console.log("Simulating API call...");
      return new Promise(resolve => setTimeout(() => resolve([
          { brandName: 'Sim-Amoxil', genericFormula: 'Amoxicillin + Clavulanic Acid', manufacturer: 'Sim-Pharma', priceRange: 'PKR 180 - 220', form: 'Tablet' },
          { brandName: 'Mock-Clav', genericFormula: 'Amoxicillin + Clavulanic Acid', manufacturer: 'Pak-Mocks', priceRange: 'PKR 150 - 190', form: 'Tablet' },
      ]), 1500));
  }

  try {
    const prompt = `A user is searching for a high-cost medicine: "${medicineName}". Your primary goal is to help them save money. Find 15 to 20 low-cost, authentic brand alternatives available in Karachi, Pakistan. All alternatives MUST have the exact same active generic formula as "${medicineName}". Prioritize suggesting brands from reputable local Pakistani manufacturers.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const alternatives: Medicine[] = JSON.parse(jsonText);
    
    return alternatives.map(alt => ({
        ...alt,
        stock: Math.random() > 0.8 ? 'Low Stock' : (Math.random() > 0.9 ? 'Out of Stock' : 'In Stock')
    }));

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch medicine alternatives from AI.");
  }
};