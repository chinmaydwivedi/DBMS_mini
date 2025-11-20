-- Fix products not showing on website
-- Products need: product_status = 'Active' to appear

USE flipkart_ecommerce;

-- Check products that are NOT showing (status not Active)
SELECT product_id, product_name, product_status, is_featured 
FROM products 
WHERE product_status != 'Active';

-- Fix: Set all products to Active (if you want them to show)
-- UPDATE products SET product_status = 'Active' WHERE product_status != 'Active';

-- Or fix specific product by ID
-- UPDATE products SET product_status = 'Active' WHERE product_id = YOUR_PRODUCT_ID;

-- Check products that should show on featured page
-- Featured products need: product_status = 'Active' AND (is_featured = TRUE OR is_bestseller = TRUE)
SELECT product_id, product_name, product_status, is_featured, is_bestseller
FROM products 
WHERE product_status = 'Active' 
AND (is_featured = TRUE OR is_bestseller = TRUE);

-- Make a product featured so it shows on homepage
-- UPDATE products SET is_featured = TRUE WHERE product_id = YOUR_PRODUCT_ID;

