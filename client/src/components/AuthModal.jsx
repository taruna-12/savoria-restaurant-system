import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Customer');
  const [dietary, setDietary] = useState([]);

  if (!isOpen) return null;

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free', 'Halal'];

  const toggleDietary = (opt) => {
    setDietary(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt]);
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setError('');
    setLoading(true);
    try {
      const res = await login(demoEmail, demoPass);
      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await register({
          name,
          email,
          phone,
          password,
          role,
          dietary_preferences: dietary.join(', ')
        });
      } else {
        res = await login(email, password);
      }

      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-dining-800 to-amber-900 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Savoria Hospitality Access</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            {isRegister ? 'Create Diner Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-amber-200/80 mt-1">
            {isRegister ? 'Register to manage reservations & custom orders' : 'Sign in to access your table bookings'}
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="p-4 bg-amber-950/40 border-b border-amber-800/40 text-xs">
          <div className="text-amber-300 font-bold mb-2 flex items-center justify-between">
            <span>⚡ One-Click Demo Access:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@example.com', 'customer123')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500 hover:text-white transition-all font-semibold flex items-center justify-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@savoria.com', 'admin123')}
              className="px-3 py-1.5 rounded-lg bg-dining-600/30 text-dining-200 border border-dining-500/40 hover:bg-dining-600 hover:text-white transition-all font-semibold flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Dietary Preferences</label>
              <div className="flex flex-wrap gap-1.5">
                {dietaryOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleDietary(opt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      dietary.includes(opt)
                        ? 'bg-amber-500 text-charcoal-900 font-bold'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Customer">Customer (Diner)</option>
                <option value="Admin">Restaurant Admin / Kitchen Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-dining-600 to-amber-600 hover:from-dining-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div className="pt-2 text-center text-xs text-slate-400">
            {isRegister ? 'Already registered?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-amber-400 font-semibold hover:underline"
            >
              {isRegister ? 'Sign In Here' : 'Create New Account'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
