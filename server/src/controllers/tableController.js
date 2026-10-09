const { Table, Reservation } = require('../models');
const { Op } = require('sequelize');

// Get all tables
const getTables = async (req, res) => {
  try {
    const tables = await Table.findAll({ order: [['table_number', 'ASC']] });
    return res.json({ success: true, tables });
  } catch (error) {
    console.error('getTables error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tables.' });
  }
};

// Check table availability for date & slot
const getAvailability = async (req, res) => {
  try {
    const { date, slot, guests, zone } = req.query;

    if (!date || !slot) {
      return res.status(400).json({ success: false, message: 'Date (YYYY-MM-DD) and slot (HH:MM) are required.' });
    }

    const guestCount = parseInt(guests, 10) || 1;

    // Find all active tables
    const tableWhereClause = { is_active: true };
    if (guestCount > 0) {
      tableWhereClause.capacity = { [Op.gte]: guestCount };
    }
    if (zone) {
      tableWhereClause.location_zone = zone;
    }

    const eligibleTables = await Table.findAll({ where: tableWhereClause });

    // Find reserved table IDs for the given date and slot
    const reservedRecords = await Reservation.findAll({
      where: {
        res_date: date,
        time_slot: slot,
        status: { [Op.in]: ['PENDING', 'CONFIRMED'] }
      },
      attributes: ['table_id']
    });

    const reservedTableIds = new Set(reservedRecords.map(r => r.table_id));

    // Map table availability status
    const tablesWithStatus = eligibleTables.map(table => ({
      table_id: table.table_id,
      table_number: table.table_number,
      capacity: table.capacity,
      location_zone: table.location_zone,
      is_active: table.is_active,
      is_available: !reservedTableIds.has(table.table_id)
    }));

    return res.json({
      success: true,
      query: { date, slot, guests: guestCount, zone },
      available_count: tablesWithStatus.filter(t => t.is_available).length,
      total_eligible: tablesWithStatus.length,
      tables: tablesWithStatus
    });
  } catch (error) {
    console.error('getAvailability error:', error);
    return res.status(500).json({ success: false, message: 'Failed to check table availability.' });
  }
};

// Create Table (Admin)
const createTable = async (req, res) => {
  try {
    const { table_number, capacity, location_zone, is_active } = req.body;
    if (!table_number || !capacity || !location_zone) {
      return res.status(400).json({ success: false, message: 'Table number, capacity, and location zone are required.' });
    }

    const existing = await Table.findOne({ where: { table_number } });
    if (existing) {
      return res.status(400).json({ success: false, message: `Table #${table_number} already exists.` });
    }

    const newTable = await Table.create({
      table_number,
      capacity: parseInt(capacity, 10),
      location_zone,
      is_active: is_active !== undefined ? is_active : true
    });

    return res.status(201).json({ success: true, message: 'Table created successfully!', table: newTable });
  } catch (error) {
    console.error('createTable error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create table.' });
  }
};

// Update Table Status/Capacity (Admin)
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, location_zone, is_active, table_number } = req.body;

    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found.' });
    }

    if (table_number) table.table_number = table_number;
    if (capacity) table.capacity = parseInt(capacity, 10);
    if (location_zone) table.location_zone = location_zone;
    if (is_active !== undefined) table.is_active = is_active;

    await table.save();

    return res.json({ success: true, message: 'Table updated successfully!', table });
  } catch (error) {
    console.error('updateTable error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update table.' });
  }
};

module.exports = {
  getTables,
  getAvailability,
  createTable,
  updateTable
};
