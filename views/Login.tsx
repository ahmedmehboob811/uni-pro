import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../constants/translations';
import { LogoIcon } from '../components/Icons';

interface LoginProps {
  onLogin: () => void;
  language: Language;
}

export const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: ''});

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    if (!email) {
      newErrors.email = t('emailRequired', language);
      isValid = false;
    }
    if (!password) {
      newErrors.password = t('passwordRequired', language);
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleLoginClick = () => {
    if (validate()) {
      onLogin();
    }
  };

  const isFormInvalid = !email || !password;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <LogoIcon className="w-16 h-16 mx-auto text-teal-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t('welcome', language)}</h2>
          <p className="mt-2 text-gray-600">{t('loginPrompt', language)}</p>
        </div>

        <div className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder={t('emailPlaceholder', language)}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: ''}));
              }}
              className={`w-full px-4 py-3 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <input 
              type="password" 
              placeholder={t('passwordPlaceholder', language)}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: ''}));
              }}
              className={`w-full px-4 py-3 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <button 
            onClick={handleLoginClick} 
            disabled={isFormInvalid}
            className="w-full px-4 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            {t('login', language)}
          </button>
        </div>
      </div>
    </div>
  );
};