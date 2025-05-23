import pool from '../db.js';
import { generateTrackingCode } from '../utils/helpers.js';

// Create a new order from cart
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const userId = req.user.id;
    
    // Get cart items
    const [cartItems] = await connection.query(`
      SELECT c.id, c.product_id, c.quantity, p.price, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);
    
    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Not enough stock for product ID ${item.product_id}` 
        });
      }
    }
    
    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (total, item) => total + (parseFloat(item.price) * item.quantity), 
      0
    );
    
    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, totalAmount, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // Create order items
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      // Update product stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Generate tracking code
    const trackingCode = generateTrackingCode();
    
    // Create shipment
    await connection.query(
      'INSERT INTO shipments (order_id, tracking_code) VALUES (?, ?)',
      [orderId, trackingCode]
    );
    
    // Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    
    await connection.commit();
    
    res.status(201).json({
      orderId,
      trackingCode,
      totalAmount,
      message: 'Order created successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    // Get order details
    const [orders] = await pool.query(`
      SELECT o.*, s.tracking_code
      FROM orders o
      LEFT JOIN shipments s ON o.id = s.order_id
      WHERE o.id = ? AND o.user_id = ?
    `, [orderId, userId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [orderItems] = await pool.query(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    // Get shipment traces if available
    const [shipmentTraces] = await pool.query(`
      SELECT st.*
      FROM shipment_traces st
      JOIN shipments s ON st.shipment_id = s.id
      WHERE s.order_id = ?
      ORDER BY st.updated_at DESC
    `, [orderId]);
    
    res.json({
      ...order,
      items: orderItems,
      shipmentTraces
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [orders] = await pool.query(`
      SELECT o.*, s.tracking_code
      FROM orders o
      LEFT JOIN shipments s ON o.id = s.order_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Check if order exists
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    
    // If status is shipped, add a shipment trace
    if (status === 'shipped') {
      const [shipments] = await pool.query(
        'SELECT id FROM shipments WHERE order_id = ?',
        [orderId]
      );
      
      if (shipments.length > 0) {
        await pool.query(
          'INSERT INTO shipment_traces (shipment_id, status) VALUES (?, ?)',
          [shipments[0].id, 'Paket telah dikirim']
        );
      }
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email, s.tracking_code
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN shipments s ON o.id = s.order_id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};