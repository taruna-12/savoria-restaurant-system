import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ItemCustomizationModal = ({ isOpen, onClose, item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [extraNotes, setExtraNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    const customString = `Spice: ${spiceLevel}${extraNotes ? ` | Note: ${extraNotes}` : ''}`;
    addToCart(item, quantity, customString);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-white">

        {/* Item Image Header */}
        <div className="relative h-48">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
            alt={item.item_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">{item.category}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">{item.item_name}</h3>
            <p className="text-amber-400 font-bold text-lg">${Number(item.price).toFixed(2)}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

          {/* Spice Level selection */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-2 flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Select Spiciness Level:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Mild', 'Medium', 'Chef Special Spicy'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(level)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                    spiceLevel === level
                      ? 'bg-amber-500 text-charcoal-900 shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Special Culinary Request</label>
            <input
              type="text"
              placeholder="e.g. Extra parmesan cheese, sauce on side..."
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-300">Quantity:</span>
            <div className="flex items-center space-x-3 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-400 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-white w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-dining-600 to-amber-600 hover:from-dining-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Order • ${(Number(item.price) * quantity).toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
