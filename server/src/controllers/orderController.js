const { sequelize, Order, OrderItem, MenuItem, User, Reservation } = require('../models');
const { sendOrderStatusUpdate } = require('../services/emailService');

// Create standalone or attached Order
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { reservation_id, items, notes } = req.body;
    const userId = req.user.user_id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.item_id, { transaction });
      if (!menuItem || !menuItem.is_available) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: `Item "${menuItem ? menuItem.item_name : 'Unknown'}" is currently out of stock.` });
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      subtotal += itemTotal;
      itemsToCreate.push({
        item_id: menuItem.item_id,
        quantity: item.quantity,
        unit_price: menuItem.price,
        customizations: item.customizations || ''
      });
    }

    const tax_amount = Number((subtotal * 0.05).toFixed(2));
    const total_amount = Number((subtotal + tax_amount).toFixed(2));
    const order_number = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const order = await Order.create({
      order_number,
      user_id: userId,
      reservation_id: reservation_id || null,
      subtotal,
      tax_amount,
      total_amount,
      order_status: 'PENDING',
      notes: notes || ''
    }, { transaction });

    for (const oi of itemsToCreate) {
      await OrderItem.create({
        order_id: order.order_id,
        ...oi
      }, { transaction });
    }

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.order_id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'item' }] }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: createdOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('createOrder error:', error);
    return res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.user_id;

    if (req.user.role !== 'Admin' && req.user.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'item' }] },
        { model: Reservation, as: 'reservation' }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('getUserOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user orders.' });
  }
};

// Get Live Kitchen Orders Stream (Admin / Kitchen Console)
const getLiveKitchenOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
        { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'item' }] },
        { model: Reservation, as: 'reservation' }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('getLiveKitchenOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch live kitchen orders stream.' });
  }
};

// Update Order Status (Admin / Kitchen Staff)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body; // PENDING, PREPARING, SERVED, COMPLETED, CANCELLED

    if (!['PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED'].includes(order_status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value.' });
    }

    const order = await Order.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.order_status = order_status;
    await order.save();

    if (order.user) {
      sendOrderStatusUpdate(order.user.email, order.order_number, order_status);
    }

    return res.json({ success: true, message: `Order status updated to ${order_status}.`, order });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getLiveKitchenOrders,
  updateOrderStatus
};
