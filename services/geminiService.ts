
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

export const findMedicineAlternatives = async (medicineName: string, imageBase64?: string): Promise<MedicineSearchResult> => {
  // Check if the `ai` instance was successfully initialized.
  if (!ai) {
      // Simulate a delay and return mock data if API key is not present
      console.log("Simulating API call...");
      return new Promise(resolve => setTimeout(() => resolve({
          original: {
             brandName: medicineName || 'Mock Medicine from Image',
             genericFormula: 'Amoxicillin + Clavulanic Acid',
             manufacturer: 'Original Pharma',
             priceRange: 'PKR 450 - 500',
             form: 'Tablet',
             stock: 'In Stock',
             dosage: '1 tablet every 12 hours'
          },
          alternatives: [
            { brandName: 'Sim-Amoxil', genericFormula: 'Amoxicillin + Clavulanic Acid', manufacturer: 'Sim-Pharma', priceRange: 'PKR 180 - 220', form: 'Tablet', stock: 'In Stock', dosage: '1 tablet every 12 hours' },
            { brandName: 'Mock-Clav', genericFormula: 'Amoxicillin + Clavulanic Acid', manufacturer: 'Pak-Mocks', priceRange: 'PKR 150 - 190', form: 'Tablet', stock: 'Low Stock', dosage: '1 tablet every 12 hours' },
          ]
      }), 1500));
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
    
    // Add random stock status
    const addStock = (med: Medicine) => ({
        ...med,
        stock: Math.random() > 0.8 ? 'Low Stock' : (Math.random() > 0.9 ? 'Out of Stock' : 'In Stock')
    } as Medicine);

    return {
        original: addStock(result.original),
        alternatives: result.alternatives.map(addStock)
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch medicine alternatives from AI.");
  }
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const getChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    if (!ai) {
        // Mock response
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

    } catch (error) {
        console.error("Error in chat:", error);
        return "I'm having trouble connecting to the server right now. Please try again later.";
    }
};
