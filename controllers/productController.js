import pool from '../db.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      stock,
      image_url,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock, image_url } = req.body;
    
    // Check if product exists
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [name, description, price, stock, image_url, productId]
    );
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};