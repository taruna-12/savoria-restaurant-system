const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reservation = sequelize.define('Reservation', {
  reservation_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reservation_token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  table_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  res_date: {
    type: DataTypes.STRING, // YYYY-MM-DD
    allowNull: false
  },
  time_slot: {
    type: DataTypes.STRING, // HH:MM (e.g. 18:00, 19:30)
    allowNull: false
  },
  guest_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
    defaultValue: 'CONFIRMED',
    allowNull: false
  },
  special_requests: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  }
}, {
  tableName: 'reservations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Reservation;
