import express from 'express';
import db from '../db.js';

const router = express.Router();

// Icon mapping for categories
const categoryIcons = {
  'Mobile Phones': 'Smartphone',
  'Laptops': 'Laptop',
  'Fashion': 'Shirt',
  'Home & Kitchen': 'Home',
  'Books': 'Book',
  'Watches': 'Watch',
  'Audio': 'Headphones',
  'Cameras': 'Camera',
  'Electronics': 'Cpu',
  'Men Fashion': 'Shirt',
  'Women Fashion': 'Shirt'
};

const categoryColors = {
  'Mobile Phones': 'from-blue-500 to-blue-600',
  'Laptops': 'from-purple-500 to-purple-600',
  'Fashion': 'from-pink-500 to-pink-600',
  'Home & Kitchen': 'from-green-500 to-green-600',
  'Books': 'from-amber-500 to-amber-600',
  'Watches': 'from-cyan-500 to-cyan-600',
  'Audio': 'from-indigo-500 to-indigo-600',
  'Cameras': 'from-rose-500 to-rose-600',
  'Electronics': 'from-blue-500 to-indigo-600',
  'Men Fashion': 'from-blue-500 to-cyan-600',
  'Women Fashion': 'from-pink-500 to-rose-600'
};

// Get all categories
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        pc.category_id,
        pc.category_name,
        pc.category_description,
        pc.category_image_url,
        COUNT(DISTINCT p.product_id) as product_count
      FROM product_category pc
      LEFT JOIN products p ON pc.category_id = p.category_id AND p.product_status = 'Active'
      WHERE pc.is_active = TRUE
      GROUP BY pc.category_id, pc.category_name, pc.category_description, pc.category_image_url
      ORDER BY product_count DESC, pc.category_name
    `;

    const [categories] = await db.execute(query);

    const categoriesWithMetadata = categories.map(category => ({
      ...category,
      icon: categoryIcons[category.category_name] || 'Package',
      color: categoryColors[category.category_name] || 'from-gray-500 to-gray-600'
    }));

    res.json(categoriesWithMetadata);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        pc.*,
        COUNT(DISTINCT p.product_id) as product_count
      FROM product_category pc
      LEFT JOIN products p ON pc.category_id = p.category_id AND p.product_status = 'Active'
      WHERE pc.category_id = ?
      GROUP BY pc.category_id
    `;

    const [categories] = await db.execute(query, [id]);

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = categories[0];
    category.icon = categoryIcons[category.category_name] || 'Package';
    category.color = categoryColors[category.category_name] || 'from-gray-500 to-gray-600';

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category', message: error.message });
  }
});

export default router;

