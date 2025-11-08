
import React, { useState } from 'react';
import { Language, View, Medicine } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Pharmacies } from './views/Pharmacies';
import { Appointments } from './views/Appointments';
import { Login } from './views/Login';
import { CartModal, CartItem } from './components/CartModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import './index.css';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [lastOrder, setLastOrder] = useState<CartItem[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(View.HOME);
  };
  
  const handleAddToCart = (medicine: Medicine) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.brandName === medicine.brandName);
        if (existingItem) {
            return prevItems.map(item => 
                item.brandName === medicine.brandName ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prevItems, { ...medicine, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  
  const handleUpdateQuantity = (brandName: string, quantity: number) => {
      if (quantity <= 0) {
          handleRemoveItem(brandName);
      } else {
          setCartItems(prev => prev.map(item => item.brandName === brandName ? {...item, quantity} : item));
      }
  };
  
  const handleRemoveItem = (brandName: string) => {
      setCartItems(prev => prev.filter(item => item.brandName !== brandName));
  };

  const handleCheckout = () => {
    setLastOrder([...cartItems]);
    setCartItems([]);
    setIsCartOpen(false);
    setShowOrderConfirmation(true);
  };

  const handleBackToHome = () => {
    setShowOrderConfirmation(false);
    setCurrentView(View.HOME);
  };

  const renderView = () => {
    if (showOrderConfirmation) {
        return <OrderConfirmation language={language} orderItems={lastOrder} onBackToHome={handleBackToHome} />;
    }

    switch (currentView) {
      case View.HOME:
        return <Home language={language} onAddToCart={handleAddToCart} />;
      case View.DASHBOARD:
        return <Dashboard language={language} />;
      case View.PHARMACIES:
        return <Pharmacies language={language} />;
      case View.APPOINTMENTS:
        return <Appointments language={language} />;
      case View.LOGIN:
        return <Login onLogin={handleLogin} language={language} />;
      default:
        return <Home language={language} onAddToCart={handleAddToCart} />;
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 font-sans ${language === Language.UR ? 'rtl' : ''}`}>
      <Header
        language={language}
        setLanguage={setLanguage}
        currentView={currentView}
        setView={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      <Footer language={language} />
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        language={language}
      />
    </div>
  );
};

export default App;
