import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get addresses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [addresses] = await db.execute(
      `SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses', message: error.message });
  }
});

// Get single address by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [addresses] = await db.execute(
      'SELECT * FROM user_addresses WHERE address_id = ?',
      [id]
    );

    if (addresses.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(addresses[0]);
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Failed to fetch address', message: error.message });
  }
});

// Create new address
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      address_type,
      full_name,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country = 'India',
      is_default = false
    } = req.body;

    if (!user_id || !full_name || !phone_number || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await db.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [user_id]
      );
    }

    const [result] = await db.execute(
      `INSERT INTO user_addresses 
       (user_id, address_type, full_name, phone_number, address_line1, address_line2, 
        city, state, pincode, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, address_type, full_name, phone_number, address_line1, address_line2 || '', 
       city, state, pincode, country, is_default]
    );

    res.status(201).json({
      address_id: result.insertId,
      message: 'Address created successfully'
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Failed to create address', message: error.message });
  }
});

// Update address
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address_type,
      full_name,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      is_default
    } = req.body;

    // Get the address to find user_id
    const [addresses] = await db.execute(
      'SELECT user_id FROM user_addresses WHERE address_id = ?',
      [id]
    );

    if (addresses.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await db.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [addresses[0].user_id]
      );
    }

    await db.execute(
      `UPDATE user_addresses 
       SET address_type = ?, full_name = ?, phone_number = ?, 
           address_line1 = ?, address_line2 = ?, city = ?, state = ?, 
           pincode = ?, country = ?, is_default = ?, updated_at = NOW()
       WHERE address_id = ?`,
      [address_type, full_name, phone_number, address_line1, address_line2 || '', 
       city, state, pincode, country, is_default, id]
    );

    res.json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address', message: error.message });
  }
});

// Delete address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM user_addresses WHERE address_id = ?', [id]);

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address', message: error.message });
  }
});

// Set address as default
router.put('/:id/set-default', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the address to find user_id
    const [addresses] = await db.execute(
      'SELECT user_id FROM user_addresses WHERE address_id = ?',
      [id]
    );

    if (addresses.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Unset all defaults for this user
    await db.execute(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
      [addresses[0].user_id]
    );

    // Set this one as default
    await db.execute(
      'UPDATE user_addresses SET is_default = TRUE WHERE address_id = ?',
      [id]
    );

    res.json({ message: 'Default address updated successfully' });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Failed to set default address', message: error.message });
  }
});

export default router;

