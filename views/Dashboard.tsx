
import React from 'react';
import { Language } from '../types';
import { t } from '../constants/translations';
import { mockAppointments, mockOrders, mockHealthData } from '../constants/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  language: Language;
}

const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border rounded-md shadow-md">
                <p className="font-bold">{label}</p>
                <p className="text-indigo-600">{`Systolic: ${payload[0].value}`}</p>
                <p className="text-teal-600">{`Diastolic: ${payload[1].value}`}</p>
            </div>
        );
    }
    return null;
};


export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t('welcomeUser', language)}, User!</h1>
      </div>

      {/* Health History */}
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">{t('healthHistory', language)}</h2>
        <h3 className="text-md font-semibold text-gray-600 mb-4 text-center">{t('bloodPressureTrend', language)}</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={mockHealthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="#4f46e5" strokeWidth={2} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#0d9488" strokeWidth={2} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('myAppointments', language)}</h2>
          <div className="space-y-4">
            {mockAppointments.map((appt, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">{appt.doctorName} <span className="text-sm font-normal text-gray-500">- {appt.specialty}</span></p>
                <p className="text-gray-700">{appt.date} @ {appt.time} ({appt.type})</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full px-4 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
            {t('bookAppointment', language)}
          </button>
        </div>

        {/* Orders */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('myOrders', language)}</h2>
          <div className="space-y-4">
            {mockOrders.map(order => (
              <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Order #{order.id}</p>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{order.date}</p>
                <ul className="list-disc ps-5 mt-2 text-gray-700">
                  {order.medicines.map((med, i) => <li key={i}>{med.name} (x{med.quantity})</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
