import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all sellers
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.seller_id,
        s.business_name,
        s.business_email,
        s.business_phone,
        s.seller_rating,
        s.total_sales,
        s.commission_rate,
        s.account_status,
        COUNT(DISTINCT p.product_id) as product_count
      FROM sellers s
      LEFT JOIN products p ON s.seller_id = p.seller_id
      GROUP BY s.seller_id
      ORDER BY s.seller_rating DESC
    `;

    const [sellers] = await db.execute(query);
    res.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Failed to fetch sellers', message: error.message });
  }
});

// Get seller by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [sellers] = await db.execute(
      `SELECT s.*, sbd.* 
       FROM sellers s
       LEFT JOIN seller_bank_details sbd ON s.seller_id = sbd.seller_id
       WHERE s.seller_id = ?`,
      [id]
    );

    if (sellers.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Get seller products
    const [products] = await db.execute(
      `SELECT product_id, product_name, selling_price, stock_quantity, total_sales, average_rating
       FROM products
       WHERE seller_id = ?`,
      [id]
    );

    const seller = sellers[0];
    seller.products = products;

    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ error: 'Failed to fetch seller', message: error.message });
  }
});

// Calculate seller commission using stored procedure
router.get('/:id/commission', async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const [result] = await db.execute(
      'CALL calculate_seller_commission(?, ?, ?)',
      [id, start_date, end_date]
    );

    if (result[0] && result[0].length > 0) {
      res.json(result[0][0]);
    } else {
      res.json({ 
        seller_id: id, 
        total_sales: 0, 
        commission_amount: 0 
      });
    }
  } catch (error) {
    console.error('Error calculating commission:', error);
    res.status(500).json({ error: 'Failed to calculate commission', message: error.message });
  }
});

// Get top selling products for a seller
router.get('/:id/top-products', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit || 10;

    const [products] = await db.execute(
      `SELECT 
        p.product_id,
        p.product_name,
        p.brand,
        p.selling_price,
        p.total_sales,
        p.average_rating,
        p.stock_quantity,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as image_url
       FROM products p
       WHERE p.seller_id = ? AND p.product_status = 'Active'
       ORDER BY p.total_sales DESC
       LIMIT ?`,
      [id, parseInt(limit)]
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products', message: error.message });
  }
});

export default router;

