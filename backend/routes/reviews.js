import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const query = `
      SELECT 
        r.review_id,
        r.rating,
        r.review_title,
        r.review_text,
        r.is_verified_purchase,
        r.helpful_count,
        r.created_at,
        u.first_name,
        u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = ? AND r.review_status = 'Approved'
      ORDER BY r.created_at DESC
    `;

    const [reviews] = await db.execute(query, [productId]);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
});

// Add review
router.post('/', async (req, res) => {
  try {
    const { product_id, user_id, rating, review_title, review_text, order_id } = req.body;

    await db.execute(
      'INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_id, user_id, order_id || null, rating, review_title, review_text, 'Pending']
    );

    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review', message: error.message });
  }
});

export default router;

