import express from 'express'
import { isAuth } from '../../utils/auth.js'

import {
  createOrder,
  getOrders,
  getDashboardSummary,
  getOrderById,
  updateOrder,
  deleteOrder,
  getCustomers,
  getCustomerById,
} from '../controllers/orders.js'

const router = express.Router()

// Orders list and creation
router
  .route('/api/orders')
  .get(isAuth, getOrders)
  .post(isAuth, createOrder)

router
  .route('/api/orders/dashboard-summary')
  .get(isAuth, getDashboardSummary)

// Individual order operations
router
  .route('/api/orders/:id')
  .get(isAuth, getOrderById)
  .put(isAuth, updateOrder)
  .delete(isAuth, deleteOrder)

router
  .route('/api/customers')
  .get(isAuth, getCustomers)

router
  .route('/api/customers/:id')
  .get(isAuth, getCustomerById)
  
export default router