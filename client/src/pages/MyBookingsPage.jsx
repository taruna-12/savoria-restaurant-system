import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle2, XCircle, Utensils, Ticket, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MyBookingsPage = ({ onViewPass, onOpenCart }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations'); // reservations or orders

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [resData, orderData] = await Promise.all([
        api.getUserReservations(user.user_id),
        api.getUserOrders(user.user_id)
      ]);

      if (resData.success) setReservations(resData.reservations || []);
      if (orderData.success) setOrders(orderData.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCancelReservation = async (resId) => {
    if (!window.confirm('Are you sure you want to cancel this table reservation?')) return;
    try {
      const res = await api.updateReservationStatus(resId, 'CANCELLED');
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      alert('Failed to cancel reservation.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-charcoal-900">Sign In Required</h3>
        <p className="text-xs text-slate-600">Please sign in to view your table reservation passes and live kitchen orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900">Guest Dining Ledger</h1>
          <p className="text-xs text-slate-600 mt-1">Logged in as {user.name} ({user.email})</p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl text-xs font-bold flex items-center space-x-2 w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Tab Selector */}
      <div className="flex space-x-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'reservations'
              ? 'border-dining-600 text-dining-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Table Reservations ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'border-dining-600 text-dining-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Food Orders ({orders.length})</span>
        </button>
      </div>

      {/* Reservations List */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-3xl animate-pulse text-xs text-slate-500">
              Loading reservation ledger...
            </div>
          ) : reservations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-800">No active or past table reservations found</h3>
              <p className="text-xs text-slate-500">Book your first table slot now!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map(res => {
                const statusColors = {
                  CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
                  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
                  CANCELLED: 'bg-red-100 text-red-800 border-red-300'
                };

                return (
                  <div
                    key={res.reservation_id}
                    className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-lg space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-base font-black text-dining-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                          #{res.reservation_token}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[res.status] || 'bg-slate-100'}`}>
                          {res.status}
                        </span>
                      </div>
                      <button
                        onClick={() => onViewPass(res)}
                        className="px-3 py-1.5 rounded-xl bg-charcoal-900 text-amber-300 hover:bg-slate-800 text-xs font-bold flex items-center space-x-1.5 shadow-md"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Voucher Pass</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                        <span className="font-bold text-charcoal-900">{res.res_date} @ {res.time_slot}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Party Size</span>
                        <span className="font-bold text-charcoal-900">{res.guest_count} Guests</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Table Number</span>
                        <span className="font-bold text-emerald-700">Table #{res.table?.table_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Dining Zone</span>
                        <span className="font-bold text-charcoal-900">{res.table?.location_zone || 'Indoor'}</span>
                      </div>
                    </div>

                    {res.special_requests && (
                      <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-100 italic">
                        Special Requests: {res.special_requests}
                      </p>
                    )}

                    {res.orders && res.orders.length > 0 && (
                      <div className="text-xs bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                          <Utensils className="w-3.5 h-3.5 text-dining-400" />
                          <span>Linked Pre-Order Ticket (${Number(res.orders[0].total_amount).toFixed(2)})</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase text-emerald-400">{res.orders[0].order_status}</span>
                      </div>
                    )}

                    {res.status === 'CONFIRMED' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleCancelReservation(res.reservation_id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-3xl animate-pulse text-xs text-slate-500">
              Loading kitchen orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Utensils className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-800">No food orders placed yet</h3>
              <p className="text-xs text-slate-500">Order from our digital menu catalog!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map(order => {
                const statusColors = {
                  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
                  PREPARING: 'bg-orange-100 text-orange-800 border-orange-300',
                  SERVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
                  CANCELLED: 'bg-red-100 text-red-800 border-red-300'
                };

                return (
                  <div key={order.order_id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-base font-bold text-charcoal-900">
                        #{order.order_number}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[order.order_status]}`}>
                        Kitchen: {order.order_status}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {order.items?.map((itemObj, idx) => (
                        <div key={idx} className="py-2 flex justify-between">
                          <div>
                            <span className="font-bold text-charcoal-900">{itemObj.quantity}x {itemObj.item?.item_name || 'Dish'}</span>
                            {itemObj.customizations && (
                              <p className="text-[10px] text-amber-600 italic">{itemObj.customizations}</p>
                            )}
                          </div>
                          <span className="font-bold text-slate-700">${(Number(itemObj.unit_price) * itemObj.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-charcoal-900">
                      <span>Total Paid</span>
                      <span className="text-dining-600">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
