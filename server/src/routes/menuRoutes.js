const express = require('express');
const router = express.Router();
const { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getMenu);
router.post('/', verifyToken, isAdmin, createMenuItem);
router.put('/:id', verifyToken, isAdmin, updateMenuItem);
router.delete('/:id', verifyToken, isAdmin, deleteMenuItem);

module.exports = router;
