import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        loyalty_points,
        wallet_balance,
        account_status,
        created_at,
        get_loyalty_tier(loyalty_points) as loyalty_tier,
        get_user_total_spending(user_id) as total_spending
      FROM users
      WHERE user_id = ?
    `;

    const [users] = await db.execute(query, [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get membership info
    const [memberships] = await db.execute(
      `SELECT um.*, mp.plan_name, mp.plan_type, mp.discount_percentage, mp.free_delivery
       FROM user_membership um
       JOIN membership_plans mp ON um.plan_id = mp.plan_id
       WHERE um.user_id = ? AND um.membership_status = 'Active'`,
      [id]
    );

    const user = users[0];
    user.membership = memberships.length > 0 ? memberships[0] : null;

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        get_user_total_spending(?) as total_spending,
        u.loyalty_points,
        get_loyalty_tier(u.loyalty_points) as loyalty_tier,
        u.wallet_balance
      FROM users u
      LEFT JOIN orders o ON u.user_id = o.user_id AND o.order_status IN ('Delivered', 'Shipped')
      WHERE u.user_id = ?
      GROUP BY u.user_id
    `;

    const [stats] = await db.execute(query, [id, id]);

    if (stats.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats', message: error.message });
  }
});

export default router;

