const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('savoria_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  // Tables & Availability
  getTables: async () => {
    const res = await fetch(`${API_BASE_URL}/tables`);
    return res.json();
  },
  getAvailability: async (date, slot, guests, zone) => {
    const query = new URLSearchParams({ date, slot, guests: guests || 1 });
    if (zone && zone !== 'ALL') query.append('zone', zone);
    const res = await fetch(`${API_BASE_URL}/tables/availability?${query.toString()}`);
    return res.json();
  },
  createTable: async (tableData) => {
    const res = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(tableData)
    });
    return res.json();
  },
  updateTable: async (id, tableData) => {
    const res = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(tableData)
    });
    return res.json();
  },

  // Reservations
  createReservation: async (reservationData) => {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(reservationData)
    });
    return res.json();
  },
  getUserReservations: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/reservations/user/${userId}`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },
  getAllReservations: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/reservations/all?${query}`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },
  updateReservationStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Menu & Ordering
  getMenu: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/menu?${query}`);
    return res.json();
  },
  createMenuItem: async (itemData) => {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },
  updateMenuItem: async (id, itemData) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },
  deleteMenuItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },

  // Orders
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },
  getUserOrders: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },
  getLiveKitchenOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders/live`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },
  updateOrderStatus: async (id, order_status) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ order_status })
    });
    return res.json();
  },

  // Admin Logs & Stats
  getEmailLogs: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/emails`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  }
};
