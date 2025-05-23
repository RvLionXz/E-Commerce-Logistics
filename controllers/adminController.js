import pool from '../db.js';

// Check if user is admin
export const checkAdminStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [admins] = await pool.query('SELECT * FROM admins WHERE user_id = ?', [userId]);
    const isAdmin = admins.length > 0;
    
    res.json({ isAdmin });
  } catch (error) {
    console.error('Check admin status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard statistics (admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const [userResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const totalUsers = userResult[0].total;
    
    // Get total products
    const [productResult] = await pool.query('SELECT COUNT(*) as total FROM products');
    const totalProducts = productResult[0].total;
    
    // Get total orders
    const [orderResult] = await pool.query('SELECT COUNT(*) as total FROM orders');
    const totalOrders = orderResult[0].total;
    
    // Get total revenue
    const [revenueResult] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status != "pending"');
    const totalRevenue = revenueResult[0].total || 0;
    
    // Get recent orders
    const [recentOrders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    
    // Get low stock products
    const [lowStockProducts] = await pool.query('SELECT * FROM products WHERE stock < 10');
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};