import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes are protected
router.get('/', authenticateUser, getCart);
router.post('/add', authenticateUser, addToCart);
router.put('/:id', authenticateUser, updateCartItem);
router.delete('/:id', authenticateUser, removeFromCart);
router.delete('/', authenticateUser, clearCart);

export default router;