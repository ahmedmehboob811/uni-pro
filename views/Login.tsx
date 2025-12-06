
import React, { useState } from 'react';
import { Language, User } from '../types';
import { t } from '../constants/translations';
import { LogoIcon, EmailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckCircleIcon } from '../components/Icons';
import { authService } from '../services/authService';
import { Spinner } from '../components/Spinner';
import { auth } from '../services/firebase';

interface LoginProps {
  onLogin: (user: User) => void;
  language: Language;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset-password';

export const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', name: '', general: '' });
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const validate = () => {
    const newErrors = { email: '', password: '', name: '', general: '' };
    let isValid = true;
    
    if (authMode === 'signup' && !name) {
      newErrors.name = t('nameRequired', language);
      isValid = false;
    }
    if (!email && authMode !== 'reset-password') {
      newErrors.email = t('emailRequired', language);
      isValid = false;
    }
    if (authMode !== 'forgot') {
        if (!password) {
            newErrors.password = t('passwordRequired', language);
            isValid = false;
        } else if (authMode === 'reset-password' && password !== confirmPassword) {
            newErrors.password = "Passwords do not match";
            isValid = false;
        }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
        if (authMode === 'signup') {
            const user = await authService.signup(name, email, password);
            onLogin(user);
        } else if (authMode === 'login') {
            const user = await authService.login(email, password);
            onLogin(user);
        } else if (authMode === 'forgot') {
            await authService.resetPassword(email);
            setResetSuccess(true);
        } else if (authMode === 'reset-password') {
            await authService.updatePassword(email, password);
            setPasswordUpdated(true);
            setTimeout(() => {
                toggleMode('login');
            }, 2000);
        }
    } catch (err: any) {
        console.error(err);
        let errorMsg = t('invalidCredentials', language);
        
        // Handle specific error messages
        if (err.message === 'Email not found' || (err.message && err.message.includes('not-found'))) {
            errorMsg = t('emailNotFound', language);
        } else if (authMode === 'signup' && (err.message.includes('already-in-use') || err.message === 'User already exists')) {
            errorMsg = t('userExists', language);
        } else if (authMode === 'forgot') {
            errorMsg = t('resetError', language);
        }
        
        setErrors(prev => ({ ...prev, general: errorMsg }));
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = (mode: AuthMode) => {
      setAuthMode(mode);
      setErrors({ email: '', password: '', name: '', general: '' });
      setResetSuccess(false);
      setPasswordUpdated(false);
      // Don't clear email if switching from forgot -> reset, we need it to know who to update
      if (mode !== 'reset-password') {
          if (mode === 'login') {
              // Keep email if simulating flow
          } else {
              setEmail('');
          }
      }
      setPassword('');
      setConfirmPassword('');
      setName('');
  };

  const renderHeader = () => {
      if (authMode === 'forgot') return t('forgotPassword', language);
      if (authMode === 'reset-password') return "Set New Password";
      return authMode === 'signup' ? t('createAccount', language) : t('welcome', language);
  };

  const renderSubHeader = () => {
      if (authMode === 'forgot') return t('forgotPasswordDesc', language);
      if (authMode === 'reset-password') return "Please enter your new password below.";
      return authMode === 'signup' ? t('signupPrompt', language) : t('loginPrompt', language);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Left Panel - Branding (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-teal-900/50 to-transparent"></div>
        
        <div className="relative z-10 text-center px-12 text-white">
          <div className="bg-white/20 p-6 rounded-3xl inline-block mb-8 backdrop-blur-sm shadow-xl">
             <LogoIcon className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">{t('appName', language)}</h1>
          <p className="text-xl font-medium text-teal-50 max-w-md mx-auto leading-relaxed">
            {t('heroSubtitle', language)}
          </p>
          <div className="mt-12 flex space-x-3 justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-100"></div>
              <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
              <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            
            {/* Header */}
            <div className="text-center lg:text-left">
                {authMode === 'forgot' && (
                    <button onClick={() => toggleMode('login')} className="mb-4 inline-flex items-center text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        {t('backToLogin', language)}
                    </button>
                )}
                
                <div className="lg:hidden inline-block p-3 bg-teal-50 rounded-2xl mb-4">
                     <LogoIcon className="w-10 h-10 text-teal-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {renderHeader()}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    {renderSubHeader()}
                </p>
            </div>

            {/* Error Message */}
            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start animate-fade-in">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.general}</span>
                </div>
            )}

            {passwordUpdated && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center animate-fade-in">
                    <p className="font-bold">Password Updated!</p>
                    <p>Redirecting to login...</p>
                </div>
            )}

            {/* Success Message (Forgot Password) */}
            {authMode === 'forgot' && resetSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-2xl text-center animate-fade-in">
                    <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="font-bold text-lg mb-2">{t('resetSuccess', language)}</h3>
                    <p className="text-sm mb-6">Check your inbox and follow the instructions to reset your password.</p>
                    
                    {!auth && (
                        <div className="bg-white border border-green-300 p-4 rounded-xl text-sm mb-6 text-left shadow-sm">
                            <p className="font-bold mb-2 text-teal-800">🚀 DEMO MODE ACTION</p>
                            <p className="mb-3 text-gray-600">Since this is a demo without a real email server, click the button below to simulate clicking the email link:</p>
                            <button 
                                type="button"
                                onClick={() => toggleMode('reset-password')}
                                className="w-full py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 text-xs uppercase tracking-wide"
                            >
                                Simulate: Open Email Link
                            </button>
                        </div>
                    )}

                    <button 
                        onClick={() => toggleMode('login')}
                        className="w-full py-3 bg-white border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all shadow-sm"
                    >
                        {t('backToLogin', language)}
                    </button>
                </div>
            ) : (
                /* Form */
                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {authMode === 'signup' && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className={`h-5 w-5 ${errors.name ? 'text-red-400' : 'text-gray-400'} group-focus-within:text-teal-500 transition-colors`} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors(prev => ({ ...prev, name: ''}));
                                }}
                                className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300' : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all`}
                                placeholder={t('namePlaceholder', language)}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600 ml-1">{errors.name}</p>}
                        </div>
                    )}

                    {/* Email Field - Read Only in Reset Mode */}
                    {authMode !== 'reset-password' && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EmailIcon className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'} group-focus-within:text-teal-500 transition-colors`} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: ''}));
                                }}
                                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300' : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all`}
                                placeholder={t('emailPlaceholder', language)}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600 ml-1">{errors.email}</p>}
                        </div>
                    )}

                    {authMode !== 'forgot' && (
                        <>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockIcon className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'} group-focus-within:text-teal-500 transition-colors`} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: ''}));
                                }}
                                className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300' : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all`}
                                placeholder={authMode === 'reset-password' ? "New Password" : t('passwordPlaceholder', language)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                            {errors.password && <p className="mt-1 text-xs text-red-600 ml-1">{errors.password}</p>}
                        </div>
                        
                        {authMode === 'reset-password' && (
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all"
                                    placeholder="Confirm New Password"
                                />
                            </div>
                        )}
                        </>
                    )}

                    {authMode !== 'forgot' && authMode !== 'reset-password' && (
                        <div className="flex items-center justify-between">
                            {authMode === 'login' && (
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                            )}
                            {authMode === 'login' && (
                                <div className="text-sm">
                                    <button 
                                        type="button" 
                                        onClick={() => toggleMode('forgot')}
                                        className="font-medium text-teal-600 hover:text-teal-500"
                                    >
                                        {t('forgotPassword', language)}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!passwordUpdated && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <Spinner className="w-5 h-5 text-white" />
                            ) : (
                                authMode === 'signup' ? t('signup', language) : 
                                (authMode === 'forgot' ? t('sendResetLink', language) : 
                                (authMode === 'reset-password' ? "Update Password" : t('login', language)))
                            )}
                        </button>
                    )}
                </form>
            )}

            {authMode !== 'forgot' && authMode !== 'reset-password' && (
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {authMode === 'signup' ? t('alreadyHaveAccount', language) : t('dontHaveAccount', language)}{' '}
                            <button 
                                onClick={() => toggleMode(authMode === 'signup' ? 'login' : 'signup')} 
                                className="font-bold text-teal-600 hover:text-teal-500 transition-colors"
                            >
                                {authMode === 'signup' ? t('loginHere', language) : t('signupHere', language)}
                            </button>
                        </p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
