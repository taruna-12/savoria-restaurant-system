import React, { useEffect } from 'react';
import { X, CheckCircle2, Calendar, Clock, Users, MapPin, Printer, QrCode, Sparkles, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReservationPassModal = ({ isOpen, onClose, reservation }) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-white my-8">

        {/* Modal Top Control */}
        <div className="p-4 bg-slate-950/80 border-b border-amber-900/30 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Booking Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Ticket Container */}
        <div className="printable-voucher p-6 space-y-6">

          {/* Ticket Header Banner */}
          <div className="bg-gradient-to-br from-dining-800 via-amber-900 to-slate-900 p-6 rounded-2xl border border-amber-500/30 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <Sparkles className="w-32 h-32 text-amber-300" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent block">
              SAVORIA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold block mb-4">
              Official Dining Reservation Voucher
            </span>

            {/* Token Badge */}
            <div className="inline-block bg-black/40 border border-amber-400/40 rounded-xl px-4 py-2 backdrop-blur-md">
              <span className="text-[10px] uppercase text-amber-300 font-medium block">Digital Reservation Token</span>
              <span className="font-mono text-2xl font-black text-amber-200 tracking-wider">
                #{reservation.reservation_token}
              </span>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Date</span>
              </span>
              <p className="font-bold text-white">{reservation.res_date}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Slot</span>
              </span>
              <p className="font-bold text-amber-300">{reservation.time_slot}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Party Size</span>
              </span>
              <p className="font-bold text-white">{reservation.guest_count} Guests</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Table & Zone</span>
              </span>
              <p className="font-bold text-emerald-400">
                Table #{reservation.table?.table_number || 'Auto'} ({reservation.table?.location_zone || 'Indoor'})
              </p>
            </div>
          </div>

          {/* Attached Pre-order Ticket breakdown if present */}
          {reservation.orders && reservation.orders.length > 0 && (
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-amber-800/30 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase">
                <Utensils className="w-4 h-4 text-dining-400" />
                <span>Attached Kitchen Pre-Order (#{reservation.orders[0].order_number})</span>
              </div>
              <div className="divide-y divide-slate-700/50 text-xs text-slate-300">
                {reservation.orders[0].items?.map((itemObj, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between">
                    <span>{itemObj.quantity}x {itemObj.item?.item_name || 'Dish'}</span>
                    <span className="font-medium text-amber-200">${(Number(itemObj.unit_price) * itemObj.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between text-xs font-bold text-white border-t border-slate-700">
                <span>Pre-Order Total (Taxes incl.)</span>
                <span className="text-amber-400">${Number(reservation.orders[0].total_amount).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* QR Code Mock & Entry Instructions */}
          <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-black" />
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">Present Pass at Host Counter</p>
              <p>Please arrive 5 minutes prior to your time slot. Table lock will be held for 15 minutes.</p>
            </div>
          </div>

        </div>

        {/* Footer Close */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
          >
            Done & Close
          </button>
        </div>

      </div>
    </div>
  );
};
