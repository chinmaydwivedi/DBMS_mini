-- ============================================
-- QUICK FIX: Make Your Product Show on Website
-- ============================================

USE flipkart_ecommerce;

-- STEP 1: Check what you added (replace YOUR_PRODUCT_ID with actual ID)
-- SELECT * FROM products WHERE product_id = YOUR_PRODUCT_ID;

-- STEP 2: Fix common issues

-- Issue 1: Product status is not 'Active'
-- SOLUTION: Set status to Active
UPDATE products 
SET product_status = 'Active' 
WHERE product_id = YOUR_PRODUCT_ID;  -- Replace YOUR_PRODUCT_ID

-- Issue 2: Product has no image
-- SOLUTION: Add an image
INSERT INTO product_images (product_id, image_url, image_type, display_order)
VALUES (YOUR_PRODUCT_ID, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', 'Primary', 1);

-- Issue 3: Product not showing on homepage (Featured section)
-- SOLUTION: Make it featured
UPDATE products 
SET is_featured = TRUE 
WHERE product_id = YOUR_PRODUCT_ID;

-- Issue 4: Stock is 0
-- SOLUTION: Add stock
UPDATE products 
SET stock_quantity = 50 
WHERE product_id = YOUR_PRODUCT_ID;

-- ============================================
-- COMPLETE FIX FOR ONE PRODUCT (Replace YOUR_PRODUCT_ID)
-- ============================================
-- UPDATE products 
-- SET 
--     product_status = 'Active',
--     is_featured = TRUE,
--     stock_quantity = 50
-- WHERE product_id = YOUR_PRODUCT_ID;

-- ============================================
-- CHECK IF IT'S FIXED
-- ============================================
-- SELECT product_id, product_name, product_status, is_featured, stock_quantity
-- FROM products 
-- WHERE product_id = YOUR_PRODUCT_ID;

