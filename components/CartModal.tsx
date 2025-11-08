
import React from 'react';
import { Medicine, Language } from '../types';
import { t } from '../constants/translations';
import { XIcon, TrashIcon, PlusIcon, MinusIcon } from './Icons';

export interface CartItem extends Medicine {
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (brandName: string, quantity: number) => void;
  onRemoveItem: (brandName: string) => void;
  onCheckout: () => void;
  language: Language;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout, language,
}) => {
  if (!isOpen) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.brandName} className="flex items-center">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.brandName}</p>
                    <p className="text-sm text-gray-500">{item.priceRange}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onUpdateQuantity(item.brandName, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.brandName, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon /></button>
                  </div>
                  <button onClick={() => onRemoveItem(item.brandName)} className="ms-4 text-red-500 hover:text-red-700">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 border-t mt-auto">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
