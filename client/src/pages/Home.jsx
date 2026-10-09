import React from 'react';
import { Calendar, Utensils, Award, ShieldCheck, Clock, ArrowRight, Sparkles, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

export const Home = ({ setActiveTab, onSelectDish }) => {
  const featuredDishes = [
    {
      item_name: 'Filet Mignon Rossini',
      category: 'Mains',
      price: 38.50,
      description: '8oz prime Angus beef tenderloin, seared foie gras, truffle reduction, and duck fat pomme purée.',
      is_veg: false,
      dietary_tags: 'Signature Dish',
      image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80'
    },
    {
      item_name: 'Truffle Mushroom Bruschetta',
      category: 'Starters',
      price: 14.50,
      description: 'Artisanal sourdough topped with sautéed wild mushrooms, white truffle oil, and aged parmesan.',
      is_veg: true,
      dietary_tags: 'Vegetarian, Chef Special',
      image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80'
    },
    {
      item_name: 'Deconstructed Tiramisu Sphere',
      category: 'Desserts',
      price: 13.00,
      description: 'Valrhona dark chocolate shell, espresso-soaked savoiardi, mascarpone cream, and gold leaf dust.',
      is_veg: true,
      dietary_tags: 'Vegetarian, Chef Special',
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-20 pb-20">

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal-950 text-white rounded-b-3xl border-b border-amber-900/30">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
            alt="Savoria Interior"
            className="w-full h-full object-cover opacity-25 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 pt-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Exquisite Fine Dining & Real-Time Reservations</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Where Culinary Artistry Meets{' '}
            <span className="bg-gradient-to-r from-amber-200 via-dining-300 to-amber-500 bg-clip-text text-transparent">
              Unrivaled Ambiance
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-300 leading-relaxed font-light">
            Reserve your intimate table across our four curated zones — Indoor Dining, Patio Garden, Balcony Skyline, or Private Lounge. Optionally pre-order your tasting menu to arrive flawlessly upon seating.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('reserve')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-dining-600 to-amber-600 hover:from-dining-500 hover:to-amber-500 text-white font-bold text-base shadow-xl shadow-dining-600/30 flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Book a Table Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-base font-bold flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <Utensils className="w-5 h-5 text-dining-400" />
              <span>Explore Digital Menu</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Dining Zones</span>
              <span className="text-xl font-bold text-amber-300">4 Distinct Areas</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Reservation Lock</span>
              <span className="text-xl font-bold text-emerald-400">Atomic 100% Guaranteed</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Pre-Ordering</span>
              <span className="text-xl font-bold text-amber-300">Instant Kitchen Sync</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Pass Voucher</span>
              <span className="text-xl font-bold text-dining-300">Digital Token & QR</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Dining Zones Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Architectural Elegance</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900">Choose Your Dining Atmosphere</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">Each zone offers a custom lighting profile, music acoustic setup, and dedicated service staff.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'Indoor Main Dining',
              desc: 'Warm leather seating, ambient crystal chandelier lighting, and view of the open chef station.',
              image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
              cap: 'Tables of 2 to 6'
            },
            {
              title: 'Patio Garden',
              desc: 'Lush greenery, heated pergola, and relaxed al fresco atmosphere under fairy lights.',
              image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80',
              cap: 'Tables of 2 to 4'
            },
            {
              title: 'Balcony Skyline',
              desc: 'Elevated terrace overlooking the city skyline, perfect for romantic evening dinners.',
              image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
              cap: 'Tables of 2 to 4'
            },
            {
              title: 'Private Lounge',
              desc: 'Sound-isolated VIP enclave with private sommelier service and customized tasting menus.',
              image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
              cap: 'Parties up to 10'
            }
          ].map((zone, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('reserve')}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 cursor-pointer bg-charcoal-900 text-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={zone.image}
                  alt={zone.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-transparent" />
              <div className="absolute bottom-0 p-5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/40 inline-block">
                  {zone.cap}
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{zone.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{zone.desc}</p>
                <div className="pt-1 flex items-center text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Reserve this Zone</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Culinary Highlights */}
      <section className="bg-charcoal-950 text-white py-16 border-y border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Artisanal Catalog</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-1">Chef's Signature Creations</h2>
            </div>
            <button
              onClick={() => setActiveTab('menu')}
              className="mt-4 md:mt-0 text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center space-x-1"
            >
              <span>View Full 15+ Item Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDishes.map((dish, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-2xl border border-amber-500/20 overflow-hidden shadow-xl hover:border-amber-400 transition-all duration-300 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dish.image_url}
                    alt={dish.item_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${dish.is_veg ? 'bg-emerald-600' : 'bg-red-600'}`}>
                      {dish.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white shadow-md">
                      {dish.dietary_tags}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400 uppercase">{dish.category}</span>
                    <span className="font-bold text-lg text-white">${dish.price.toFixed(2)}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{dish.item_name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{dish.description}</p>

                  <button
                    onClick={() => { setActiveTab('menu'); if (onSelectDish) onSelectDish(dish); }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Customize & Pre-Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-dining-800 via-amber-900 to-charcoal-900 p-10 md:p-14 rounded-3xl border border-amber-500/40 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-100">Planning a Special Celebration?</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Guarantee your preferred table slot, lock down party capacity, and receive an instant digital reservation token pass sent to your email.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('reserve')}
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold text-base shadow-xl flex items-center space-x-2 transition-transform hover:scale-105 shrink-0"
          >
            <Calendar className="w-5 h-5" />
            <span>Select Date & Table Slot</span>
          </button>
        </div>
      </section>

    </div>
  );
};
