import express from 'express';
import { 
  getShipmentByTrackingCode, 
  createShipmentTrace, 
  getShipmentTraces,
  getAllShipments
} from '../controllers/shipmentController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for tracking
router.get('/track/:trackingCode', getShipmentByTrackingCode);
router.get('/track/:trackingCode/traces', getShipmentTraces);

// Admin routes
router.get('/', authenticateUser, isAdmin, getAllShipments);
router.post('/:id/trace', authenticateUser, isAdmin, createShipmentTrace);

export default router;