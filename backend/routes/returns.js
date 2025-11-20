import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get returns for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        r.*,
        o.order_number,
        oi.product_name,
        oi.unit_price,
        p.product_id,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM returns r
      JOIN orders o ON r.order_id = o.order_id
      JOIN order_items oi ON r.order_item_id = oi.order_item_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;

    const [returns] = await db.execute(query, [userId]);

    const returnsWithImages = returns.map(ret => ({
      ...ret,
      image: ret.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
    }));

    res.json(returnsWithImages);
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ error: 'Failed to fetch returns', message: error.message });
  }
});

// Get single return by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        r.*,
        o.order_number,
        o.order_id,
        oi.product_name,
        oi.unit_price,
        oi.quantity as ordered_quantity,
        p.product_id,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM returns r
      JOIN orders o ON r.order_id = o.order_id
      JOIN order_items oi ON r.order_item_id = oi.order_item_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE r.return_id = ?
    `;

    const [returns] = await db.execute(query, [id]);

    if (returns.length === 0) {
      return res.status(404).json({ error: 'Return not found' });
    }

    const returnData = returns[0];
    returnData.image = returnData.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`;

    res.json(returnData);
  } catch (error) {
    console.error('Error fetching return:', error);
    res.status(500).json({ error: 'Failed to fetch return', message: error.message });
  }
});

// Create return request using stored procedure
router.post('/', async (req, res) => {
  try {
    const { order_item_id, return_reason, return_description } = req.body;

    if (!order_item_id || !return_reason) {
      return res.status(400).json({ error: 'order_item_id and return_reason are required' });
    }

    const [result] = await db.execute(
      'CALL process_return(?, ?, ?)',
      [order_item_id, return_reason, return_description || '']
    );

    if (result[0] && result[0].length > 0) {
      res.status(201).json({
        return_id: result[0][0].return_id,
        message: 'Return request created successfully'
      });
    } else {
      res.status(400).json({ error: 'Failed to create return request' });
    }
  } catch (error) {
    console.error('Error creating return:', error);
    res.status(500).json({ error: 'Failed to create return', message: error.message });
  }
});

// Update return status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Requested', 'Approved', 'Rejected', 'PickupScheduled', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      'UPDATE returns SET return_status = ?, updated_at = NOW() WHERE return_id = ?',
      [status, id]
    );

    res.json({ message: 'Return status updated successfully' });
  } catch (error) {
    console.error('Error updating return status:', error);
    res.status(500).json({ error: 'Failed to update return status', message: error.message });
  }
});

export default router;

