import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get wishlist for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get or create wishlist
    let [wishlists] = await db.execute('SELECT wishlist_id FROM wishlist WHERE user_id = ?', [userId]);
    let wishlistId;

    if (wishlists.length === 0) {
      const [result] = await db.execute('INSERT INTO wishlist (user_id) VALUES (?)', [userId]);
      wishlistId = result.insertId;
    } else {
      wishlistId = wishlists[0].wishlist_id;
    }

    // Get wishlist items
    const query = `
      SELECT 
        wi.wishlist_item_id,
        wi.product_id,
        wi.added_at,
        p.product_name,
        p.brand,
        p.selling_price,
        p.original_price,
        p.discount_percentage,
        p.stock_quantity,
        p.average_rating,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM wishlist_items wi
      JOIN products p ON wi.product_id = p.product_id
      WHERE wi.wishlist_id = ?
      ORDER BY wi.added_at DESC
    `;

    const [items] = await db.execute(query, [wishlistId]);

    const wishlistItems = items.map(item => ({
      ...item,
      image: item.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`,
      inStock: item.stock_quantity > 0,
      discount: item.discount_percentage || (item.original_price > item.selling_price
        ? Math.round(((item.original_price - item.selling_price) / item.original_price) * 100)
        : 0)
    }));

    res.json({
      wishlist_id: wishlistId,
      items: wishlistItems,
      item_count: wishlistItems.length
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist', message: error.message });
  }
});

// Add item to wishlist
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { product_id } = req.body;

    // Get or create wishlist
    let [wishlists] = await db.execute('SELECT wishlist_id FROM wishlist WHERE user_id = ?', [userId]);
    let wishlistId;

    if (wishlists.length === 0) {
      const [result] = await db.execute('INSERT INTO wishlist (user_id) VALUES (?)', [userId]);
      wishlistId = result.insertId;
    } else {
      wishlistId = wishlists[0].wishlist_id;
    }

    // Check if product exists
    const [products] = await db.execute('SELECT product_id FROM products WHERE product_id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in wishlist
    const [existing] = await db.execute(
      'SELECT wishlist_item_id FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?',
      [wishlistId, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Add to wishlist
    await db.execute(
      'INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)',
      [wishlistId, product_id]
    );

    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist', message: error.message });
  }
});

// Remove item from wishlist
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const [wishlists] = await db.execute('SELECT wishlist_id FROM wishlist WHERE user_id = ?', [userId]);
    if (wishlists.length === 0) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    await db.execute(
      'DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?',
      [wishlists[0].wishlist_id, productId]
    );

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist', message: error.message });
  }
});

export default router;

