-- ============================================
-- HOW TO RUN UPDATE QUERY - STEP BY STEP
-- ============================================

-- STEP 1: First, find your product ID
-- Run this query first to see all products:
USE flipkart_ecommerce;

SELECT product_id, product_name, product_status, is_featured 
FROM products 
ORDER BY product_id DESC 
LIMIT 10;

-- STEP 2: Look at the results and find your product
-- Note the product_id number (for example: 13, 14, 15, etc.)

-- STEP 3: Replace YOUR_PRODUCT_ID below with the actual number
-- For example, if your product_id is 13, change it to:
-- UPDATE products SET product_status = 'Active' WHERE product_id = 13;

-- STEP 4: Copy and paste this UPDATE query (with your product_id):
UPDATE products 
SET 
    product_status = 'Active',
    is_featured = TRUE,
    stock_quantity = 50
WHERE product_id = YOUR_PRODUCT_ID;  -- CHANGE THIS NUMBER!

-- STEP 5: After running UPDATE, verify it worked:
SELECT product_id, product_name, product_status, is_featured 
FROM products 
WHERE product_id = YOUR_PRODUCT_ID;  -- CHANGE THIS NUMBER!
