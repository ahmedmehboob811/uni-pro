
import React, { useState, useRef, useEffect } from 'react';
import { Language, View, User } from '../types';
import { t } from '../constants/translations';
import { LogoIcon, CartIcon, MenuIcon, XIcon, UserIcon, ChevronDownIcon, ClipboardListIcon } from './Icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  cartItemCount: number;
  onCartClick: () => void;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, currentView, setView, isLoggedIn, onLogout, cartItemCount, onCartClick, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { view: View.HOME, label: t('home', language) },
    { view: View.PHARMACIES, label: t('pharmacies', language) },
    { view: View.APPOINTMENTS, label: t('appointments', language) },
  ];

  const handleNavClick = (view: View) => {
    if (isLoggedIn || view === View.HOME) {
      setView(view);
    } else {
      setView(View.LOGIN);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
      onLogout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
            setIsProfileOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-40 transition-all duration-300 border-b border-gray-100/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <div 
                className="flex-shrink-0 cursor-pointer flex items-center group" 
                onClick={() => handleNavClick(View.HOME)}
            >
              <div className="bg-gradient-to-tr from-teal-500 to-cyan-500 p-2 rounded-xl shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300 transform group-hover:scale-105">
                 <LogoIcon className="h-7 w-7 text-white" />
              </div>
              <span className="font-bold text-2xl ms-3 text-slate-800 tracking-tight hidden sm:block group-hover:text-teal-600 transition-colors">
                {t('appName', language)}
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ms-12">
              <div className="flex items-baseline space-x-1">
                {navItems.map(item => (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      currentView === item.view
                        ? 'bg-teal-50 text-teal-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {isLoggedIn && (
                   <button
                    onClick={() => handleNavClick(View.DASHBOARD)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      currentView === View.DASHBOARD
                        ? 'bg-teal-50 text-teal-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
                    }`}
                  >
                    {t('dashboard', language)}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Language, Cart, Profile */}
          <div className="flex items-center space-x-3 sm:space-x-5 rtl:space-x-reverse">
            
            {/* Language Selector */}
            <div className="relative group">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="block appearance-none bg-slate-50 border border-slate-200 text-slate-600 hover:border-teal-400 px-3 py-1.5 pr-8 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer font-semibold transition-all"
              >
                <option value={Language.EN}>English</option>
                <option value={Language.UR}>اردو</option>
              </select>
            </div>
            
            {/* Cart Button */}
            <button 
                onClick={onCartClick} 
                className="relative p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all focus:outline-none active:scale-95"
            >
              <CartIcon className="w-6 h-6"/>
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full shadow-sm ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Desktop Profile / Login */}
            <div className="hidden md:block">
                {isLoggedIn && user ? (
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2 text-slate-700 hover:text-teal-600 focus:outline-none bg-white hover:bg-slate-50 py-1.5 px-3 pr-4 rounded-full border border-slate-200 shadow-sm transition-all active:scale-95"
                        >
                            <div className="bg-teal-100 p-1 rounded-full">
                                <UserIcon className="w-4 h-4 text-teal-700" />
                            </div>
                            <span className="text-sm font-semibold max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                            <ChevronDownIcon className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 animate-fade-in origin-top-right z-50 ring-1 ring-black/5">
                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => { handleNavClick(View.DASHBOARD); setIsProfileOpen(false); }}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors font-medium"
                                >
                                    {t('dashboard', language)}
                                </button>
                                <button
                                    onClick={() => { handleNavClick(View.HEALTH_PROFILE); setIsProfileOpen(false); }}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors font-medium"
                                >
                                    {t('healthProfile', language)}
                                </button>
                                <div className="border-t border-slate-50 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                                >
                                    {t('logout', language)}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setView(View.LOGIN)}
                        className="px-6 py-2.5 rounded-full text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 transition-all transform hover:-translate-y-0.5"
                    >
                        {t('login', language)}
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-fade-in z-30">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  currentView === item.view
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
             {isLoggedIn && (
                <>
                <button
                    onClick={() => handleNavClick(View.DASHBOARD)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    currentView === View.DASHBOARD
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {t('dashboard', language)}
                </button>
                 <button
                    onClick={() => handleNavClick(View.HEALTH_PROFILE)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    currentView === View.HEALTH_PROFILE
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {t('healthProfile', language)}
                </button>
                </>
             )}
            
             <div className="border-t border-slate-100 my-2 pt-3">
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50"
                    >
                        <span>{t('logout', language)}</span>
                    </button>
                ) : (
                    <button
                        onClick={() => { setView(View.LOGIN); setIsMenuOpen(false); }}
                        className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md"
                    >
                        {t('login', language)}
                    </button>
                )}
             </div>
          </div>
        </div>
      )}
    </header>
  );
};
