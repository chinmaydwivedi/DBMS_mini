-- Quick queries to check existing data before adding new

USE flipkart_ecommerce;

-- Check sellers (need seller_id for products)
SELECT seller_id, business_name, account_status FROM sellers;

-- Check categories (need category_id for products)
SELECT category_id, category_name, parent_category_id FROM product_category;

-- Check existing products
SELECT product_id, product_name, brand, selling_price FROM products LIMIT 10;

-- Check users
SELECT user_id, email, first_name, last_name FROM users LIMIT 10;
