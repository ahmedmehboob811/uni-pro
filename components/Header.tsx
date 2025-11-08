
import React from 'react';
import { Language, View } from '../types';
import { t } from '../constants/translations';
import { LogoIcon, CartIcon } from './Icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, currentView, setView, isLoggedIn, onLogout, cartItemCount, onCartClick }) => {

  const navItems = [
    { view: View.HOME, label: t('home', language) },
    { view: View.DASHBOARD, label: t('dashboard', language) },
    { view: View.PHARMACIES, label: t('pharmacies', language) },
    { view: View.APPOINTMENTS, label: t('appointments', language) },
  ];

  const handleNavClick = (view: View) => {
    if (isLoggedIn || view === View.HOME) {
      setView(view);
    } else {
      setView(View.LOGIN);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick(View.HOME)}>
              <LogoIcon className="h-8 w-8 text-teal-600" />
            </div>
            <span className="font-bold text-xl ms-2 text-gray-800">{t('appName', language)}</span>
            <div className="hidden md:block">
              <div className="ms-10 flex items-baseline space-x-4">
                {navItems.map(item => (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === item.view
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 pr-8 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value={Language.EN}>English</option>
                <option value={Language.UR}>اردو</option>
              </select>
            </div>
            
            <button onClick={onCartClick} className="relative p-2 text-gray-600 hover:text-teal-600 focus:outline-none">
              <CartIcon className="w-6 h-6"/>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                {t('logout', language)}
              </button>
            ) : (
              <button
                onClick={() => setView(View.LOGIN)}
                className="px-3 py-2 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              >
                {t('login', language)}
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
