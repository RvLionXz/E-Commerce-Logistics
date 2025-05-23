import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authenticateUser, isAdmin, createProduct);
router.put('/:id', authenticateUser, isAdmin, updateProduct);
router.delete('/:id', authenticateUser, isAdmin, deleteProduct);

export default router;