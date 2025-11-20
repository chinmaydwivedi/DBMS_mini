#!/bin/bash
echo "Checking why products aren't showing..."
echo ""

DB_PASS=$(grep DB_PASSWORD backend/.env | cut -d'=' -f2)

mysql -u root -p"$DB_PASS" -h Chinmays-M2.local flipkart_ecommerce << SQL
-- Check products with wrong status
SELECT 'Products NOT showing (status != Active):' as info;
SELECT product_id, product_name, product_status 
FROM products 
WHERE product_status != 'Active';

SELECT '';

-- Check products that SHOULD show
SELECT 'Products that SHOULD show:' as info;
SELECT product_id, product_name, product_status, is_featured, stock_quantity
FROM products 
WHERE product_status = 'Active'
ORDER BY product_id DESC
LIMIT 10;
SQL

echo ""
echo "To fix: Run this SQL:"
echo "UPDATE products SET product_status = 'Active' WHERE product_id = YOUR_PRODUCT_ID;"
