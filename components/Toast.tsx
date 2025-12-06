
import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon } from './Icons';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
      <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[300px]">
        <CheckCircleIcon className="w-6 h-6 text-teal-400" />
        <span className="font-medium flex-grow">{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
