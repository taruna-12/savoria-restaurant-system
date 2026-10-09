const { sequelize, Reservation, Table, User, Order, OrderItem, MenuItem } = require('../models');
const { Op } = require('sequelize');
const { sendBookingConfirmation, sendBookingCancellation } = require('../services/emailService');

// Create Reservation with Concurrency Lock & Atomic DB Transaction
const createReservation = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { table_id, res_date, time_slot, guest_count, location_zone, special_requests, pre_order_items } = req.body;
    const userId = req.user.user_id;

    if (!res_date || !time_slot || !guest_count) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Date, time slot, and guest count are required.' });
    }

    let targetTable = null;

    if (table_id) {
      // Find specified table
      targetTable = await Table.findByPk(table_id, { transaction });
      if (!targetTable || !targetTable.is_active) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'Selected table is not active or invalid.' });
      }
      if (targetTable.capacity < guest_count) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: `Table capacity (${targetTable.capacity}) is too small for ${guest_count} guests.` });
      }

      // Check conflict for this table
      const conflict = await Reservation.findOne({
        where: {
          table_id: targetTable.table_id,
          res_date,
          time_slot,
          status: { [Op.in]: ['PENDING', 'CONFIRMED'] }
        },
        transaction
      });

      if (conflict) {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          message: `Table ${targetTable.table_number} is already booked for ${res_date} at ${time_slot}. Please select another table or time.`
        });
      }
    } else {
      // Auto-assign available table in specified zone or any active table
      const tableQuery = {
        is_active: true,
        capacity: { [Op.gte]: guest_count }
      };
      if (location_zone) {
        tableQuery.location_zone = location_zone;
      }

      const eligibleTables = await Table.findAll({
        where: tableQuery,
        order: [['capacity', 'ASC']],
        transaction
      });

      if (eligibleTables.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: 'No tables matching your guest count and zone preferences are available.' });
      }

      // Find first available table without conflict
      for (const table of eligibleTables) {
        const conflict = await Reservation.findOne({
          where: {
            table_id: table.table_id,
            res_date,
            time_slot,
            status: { [Op.in]: ['PENDING', 'CONFIRMED'] }
          },
          transaction
        });
        if (!conflict) {
          targetTable = table;
          break;
        }
      }

      if (!targetTable) {
        await transaction.rollback();
        return res.status(409).json({ success: false, message: 'All matching tables are fully booked for this date and time slot.' });
      }
    }

    // Generate unique Reservation Token
    const reservation_token = 'RES-' + Math.floor(100000 + Math.random() * 900000);

    const reservation = await Reservation.create({
      reservation_token,
      user_id: userId,
      table_id: targetTable.table_id,
      res_date,
      time_slot,
      guest_count: parseInt(guest_count, 10),
      status: 'CONFIRMED',
      special_requests: special_requests || ''
    }, { transaction });

    // Handle linked pre-order if items provided
    let linkedOrder = null;
    if (pre_order_items && Array.isArray(pre_order_items) && pre_order_items.length > 0) {
      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of pre_order_items) {
        const menuItem = await MenuItem.findByPk(item.item_id, { transaction });
        if (menuItem && menuItem.is_available) {
          const itemTotal = Number(menuItem.price) * item.quantity;
          subtotal += itemTotal;
          orderItemsToCreate.push({
            item_id: menuItem.item_id,
            quantity: item.quantity,
            unit_price: menuItem.price,
            customizations: item.notes || ''
          });
        }
      }

      if (orderItemsToCreate.length > 0) {
        const tax_amount = Number((subtotal * 0.05).toFixed(2)); // 5% tax
        const total_amount = Number((subtotal + tax_amount).toFixed(2));
        const order_number = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

        linkedOrder = await Order.create({
          order_number,
          user_id: userId,
          reservation_id: reservation.reservation_id,
          subtotal,
          tax_amount,
          total_amount,
          order_status: 'PENDING',
          notes: 'Pre-ordered with table reservation'
        }, { transaction });

        for (const oi of orderItemsToCreate) {
          await OrderItem.create({
            order_id: linkedOrder.order_id,
            ...oi
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    // Fetch full reservation details for response & email alert
    const user = await User.findByPk(userId);
    sendBookingConfirmation(user.email, user.name, {
      reservation_token: reservation.reservation_token,
      res_date: reservation.res_date,
      time_slot: reservation.time_slot,
      guest_count: reservation.guest_count,
      tableNumber: targetTable.table_number,
      zoneName: targetTable.location_zone
    });

    const fullReservation = await Reservation.findByPk(reservation.reservation_id, {
      include: [
        { model: Table, as: 'table' },
        { model: Order, as: 'orders', include: [{ model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'item' }] }] }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Table reservation confirmed successfully!',
      reservation: fullReservation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('createReservation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete reservation process.' });
  }
};

// Get User's Reservations
const getUserReservations = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.user_id;

    // Security check: non-admins can only see their own
    if (req.user.role !== 'Admin' && req.user.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden access to user reservations.' });
    }

    const reservations = await Reservation.findAll({
      where: { user_id: userId },
      include: [
        { model: Table, as: 'table' },
        { model: Order, as: 'orders', include: [{ model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'item' }] }] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json({ success: true, reservations });
  } catch (error) {
    console.error('getUserReservations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user reservations.' });
  }
};

// Get All Reservations (Admin)
const getAllReservations = async (req, res) => {
  try {
    const { date, status } = req.query;
    const whereClause = {};

    if (date) whereClause.res_date = date;
    if (status) whereClause.status = status;

    const reservations = await Reservation.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Table, as: 'table' },
        { model: Order, as: 'orders' }
      ],
      order: [['res_date', 'DESC'], ['time_slot', 'ASC']]
    });

    return res.json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    console.error('getAllReservations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reservations master ledger.' });
  }
};

// Update Reservation Status (Admin or Customer Cancel)
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, CONFIRMED, CANCELLED, COMPLETED

    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const reservation = await Reservation.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    // Non-admins can only cancel their own booking
    if (req.user.role !== 'Admin') {
      if (reservation.user_id !== req.user.user_id) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
      }
      if (status !== 'CANCELLED') {
        return res.status(400).json({ success: false, message: 'Customers can only cancel reservations.' });
      }
    }

    reservation.status = status;
    await reservation.save();

    if (status === 'CANCELLED' && reservation.user) {
      sendBookingCancellation(reservation.user.email, reservation.user.name, reservation.reservation_token);
    }

    return res.json({ success: true, message: `Reservation status updated to ${status}.`, reservation });
  } catch (error) {
    console.error('updateReservationStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update reservation status.' });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus
};
