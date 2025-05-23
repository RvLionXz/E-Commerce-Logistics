import express from 'express';
import { 
  getDashboardStats, 
  checkAdminStatus 
} from '../controllers/adminController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected
router.get('/status', authenticateUser, checkAdminStatus);
router.get('/dashboard', authenticateUser, isAdmin, getDashboardStats);

export default router;