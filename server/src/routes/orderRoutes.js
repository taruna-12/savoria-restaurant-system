const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getLiveKitchenOrders, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, createOrder);
router.get('/user/:userId', verifyToken, getUserOrders);
router.get('/live', verifyToken, isAdmin, getLiveKitchenOrders);
router.patch('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
