const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus
} = require('../controllers/reservationController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, createReservation);
router.get('/user/:userId', verifyToken, getUserReservations);
router.get('/all', verifyToken, isAdmin, getAllReservations);
router.patch('/:id/status', verifyToken, updateReservationStatus);

module.exports = router;
