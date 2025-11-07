import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get cart for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get or create cart
    let [carts] = await db.execute('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
    let cartId;

    if (carts.length === 0) {
      const [result] = await db.execute('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cartId = result.insertId;
    } else {
      cartId = carts[0].cart_id;
    }

    // Get cart items
    const query = `
      SELECT 
        ci.cart_item_id,
        ci.product_id,
        ci.quantity,
        ci.price_at_addition,
        p.product_name,
        p.brand,
        p.selling_price as current_price,
        p.stock_quantity,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = ?
    `;

    const [items] = await db.execute(query, [cartId]);

    const cartItems = items.map(item => ({
      ...item,
      image: item.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`,
      inStock: item.stock_quantity > 0,
      total: item.quantity * item.price_at_addition
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    res.json({
      cart_id: cartId,
      items: cartItems,
      subtotal,
      item_count: cartItems.length
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart', message: error.message });
  }
});

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { product_id, quantity = 1 } = req.body;

    // Get or create cart
    let [carts] = await db.execute('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
    let cartId;

    if (carts.length === 0) {
      const [result] = await db.execute('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cartId = result.insertId;
    } else {
      cartId = carts[0].cart_id;
    }

    // Get product price
    const [products] = await db.execute('SELECT selling_price, stock_quantity FROM products WHERE product_id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (products[0].stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const price = products[0].selling_price;

    // Check if item already in cart
    const [existing] = await db.execute(
      'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    if (existing.length > 0) {
      // Update quantity
      await db.execute(
        'UPDATE cart_items SET quantity = quantity + ?, price_at_addition = ? WHERE cart_item_id = ?',
        [quantity, price, existing[0].cart_item_id]
      );
    } else {
      // Add new item
      await db.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
        [cartId, product_id, quantity, price]
      );
    }

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart', message: error.message });
  }
});

// Update cart item quantity
router.put('/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart_item_id, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Get cart item
    const [items] = await db.execute(
      'SELECT ci.*, p.stock_quantity FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.cart_item_id = ?',
      [cart_item_id]
    );

    if (items.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (items[0].stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.execute('UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?', [quantity, cart_item_id]);

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart', message: error.message });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    await db.execute('DELETE FROM cart_items WHERE cart_item_id = ?', [itemId]);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart', message: error.message });
  }
});

// Clear cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const { userId } = req.params;

    const [carts] = await db.execute('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].cart_id]);

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart', message: error.message });
  }
});

export default router;

