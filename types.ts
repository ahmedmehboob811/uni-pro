
export enum Language {
  EN = 'en',
  UR = 'ur',
}

export enum View {
  HOME = 'home',
  DASHBOARD = 'dashboard',
  PHARMACIES = 'pharmacies',
  APPOINTMENTS = 'appointments',
  LOGIN = 'login',
  HEALTH_PROFILE = 'health_profile',
}

export interface User {
  name: string;
  email: string;
}

export interface UserMedicine {
    name: string;
    dosage: string;
    frequency: string;
    reason: string;
}

export interface HealthRecord {
    fullName: string;
    age: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    conditions: string;
    allergies: string;
    medicines: UserMedicine[];
}

export interface Medicine {
  brandName: string;
  genericFormula: string;
  manufacturer: string;
  priceRange: string;
  form: string;
  stock?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  dosage?: string;
}

export interface Appointment {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'Online' | 'In-Person';
}

export interface Order {
    id: string;
    status: 'Delivered' | 'Processing';
    date: string;
    medicines: { name: string; quantity: number }[];
}

export interface HealthDataPoint {
    month: string;
    systolic: number;
    diastolic: number;
}

export interface Pharmacy {
    id: number;
    name: string;
    address: string;
    distance: string;
    hours: string;
    lat: number;
    lng: number;
}
