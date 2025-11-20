import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get support tickets for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        ticket_id,
        ticket_number,
        subject,
        ticket_category as category,
        priority,
        ticket_status as status,
        created_at,
        updated_at
      FROM customer_support_tickets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const [tickets] = await db.execute(query, [userId]);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets', message: error.message });
  }
});

// Get single ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        cst.ticket_id,
        cst.ticket_number,
        cst.subject,
        cst.description,
        cst.ticket_category as category,
        cst.priority,
        cst.ticket_status as status,
        cst.resolution,
        cst.created_at,
        cst.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.email as user_email,
        u.phone_number,
        o.order_number,
        p.product_name
      FROM customer_support_tickets cst
      JOIN users u ON cst.user_id = u.user_id
      LEFT JOIN orders o ON cst.order_id = o.order_id
      LEFT JOIN products p ON cst.product_id = p.product_id
      WHERE cst.ticket_id = ?
    `;

    const [tickets] = await db.execute(query, [id]);

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(tickets[0]);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket', message: error.message });
  }
});

// Create support ticket
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      order_id,
      product_id,
      category,
      subject,
      description,
      priority = 'Medium'
    } = req.body;

    if (!user_id || !category || !subject || !description) {
      return res.status(400).json({ error: 'user_id, category, subject, and description are required' });
    }

    // Generate unique ticket number
    const ticketNumber = `TKT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const [result] = await db.execute(
      `INSERT INTO customer_support_tickets 
       (ticket_number, user_id, order_id, product_id, ticket_category, subject, description, priority, ticket_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
      [ticketNumber, user_id, order_id || null, product_id || null, category, subject, description, priority]
    );

    res.status(201).json({
      ticket_id: result.insertId,
      ticket_number: ticketNumber,
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket', message: error.message });
  }
});

// Update ticket status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Open', 'InProgress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      'UPDATE customer_support_tickets SET ticket_status = ?, updated_at = NOW() WHERE ticket_id = ?',
      [status, id]
    );

    res.json({ message: 'Ticket status updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket', message: error.message });
  }
});

// Add response to ticket
router.post('/:id/response', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ error: 'response is required' });
    }

    await db.execute(
      `UPDATE customer_support_tickets 
       SET resolution = ?, ticket_status = 'InProgress', updated_at = NOW()
       WHERE ticket_id = ?`,
      [response, id]
    );

    res.json({ message: 'Response added successfully' });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ error: 'Failed to add response', message: error.message });
  }
});

export default router;

