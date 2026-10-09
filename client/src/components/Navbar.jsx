import React, { useState } from 'react';
import { Utensils, Calendar, ShoppingBag, User as UserIcon, LogOut, ShieldAlert, Mail, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth, onOpenCart, onOpenProfile, onOpenEmailLogs }) => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-charcoal-900/95 backdrop-blur-md border-b border-amber-900/30 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-dining-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-dining-300 to-amber-500 bg-clip-text text-transparent">
                SAVORIA
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-400/80 font-medium">
                Fine Dining & Bistro
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('reserve')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'reserve'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book a Table</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'menu'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Utensils className="w-4 h-4 text-dining-400" />
              <span>Digital Menu</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'my-bookings'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                My Bookings & Orders
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-dining-600 text-white shadow-lg shadow-dining-600/30'
                    : 'bg-dining-600/20 text-dining-300 border border-dining-500/30 hover:bg-dining-600 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Email Dispatcher Alert Logs */}
            <button
              onClick={onOpenEmailLogs}
              title="View Sent Email Alerts Log"
              className="relative p-2.5 rounded-xl bg-slate-800/80 text-amber-300 border border-amber-500/20 hover:bg-slate-700 hover:border-amber-400 transition-all duration-200 group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-dining-500"></span>
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-dining-600 to-amber-600 text-white font-semibold flex items-center space-x-2 shadow-lg hover:shadow-dining-600/40 hover:scale-105 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Cart</span>
              {totalItemCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-white text-dining-700 rounded-full animate-bounce">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-800/80 border border-amber-500/20 rounded-xl p-1.5 pl-3">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center space-x-2 text-sm text-slate-200 hover:text-amber-300 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
                    <UserIcon className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700 hover:border-amber-400 text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-dining-600 text-white"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold bg-white text-dining-700 rounded-full">
                  {totalItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal-950 border-b border-amber-900/30 px-4 py-5 space-y-3">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'home' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('reserve'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'reserve' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
            }`}
          >
            Book a Table
          </button>
          <button
            onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'menu' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
            }`}
          >
            Digital Menu
          </button>

          {user && (
            <button
              onClick={() => { setActiveTab('my-bookings'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === 'my-bookings' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
              }`}
            >
              My Bookings & Orders
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold bg-dining-600 text-white"
            >
              Admin Console
            </button>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-amber-300">{user.name}</span>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-400 font-semibold px-3 py-1 bg-red-900/30 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-amber-600 text-white text-center rounded-lg text-sm font-semibold"
              >
                Sign In / Demo Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
