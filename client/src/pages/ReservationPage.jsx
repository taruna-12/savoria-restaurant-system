import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Utensils, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const ReservationPage = ({ onOpenAuth, onReservationComplete, setActiveTab }) => {
  const { user } = useAuth();
  const { cart, cartSubtotal, cartTotal } = useCart();

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [resDate, setResDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('19:00');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [includePreOrder, setIncludePreOrder] = useState(true);

  // Availability State
  const [tablesList, setTablesList] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = [
    { label: '12:00 PM (Lunch)', value: '12:00' },
    { label: '1:00 PM (Lunch)', value: '13:00' },
    { label: '2:00 PM (Lunch)', value: '14:00' },
    { label: '6:00 PM (Dinner)', value: '18:00' },
    { label: '7:00 PM (Dinner)', value: '19:00' },
    { label: '8:00 PM (Dinner)', value: '20:00' },
    { label: '9:00 PM (Dinner)', value: '21:00' }
  ];

  const zones = ['ALL', 'Indoor', 'Patio', 'Balcony', 'Private Lounge'];

  // Fetch real-time table availability when date, slot, guests, or zone change
  const fetchAvailability = async () => {
    setLoadingTables(true);
    setErrorMsg('');
    try {
      const res = await api.getAvailability(resDate, timeSlot, guestCount, selectedZone);
      if (res.success) {
        setTablesList(res.tables || []);
        // Reset selected table if no longer available or matching
        if (selectedTableId) {
          const matched = res.tables.find(t => t.table_id === selectedTableId);
          if (!matched || !matched.is_available) {
            setSelectedTableId(null);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to check table availability.');
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [resDate, timeSlot, guestCount, selectedZone]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        table_id: selectedTableId || null,
        res_date: resDate,
        time_slot: timeSlot,
        guest_count: parseInt(guestCount, 10),
        location_zone: selectedZone !== 'ALL' ? selectedZone : null,
        special_requests: specialRequests,
        pre_order_items: (includePreOrder && cart.length > 0) ? cart.map(i => ({
          item_id: i.item_id,
          quantity: i.quantity,
          notes: i.customizations || ''
        })) : []
      };

      const res = await api.createReservation(payload);

      if (res.success) {
        if (onReservationComplete) {
          onReservationComplete(res.reservation);
        }
      } else {
        setErrorMsg(res.message || 'Booking conflict occurred. Please select another slot or table.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during table allocation.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableCount = tablesList.filter(t => t.is_available).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>M2 Engine • Atomic Table Locking</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900">
          Table Slot & Zone Reservation
        </h1>
        <p className="text-slate-600 text-sm">
          Select your desired date, guest count, and dining atmosphere. Our conflict prevention engine guarantees your reservation token in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Form Controls */}
        <form onSubmit={handleSubmitBooking} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-xl space-y-8">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Booking Conflict / Error</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* 1. Date & Guest Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2 flex items-center space-x-1.5">
                <CalendarIcon className="w-4 h-4 text-dining-600" />
                <span>Reservation Date</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={resDate}
                onChange={(e) => setResDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2 flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-dining-600" />
                <span>Party Size (Guests)</span>
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-3 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-dining-600" />
              <span>Choose Dining Time Slot</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {timeSlots.map(slot => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setTimeSlot(slot.value)}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border ${
                    timeSlot === slot.value
                      ? 'bg-gradient-to-r from-dining-600 to-amber-600 text-white border-transparent shadow-lg shadow-dining-600/30 scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Zone Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-3 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-dining-600" />
              <span>Filter Dining Zone</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {zones.map(z => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setSelectedZone(z)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedZone === z
                      ? 'bg-charcoal-900 text-amber-300 border-charcoal-900 shadow-md'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-charcoal-900'
                  }`}
                >
                  {z === 'ALL' ? 'All Dining Zones' : z}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Interactive Floorplan / Table Availability Seat Grid */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Interactive Floorplan ({availableCount} Available)</span>
              </label>
              <span className="text-[11px] text-slate-500">Click to select specific table number</span>
            </div>

            {loadingTables ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 font-semibold animate-pulse">
                Evaluating atomic table locks & capacity checks...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {tablesList.map(t => {
                  const isSelected = selectedTableId === t.table_id;
                  const isAvail = t.is_available && t.is_active;

                  return (
                    <button
                      key={t.table_id}
                      type="button"
                      disabled={!isAvail}
                      onClick={() => setSelectedTableId(isSelected ? null : t.table_id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-dining-600 text-white border-dining-700 ring-2 ring-amber-400 shadow-lg scale-105'
                          : isAvail
                          ? 'bg-white text-charcoal-900 border-emerald-300 hover:border-emerald-500 hover:shadow-md'
                          : !t.is_active
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
                          : 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-black">T#{t.table_number}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          isSelected ? 'bg-amber-300' : isAvail ? 'bg-emerald-500' : !t.is_active ? 'bg-slate-400' : 'bg-red-500'
                        }`} />
                      </div>
                      <p className="text-[11px] font-semibold opacity-90">{t.location_zone}</p>
                      <p className="text-[10px] opacity-75">Cap: {t.capacity} Guests</p>

                      {!isAvail && (
                        <span className="text-[9px] font-bold uppercase block mt-1 text-red-600">
                          {!t.is_active ? 'Maintenance' : 'Reserved'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            
            <p className="text-[11px] text-slate-500 italic">
              * If no specific table is selected, our system will auto-assign the best matching active table upon confirmation.
            </p>
          </div>

          {/* 5. Special Requests */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Special Requests / Dietary Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. High chair required, birthday candle, quiet window seat..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-dining-600 to-amber-600 hover:from-dining-500 hover:to-amber-500 text-white font-bold text-base shadow-xl shadow-dining-600/30 flex items-center justify-center space-x-3 transition-all transform active:scale-98 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{submitting ? 'Locking Table & Token...' : user ? 'Confirm & Generate Reservation Pass' : 'Sign In to Complete Booking'}</span>
          </button>

        </form>

        {/* Right Column: Pre-Order Linking & Booking Overview */}
        <div className="lg:col-span-5 space-y-6">

          {/* Reservation Summary Card */}
          <div className="bg-charcoal-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-900/30 shadow-2xl space-y-6">
            <h3 className="font-serif text-2xl font-bold text-amber-200 border-b border-slate-800 pb-4">
              Booking Overview
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Date</span>
                <span className="font-bold text-white text-sm">{resDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Time Slot</span>
                <span className="font-bold text-amber-300 text-sm">{timeSlot}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Party Size</span>
                <span className="font-bold text-white text-sm">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Selected Zone</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedZone}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Table Allocation</span>
                <span className="font-bold text-amber-300 text-sm">
                  {selectedTableId ? `Table #${tablesList.find(t => t.table_id === selectedTableId)?.table_number}` : 'Auto-Allocate Best Seat'}
                </span>
              </div>
            </div>

            {/* Pre-Order Ticket Card */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 uppercase">
                  <Utensils className="w-4 h-4 text-dining-400" />
                  <span>Linked Pre-Order Ticket</span>
                </span>
                {cart.length > 0 && (
                  <input
                    type="checkbox"
                    checked={includePreOrder}
                    onChange={(e) => setIncludePreOrder(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                  />
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-slate-400">No dishes currently in cart.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Browse Digital Menu & Add Dishes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {cart.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>{i.quantity}x {i.item_name}</span>
                      <span className="font-semibold text-amber-200">${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-bold text-white border-t border-slate-800 text-sm">
                    <span>Pre-Order Total</span>
                    <span className="text-amber-400">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed">
              🔒 <strong>Guarantee Policy:</strong> Upon confirmation, your reservation ID token will be generated instantly and emailed via our automated Nodemailer dispatcher.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
