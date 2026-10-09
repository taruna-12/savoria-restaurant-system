const express = require('express');
const router = express.Router();
const { getTables, getAvailability, createTable, updateTable } = require('../controllers/tableController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getTables);
router.get('/availability', getAvailability);
router.post('/', verifyToken, isAdmin, createTable);
router.patch('/:id', verifyToken, isAdmin, updateTable);

module.exports = router;
