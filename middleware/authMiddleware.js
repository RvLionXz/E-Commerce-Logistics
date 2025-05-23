import pool from '../db.js';

// Authenticate user
export const authenticateUser = async (req, res, next) => {
  try {
    // In a real application, you would use JWT or sessions
    // For simplicity, we'll use a user ID in the header
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    
    // Set user in request
    req.user = users[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Check if user is admin
    const [admins] = await pool.query('SELECT * FROM admins WHERE user_id = ?', [userId]);
    
    if (admins.length === 0) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};