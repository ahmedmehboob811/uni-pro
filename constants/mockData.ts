import { Appointment, HealthDataPoint, Order, Pharmacy } from '../types';

export const mockAppointments: Appointment[] = [
  {
    doctorName: 'Dr. Fatima Ahmed',
    specialty: 'General Physician',
    date: '2024-08-15',
    time: '11:00 AM',
    type: 'Online',
  },
  {
    doctorName: 'Dr. Zeeshan Khan',
    specialty: 'Dentist',
    date: '2024-08-20',
    time: '03:30 PM',
    type: 'In-Person',
  },
];

export const mockOrders: Order[] = [
    {
        id: 'MF-1024',
        status: 'Delivered',
        date: '2024-07-28',
        medicines: [
            { name: 'Panadol Extra', quantity: 2 },
            { name: 'Cofcol Syrup', quantity: 1 },
        ]
    },
    {
        id: 'MF-1025',
        status: 'Processing',
        date: '2024-08-02',
        medicines: [
            { name: 'Augmentin 625mg', quantity: 1 },
        ]
    }
];

export const mockHealthData: HealthDataPoint[] = [
    { month: 'Feb', systolic: 120, diastolic: 80 },
    { month: 'Mar', systolic: 122, diastolic: 78 },
    { month: 'Apr', systolic: 118, diastolic: 81 },
    { month: 'May', systolic: 125, diastolic: 85 },
    { month: 'Jun', systolic: 123, diastolic: 82 },
    { month: 'Jul', systolic: 120, diastolic: 80 },
];

export const mockPharmacies: Pharmacy[] = [
    { id: 1, name: 'MedWise Pharmacy', address: 'Shop 1, Block A, Gulshan-e-Iqbal', distance: '0.8 km', hours: '24 Hours', lat: 24.913, lng: 67.082 },
    { id: 2, name: 'CarePlus Pharmacy', address: 'Main Tariq Road, PECHS', distance: '1.2 km', hours: '9 AM - 11 PM', lat: 24.873, lng: 67.062 },
    { id: 3, name: 'DVAGO Pharmacy', address: 'Bahadurabad, Block 3', distance: '2.5 km', hours: '24 Hours', lat: 24.878, lng: 67.072 },
    { id: 4, name: 'Time Medicos', address: 'Saddar, Near Empress Market', distance: '4.1 km', hours: '10 AM - 10 PM', lat: 24.856, lng: 67.028 },
];
