import React, { useState, useEffect } from 'react';
import { Utensils, Search, Filter, ShoppingBag, Plus, Sparkles, Check, Flame } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export const MenuPage = ({ onSelectDish, onOpenCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [vegFilter, setVegFilter] = useState('ALL'); // ALL, VEG, NON_VEG
  const [searchQuery, setSearchQuery] = useState('');

  const { cart, totalItemCount, cartTotal } = useCart();

  const categories = ['ALL', 'Starters', 'Mains', 'Desserts', 'Beverages'];

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (vegFilter === 'VEG') params.is_veg = 'true';
      if (vegFilter === 'NON_VEG') params.is_veg = 'false';
      if (searchQuery) params.search = searchQuery;

      const res = await api.getMenu(params);
      if (res.success) {
        setMenuItems(res.items || []);
      }
    } catch (e) {
      console.error('Fetch menu failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, vegFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-dining-600/10 border border-dining-500/30 text-dining-600 text-xs font-bold uppercase tracking-wider">
          <Utensils className="w-4 h-4 text-dining-600" />
          <span>M3 Engine • Digital Gourmet Menu</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900">
          Artisanal Culinary Catalog
        </h1>
        <p className="text-slate-600 text-sm">
          Select dishes for instant pre-ordering with your table reservation or standalone dining delivery.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-lg space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-dining-600 to-amber-600 text-white shadow-md shadow-dining-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

        </div>

        {/* Dietary Veg/Non-Veg Filter Pill */}
        <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider">Dietary Filter:</span>
          <div className="flex space-x-2">
            {[
              { id: 'ALL', label: 'All Items' },
              { id: 'VEG', label: '🟢 Vegetarian Only' },
              { id: 'NON_VEG', label: '🔴 Non-Veg Only' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setVegFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  vegFilter === f.id
                    ? 'bg-charcoal-900 text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-charcoal-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-72 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Utensils className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-lg font-bold text-charcoal-900">No dishes match your filter criteria</h3>
          <p className="text-xs">Try selecting a different category or clear the search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map(item => (
            <div
              key={item.item_id}
              className="bg-white rounded-3xl border border-amber-900/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.item_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${item.is_veg ? 'bg-emerald-600' : 'bg-red-600'}`}>
                      {item.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                    {item.dietary_tags && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-300 backdrop-blur-md">
                        {item.dietary_tags.split(',')[0]}
                      </span>
                    )}
                  </div>
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-black uppercase rounded-lg shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-dining-600 uppercase tracking-wider">{item.category}</span>
                    <span className="font-bold text-xl text-charcoal-900">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-dining-600 transition-colors">
                    {item.item_name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  disabled={!item.is_available}
                  onClick={() => onSelectDish(item)}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-dining-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Customize & Add to Order</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Floating Sticky Cart Summary Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-bounce-short">
          <div className="bg-charcoal-950 border border-amber-500/40 p-4 rounded-2xl shadow-2xl text-white flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-dining-600 flex items-center justify-center font-bold text-sm">
                {totalItemCount}
              </div>
              <div>
                <p className="text-xs text-slate-400">Current Order Subtotal</p>
                <p className="text-lg font-bold text-amber-300">${cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-dining-600 to-amber-600 text-white font-bold text-xs shadow-lg flex items-center space-x-2 hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Review Cart Drawer</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
