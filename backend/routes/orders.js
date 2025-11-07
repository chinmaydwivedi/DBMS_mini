import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT 
        o.order_id,
        o.order_number,
        o.total_amount,
        o.order_status,
        o.payment_mode,
        o.created_at,
        d.delivery_status,
        d.estimated_delivery_date,
        d.tracking_number,
        COUNT(oi.order_item_id) as item_count
      FROM orders o
      LEFT JOIN delivery d ON o.order_id = d.order_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.user_id = ?
    `;

    const params = [userId];

    if (status) {
      query += ' AND o.order_status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.order_id ORDER BY o.created_at DESC';

    const [orders] = await db.execute(query, params);

    // Get order items for each order
    for (let order of orders) {
      const itemsQuery = `
        SELECT 
          oi.*,
          p.product_name,
          p.brand,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `;
      const [items] = await db.execute(itemsQuery, [order.order_id]);
      order.items = items.map(item => ({
        ...item,
        image: item.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
      }));
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orderQuery = `
      SELECT 
        o.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        d.delivery_status,
        d.estimated_delivery_date,
        d.tracking_number,
        d.courier_partner
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN delivery d ON o.order_id = d.order_id
      WHERE o.order_id = ?
    `;

    const [orders] = await db.execute(orderQuery, [id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    const itemsQuery = `
      SELECT 
        oi.*,
        p.product_name,
        p.brand,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `;

    const [items] = await db.execute(itemsQuery, [id]);
    order.items = items.map(item => ({
      ...item,
      image: item.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
    }));

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
});

// Create new order using stored procedure
router.post('/', async (req, res) => {
  try {
    const { user_id, shipping_address_id, billing_address_id, payment_mode, coupon_code } = req.body;

    // Call stored procedure
    const [result] = await db.execute(
      'CALL place_order(?, ?, ?, ?, ?)',
      [user_id, shipping_address_id, billing_address_id, payment_mode, coupon_code || null]
    );

    if (result[0] && result[0].length > 0) {
      res.status(201).json({
        order_id: result[0][0].order_id,
        total_amount: result[0][0].total_amount,
        message: 'Order placed successfully'
      });
    } else {
      res.status(400).json({ error: 'Failed to place order' });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

export default router;

