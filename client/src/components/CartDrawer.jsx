import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Utensils, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CartDrawer = ({ isOpen, onClose, onOpenAuth, activeReservations, onOrderSuccess }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, cartTax, cartTotal } = useCart();
  const { user } = useAuth();
  const [selectedResId, setSelectedResId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        reservation_id: selectedResId || null,
        notes,
        items: cart.map(i => ({
          item_id: i.item_id,
          quantity: i.quantity,
          customizations: i.customizations || ''
        }))
      };

      const res = await api.createOrder(payload);
      if (res.success) {
        clearCart();
        onClose();
        if (onOrderSuccess) onOrderSuccess(res.order);
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-charcoal-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-amber-500/30 shadow-2xl flex flex-col text-white">

          {/* Drawer Header */}
          <div className="p-6 bg-gradient-to-r from-dining-900 to-slate-900 border-b border-amber-800/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-dining-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-200">Your Dining Order</h3>
                <p className="text-xs text-slate-400">{cart.length} unique item types</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 py-12">
                <Utensils className="w-12 h-12 text-slate-600" />
                <p className="text-base font-semibold text-slate-400">Your cart is currently empty</p>
                <p className="text-xs max-w-xs">Browse our digital menu catalog and add gourmet appetizers, mains, or beverages!</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 bg-slate-800/80 border border-slate-700/70 rounded-xl flex space-x-3 items-center"
                >
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                    alt={item.item_name}
                    className="w-16 h-16 rounded-lg object-cover border border-amber-900/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <h4 className="text-sm font-semibold text-white truncate">{item.item_name}</h4>
                    </div>
                    {item.customizations && (
                      <p className="text-[11px] text-amber-400/90 italic truncate">Note: {item.customizations}</p>
                    )}
                    <p className="text-xs text-amber-300 font-bold mt-1">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-1.5 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* Link Order to Active Table Reservation option */}
            {cart.length > 0 && user && activeReservations && activeReservations.length > 0 && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/40 rounded-xl space-y-2 text-xs">
                <label className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <CalendarCheck className="w-4 h-4 text-amber-400" />
                  <span>Attach Pre-Order to Table Reservation:</span>
                </label>
                <select
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-amber-700/50 rounded-lg text-white text-xs"
                >
                  <option value="">-- Standalone Kitchen Order (No Table) --</option>
                  {activeReservations.map(res => (
                    <option key={res.reservation_id} value={res.reservation_id}>
                      Token #{res.reservation_token} (Table {res.table?.table_number || ''} @ {res.time_slot})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {cart.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Special Dining Instructions / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please serve dessert after main course, dressing on side..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Drawer Footer & Billing Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-950 border-t border-amber-900/30 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="font-medium">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-amber-300 pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-dining-600 to-amber-600 hover:from-dining-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <span>{loading ? 'Submitting Order...' : user ? 'Confirm & Place Order' : 'Sign In to Complete Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
