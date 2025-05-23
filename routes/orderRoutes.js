import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getUserOrders, 
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', authenticateUser, createOrder);
router.get('/user', authenticateUser, getUserOrders);
router.get('/:id', authenticateUser, getOrderById);

// Admin routes
router.get('/', authenticateUser, isAdmin, getAllOrders);
router.put('/:id/status', authenticateUser, isAdmin, updateOrderStatus);

export default router;