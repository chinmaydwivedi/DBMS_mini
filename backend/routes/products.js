import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category_id, brand, min_price, max_price, min_rating, search, sort = 'total_sales' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.brand,
        p.selling_price,
        p.original_price,
        p.discount_percentage,
        p.stock_quantity,
        p.average_rating,
        p.total_reviews,
        p.product_status,
        p.total_sales,
        p.is_featured,
        p.is_bestseller,
        pc.category_name,
        s.business_name as seller_name,
        s.seller_rating,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM products p
      LEFT JOIN product_category pc ON p.category_id = pc.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      WHERE p.product_status = 'Active'
    `;

    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (brand) {
      query += ' AND p.brand LIKE ?';
      params.push(`%${brand}%`);
    }

    if (min_price) {
      query += ' AND p.selling_price >= ?';
      params.push(min_price);
    }

    if (max_price) {
      query += ' AND p.selling_price <= ?';
      params.push(max_price);
    }

    if (min_rating) {
      query += ' AND p.average_rating >= ?';
      params.push(min_rating);
    }

    if (search) {
      query += ' AND (p.product_name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sorting
    const validSorts = ['total_sales', 'average_rating', 'selling_price', 'created_at'];
    const sortField = validSorts.includes(sort) ? sort : 'total_sales';
    const sortOrder = sort === 'selling_price' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortField} ${sortOrder} LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [products] = await db.execute(query, params);

    // Calculate discount and format data
    const productsWithDiscount = products.map(product => ({
      ...product,
      discount: product.discount_percentage || (product.original_price > product.selling_price
        ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
        : 0),
      inStock: product.stock_quantity > 0,
      image: product.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
    }));

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE p.product_status = 'Active'
    `;
    const countParams = [];

    if (category_id) {
      countQuery += ' AND p.category_id = ?';
      countParams.push(category_id);
    }

    if (brand) {
      countQuery += ' AND p.brand LIKE ?';
      countParams.push(`%${brand}%`);
    }

    if (min_price) {
      countQuery += ' AND p.selling_price >= ?';
      countParams.push(min_price);
    }

    if (max_price) {
      countQuery += ' AND p.selling_price <= ?';
      countParams.push(max_price);
    }

    if (min_rating) {
      countQuery += ' AND p.average_rating >= ?';
      countParams.push(min_rating);
    }

    if (search) {
      countQuery += ' AND (p.product_name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products: productsWithDiscount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.brand,
        p.selling_price,
        p.original_price,
        p.discount_percentage,
        p.stock_quantity,
        p.average_rating,
        p.total_reviews,
        p.product_status,
        p.is_featured,
        p.is_bestseller,
        pc.category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM products p
      LEFT JOIN product_category pc ON p.category_id = pc.category_id
      WHERE p.product_status = 'Active' AND (p.is_featured = TRUE OR p.is_bestseller = TRUE)
      ORDER BY p.total_sales DESC, p.average_rating DESC
      LIMIT 12
    `;

    const [products] = await db.execute(query);

    const productsWithDiscount = products.map(product => ({
      ...product,
      discount: product.discount_percentage || (product.original_price > product.selling_price
        ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
        : 0),
      inStock: product.stock_quantity > 0,
      image: product.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
    }));

    res.json(productsWithDiscount);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products', message: error.message });
  }
});

// Get bestseller products
router.get('/bestsellers', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.brand,
        p.selling_price,
        p.original_price,
        p.discount_percentage,
        p.stock_quantity,
        p.average_rating,
        p.total_reviews,
        p.total_sales,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND image_type = 'Primary' LIMIT 1) as product_image
      FROM products p
      WHERE p.product_status = 'Active' AND p.is_bestseller = TRUE
      ORDER BY p.total_sales DESC
      LIMIT 8
    `;

    const [products] = await db.execute(query);

    const productsWithDiscount = products.map(product => ({
      ...product,
      discount: product.discount_percentage || (product.original_price > product.selling_price
        ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
        : 0),
      inStock: product.stock_quantity > 0,
      image: product.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
    }));

    res.json(productsWithDiscount);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ error: 'Failed to fetch bestsellers', message: error.message });
  }
});

// Get top selling products using stored procedure
router.get('/top-selling', async (req, res) => {
  try {
    const { limit = 10, category_id = null } = req.query;

    const [result] = await db.execute(
      'CALL get_top_selling_products(?, ?)',
      [parseInt(limit), category_id]
    );

    if (result[0]) {
      const products = result[0].map(product => ({
        ...product,
        discount: product.discount_percentage || (product.original_price > product.selling_price
          ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
          : 0),
        inStock: product.stock_quantity > 0,
        image: product.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`
      }));

      res.json(products);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ error: 'Failed to fetch top selling products', message: error.message });
  }
});

// Update product price using stored procedure
router.put('/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { new_price } = req.body;

    if (!new_price || new_price <= 0) {
      return res.status(400).json({ error: 'Valid new_price is required' });
    }

    const [result] = await db.execute(
      'CALL update_product_price(?, ?)',
      [id, new_price]
    );

    if (result[0] && result[0].length > 0) {
      res.json({ message: result[0][0].message });
    } else {
      res.json({ message: 'Price updated successfully' });
    }
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ error: 'Failed to update price', message: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.*,
        pc.category_name,
        s.business_name as seller_name,
        s.seller_rating,
        s.verified_seller
      FROM products p
      LEFT JOIN product_category pc ON p.category_id = pc.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      WHERE p.product_id = ?
    `;

    const [products] = await db.execute(query, [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    // Get product images
    const [images] = await db.execute(
      'SELECT image_url, image_type, display_order FROM product_images WHERE product_id = ? ORDER BY display_order',
      [id]
    );

    product.images = images.map(img => img.image_url);
    product.primary_image = images.find(img => img.image_type === 'Primary')?.image_url || images[0]?.image_url || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&auto=format`;

    product.discount = product.discount_percentage || (product.original_price > product.selling_price
      ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
      : 0);
    product.inStock = product.stock_quantity > 0;

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
});

export default router;

