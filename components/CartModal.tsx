
import React, { useState } from 'react';
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
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.brandName, item.quantity - 1);
    } else {
      setItemToRemove(item.brandName);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      onRemoveItem(itemToRemove);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setItemToRemove(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 max-h-[90vh] flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Confirmation Overlay */}
        {itemToRemove && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
             <div className="bg-red-100 p-4 rounded-full mb-4 shadow-sm">
                <TrashIcon className="w-8 h-8 text-red-600" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">{t('removeItemTitle', language)}</h3>
             <p className="text-gray-600 mb-8 max-w-xs">{t('removeItemConfirm', language)}</p>
             <div className="flex space-x-3 w-full max-w-xs">
                <button 
                  onClick={handleCancelRemove}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  {t('cancel', language)}
                </button>
                <button 
                  onClick={handleConfirmRemove}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {t('yesRemove', language)}
                </button>
             </div>
          </div>
        )}

        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-grow">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <PlusIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Your cart is empty.</p>
                <p className="text-sm text-gray-400 mt-1">Add items to proceed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.brandName} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.brandName}</p>
                    <p className="text-sm text-gray-500">{item.priceRange}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                    <button 
                        onClick={() => handleDecreaseQuantity(item)} 
                        className="p-1 text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50"
                    >
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="font-medium w-4 text-center text-gray-700">{item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item.brandName, item.quantity + 1)} 
                        className="p-1 text-gray-500 hover:text-teal-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setItemToRemove(item.brandName)} 
                    className="ms-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between font-bold text-lg mb-4 text-gray-800">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <button 
                onClick={onCheckout} 
                className="w-full py-3.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
