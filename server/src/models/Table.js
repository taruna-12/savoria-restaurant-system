const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Table = sequelize.define('Table', {
  table_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  table_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  location_zone: {
    type: DataTypes.STRING,
    allowNull: false, // Indoor, Patio, Balcony, Private Lounge
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'tables',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Table;
