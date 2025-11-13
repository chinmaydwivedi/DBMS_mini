-- Test script for triggers and procedures

-- ============================================
-- CLEANUP PREVIOUS TEST DATA
-- ============================================
USE flipkart_ecommerce;

-- Suppress errors if data doesn't exist
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;

-- Delete test user if exists (cascades to cart/wishlist)
DELETE FROM users WHERE email = 'trigger4@test.com';
-- Delete specific cart item from user 1 that the test uses
DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = 1) AND product_id = 5;

SET SQL_NOTES=@OLD_SQL_NOTES;

-- ============================================
-- START TESTS
-- ============================================

-- Test 1: after_user_insert trigger
INSERT INTO users (email, password_hash, first_name, last_name, phone_number) 
VALUES ('trigger4@test.com', 'password123', 'Test', 'User', '9876543213');
SET @new_user_id = LAST_INSERT_ID();
SELECT 'Test 1: Cart for new user', COUNT(*) FROM cart WHERE user_id = @new_user_id;
SELECT 'Test 1: Wishlist for new user', COUNT(*) FROM wishlist WHERE user_id = @new_user_id;

-- Test 2: after_review_insert trigger
SELECT 'Test 2: Rating before', average_rating, total_reviews FROM products WHERE product_id = 1;
INSERT INTO reviews (product_id, user_id, rating, review_text, review_status) 
VALUES (1, 1, 4, 'Another test review!', 'Approved');
SELECT 'Test 2: Rating after', average_rating, total_reviews FROM products WHERE product_id = 1;

-- Test 3: place_order procedure
SET @user_id_order = 1;
SET @cart_id_order = (SELECT cart_id FROM cart WHERE user_id = @user_id_order);
INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (@cart_id_order, 5, 1, 1200.00);
SELECT 'Test 3: Stock before order', stock_quantity FROM products WHERE product_id = 5;
CALL place_order(@user_id_order, 1, 1, 'COD', NULL);
SELECT 'Test 3: Stock after order', stock_quantity FROM products WHERE product_id = 5;
SELECT 'Test 3: Cart after order', COUNT(*) FROM cart_items WHERE cart_id = @cart_id_order;

-- Test 4: get_loyalty_tier function
SELECT 'Test 4: Loyalty Tiers', get_loyalty_tier(500) AS tier_bronze, get_loyalty_tier(2500) AS tier_silver, get_loyalty_tier(7500) AS tier_gold;
