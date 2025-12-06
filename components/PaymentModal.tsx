
import React, { useState } from 'react';
import { Medicine, Language } from '../types';
import { t } from '../constants/translations';
import { XIcon, CreditCardIcon, CheckCircleIcon } from './Icons';
import { Spinner } from './Spinner';
import { CartItem } from './CartModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[] | Medicine[];
  language: Language;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, items, language, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  
  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  // Calculate Total
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const matches = priceStr.match(/(\d+)/);
    return matches ? parseInt(matches[0], 10) : 0;
  };

  const totalAmount = items.reduce((sum, item) => {
      const qty = (item as CartItem).quantity || 1;
      return sum + (parsePrice(item.priceRange) * qty);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            onPaymentSuccess();
        }, 2000);
    }, 2000);
  };

  if (success) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in-up">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('orderSuccessTitle', language)}</h2>
                <p className="text-gray-500">{t('orderSuccessMessage', language)}</p>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{t('placeOrder', language)}</h2>
                <p className="text-sm text-gray-500 mt-1">{items.length} item(s) • Total: PKR {totalAmount}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-8">
            
            {/* Shipping Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm mr-3">1</span>
                    {t('shippingDetails', language)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName', language)}</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('address', language)}</label>
                        <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('city', language)}</label>
                        <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneNumber', language)}</label>
                        <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm mr-3">2</span>
                    {t('paymentMethod', language)}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all ${paymentMethod === 'card' ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <CreditCardIcon className="w-8 h-8" />
                        <span className="font-semibold text-sm">{t('card', language)}</span>
                    </div>
                    <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all ${paymentMethod === 'cod' ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-semibold text-sm">{t('cod', language)}</span>
                    </div>
                </div>

                {paymentMethod === 'card' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fade-in space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cardNumber', language)}</label>
                            <input required type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('expiry', language)}</label>
                                <input required type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('cvv', language)}</label>
                                <input required type="text" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pay Button */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-800">{t('totalAmount', language)}</span>
                    <span className="text-2xl font-bold text-teal-600">PKR {totalAmount}</span>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 flex justify-center items-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('processingPayment', language)}
                        </>
                    ) : (
                        t('placeOrder', language)
                    )}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};
