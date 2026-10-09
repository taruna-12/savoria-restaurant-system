const sequelize = require('../config/db');
const User = require('./User');
const Table = require('./Table');
const Reservation = require('./Reservation');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// User <-> Reservation
User.hasMany(Reservation, { foreignKey: 'user_id', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Table <-> Reservation
Table.hasMany(Reservation, { foreignKey: 'table_id', as: 'reservations' });
Reservation.belongsTo(Table, { foreignKey: 'table_id', as: 'table' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Reservation <-> Order
Reservation.hasMany(Order, { foreignKey: 'reservation_id', as: 'orders' });
Order.belongsTo(Reservation, { foreignKey: 'reservation_id', as: 'reservation' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// MenuItem <-> OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: 'item_id', as: 'orderItems' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'item_id', as: 'item' });

module.exports = {
  sequelize,
  User,
  Table,
  Reservation,
  MenuItem,
  Order,
  OrderItem
};
