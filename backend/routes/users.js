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
        created_at
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

export default router;

