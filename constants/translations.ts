
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
  healthProfile: { en: 'Health Profile', ur: 'ہیلتھ پروفائل' },
  login: { en: 'Login', ur: 'لاگ ان کریں' },
  logout: { en: 'Logout', ur: 'لاگ آؤٹ' },

  // Landing Page / Hero
  heroTitle: { en: 'Your Personal AI Health Assistant', ur: 'آپ کا ذاتی AI ہیلتھ اسسٹنٹ' },
  heroSubtitle: { en: 'Find affordable medicine alternatives, compare prices, and manage your health efficiently.', ur: 'سستی ادویات کے متبادل تلاش کریں، قیمتوں کا موازنہ کریں، اور اپنی صحت کا مؤثر طریقے سے انتظام کریں۔' },
  popularCategories: { en: 'Popular Categories:', ur: 'مشہور زمرے:' },
  categoryPain: { en: 'Pain Relief', ur: 'درد سے نجات' },
  categoryAntibiotics: { en: 'Antibiotics', ur: 'اینٹی بائیوٹکس' },
  categoryVitamins: { en: 'Vitamins', ur: 'وٹامنز' },
  categoryStomach: { en: 'Stomach', ur: 'معدہ' },
  
  // Stats
  statUsers: { en: '10k+ Users', ur: '10 ہزار+ صارفین' },
  statProducts: { en: 'Verified Meds', ur: 'تصدیق شدہ ادویات' },
  statPharmacies: { en: '24/7 Support', ur: '24/7 سپورٹ' },
  
  featureAI: { en: 'AI-Powered Search', ur: 'AI سے چلنے والی تلاش' },
  featureAIDesc: { en: 'Instantly find generic alternatives with the same active formula.', ur: 'اسی فارمولے کے ساتھ فوری طور پر جینرک متبادل تلاش کریں۔' },
  featureScan: { en: 'Smart Scanning', ur: 'اسمارٹ اسکیننگ' },
  featureScanDesc: { en: 'Upload prescription images to automatically identify medicines.', ur: 'ادویات کی خودکار شناخت کے لیے نسخے کی تصاویر اپ لوڈ کریں۔' },
  featureSave: { en: 'Save Money', ur: 'پیسے بچائیں' },
  featureSaveDesc: { en: 'Compare prices and choose cost-effective healthcare options.', ur: 'قیمتوں کا موازنہ کریں اور کم خرچ صحت کی دیکھ بھال کے اختیارات کا انتخاب کریں۔' },
  howItWorks: { en: 'How It Works', ur: 'یہ کیسے کام کرتا ہے' },
  whyChooseUs: { en: 'Why Choose V-CARE?', ur: 'V-CARE کا انتخاب کیوں کریں؟' },
  ctaTitle: { en: 'Healthcare in Your Pocket', ur: 'صحت کی دیکھ بھال آپ کی جیب میں' },
  ctaDesc: { en: 'Download our app for on-the-go access to medicine prices and health records.', ur: 'ادویات کی قیمتوں اور صحت کے ریکارڈ تک رسائی کے لیے ہماری ایپ ڈاؤن لوڈ کریں۔' },
  getApp: { en: 'Get the App', ur: 'ایپ حاصل کریں' },

  // Login View
  welcome: { en: 'Welcome Back!', ur: 'خوش آمدید!' },
  loginPrompt: { en: 'Log in to access your dashboard.', ur: 'اپنے ڈیش بورڈ تک رسائی کے لیے لاگ ان کریں۔' },
  signupPrompt: { en: 'Create an account to track your health.', ur: 'اپنی صحت کا ریکارڈ رکھنے کے لیے اکاؤنٹ بنائیں۔' },
  emailPlaceholder: { en: 'Email Address', ur: 'ای میل ایڈریس' },
  passwordPlaceholder: { en: 'Password', ur: 'پاس ورڈ' },
  namePlaceholder: { en: 'Full Name', ur: 'پورا نام' },
  emailRequired: { en: 'Email is required.', ur: 'ای میل درکار ہے۔' },
  passwordRequired: { en: 'Password is required.', ur: 'پاس ورڈ درکار ہے۔' },
  nameRequired: { en: 'Name is required.', ur: 'نام درکار ہے۔' },
  signup: { en: 'Sign Up', ur: 'سائن اپ کریں' },
  createAccount: { en: 'Create Account', ur: 'اکاؤنٹ بنائیں' },
  alreadyHaveAccount: { en: 'Already have an account?', ur: 'کیا آپ کا پہلے سے اکاؤنٹ ہے؟' },
  dontHaveAccount: { en: "Don't have an account?", ur: "کیا آپ کا اکاؤنٹ نہیں ہے؟" },
  loginHere: { en: 'Login here', ur: 'یہاں لاگ ان کریں' },
  signupHere: { en: 'Sign up here', ur: 'یہاں سائن اپ کریں' },
  userExists: { en: 'User already exists.', ur: 'صارف پہلے سے موجود ہے۔' },
  invalidCredentials: { en: 'Invalid email or password.', ur: 'غلط ای میل یا پاس ورڈ۔' },
  emailNotFound: { en: 'Email not found. Please check or sign up.', ur: 'ای میل نہیں ملا۔ براہ کرم چیک کریں یا سائن اپ کریں۔' },
  forgotPassword: { en: 'Forgot Password?', ur: 'پاس ورڈ بھول گئے؟' },
  forgotPasswordDesc: { en: 'Enter your email to receive a password reset link.', ur: 'پاس ورڈ دوبارہ ترتیب دینے کا لنک حاصل کرنے کے لیے اپنا ای میل درج کریں۔' },
  sendResetLink: { en: 'Send Reset Link', ur: 'ری سیٹ لنک بھیجیں' },
  backToLogin: { en: 'Back to Login', ur: 'لاگ ان پر واپس جائیں' },
  resetSuccess: { en: 'Password reset link sent to your email!', ur: 'پاس ورڈ ری سیٹ کا لنک آپ کے ای میل پر بھیج دیا گیا ہے!' },
  resetError: { en: 'Failed to send reset link. Please check your email.', ur: 'ری سیٹ لنک بھیجنے میں ناکامی۔ براہ کرم اپنا ای میل چیک کریں۔' },
  demoMode: { en: 'Demo Mode', ur: 'ڈیمو موڈ' },
  demoEmailNotice: { en: 'Since no email provider is configured (Missing API Key), no actual email was sent. This is a UI simulation.', ur: 'چونکہ کوئی ای میل فراہم کنندہ ترتیب نہیں دیا گیا ہے (API کلید غائب ہے)، اس لیے کوئی اصل ای میل نہیں بھیجی گئی۔ یہ صرف ایک UI نقلی ہے۔' },

  // Home View
  searchTitle: { en: 'Find Cheaper Medicine Alternatives', ur: 'دوا کے سستے متبادل تلاش کریں' },
  searchPlaceholder: { en: 'Enter medicine name, e.g., "Augmentin"', ur: 'دوا کا نام درج کریں، جیسے "Augmentin"' },
  searchButton: { en: 'Find Alternatives', ur: 'متبادل تلاش کریں' },
  searching: { en: 'Searching...', ur: 'تلاش جاری ہے...' },
  resultsTitle: { en: 'Cheaper Alternatives for', ur: 'کے لیے سستے متبادل' },
  searchedMedicine: { en: 'Searched Medicine', ur: 'تلاش کردہ دوا' },
  noResults: { en: 'No alternatives found. Please try another medicine.', ur: 'کوئی متبادل نہیں ملا۔ براہ کرم کوئی دوسری دوا آزمائیں۔' },
  error: { en: 'An error occurred. Please try again later.', ur: 'ایک خرابی واقع ہوئی ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔' },
  loginToSave: { en: 'Login to save medicines', ur: 'دوائیں محفوظ کرنے کے لیے لاگ ان کریں' },
  uploadPrescription: { en: 'Upload Prescription', ur: 'نسخہ اپ لوڈ کریں' },
  removeImage: { en: 'Remove Image', ur: 'تصویر ہٹائیں' },
  
  // Sorting
  sortBy: { en: 'Sort by Price', ur: 'قیمت کے لحاظ سے ترتیب دیں' },
  sortDefault: { en: 'Recommended', ur: 'تجویز کردہ' },
  sortLowHigh: { en: 'Lowest to Highest', ur: 'کم سے زیادہ' },
  sortHighLow: { en: 'Highest to Lowest', ur: 'زیادہ سے کم' },

  // Price Levels
  Budget: { en: 'Budget Friendly', ur: 'کم خرچ' },
  Moderate: { en: 'Moderate Price', ur: 'درمیانی قیمت' },
  Premium: { en: 'Expensive', ur: 'مہنگی' },

  // Medicine Card
  brandName: { en: 'Brand Name', ur: 'برانڈ کا نام' },
  genericFormula: { en: 'Generic Formula', ur: 'جینرک فارمولا' },
  manufacturer: { en: 'Manufacturer', ur: 'بنانے والا' },
  priceRange: { en: 'Price Range', ur: 'قیمت کی حد' },
  form: { en: 'Form', ur: 'قسم' },
  dosage: { en: 'Dosage', ur: 'خوراک' },
  consultDoctor: { en: 'Consult your doctor for dosage information', ur: 'خوراک کے لیے اپنے ڈاکٹر سے رجوع کریں' },
  stockStatus: { en: 'Stock Status', ur: 'اسٹاک کی حیثیت' },
  instock: { en: 'In Stock', ur: 'اسٹاک میں ہے' },
  lowstock: { en: 'Low Stock', ur: 'اسٹاک کم ہے' },
  outofstock: { en: 'Out of Stock', ur: 'اسٹاک ختم' },
  addToCart: { en: 'Add to Cart', ur: 'کارٹ میں شامل کریں' },
  orderNow: { en: 'Order Now', ur: 'ابھی آرڈر کریں' },
  save: { en: 'Save', ur: 'محفوظ کریں' },
  saved: { en: 'Saved', ur: 'محفوظ شدہ' },
  saveBadge: { en: 'Save', ur: 'بچت' },
  askAI: { en: 'Ask AI', ur: 'AI سے پوچھیں' },

  // Dashboard View
  welcomeUser: { en: 'Welcome', ur: 'خوش آمدید' },
  healthHistory: { en: 'Health History', ur: 'صحت کی تاریخ' },
  bloodPressureTrend: { en: 'Blood Pressure Trend (Last 6 Months)', ur: 'بلڈ پریشر کا رجحان (گزشتہ 6 ماہ)' },
  myAppointments: { en: 'My Appointments', ur: 'میری ملاقاتیں' },
  bookAppointment: { en: 'Book New Appointment', ur: 'نئی ملاقات بُک کریں' },
  myOrders: { en: 'My Orders', ur: 'میرے آرڈرز' },
  savedMedicines: { en: 'Saved Medicines', ur: 'محفوظ شدہ دوائیں' },
  noSavedMedicines: { en: 'No saved medicines yet.', ur: 'ابھی تک کوئی دوا محفوظ نہیں کی گئی ہے۔' },
  yourHealthRecord: { en: 'Your Health Record', ur: 'آپ کا ہیلتھ ریکارڈ' },
  completeProfile: { en: 'Complete Profile', ur: 'پروفائل مکمل کریں' },
  
  // Health Profile View
  healthProfileTitle: { en: 'Let’s Build Your Health Profile', ur: 'آئیے آپ کا ہیلتھ پروفائل بنائیں' },
  healthProfileSubtitle: { en: 'Sharing this information helps us provide you with better, personalized care.', ur: 'یہ معلومات شیئر کرنے سے ہمیں آپ کو بہتر اور ذاتی نگہداشت فراہم کرنے میں مدد ملتی ہے۔' },
  personalInfo: { en: 'Personal Information', ur: 'ذاتی معلومات' },
  fullName: { en: 'Full Name', ur: 'پورا نام' },
  age: { en: 'Age', ur: 'عمر' },
  gender: { en: 'Gender', ur: 'جنس' },
  male: { en: 'Male', ur: 'مرد' },
  female: { en: 'Female', ur: 'عورت' },
  other: { en: 'Other', ur: 'دیگر' },
  
  healthInfo: { en: 'Health Information', ur: 'صحت کی معلومات' },
  medicalConditions: { en: 'Current Medical Conditions', ur: 'موجودہ طبی حالات' },
  medicalConditionsPlaceholder: { en: 'e.g., Diabetes, Hypertension', ur: 'جیسے ذیابیطس، ہائی بلڈ پریشر' },
  allergies: { en: 'Allergies (if any)', ur: 'الرجی (اگر کوئی ہو)' },
  allergiesPlaceholder: { en: 'e.g., Peanuts, Penicillin', ur: 'جیسے مونگ پھلی، پینسلین' },

  medicineInfo: { en: 'Medicine Information', ur: 'دوا کی معلومات' },
  medicineName: { en: 'Medicine Name', ur: 'دوا کا نام' },
  medicineDosage: { en: 'Dosage', ur: 'خوراک' },
  dailyFrequency: { en: 'Daily Frequency', ur: 'روزانہ کی تعدد' },
  reasonForTaking: { en: 'Reason for Taking', ur: 'لینے کی وجہ' },
  saveProfile: { en: 'Save Health Profile', ur: 'ہیلتھ پروفائل محفوظ کریں' },
  profileSaved: { en: 'Profile Saved Successfully!', ur: 'پروفائل کامیابی سے محفوظ کر لیا گیا!' },

  // Pharmacies View
  nearbyPharmacies: { en: 'Nearby Pharmacies', ur: 'قریبی فارمیسیز' },
  pharmacySubtitle: { en: 'Find trusted pharmacies near you with real-time navigation.', ur: 'اپنے قریب قابل اعتماد فارمیسی تلاش کریں اور نیویگیٹ کریں۔' },
  navigate: { en: 'Get Directions', ur: 'راستہ دیکھیں' },
  orderDelivery: { en: 'Order Delivery', ur: 'ڈیلیوری آرڈر کریں' },
  useMyLocation: { en: 'Use My Location', ur: 'میری لوکیشن استعمال کریں' },
  locating: { en: 'Locating...', ur: 'تلاش جاری ہے...' },
  locationError: { en: 'Location access denied or unavailable.', ur: 'مقام تک رسائی مسترد یا دستیاب نہیں ہے۔' },

  // Navigation Modal
  yourDriver: { en: 'Your Driver', ur: 'آپ کا ڈرائیور' },
  driverName: { en: 'Kamran', ur: 'کامران' },
  carDetails: { en: 'White Suzuki Alto - LE-1234', ur: 'سفید سوزوکی آلٹو - LE-1234' },
  onTheWay: { en: 'On the way to', ur: 'کی طرف رواں دواں' },
  youHaveArrived: { en: 'You have arrived', ur: 'آپ پہنچ چکے ہیں' },
  eta: { en: 'ETA', ur: 'متوقع آمد' },
  minutes: { en: 'min', ur: 'منٹ' },
  distanceAway: { en: 'away', ur: 'دور' },
  trackInMaps: { en: 'Open Real Navigation', ur: 'اصل نیویگیشن کھولیں' },

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

  // Cart Modal
  removeItemTitle: { en: 'Remove Item?', ur: 'آئٹم ہٹائیں؟' },
  removeItemConfirm: { en: 'Are you sure you want to remove this item?', ur: 'کیا آپ واقعی اس آئٹم کو ہٹانا چاہتے ہیں؟' },
  yesRemove: { en: 'Remove', ur: 'ہٹا دیں' },
  cancel: { en: 'Cancel', ur: 'منسوخ کریں' },
  
  // Payment
  shippingDetails: { en: 'Shipping Details', ur: 'شپنگ کی تفصیلات' },
  address: { en: 'Address', ur: 'پتہ' },
  city: { en: 'City', ur: 'شہر' },
  phoneNumber: { en: 'Phone Number', ur: 'فون نمبر' },
  paymentMethod: { en: 'Payment Method', ur: 'ادائیگی کا طریقہ' },
  cod: { en: 'Cash on Delivery', ur: 'کیش آن ڈیلیوری' },
  card: { en: 'Credit/Debit Card', ur: 'کریڈٹ/ڈیبٹ کارڈ' },
  cardNumber: { en: 'Card Number', ur: 'کارڈ نمبر' },
  expiry: { en: 'Expiry Date', ur: 'میعاد ختم ہونے کی تاریخ' },
  cvv: { en: 'CVV', ur: 'CVV' },
  totalAmount: { en: 'Total Amount', ur: 'کل رقم' },
  placeOrder: { en: 'Place Order & Pay', ur: 'آرڈر کریں اور ادائیگی کریں' },
  processingPayment: { en: 'Processing Payment...', ur: 'ادائیگی جاری ہے...' },
  orderSuccessTitle: { en: 'Payment Successful!', ur: 'ادائیگی کامیاب!' },
  orderSuccessMessage: { en: 'Your order has been confirmed and will be shipped shortly.', ur: 'آپ کے آرڈر کی تصدیق ہو گئی ہے اور جلد ہی بھیج دیا جائے گا۔' },
  
  // Chatbot
  chatHeader: { en: 'V-CARE Health Assistant', ur: 'وی کیئر ہیلتھ اسسٹنٹ' },
  typeMessage: { en: 'Type your question...', ur: 'اپنا سوال لکھیں...' },
  aiGreeting: { en: 'Hello! I am your AI health assistant. I can help you with medicine information, dosage timing, and general health advice. How can I help you today?', ur: 'ہیلو! میں آپ کا AI ہیلتھ اسسٹنٹ ہوں۔ میں دواؤں کی معلومات، خوراک کے اوقات اور عمومی صحت کے مشورے میں آپ کی مدد کر سکتا ہوں۔ میں آج آپ کی کیسے مدد کر سکتا ہوں؟' },
};

export const t = (key: keyof typeof translations, language: Language): string => {
  return translations[key] ? translations[key][language] : String(key);
};
