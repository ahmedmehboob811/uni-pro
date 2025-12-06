
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './services/firebase';
import { Language, View, Medicine, User } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Pharmacies } from './views/Pharmacies';
import { Appointments } from './views/Appointments';
import { Login } from './views/Login';
import { HealthProfile } from './views/HealthProfile';
import { CartModal, CartItem } from './components/CartModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { PaymentModal } from './components/PaymentModal';
import { ChatWidget } from './components/ChatWidget';
import { ChatBubbleIcon } from './components/Icons';
import { authService } from './services/authService';
import { Toast } from './components/Toast';
import './index.css';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [lastOrder, setLastOrder] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | Medicine[]>([]);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  // Listen for Auth state changes (Firebase or Mock)
  useEffect(() => {
    if (auth) {
        // Firebase Mode
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const appUser = authService.mapUser(firebaseUser);
                setUser(appUser);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    } else {
        // Mock Mode: Check LocalStorage
        const storedUser = localStorage.getItem('vcare_current_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Error parsing stored user", e);
            }
        }
    }
  }, []);

  const handleLogin = (user: User) => {
    // If mocking, update state immediately since onAuthStateChanged won't fire
    if (!auth) {
        setUser(user);
        setIsLoggedIn(true);
    }
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = async () => {
    await authService.logout();
    if (!auth) {
        setUser(null);
        setIsLoggedIn(false);
    }
    setCurrentView(View.HOME);
  };
  
  const triggerToast = (msg: string) => {
      setToastMessage(msg);
      setShowToast(true);
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
    // Show feedback instead of opening modal immediately
    triggerToast(`${medicine.brandName} added to cart`);
  };
  
  const handleOrderNow = (medicine: Medicine) => {
      setCheckoutItems([medicine]);
      setIsPaymentModalOpen(true);
  };

  // Handler for "Ask AI" button on medicine cards
  const handleAskAI = (medicine: Medicine) => {
      setChatContext(`I would like to know more about the medicine ${medicine.brandName} (${medicine.genericFormula}). What is it used for, what are the side effects, and what is the typical timing/dosage?`);
      setIsChatOpen(true);
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

  const handleCartCheckout = () => {
    setCheckoutItems(cartItems);
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = () => {
      // If we were checking out the cart, clear it
      if (checkoutItems === cartItems) {
          setLastOrder([...cartItems]);
          setCartItems([]);
      } else {
          // Single item order
          setLastOrder(checkoutItems as CartItem[]);
      }
      setIsPaymentModalOpen(false);
      // Optional: Show summary page, or just stay on current view with a toast/notification
      // But PaymentModal handles success UI internally before closing, so we might just want to show summary if desired.
      // For now, let's show the OrderConfirmation screen as a receipt
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
        return <Home language={language} onAddToCart={handleAddToCart} onOrderNow={handleOrderNow} user={user} />;
      case View.DASHBOARD:
        return <Dashboard language={language} user={user} setView={setCurrentView} onAddToCart={handleAddToCart} onOrderNow={handleOrderNow} />;
      case View.PHARMACIES:
        return <Pharmacies language={language} />;
      case View.APPOINTMENTS:
        return <Appointments language={language} />;
      case View.LOGIN:
        return <Login onLogin={handleLogin} language={language} />;
      case View.HEALTH_PROFILE:
        return <HealthProfile language={language} user={user} setView={setCurrentView} />;
      default:
        return <Home language={language} onAddToCart={handleAddToCart} onOrderNow={handleOrderNow} user={user} />;
    }
  };

  // Enhance children with onAskAI prop if they are Home or Dashboard
  const enhancedRenderView = () => {
      const view = renderView();
      if (React.isValidElement(view)) {
          // Add onAskAI prop if component accepts it (Home and Dashboard mainly interact with MedicineCard)
          if (currentView === View.HOME || currentView === View.DASHBOARD) {
              return React.cloneElement(view as React.ReactElement<any>, { onAskAI: handleAskAI });
          }
      }
      return view;
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 font-sans ${language === Language.UR ? 'rtl' : ''}`}>
      <Header
        language={language}
        setLanguage={setLanguage}
        currentView={currentView}
        setView={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        user={user}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-fade-in">
            {enhancedRenderView()}
        </div>
      </main>
      <Footer language={language} />
      
      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCartCheckout}
        language={language}
      />
      
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={checkoutItems}
        language={language}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Floating Chat Button */}
      {!isChatOpen && (
          <button 
            onClick={() => { setChatContext(undefined); setIsChatOpen(true); }}
            className="fixed bottom-6 right-6 p-4 bg-teal-600 text-white rounded-full shadow-xl hover:bg-teal-700 hover:scale-110 transition-all z-40 animate-bounce-in"
          >
              <ChatBubbleIcon className="w-8 h-8" />
          </button>
      )}

      {/* Chat Widget */}
      <ChatWidget 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        initialContext={chatContext}
      />
    </div>
  );
};

export default App;
