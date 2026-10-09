import React, { useState, useEffect } from 'react';
import { LayoutGrid, Utensils, Calendar, Mail, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, RefreshCw, Power, Flame, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = ({ onOpenEmailLogs }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('floorplan'); // floorplan, kitchen, reservations, menu, stats
  const [stats, setStats] = useState(null);

  // Data states
  const [tables, setTables] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [masterReservations, setMasterReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state for CRUD
  const [showTableModal, setShowTableModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // New Table Form
  const [tableNumber, setTableNumber] = useState('');
  const [tableCapacity, setTableCapacity] = useState('4');
  const [tableZone, setTableZone] = useState('Indoor');

  // Menu Form
  const [menuName, setMenuName] = useState('');
  const [menuCategory, setMenuCategory] = useState('Starters');
  const [menuPrice, setMenuPrice] = useState('15.00');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuVeg, setMenuVeg] = useState(true);
  const [menuTags, setMenuTags] = useState('Vegetarian');
  const [menuImage, setMenuImage] = useState('');

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, tablesRes, ordersRes, resRes, menuRes] = await Promise.all([
        api.getAdminStats(),
        api.getTables(),
        api.getLiveKitchenOrders(),
        api.getAllReservations(),
        api.getMenu()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (tablesRes.success) setTables(tablesRes.tables || []);
      if (ordersRes.success) setLiveOrders(ordersRes.orders || []);
      if (resRes.success) setMasterReservations(resRes.reservations || []);
      if (menuRes.success) setMenuItems(menuRes.items || []);
    } catch (e) {
      console.error('Admin data fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // Table Operational Override Toggle (Active vs Maintenance)
  const handleToggleTableActive = async (table) => {
    try {
      const res = await api.updateTable(table.table_id, { is_active: !table.is_active });
      if (res.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      alert('Failed to toggle table status.');
    }
  };

  // Add Table
  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createTable({
        table_number: tableNumber,
        capacity: parseInt(tableCapacity, 10),
        location_zone: tableZone,
        is_active: true
      });
      if (res.success) {
        setShowTableModal(false);
        setTableNumber('');
        fetchAllAdminData();
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert('Failed to create table.');
    }
  };

  // Live Order Status Advance
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      alert('Failed to update order status.');
    }
  };

  // Reservation Status Advance
  const handleUpdateResStatus = async (resId, newStatus) => {
    try {
      const res = await api.updateReservationStatus(resId, newStatus);
      if (res.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      alert('Failed to update reservation status.');
    }
  };

  // Menu Stock Availability Toggle
  const handleToggleMenuStock = async (item) => {
    try {
      const res = await api.updateMenuItem(item.item_id, { is_available: !item.is_available });
      if (res.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      alert('Failed to update menu availability.');
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Delete this menu item permanently?')) return;
    try {
      const res = await api.deleteMenuItem(itemId);
      if (res.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      alert('Failed to delete menu item.');
    }
  };

  // Menu Save / Create / Edit
  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const payload = {
      item_name: menuName,
      category: menuCategory,
      price: parseFloat(menuPrice),
      description: menuDesc,
      is_veg: menuVeg,
      dietary_tags: menuTags,
      image_url: menuImage,
      is_available: true
    };

    try {
      let res;
      if (editingMenuItem) {
        res = await api.updateMenuItem(editingMenuItem.item_id, payload);
      } else {
        res = await api.createMenuItem(payload);
      }

      if (res.success) {
        setShowMenuModal(false);
        setEditingMenuItem(null);
        resetMenuForm();
        fetchAllAdminData();
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert('Failed to save menu item.');
    }
  };

  const openMenuEdit = (item) => {
    setEditingMenuItem(item);
    setMenuName(item.item_name);
    setMenuCategory(item.category);
    setMenuPrice(item.price.toString());
    setMenuDesc(item.description || '');
    setMenuVeg(item.is_veg);
    setMenuTags(item.dietary_tags || '');
    setMenuImage(item.image_url || '');
    setShowMenuModal(true);
  };

  const resetMenuForm = () => {
    setMenuName('');
    setMenuCategory('Starters');
    setMenuPrice('15.00');
    setMenuDesc('');
    setMenuVeg(true);
    setMenuTags('Vegetarian');
    setMenuImage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-charcoal-950 via-dining-900 to-amber-950 p-8 rounded-3xl border border-amber-500/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>M4 Console • Kitchen & Floor Overrides</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Restaurant Management Center
          </h1>
          <p className="text-xs text-amber-200/80">Live Kitchen Display System (KDS), Table Lock Override, and Menu Catalog CRUD</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenEmailLogs}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700 text-xs font-bold flex items-center space-x-2 shadow-lg"
          >
            <Mail className="w-4 h-4" />
            <span>Email Alert Logs</span>
          </button>

          <button
            onClick={fetchAllAdminData}
            className="p-2.5 rounded-xl bg-dining-600 text-white hover:bg-dining-500 text-xs font-bold flex items-center space-x-1.5 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Users</span>
            <span className="text-2xl font-black text-charcoal-900 block mt-1">{stats.totalUsers}</span>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Tables</span>
            <span className="text-2xl font-black text-charcoal-900 block mt-1">{stats.totalTables}</span>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Confirmed Bookings</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">{stats.activeReservations}</span>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Kitchen Orders</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{stats.liveOrders}</span>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Menu Dish Items</span>
            <span className="text-2xl font-black text-dining-600 block mt-1">{stats.totalMenuItems}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'floorplan', label: '🪑 Floorplan & Table Grid', count: tables.length },
          { id: 'kitchen', label: '👨‍🍳 Live Kitchen Stream (KDS)', count: liveOrders.filter(o => o.order_status !== 'COMPLETED').length },
          { id: 'reservations', label: '📅 Master Reservation Ledger', count: masterReservations.length },
          { id: 'menu', label: '📖 Menu CRUD Editor', count: menuItems.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-charcoal-900 text-amber-300 shadow-lg shadow-charcoal-900/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: Table Floorplan Overview */}
      {activeTab === 'floorplan' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Table Capacity & Operational Override</h3>
              <p className="text-xs text-slate-500">Toggle table status between Active vs Maintenance mode.</p>
            </div>
            <button
              onClick={() => setShowTableModal(true)}
              className="px-4 py-2.5 rounded-xl bg-dining-600 hover:bg-dining-500 text-white font-bold text-xs shadow-md flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Table</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables.map(table => (
              <div
                key={table.table_id}
                className={`p-6 rounded-3xl border transition-all space-y-4 shadow-sm ${
                  table.is_active
                    ? 'bg-white border-slate-200 hover:border-amber-400'
                    : 'bg-slate-100 border-slate-300 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-charcoal-900">
                    Table #{table.table_number}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    table.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {table.is_active ? 'Active' : 'Maintenance'}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <p><strong>Zone:</strong> {table.location_zone}</p>
                  <p><strong>Max Capacity:</strong> {table.capacity} Guests</p>
                </div>

                <button
                  onClick={() => handleToggleTableActive(table)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    table.is_active
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{table.is_active ? 'Mark Inactive (Maintenance)' : 'Set Active for Booking'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Live Kitchen Orders (KDS Stream) */}
      {activeTab === 'kitchen' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Live Kitchen Display System (KDS)</h3>
              <p className="text-xs text-slate-500">Real-time incoming dishes stream with status progression</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveOrders.map(order => {
              const statusNext = {
                PENDING: 'PREPARING',
                PREPARING: 'SERVED',
                SERVED: 'COMPLETED'
              };

              return (
                <div
                  key={order.order_id}
                  className="bg-charcoal-950 text-white rounded-3xl border border-amber-500/30 p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono text-lg font-bold text-amber-300">#{order.order_number}</span>
                      <span className="block text-[10px] text-slate-400">{order.user?.name || 'Guest'}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {order.order_status}
                    </span>
                  </div>

                  {order.reservation && (
                    <div className="p-2.5 bg-slate-900 rounded-xl text-xs text-emerald-400 font-semibold border border-emerald-800/40">
                      Linked Table Reservation: #{order.reservation.reservation_token}
                    </div>
                  )}

                  <div className="space-y-2 text-xs divide-y divide-slate-800">
                    {order.items?.map((oi, idx) => (
                      <div key={idx} className="pt-2 flex justify-between">
                        <div>
                          <span className="font-bold text-amber-200">{oi.quantity}x {oi.item?.item_name || 'Dish'}</span>
                          {oi.customizations && (
                            <p className="text-[10px] text-amber-400 italic">{oi.customizations}</p>
                          )}
                        </div>
                        <span className="text-slate-400">${(Number(oi.unit_price) * oi.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl italic border border-slate-800">
                      Note: {order.notes}
                    </p>
                  )}

                  {statusNext[order.order_status] && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.order_id, statusNext[order.order_status])}
                      className="w-full py-2.5 rounded-xl bg-dining-600 hover:bg-dining-500 text-white font-bold text-xs shadow-lg transition-all"
                    >
                      Advance Status to: {statusNext[order.order_status]}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Master Reservation Ledger */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">Master Reservation Ledger</h3>
            <p className="text-xs text-slate-500">Manage all guest table reservations and check-in statuses.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Token</th>
                    <th className="p-4">Guest Info</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Table / Zone</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {masterReservations.map(res => (
                    <tr key={res.reservation_id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-dining-600">#{res.reservation_token}</td>
                      <td className="p-4">
                        <span className="font-bold block text-charcoal-900">{res.user?.name || 'Guest'}</span>
                        <span className="text-[10px] text-slate-400">{res.user?.email}</span>
                      </td>
                      <td className="p-4 font-semibold">{res.res_date} @ {res.time_slot}</td>
                      <td className="p-4 font-semibold text-emerald-700">
                        Table #{res.table?.table_number} ({res.table?.location_zone})
                      </td>
                      <td className="p-4 font-bold">{res.guest_count}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateResStatus(res.reservation_id, 'COMPLETED')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                          >
                            Check In / Seated
                          </button>
                        )}
                        {res.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateResStatus(res.reservation_id, 'CANCELLED')}
                            className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold text-[10px]"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Menu Items CRUD Editor */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Menu Catalog CRUD Editor</h3>
              <p className="text-xs text-slate-500">Create, edit prices, descriptions, and stock availability.</p>
            </div>
            <button
              onClick={() => { resetMenuForm(); setEditingMenuItem(null); setShowMenuModal(true); }}
              className="px-4 py-2.5 rounded-xl bg-dining-600 text-white font-bold text-xs shadow-md flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Menu Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map(item => (
              <div key={item.item_id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-dining-600 uppercase">{item.category}</span>
                    <span className="font-bold text-lg text-charcoal-900">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-charcoal-900">{item.item_name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => handleToggleMenuStock(item)}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold ${
                      item.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Stock: {item.is_available ? 'In-Stock (Available)' : 'Out of Stock'}
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openMenuEdit(item)}
                      className="flex-1 py-1.5 bg-slate-800 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.item_id)}
                      className="py-1.5 px-3 bg-red-100 text-red-600 rounded-xl text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add New Table */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-md text-white space-y-4">
            <h3 className="font-serif text-xl font-bold text-amber-300">Add New Dining Table</h3>
            <form onSubmit={handleAddTable} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 501"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Capacity (Guests)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Location Zone</label>
                <select
                  value={tableZone}
                  onChange={(e) => setTableZone(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Indoor">Indoor Main Dining</option>
                  <option value="Patio">Patio Garden</option>
                  <option value="Balcony">Balcony Skyline</option>
                  <option value="Private Lounge">Private Lounge</option>
                </select>
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-dining-600 text-white rounded-xl font-bold"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Menu Item Create/Edit */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-lg text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-amber-300">
              {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={menuDesc}
                  onChange={(e) => setMenuDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Veg / Non-Veg</label>
                  <select
                    value={menuVeg ? 'true' : 'false'}
                    onChange={(e) => setMenuVeg(e.target.value === 'true')}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="true">🟢 Vegetarian</option>
                    <option value="false">🔴 Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dietary Tags</label>
                  <input
                    type="text"
                    placeholder="Gluten-Free, Chef Special"
                    value={menuTags}
                    onChange={(e) => setMenuTags(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={menuImage}
                  onChange={(e) => setMenuImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMenuModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-dining-600 text-white rounded-xl font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
