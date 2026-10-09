import React from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, Award, ShieldCheck } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-charcoal-950 text-slate-300 border-t border-amber-900/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-dining-600 flex items-center justify-center shadow-lg">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-200">
                SAVORIA
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curating exceptional dining memories with farm-to-table artisanal ingredients, luxury ambiance, and effortless online table reservations.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Michelin Recommended 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-300 font-semibold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition-colors">Home Experience</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reserve')} className="hover:text-amber-400 transition-colors">Instant Slot Reservation</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-amber-400 transition-colors">Digital Pre-Order Menu</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-bookings')} className="hover:text-amber-400 transition-colors">Track Bookings & Orders</button>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-amber-300 font-semibold text-sm uppercase tracking-wider mb-4">Hours of Hospitality</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span>Lunch Service</span>
                <span className="text-slate-200 font-medium">12:00 PM - 3:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span>Dinner Service</span>
                <span className="text-slate-200 font-medium">6:00 PM - 11:00 PM</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Weekend Brunch</span>
                <span className="text-amber-400 font-medium">11:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-amber-300 font-semibold text-sm uppercase tracking-wider mb-4">Reserve & Visit</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-dining-500 shrink-0 mt-0.5" />
                <span>458 Grand Culinary Boulevard, Skyline District</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-dining-500 shrink-0" />
                <span>+1 (555) 892-DINE (3463)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-dining-500 shrink-0" />
                <span>reservations@savoria.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Savoria Fine Dining Systems. All Rights Reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SSL 256-bit Encrypted Reservations</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
