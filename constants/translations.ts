import { Language } from '../types';

type Translations = {
  [key: string]: {
    [lang in Language]: string;
  };
};

const translations: Translations = {
  // General
  tagline: { en: 'Your Health, Simplified.', ur: 'آپ کی صحت، آسان بنائی گئی۔' },
  copyright: { en: '© 2024 V-CARE. All rights reserved.', ur: '© 2024 وی کیئر۔ جملہ حقوق محفوظ ہیں۔' },
  disclaimer: { en: 'This information is AI-generated and for informational purposes only. Always consult a healthcare professional for medical advice.', ur: 'یہ معلومات AI سے تیار کردہ ہیں اور صرف معلوماتی مقاصد کے لیے ہیں۔ طبی مشورے کے لیے ہمیشہ کسی ہیلتھ کیئر پروفیشنل سے رجوع کریں۔' },
  close: { en: 'Close', ur: 'بند کریں' },

  // Header & Nav
  appName: { en: 'V-CARE', ur: 'وی کیئر' },
  home: { en: 'Find Medicine', ur: 'دوا تلاش کریں' },
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  pharmacies: { en: 'Pharmacies', ur: 'فارمیسیز' },
  appointments: { en: 'Appointments', ur: 'ملاقاتیں' },
  login: { en: 'Login', ur: 'لاگ ان کریں' },
  logout: { en: 'Logout', ur: 'لاگ آؤٹ' },

  // Login View
  welcome: { en: 'Welcome Back!', ur: 'خوش آمدید!' },
  loginPrompt: { en: 'Log in to access your dashboard.', ur: 'اپنے ڈیش بورڈ تک رسائی کے لیے لاگ ان کریں۔' },
  emailPlaceholder: { en: 'Email Address', ur: 'ای میل ایڈریس' },
  passwordPlaceholder: { en: 'Password', ur: 'پاس ورڈ' },
  emailRequired: { en: 'Email is required.', ur: 'ای میل درکار ہے۔' },
  passwordRequired: { en: 'Password is required.', ur: 'پاس ورڈ درکار ہے۔' },

  // Home View
  searchTitle: { en: 'Find Cheaper Medicine Alternatives', ur: 'دوا کے سستے متبادل تلاش کریں' },
  searchPlaceholder: { en: 'Enter medicine name, e.g., "Augmentin"', ur: 'دوا کا نام درج کریں، جیسے "Augmentin"' },
  searchButton: { en: 'Find Alternatives', ur: 'متبادل تلاش کریں' },
  searching: { en: 'Searching...', ur: 'تلاش جاری ہے...' },
  resultsTitle: { en: 'AI-Generated Alternatives for', ur: 'کے لیے AI سے تیار کردہ متبادل' },
  noResults: { en: 'No alternatives found. Please try another medicine.', ur: 'کوئی متبادل نہیں ملا۔ براہ کرم کوئی دوسری دوا آزمائیں۔' },
  error: { en: 'An error occurred. Please try again later.', ur: 'ایک خرابی واقع ہوئی ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔' },
  
  // Medicine Card
  brandName: { en: 'Brand Name', ur: 'برانڈ کا نام' },
  genericFormula: { en: 'Generic Formula', ur: 'جینرک فارمولا' },
  manufacturer: { en: 'Manufacturer', ur: 'بنانے والا' },
  priceRange: { en: 'Price Range', ur: 'قیمت کی حد' },
  form: { en: 'Form', ur: 'قسم' },
  stockStatus: { en: 'Stock Status', ur: 'اسٹاک کی حیثیت' },
  instock: { en: 'In Stock', ur: 'اسٹاک میں ہے' },
  lowstock: { en: 'Low Stock', ur: 'اسٹاک کم ہے' },
  outofstock: { en: 'Out of Stock', ur: 'اسٹاک ختم' },
  addToCart: { en: 'Add to Cart', ur: 'کارٹ میں شامل کریں' },

  // Dashboard View
  welcomeUser: { en: 'Welcome', ur: 'خوش آمدید' },
  healthHistory: { en: 'Health History', ur: 'صحت کی تاریخ' },
  bloodPressureTrend: { en: 'Blood Pressure Trend (Last 6 Months)', ur: 'بلڈ پریشر کا رجحان (گزشتہ 6 ماہ)' },
  myAppointments: { en: 'My Appointments', ur: 'میری ملاقاتیں' },
  bookAppointment: { en: 'Book New Appointment', ur: 'نئی ملاقات بُک کریں' },
  myOrders: { en: 'My Orders', ur: 'میرے آرڈرز' },
  
  // Pharmacies View
  nearbyPharmacies: { en: 'Nearby Pharmacies', ur: 'قریبی فارمیسیز' },
  navigate: { en: 'Navigate', ur: 'نیویگیٹ کریں' },

  // Navigation Modal
  yourDriver: { en: 'Your Driver', ur: 'آپ کا ڈرائیور' },
  driverName: { en: 'Kamran', ur: 'کامران' },
  carDetails: { en: 'White Suzuki Alto - LE-1234', ur: 'سفید سوزوکی آلٹو - LE-1234' },
  onTheWay: { en: 'On the way to', ur: 'کی طرف رواں دواں' },
  youHaveArrived: { en: 'You have arrived', ur: 'آپ پہنچ چکے ہیں' },
  eta: { en: 'ETA', ur: 'متوقع آمد' },
  minutes: { en: 'min', ur: 'منٹ' },

  // Appointments View
  bookNewAppointment: { en: 'Book a New Appointment', ur: 'نئی ملاقات بُک کریں' },
  errorDoctorRequired: { en: 'Doctor selection is required.', ur: 'ڈاکٹر کا انتخاب ضروری ہے۔' },
  errorDateRequired: { en: 'Date is required.', ur: 'تاریخ درکار ہے۔' },
  errorDateInPast: { en: 'Cannot book an appointment in the past.', ur: 'ماضی میں ملاقات بُک نہیں کی جا سکتی۔' },
  errorTimeRequired: { en: 'Time is required.', ur: 'وقت درکار ہے۔' },
  bookingSuccessTitle: { en: 'Appointment Booked!', ur: 'ملاقات بُک ہو گئی!' },
  bookingSuccessMessage: { en: 'Your appointment has been successfully scheduled.', ur: 'آپ کی ملاقات کامیابی سے طے ہو گئی ہے۔' },
  bookAnotherAppointment: { en: 'Book Another Appointment', ur: 'ایک اور ملاقات بُک کریں' },
  aiRecommendation: { en: 'AI Recommendation (based on your health data)', ur: 'AI کی سفارش (آپ کے صحت کے ڈیٹا کی بنیاد پر)' },
  selectDoctor: { en: 'Select Doctor', ur: 'ڈاکٹر منتخب کریں' },
  selectDate: { en: 'Select Date', ur: 'تاریخ منتخب کریں' },
  selectTime: { en: 'Select Time', ur: 'وقت منتخب کریں' },
  confirmBooking: { en: 'Confirm Booking', ur: 'بکنگ کی تصدیق کریں' },
};

export const t = (key: keyof typeof translations, language: Language): string => {
  // FIX: The type of `key` is `string | number` due to the index signature on `Translations`.
  // If a numeric key is passed and it's not in `translations`, the key itself (a number) would be returned,
  // violating the function's `string` return type. This ensures the fallback is always a string.
  return translations[key] ? translations[key][language] : String(key);
};