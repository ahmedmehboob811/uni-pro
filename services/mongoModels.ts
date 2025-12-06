
import { Type } from "@google/genai";

/**
 * NOTE: These schemas are for reference only. 
 * In a real application with a Node.js backend, you would use 'mongoose' to define these.
 * Since this is a frontend-only app, we cannot import 'mongoose' directly.
 */

// --- 1. User Schema ---
export const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed in real app
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['patient', 'admin'], default: 'patient' }
};

// --- 2. Medicine Schema ---
export const MedicineSchema = {
  brandName: { type: String, required: true, index: true },
  genericFormula: { type: String, required: true },
  manufacturer: { type: String, required: true },
  priceRange: { type: String, required: true },
  form: { type: String, required: true },
  dosage: { type: String },
  stockStatus: { 
    type: String, 
    enum: ['In Stock', 'Low Stock', 'Out of Stock'], 
    default: 'In Stock' 
  },
  imageUrl: { type: String }
};

// --- 3. Health Record Schema ---
export const HealthRecordSchema = {
  userEmail: { type: String, required: true, ref: 'User' },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  
  // Medical History
  conditions: [{ type: String }], // Array of strings e.g. ["Diabetes"]
  allergies: [{ type: String }],
  
  // Current Medications
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
    reason: { type: String },
    startDate: { type: Date }
  }],
  
  lastUpdated: { type: Date, default: Date.now }
};

// --- 4. Order Schema ---
export const OrderSchema = {
  orderId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  items: [{
    brandName: { type: String },
    quantity: { type: Number },
    price: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  shippingDetails: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, enum: ['COD', 'Card'] },
  createdAt: { type: Date, default: Date.now }
};
