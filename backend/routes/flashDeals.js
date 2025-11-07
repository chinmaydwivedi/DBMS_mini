import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all active flash deals
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        fd.deal_id,
        fd.deal_name,
        fd.deal_description,
        fd.start_time,
        fd.end_time,
        fd.discount_type,
        fd.discount_value,
        fd.deal_status,
        fd.banner_image_url,
        fdp.product_id,
        fdp.deal_price,
        fdp.stock_allocated,
        fdp.stock_remaining,
        p.product_name,
        p.brand,
        p.selling_price as original_price,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image,
        p.average_rating,
        p.total_reviews
      FROM flash_deals fd
      JOIN flash_deal_products fdp ON fd.deal_id = fdp.deal_id
      JOIN products p ON fdp.product_id = p.product_id
      WHERE fd.deal_status IN ('Active', 'Scheduled')
        AND NOW() BETWEEN fd.start_time AND fd.end_time
        AND fdp.stock_remaining > 0
      ORDER BY fd.deal_id, fdp.product_id
    `;

    const [deals] = await db.execute(query);

    // Group deals by deal_id
    const dealsMap = {};
    deals.forEach(deal => {
      if (!dealsMap[deal.deal_id]) {
        dealsMap[deal.deal_id] = {
          deal_id: deal.deal_id,
          deal_name: deal.deal_name,
          deal_description: deal.deal_description,
          start_time: deal.start_time,
          end_time: deal.end_time,
          deal_status: deal.deal_status,
          banner_image_url: deal.banner_image_url,
          products: []
        };
      }

      const discount = deal.original_price > deal.deal_price
        ? Math.round(((deal.original_price - deal.deal_price) / deal.original_price) * 100)
        : 0;

      dealsMap[deal.deal_id].products.push({
        product_id: deal.product_id,
        name: deal.product_name,
        brand: deal.brand,
        price: deal.deal_price,
        originalPrice: deal.original_price,
        discount,
        image: deal.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&auto=format`,
        rating: deal.average_rating,
        reviews: deal.total_reviews,
        sold: deal.stock_allocated - deal.stock_remaining,
        total: deal.stock_allocated
      });
    });

    res.json(Object.values(dealsMap));
  } catch (error) {
    console.error('Error fetching flash deals:', error);
    res.status(500).json({ error: 'Failed to fetch flash deals', message: error.message });
  }
});

// Get single flash deal by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        fd.*,
        fdp.product_id,
        fdp.deal_price,
        fdp.stock_allocated,
        fdp.stock_remaining,
        p.product_name,
        p.brand,
        p.selling_price as original_price,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image,
        p.average_rating,
        p.total_reviews
      FROM flash_deals fd
      JOIN flash_deal_products fdp ON fd.deal_id = fdp.deal_id
      JOIN products p ON fdp.product_id = p.product_id
      WHERE fd.deal_id = ?
        AND fdp.stock_remaining > 0
    `;

    const [deals] = await db.execute(query, [id]);

    if (deals.length === 0) {
      return res.status(404).json({ error: 'Flash deal not found' });
    }

    const deal = {
      deal_id: deals[0].deal_id,
      deal_name: deals[0].deal_name,
      deal_description: deals[0].deal_description,
      start_time: deals[0].start_time,
      end_time: deals[0].end_time,
      deal_status: deals[0].deal_status,
      banner_image_url: deals[0].banner_image_url,
      products: deals.map(d => {
        const discount = d.original_price > d.deal_price
          ? Math.round(((d.original_price - d.deal_price) / d.original_price) * 100)
          : 0;

        return {
          product_id: d.product_id,
          name: d.product_name,
          brand: d.brand,
          price: d.deal_price,
          originalPrice: d.original_price,
          discount,
          image: d.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&auto=format`,
          rating: d.average_rating,
          reviews: d.total_reviews,
          sold: d.stock_allocated - d.stock_remaining,
          total: d.stock_allocated
        };
      })
    };

    res.json(deal);
  } catch (error) {
    console.error('Error fetching flash deal:', error);
    res.status(500).json({ error: 'Failed to fetch flash deal', message: error.message });
  }
});

export default router;

