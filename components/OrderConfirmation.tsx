
import React from 'react';
import { Language } from '../types';
import { CheckCircleIcon } from './Icons';
import { CartItem } from './CartModal';

interface OrderConfirmationProps {
    language: Language;
    orderItems: CartItem[];
    onBackToHome: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ language, orderItems, onBackToHome }) => {
    return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>
            <p className="mt-2 text-gray-600">Thank you for your purchase. Your order will be processed shortly.</p>
            
            <div className="my-6 text-left p-4 bg-gray-50 rounded-lg">
                <h2 className="font-bold mb-2">Order Summary:</h2>
                <ul className="list-disc ps-5 space-y-1">
                    {orderItems.map(item => (
                        <li key={item.brandName}>
                            {item.brandName} (x{item.quantity})
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={onBackToHome} className="mt-6 w-full px-4 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                Back to Home
            </button>
        </div>
    );
};
