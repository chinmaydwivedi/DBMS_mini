import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all active coupons
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        coupon_id,
        coupon_code,
        coupon_name,
        description,
        discount_type,
        discount_value,
        max_discount_amount,
        min_order_amount,
        start_date,
        end_date,
        coupon_type
      FROM coupons
      WHERE is_active = TRUE 
        AND NOW() BETWEEN start_date AND end_date
        AND (usage_limit IS NULL OR usage_count < usage_limit)
      ORDER BY discount_value DESC
    `;

    const [coupons] = await db.execute(query);

    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons', message: error.message });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { coupon_code, user_id, subtotal } = req.body;

    const query = `
      SELECT 
        coupon_id,
        coupon_code,
        discount_type,
        discount_value,
        max_discount_amount,
        min_order_amount,
        usage_limit,
        usage_count,
        usage_limit_per_user
      FROM coupons
      WHERE coupon_code = ?
        AND is_active = TRUE
        AND NOW() BETWEEN start_date AND end_date
    `;

    const [coupons] = await db.execute(query, [coupon_code]);

    if (coupons.length === 0) {
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    const coupon = coupons[0];

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    // Check min order amount
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return res.status(400).json({ 
        error: `Minimum order amount of ₹${coupon.min_order_amount} required` 
      });
    }

    // Check user usage limit
    if (user_id && coupon.usage_limit_per_user) {
      const [usage] = await db.execute(
        'SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?',
        [coupon.coupon_id, user_id]
      );
      if (usage[0].count >= coupon.usage_limit_per_user) {
        return res.status(400).json({ error: 'You have already used this coupon' });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'Percentage') {
      discount = subtotal * (coupon.discount_value / 100);
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    } else if (coupon.discount_type === 'FixedAmount') {
      discount = coupon.discount_value;
    }

    res.json({
      valid: true,
      discount,
      coupon_code: coupon.coupon_code,
      coupon_name: coupon.coupon_name
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Failed to validate coupon', message: error.message });
  }
});

export default router;

