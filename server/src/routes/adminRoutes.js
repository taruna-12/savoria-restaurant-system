const express = require('express');
const router = express.Router();
const { getEmailLogs } = require('../services/emailService');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { User, Table, Reservation, Order, MenuItem } = require('../models');

// Get Email Logs
router.get('/emails', verifyToken, isAdmin, (req, res) => {
  return res.json({ success: true, logs: getEmailLogs() });
});

// Get Dashboard Summary Stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTables = await Table.count();
    const activeReservations = await Reservation.count({ where: { status: 'CONFIRMED' } });
    const totalMenuItems = await MenuItem.count();
    const liveOrders = await Order.count({ where: { order_status: ['PENDING', 'PREPARING', 'SERVED'] } });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalTables,
        activeReservations,
        totalMenuItems,
        liveOrders
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
});

module.exports = router;
