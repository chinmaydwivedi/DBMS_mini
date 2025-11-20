import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all orders (Admin view)
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const limit = parseInt(req.query.limit) || 50;

    let query = `
      SELECT 
        o.order_id,
        o.order_number,
        o.user_id,
        o.total_amount,
        o.order_status,
        o.payment_mode,
        o.created_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        d.delivery_status,
        d.tracking_number,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN delivery d ON o.order_id = d.order_id
    `;

    const params = [];
    
    if (status) {
      query += ' WHERE o.order_status = ?';
      params.push(status);
    }
    
    query += ` ORDER BY o.created_at DESC LIMIT ${limit}`;

    const [orders] = await db.execute(query, params);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

// Update order status
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update order status
    const updateFields = ['order_status = ?'];
    const params = [status];

    if (status === 'Confirmed') {
      updateFields.push('confirmed_at = NOW()');
    } else if (status === 'Shipped') {
      updateFields.push('shipped_at = NOW()');
    } else if (status === 'Delivered') {
      updateFields.push('delivered_at = NOW()');
    } else if (status === 'Cancelled') {
      updateFields.push('cancelled_at = NOW()');
    }

    if (notes) {
      updateFields.push('order_notes = ?');
      params.push(notes);
    }

    params.push(orderId);

    await db.execute(
      `UPDATE orders SET ${updateFields.join(', ')}, updated_at = NOW() WHERE order_id = ?`,
      params
    );

    // Update order items status
    const itemStatus = status === 'Delivered' ? 'Delivered' : 
                       status === 'Shipped' ? 'Shipped' : 
                       status === 'Confirmed' ? 'Confirmed' : 'Pending';
    
    await db.execute(
      'UPDATE order_items SET item_status = ? WHERE order_id = ?',
      [itemStatus, orderId]
    );

    // Update delivery status if exists
    if (status === 'Shipped') {
      await db.execute(
        'UPDATE delivery SET delivery_status = ?, shipped_date = NOW() WHERE order_id = ?',
        ['InTransit', orderId]
      );
    } else if (status === 'Delivered') {
      await db.execute(
        'UPDATE delivery SET delivery_status = ?, actual_delivery_date = CURDATE() WHERE order_id = ?',
        ['Delivered', orderId]
      );
    }

    res.json({ message: 'Order status updated successfully', status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', message: error.message });
  }
});

// Update delivery tracking
router.put('/orders/:orderId/delivery', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tracking_number, courier_partner, delivery_status, estimated_delivery_date } = req.body;

    // Check if delivery record exists
    const [deliveries] = await db.execute('SELECT delivery_id FROM delivery WHERE order_id = ?', [orderId]);

    if (deliveries.length === 0) {
      // Create delivery record
      await db.execute(
        `INSERT INTO delivery (order_id, tracking_number, courier_partner, delivery_status, estimated_delivery_date)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, tracking_number, courier_partner, delivery_status || 'Pending', estimated_delivery_date]
      );
    } else {
      // Update existing delivery record
      const updates = [];
      const params = [];

      if (tracking_number) {
        updates.push('tracking_number = ?');
        params.push(tracking_number);
      }
      if (courier_partner) {
        updates.push('courier_partner = ?');
        params.push(courier_partner);
      }
      if (delivery_status) {
        updates.push('delivery_status = ?');
        params.push(delivery_status);
        
        if (delivery_status === 'OutForDelivery') {
          updates.push('out_for_delivery_date = NOW()');
        } else if (delivery_status === 'Delivered') {
          updates.push('actual_delivery_date = CURDATE()');
        }
      }
      if (estimated_delivery_date) {
        updates.push('estimated_delivery_date = ?');
        params.push(estimated_delivery_date);
      }

      params.push(orderId);

      if (updates.length > 0) {
        await db.execute(
          `UPDATE delivery SET ${updates.join(', ')}, updated_at = NOW() WHERE order_id = ?`,
          params
        );
      }
    }

    res.json({ message: 'Delivery information updated successfully' });
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery', message: error.message });
  }
});

// Confirm and process pending orders automatically
router.post('/orders/:orderId/confirm', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order details
    const [orders] = await db.execute('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Create payment record for Prepaid orders
    if (order.payment_mode === 'Prepaid' && !order.payment_id) {
      const transactionId = `TXN${Date.now()}${orderId}`;
      const [paymentResult] = await db.execute(
        `INSERT INTO payment (user_id, transaction_id, payment_method, amount, payment_status, payment_date)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [order.user_id, transactionId, 'UPI', order.total_amount, 'Success']
      );

      await db.execute(
        'UPDATE orders SET payment_id = ? WHERE order_id = ?',
        [paymentResult.insertId, orderId]
      );
    }

    // Confirm order
    await db.execute(
      'UPDATE orders SET order_status = ?, confirmed_at = NOW() WHERE order_id = ?',
      ['Confirmed', orderId]
    );

    // Update order items
    await db.execute(
      'UPDATE order_items SET item_status = ? WHERE order_id = ?',
      ['Confirmed', orderId]
    );

    // Create delivery record with tracking
    const trackingNumber = `TRK${Date.now()}${orderId}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days delivery

    await db.execute(
      `INSERT INTO delivery (order_id, tracking_number, courier_partner, shipping_method, estimated_delivery_date, delivery_status)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE tracking_number = VALUES(tracking_number), courier_partner = VALUES(courier_partner)`,
      [orderId, trackingNumber, 'BlueDart', 'Standard', estimatedDelivery.toISOString().split('T')[0], 'Pending']
    );

    res.json({ 
      message: 'Order confirmed successfully',
      tracking_number: trackingNumber,
      estimated_delivery: estimatedDelivery.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'Failed to confirm order', message: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [stats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM orders WHERE order_status = 'Pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'Confirmed') as confirmed_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'Shipped') as shipped_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'Delivered') as delivered_orders,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as today_orders,
        (SELECT IFNULL(SUM(total_amount), 0) FROM orders WHERE order_status IN ('Confirmed', 'Shipped', 'Delivered')) as total_revenue,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as new_users_week,
        (SELECT COUNT(*) FROM products WHERE stock_quantity < low_stock_threshold) as low_stock_products,
        (SELECT COUNT(*) FROM user_membership WHERE membership_status = 'Active') as active_memberships,
        (SELECT COUNT(*) FROM user_membership WHERE end_date < CURDATE() AND membership_status = 'Active') as expired_memberships
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// Get all memberships
router.get('/memberships', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    let query = `
      SELECT 
        um.membership_id,
        um.user_id,
        um.plan_id,
        um.start_date,
        um.end_date,
        um.auto_renewal,
        um.membership_status,
        um.payment_method,
        um.amount_paid,
        um.created_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        mp.plan_name,
        mp.plan_type,
        mp.monthly_price,
        mp.annual_price,
        DATEDIFF(um.end_date, CURDATE()) as days_remaining,
        CASE 
          WHEN um.amount_paid = mp.monthly_price THEN 'Monthly'
          WHEN um.amount_paid = mp.annual_price THEN 'Yearly'
          ELSE 'Custom'
        END as billing_cycle
      FROM user_membership um
      JOIN users u ON um.user_id = u.user_id
      JOIN membership_plans mp ON um.plan_id = mp.plan_id
    `;

    const params = [];
    
    if (status) {
      query += ' WHERE um.membership_status = ?';
      params.push(status);
    }
    
    query += ` ORDER BY um.created_at DESC LIMIT ${parseInt(limit)}`;

    const [memberships] = await db.execute(query, params);
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Failed to fetch memberships', message: error.message });
  }
});

// Update membership status
router.put('/memberships/:membershipId/status', async (req, res) => {
  try {
    const { membershipId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Active', 'Expired', 'Cancelled', 'Suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      'UPDATE user_membership SET membership_status = ?, updated_at = NOW() WHERE membership_id = ?',
      [status, membershipId]
    );

    res.json({ message: 'Membership status updated successfully', status });
  } catch (error) {
    console.error('Error updating membership status:', error);
    res.status(500).json({ error: 'Failed to update membership status', message: error.message });
  }
});

// Extend membership
router.put('/memberships/:membershipId/extend', async (req, res) => {
  try {
    const { membershipId } = req.params;
    const { days } = req.body;

    if (!days || days <= 0) {
      return res.status(400).json({ error: 'Valid number of days is required' });
    }

    await db.execute(
      'UPDATE user_membership SET end_date = DATE_ADD(end_date, INTERVAL ? DAY), updated_at = NOW() WHERE membership_id = ?',
      [days, membershipId]
    );

    res.json({ message: `Membership extended by ${days} days` });
  } catch (error) {
    console.error('Error extending membership:', error);
    res.status(500).json({ error: 'Failed to extend membership', message: error.message });
  }
});

// Verify/Approve membership (for manual verification scenarios)
router.post('/memberships/:membershipId/verify', async (req, res) => {
  try {
    const { membershipId } = req.params;

    // Get membership details
    const [memberships] = await db.execute(
      'SELECT * FROM user_membership WHERE membership_id = ?',
      [membershipId]
    );

    if (memberships.length === 0) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    // Mark as Active and verified
    await db.execute(
      'UPDATE user_membership SET membership_status = ?, updated_at = NOW() WHERE membership_id = ?',
      ['Active', membershipId]
    );

    res.json({ message: 'Membership verified and activated successfully' });
  } catch (error) {
    console.error('Error verifying membership:', error);
    res.status(500).json({ error: 'Failed to verify membership', message: error.message });
  }
});

// Get membership statistics
router.get('/memberships/stats', async (req, res) => {
  try {
    const [stats] = await db.execute(`
      SELECT 
        mp.plan_name,
        mp.plan_type,
        COUNT(um.membership_id) as total_subscribers,
        COUNT(CASE WHEN um.membership_status = 'Active' THEN 1 END) as active_subscribers,
        IFNULL(SUM(um.amount_paid), 0) as total_revenue
      FROM membership_plans mp
      LEFT JOIN user_membership um ON mp.plan_id = um.plan_id
      GROUP BY mp.plan_id, mp.plan_name, mp.plan_type
      ORDER BY total_subscribers DESC
    `);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching membership stats:', error);
    res.status(500).json({ error: 'Failed to fetch membership stats', message: error.message });
  }
});

export default router;

