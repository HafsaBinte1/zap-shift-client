const express = require('express');
const {
  createOrder,
  myOrders,
  availableOrders,
  myDeliveries,
  acceptOrder,
  updateStatus,
  getOrder,
  cancelOrder
} = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, requireRole('merchant'), createOrder);
router.get('/my-orders', protect, requireRole('merchant'), myOrders);
router.get('/available', protect, requireRole('deliveryMan'), availableOrders);
router.get('/my-deliveries', protect, requireRole('deliveryMan'), myDeliveries);
router.post('/:id/accept', protect, requireRole('deliveryMan'), acceptOrder);
router.put('/:id/status', protect, requireRole('deliveryMan'), updateStatus);
router.get('/:id', protect, getOrder);
router.delete('/:id', protect, requireRole('merchant'), cancelOrder);

module.exports = router;
