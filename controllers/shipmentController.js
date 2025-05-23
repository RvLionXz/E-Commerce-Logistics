import pool from '../db.js';

// Get shipment by tracking code
export const getShipmentByTrackingCode = async (req, res) => {
  try {
    const trackingCode = req.params.trackingCode;
    
    const [shipments] = await pool.query(`
      SELECT s.*, o.status as order_status, o.created_at as order_date
      FROM shipments s
      JOIN orders o ON s.order_id = o.id
      WHERE s.tracking_code = ?
    `, [trackingCode]);
    
    if (shipments.length === 0) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const shipment = shipments[0];
    
    // Get order items
    const [orderItems] = await pool.query(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [shipment.order_id]);
    
    res.json({
      ...shipment,
      items: orderItems
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get shipment traces
export const getShipmentTraces = async (req, res) => {
  try {
    const trackingCode = req.params.trackingCode;
    
    const [shipments] = await pool.query(
      'SELECT id FROM shipments WHERE tracking_code = ?',
      [trackingCode]
    );
    
    if (shipments.length === 0) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const shipmentId = shipments[0].id;
    
    const [traces] = await pool.query(`
      SELECT *
      FROM shipment_traces
      WHERE shipment_id = ?
      ORDER BY updated_at DESC
    `, [shipmentId]);
    
    res.json(traces);
  } catch (error) {
    console.error('Get shipment traces error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create shipment trace (admin only)
export const createShipmentTrace = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const { status } = req.body;
    
    // Check if shipment exists
    const [shipments] = await pool.query('SELECT * FROM shipments WHERE id = ?', [shipmentId]);
    if (shipments.length === 0) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    // Create trace
    await pool.query(
      'INSERT INTO shipment_traces (shipment_id, status) VALUES (?, ?)',
      [shipmentId, status]
    );
    
    res.status(201).json({ message: 'Shipment trace created successfully' });
  } catch (error) {
    console.error('Create shipment trace error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all shipments (admin only)
export const getAllShipments = async (req, res) => {
  try {
    const [shipments] = await pool.query(`
      SELECT s.*, o.status as order_status, o.created_at as order_date, u.name as user_name
      FROM shipments s
      JOIN orders o ON s.order_id = o.id
      JOIN users u ON o.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    
    res.json(shipments);
  } catch (error) {
    console.error('Get all shipments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};