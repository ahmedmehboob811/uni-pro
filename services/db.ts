
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { Medicine, HealthRecord } from '../types';

const SAVED_MEDS_COLLECTION = 'saved_medicines';
const HEALTH_RECORDS_COLLECTION = 'health_records';

interface SavedMedicineRecord {
    id?: string;
    userEmail: string;
    medicine: Medicine;
    savedAt: string;
}

export const db = {
    // --- Saved Medicines Operations ---
    
    getSavedMedicines: async (userEmail: string): Promise<Medicine[]> => {
        if (firestore) {
            try {
                const q = query(
                    collection(firestore, SAVED_MEDS_COLLECTION),
                    where("userEmail", "==", userEmail)
                );
                
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => {
                    const data = doc.data() as SavedMedicineRecord;
                    return data.medicine;
                });
            } catch (e) {
                console.error("Error fetching medicines: ", e);
                return [];
            }
        } else {
            // MOCK MODE: LocalStorage
            try {
                const allSaved = JSON.parse(localStorage.getItem('vcare_saved_medicines') || '[]');
                return allSaved
                    .filter((item: SavedMedicineRecord) => item.userEmail === userEmail)
                    .map((item: SavedMedicineRecord) => item.medicine);
            } catch (e) {
                return [];
            }
        }
    },

    saveMedicine: async (userEmail: string, medicine: Medicine) => {
        if (firestore) {
            try {
                const isSaved = await db.isMedicineSaved(userEmail, medicine.brandName);
                if (isSaved) return;

                const record: SavedMedicineRecord = {
                    userEmail,
                    medicine,
                    savedAt: new Date().toISOString()
                };
                
                await addDoc(collection(firestore, SAVED_MEDS_COLLECTION), record);
            } catch (e) {
                console.error("Error saving medicine: ", e);
            }
        } else {
             // MOCK MODE: LocalStorage
             const isSaved = await db.isMedicineSaved(userEmail, medicine.brandName);
             if (isSaved) return;

             const allSaved = JSON.parse(localStorage.getItem('vcare_saved_medicines') || '[]');
             const record: SavedMedicineRecord = {
                id: Date.now().toString(),
                userEmail,
                medicine,
                savedAt: new Date().toISOString()
             };
             allSaved.push(record);
             localStorage.setItem('vcare_saved_medicines', JSON.stringify(allSaved));
        }
    },

    removeMedicine: async (userEmail: string, brandName: string) => {
        if (firestore) {
            try {
                const q = query(
                    collection(firestore, SAVED_MEDS_COLLECTION),
                    where("userEmail", "==", userEmail)
                );
                const querySnapshot = await getDocs(q);
                
                const docToDelete = querySnapshot.docs.find(doc => {
                    const data = doc.data() as SavedMedicineRecord;
                    return data.medicine.brandName === brandName;
                });

                if (docToDelete) {
                    await deleteDoc(doc(firestore, SAVED_MEDS_COLLECTION, docToDelete.id));
                }
            } catch (e) {
                console.error("Error removing medicine: ", e);
            }
        } else {
            // MOCK MODE: LocalStorage
            let allSaved = JSON.parse(localStorage.getItem('vcare_saved_medicines') || '[]');
            allSaved = allSaved.filter((item: SavedMedicineRecord) => 
                !(item.userEmail === userEmail && item.medicine.brandName === brandName)
            );
            localStorage.setItem('vcare_saved_medicines', JSON.stringify(allSaved));
        }
    },

    isMedicineSaved: async (userEmail: string, brandName: string): Promise<boolean> => {
         if (firestore) {
             try {
                const q = query(
                    collection(firestore, SAVED_MEDS_COLLECTION),
                    where("userEmail", "==", userEmail)
                );
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.some(doc => {
                     const data = doc.data() as SavedMedicineRecord;
                     return data.medicine.brandName === brandName;
                });
             } catch (e) {
                 return false;
             }
         } else {
             // MOCK MODE: LocalStorage
             const allSaved = JSON.parse(localStorage.getItem('vcare_saved_medicines') || '[]');
             return allSaved.some((item: SavedMedicineRecord) => 
                item.userEmail === userEmail && item.medicine.brandName === brandName
             );
         }
    },

    // --- Health Record Operations ---

    saveHealthRecord: async (userEmail: string, record: HealthRecord) => {
        if (firestore) {
             try {
                 // We use email as the ID for simplicity in this 1:1 relationship
                 await setDoc(doc(firestore, HEALTH_RECORDS_COLLECTION, userEmail), record);
             } catch(e) {
                 console.error("Error saving health record", e);
                 throw e;
             }
        } else {
            // MOCK MODE
            const records = JSON.parse(localStorage.getItem('vcare_health_records') || '{}');
            records[userEmail] = record;
            localStorage.setItem('vcare_health_records', JSON.stringify(records));
        }
    },

    getHealthRecord: async (userEmail: string): Promise<HealthRecord | null> => {
        if (firestore) {
            try {
                // Since we don't have getDoc imported above, let's use query for consistency with existing code styles
                // Or better, assume we can import getDoc. For safety with existing imports:
                const q = query(
                    collection(firestore, HEALTH_RECORDS_COLLECTION), 
                    where("__name__", "==", userEmail) // Query by doc ID
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    return querySnapshot.docs[0].data() as HealthRecord;
                }
                return null;
            } catch (e) {
                console.error("Error getting health record", e);
                return null;
            }
        } else {
            // MOCK MODE
            const records = JSON.parse(localStorage.getItem('vcare_health_records') || '{}');
            return records[userEmail] || null;
        }
    }
};
