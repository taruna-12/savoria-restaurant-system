import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CartDrawer } from './components/CartDrawer';
import { ReservationPassModal } from './components/ReservationPassModal';
import { EmailLogsModal } from './components/EmailLogsModal';
import { ItemCustomizationModal } from './components/ItemCustomizationModal';

import { Home } from './pages/Home';
import { ReservationPage } from './pages/ReservationPage';
import { MenuPage } from './pages/MenuPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { api } from './services/api';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [emailLogsOpen, setEmailLogsOpen] = useState(false);
  
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const [userActiveReservations, setUserActiveReservations] = useState([]);

  // Fetch user reservations for cart attachment option
  useEffect(() => {
    if (user) {
      api.getUserReservations(user.user_id)
        .then(res => {
          if (res.success) {
            setUserActiveReservations(
              (res.reservations || []).filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING')
            );
          }
        })
        .catch(console.error);
    }
  }, [user, passModalOpen]);

  const handleSelectDishCustomization = (dish) => {
    setSelectedDish(dish);
    setCustomizationModalOpen(true);
  };

  const handleReservationCompleted = (reservation) => {
    setCurrentReservation(reservation);
    setPassModalOpen(true);
  };

  const handleViewPass = (reservation) => {
    setCurrentReservation(reservation);
    setPassModalOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setActiveTab('my-bookings');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-dining-50 text-charcoal-900 font-sans selection:bg-amber-500 selection:text-white">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenEmailLogs={() => setEmailLogsOpen(true)}
        />

        <main className="transition-all duration-300">
          {activeTab === 'home' && (
            <Home
              setActiveTab={setActiveTab}
              onSelectDish={handleSelectDishCustomization}
            />
          )}

          {activeTab === 'reserve' && (
            <ReservationPage
              onOpenAuth={() => setAuthModalOpen(true)}
              onReservationComplete={handleReservationCompleted}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'menu' && (
            <MenuPage
              onSelectDish={handleSelectDishCustomization}
              onOpenCart={() => setCartOpen(true)}
            />
          )}

          {activeTab === 'my-bookings' && (
            <MyBookingsPage
              onViewPass={handleViewPass}
              onOpenCart={() => setCartOpen(true)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              onOpenEmailLogs={() => setEmailLogsOpen(true)}
            />
          )}
        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />

      {/* Interactive Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
        activeReservations={userActiveReservations}
        onOrderSuccess={handleOrderSuccess}
      />

      <ReservationPassModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        reservation={currentReservation}
      />

      <EmailLogsModal
        isOpen={emailLogsOpen}
        onClose={() => setEmailLogsOpen(false)}
      />

      <ItemCustomizationModal
        isOpen={customizationModalOpen}
        onClose={() => setCustomizationModalOpen(false)}
        item={selectedDish}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
