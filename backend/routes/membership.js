import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all membership plans
router.get('/plans', async (req, res) => {
  try {
    const query = `
      SELECT 
        plan_id,
        plan_name,
        plan_type,
        plan_description,
        monthly_price,
        annual_price,
        discount_percentage,
        free_delivery,
        priority_support,
        early_sale_access,
        cashback_percentage,
        max_cashback_per_order,
        warranty_extension_months,
        is_active
      FROM membership_plans
      WHERE is_active = TRUE
      ORDER BY 
        CASE plan_type
          WHEN 'Free' THEN 1
          WHEN 'Silver' THEN 2
          WHEN 'Gold' THEN 3
          WHEN 'Platinum' THEN 4
        END
    `;

    const [plans] = await db.execute(query);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    res.status(500).json({ error: 'Failed to fetch membership plans', message: error.message });
  }
});

// Get user's membership
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        um.*,
        mp.plan_name,
        mp.plan_type,
        mp.plan_description,
        mp.discount_percentage,
        mp.free_delivery,
        mp.priority_support,
        mp.early_sale_access,
        mp.cashback_percentage,
        mp.max_cashback_per_order,
        mp.warranty_extension_months
      FROM user_membership um
      JOIN membership_plans mp ON um.plan_id = mp.plan_id
      WHERE um.user_id = ? AND um.membership_status = 'Active'
      ORDER BY um.start_date DESC
      LIMIT 1
    `;

    const [memberships] = await db.execute(query, [userId]);

    if (memberships.length === 0) {
      return res.json({ membership: null, message: 'No active membership found' });
    }

    res.json(memberships[0]);
  } catch (error) {
    console.error('Error fetching user membership:', error);
    res.status(500).json({ error: 'Failed to fetch user membership', message: error.message });
  }
});

// Subscribe to a membership plan
router.post('/subscribe', async (req, res) => {
  try {
    const { user_id, plan_id, billing_cycle } = req.body;

    if (!user_id || !plan_id || !billing_cycle) {
      return res.status(400).json({ error: 'user_id, plan_id, and billing_cycle are required' });
    }

    // Get plan details
    const [plans] = await db.execute(
      'SELECT * FROM membership_plans WHERE plan_id = ? AND is_active = TRUE',
      [plan_id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ error: 'Membership plan not found' });
    }

    const plan = plans[0];
    const amount = billing_cycle === 'Monthly' ? plan.monthly_price : plan.annual_price;
    const duration = billing_cycle === 'Monthly' ? 30 : 365;

    // Check if user already has ANY membership (Active, Cancelled, Expired, etc.)
    const [existing] = await db.execute(
      'SELECT membership_id, membership_status FROM user_membership WHERE user_id = ?',
      [user_id]
    );

    if (existing.length > 0) {
      // Update existing membership (reactivate or upgrade)
      const oldStatus = existing[0].membership_status;
      await db.execute(
        `UPDATE user_membership 
         SET plan_id = ?, amount_paid = ?, start_date = CURDATE(), end_date = DATE_ADD(CURDATE(), INTERVAL ? DAY), 
             membership_status = 'Active', payment_method = 'Online', updated_at = NOW()
         WHERE membership_id = ?`,
        [plan_id, amount, duration, existing[0].membership_id]
      );

      const message = oldStatus === 'Active' 
        ? 'Membership upgraded successfully!' 
        : 'Membership reactivated successfully!';

      res.json({ 
        membership_id: existing[0].membership_id,
        message: message,
        amount
      });
    } else {
      // Create new membership (first time subscriber)
      const [result] = await db.execute(
        `INSERT INTO user_membership (user_id, plan_id, start_date, end_date, amount_paid, membership_status, payment_method)
         VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, 'Active', 'Online')`,
        [user_id, plan_id, duration, amount]
      );

      res.status(201).json({ 
        membership_id: result.insertId,
        message: 'Membership activated successfully!',
        amount,
        billing_cycle
      });
    }
  } catch (error) {
    console.error('Error subscribing to membership:', error);
    res.status(500).json({ error: 'Failed to subscribe', message: error.message });
  }
});

// Cancel membership
router.put('/cancel/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await db.execute(
      `UPDATE user_membership 
       SET membership_status = 'Cancelled', updated_at = NOW()
       WHERE user_id = ? AND membership_status = 'Active'`,
      [userId]
    );

    res.json({ message: 'Membership cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling membership:', error);
    res.status(500).json({ error: 'Failed to cancel membership', message: error.message });
  }
});

// Get membership benefits
router.get('/benefits/:planId', async (req, res) => {
  try {
    const { planId } = req.params;

    const [benefits] = await db.execute(
      'SELECT * FROM membership_benefits WHERE plan_id = ?',
      [planId]
    );

    res.json(benefits);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    res.status(500).json({ error: 'Failed to fetch benefits', message: error.message });
  }
});

export default router;

