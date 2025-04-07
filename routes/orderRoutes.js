const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder
} = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrder);

module.exports = router;