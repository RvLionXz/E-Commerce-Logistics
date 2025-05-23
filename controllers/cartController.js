import pool from '../db.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get cart items with product details
    const [cartItems] = await pool.query(`
      SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, (p.price * c.quantity) as total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);
    
    // Calculate cart total
    const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.total_price), 0);
    
    res.json({
      items: cartItems,
      total: cartTotal
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    // Check if product exists and has enough stock
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    
    // Check if item already in cart
    const [existingItems] = await pool.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if already in cart
      const newQuantity = existingItems[0].quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      
      await pool.query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
      
      res.json({ message: 'Cart updated successfully' });
    } else {
      // Add new item to cart
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      
      res.status(201).json({ message: 'Item added to cart successfully' });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;
    
    // Check if cart item exists and belongs to user
    const [cartItems] = await pool.query(
      'SELECT c.*, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?',
      [cartItemId, userId]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    const cartItem = cartItems[0];
    
    // Check if quantity is valid
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    
    // Check if quantity exceeds stock
    if (quantity > cartItem.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    
    // Update quantity
    await pool.query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, cartItemId]
    );
    
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    
    // Check if cart item exists and belongs to user
    const [cartItems] = await pool.query(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Remove item from cart
    await pool.query('DELETE FROM cart WHERE id = ?', [cartItemId]);
    
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Remove all items from user's cart
    await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};