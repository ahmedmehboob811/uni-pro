
import { GoogleGenAI, Type } from "@google/genai";
import { Medicine } from '../types';

const API_KEY = process.env.API_KEY;

// Conditionally initialize GoogleGenAI to avoid errors when API_KEY is missing.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const medicineSchema = {
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
      dosage: {
        type: Type.STRING,
        description: 'General dosage instruction for adults, e.g., "1 tablet twice daily".',
      },
    },
    required: ["brandName", "genericFormula", "manufacturer", "priceRange", "form", "dosage"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    original: medicineSchema,
    alternatives: {
      type: Type.ARRAY,
      items: medicineSchema,
    }
  },
  required: ["original", "alternatives"],
};

export interface MedicineSearchResult {
    original: Medicine;
    alternatives: Medicine[];
}

// Helper function to generate mock data
const getMockData = (term: string): MedicineSearchResult => {
    return {
        original: {
           brandName: term || 'Panadol',
           genericFormula: 'Paracetamol',
           manufacturer: 'GSK',
           priceRange: 'PKR 30 - 40',
           form: 'Tablet',
           stock: 'In Stock',
           dosage: '1-2 tablets every 4-6 hours'
        },
        alternatives: [
          { brandName: 'Disprol', genericFormula: 'Paracetamol', manufacturer: 'Reckitt Benckiser', priceRange: 'PKR 25 - 35', form: 'Tablet', stock: 'In Stock', dosage: '1-2 tablets every 4-6 hours' },
          { brandName: 'Calpol', genericFormula: 'Paracetamol', manufacturer: 'GSK', priceRange: 'PKR 40 - 50', form: 'Tablet', stock: 'Low Stock', dosage: '1-2 tablets every 4-6 hours' },
          { brandName: 'Febrol', genericFormula: 'Paracetamol', manufacturer: 'Highnoon', priceRange: 'PKR 20 - 30', form: 'Tablet', stock: 'In Stock', dosage: '1-2 tablets every 4-6 hours' },
          { brandName: 'Askprol', genericFormula: 'Paracetamol', manufacturer: 'Askari', priceRange: 'PKR 15 - 25', form: 'Tablet', stock: 'In Stock', dosage: '1-2 tablets every 4-6 hours' },
        ]
    };
};

export const findMedicineAlternatives = async (medicineName: string, imageBase64?: string): Promise<MedicineSearchResult> => {
  // Add stock status helper
  const addStock = (med: Medicine) => ({
    ...med,
    stock: med.stock || (Math.random() > 0.8 ? 'Low Stock' : (Math.random() > 0.9 ? 'Out of Stock' : 'In Stock'))
  } as Medicine);

  // Check if the `ai` instance was successfully initialized.
  if (!ai) {
      console.log("Mock Mode: API Key missing.");
      return new Promise(resolve => setTimeout(() => {
          const mock = getMockData(medicineName);
          resolve({
              original: addStock(mock.original),
              alternatives: mock.alternatives.map(addStock)
          });
      }, 1000));
  }

  try {
    let contents: any = [];
    let promptText = '';

    const instructions = `
    1. Identify the details of the medicine (Brand Name, Generic Formula, Manufacturer, Price Range in PKR, Form, Dosage).
    2. Find 10 to 15 low-cost, authentic brand alternatives available in Pakistan with the *exact same* active generic formula. Prioritize brands from reputable local manufacturers.
    3. Include typical adult dosage instructions in the 'dosage' field.
    
    Output JSON with two keys: 
    - "original": Object containing details of the searched medicine.
    - "alternatives": Array of objects containing the alternative medicines.
    `;

    if (imageBase64) {
        promptText = `Analyze the provided image to identify the prescribed medicine. `;
        if (medicineName) {
            promptText += `The user also provided this text for context: "${medicineName}". `;
        }
        promptText += `Identify the medicine details and find cheaper alternatives in Karachi, Pakistan. ${instructions}`;
        
        // Extract MIME type and data from data URL
        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        let mimeType = 'image/jpeg';
        let data = imageBase64;
        
        if (matches && matches.length === 3) {
            mimeType = matches[1];
            data = matches[2];
        }

        contents = {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: data
                    }
                },
                {
                    text: promptText
                }
            ]
        };
    } else {
        promptText = `A user is searching for details about the medicine "${medicineName}" and wants to find cheaper alternatives in Karachi, Pakistan. ${instructions}`;
        contents = promptText;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    return {
        original: addStock(result.original),
        alternatives: result.alternatives.map(addStock)
    };

  } catch (error: any) {
    console.warn("Gemini API Error (Falling back to Mock Data):", error.message);
    // FALLBACK: If API fails (e.g. 429 Quota Exceeded), return Mock Data so app doesn't crash
    const mock = getMockData(medicineName);
    return {
        original: addStock(mock.original),
        alternatives: mock.alternatives.map(addStock)
    };
  }
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const getChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    if (!ai) {
        return new Promise(resolve => setTimeout(() => resolve("I am currently in mock mode. I can only provide real health advice when connected to the Gemini API. However, usually, you should consult a doctor for this query."), 1000));
    }

    try {
        const systemInstruction = `You are V-CARE, a helpful and friendly AI Health Assistant. 
        Your goal is to guide users about medicines, diseases, medicine timing, and personal healthcare.
        
        Guidelines:
        1. Provide accurate, general information about medicines (uses, common side effects, precautions).
        2. Advise on general timing (e.g., "usually taken after food"), but emphasize following the doctor's prescription.
        3. For personal healthcare, offer lifestyle tips (diet, exercise, hygiene).
        4. CRITICAL: You are NOT a doctor. Do NOT provide diagnosis or strictly prescriptive medical advice. 
           Always end answers about serious symptoms or specific dosages with a disclaimer to consult a healthcare professional.
        5. Be concise, empathetic, and easy to understand.
        6. If asked about a specific medicine context provided in the chat, focus on that medicine.
        `;

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return result.text;

    } catch (error: any) {
        console.error("Error in chat:", error);
        // Fallback response if chat fails
        return "I apologize, but I'm having trouble accessing my medical database right now. Please verify your internet connection or try again later. For immediate medical concerns, please consult a doctor.";
    }
};
