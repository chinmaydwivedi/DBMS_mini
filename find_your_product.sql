-- Find the product you just added
USE flipkart_ecommerce;

-- Show all products ordered by newest first
SELECT 
    product_id,
    product_name,
    product_status,
    is_featured,
    stock_quantity,
    (SELECT image_url FROM product_images WHERE product_id = products.product_id LIMIT 1) as has_image
FROM products 
ORDER BY product_id DESC 
LIMIT 20;

-- If you see your product but it's not showing:
-- 1. Make sure product_status = 'Active'
-- 2. Add an image if missing
-- 3. Set is_featured = TRUE to show on homepage
