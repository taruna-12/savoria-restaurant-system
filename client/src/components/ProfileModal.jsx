import React, { useState } from 'react';
import { X, User, Phone, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dietary, setDietary] = useState(
    user?.dietary_preferences ? user.dietary_preferences.split(', ').filter(Boolean) : []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !user) return null;

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free', 'Halal'];

  const toggleDietary = (opt) => {
    setDietary(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await updateProfile({
      name,
      phone,
      dietary_preferences: dietary.join(', ')
    });
    setLoading(false);
    if (res.success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-white p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-2xl font-bold text-amber-300 mb-1">Guest Profile</h3>
        <p className="text-xs text-slate-400 mb-6">Manage your contact details and dietary preferences</p>

        {message && (
          <div className="p-3 mb-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Account ID)</label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/60 rounded-xl text-sm text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Dietary Preferences</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-dining-600 to-amber-600 text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Update Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
