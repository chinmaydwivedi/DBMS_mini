-- ============================================
-- CRUD OPERATIONS (Create, Read, Update, Delete)
-- ============================================

USE flipkart_ecommerce;

-- ============================================
-- CREATE OPERATIONS (INSERT)
-- ============================================

-- 1. Create a new user
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, gender, account_status, loyalty_points)
VALUES ('newuser@example.com', '$2y$10$newhashhere', 'New', 'User', '+919876543215', 'Male', 'Active', 0);

-- 2. Create a new product
INSERT INTO products (seller_id, category_id, product_name, brand, sku, description, original_price, selling_price, discount_percentage, stock_quantity, product_status, cod_available)
VALUES (1, 5, 'OnePlus 12 Pro', 'OnePlus', 'OP-12P-256', 'Latest OnePlus flagship', 69999.00, 64999.00, 7.14, 30, 'Active', TRUE);

-- 3. Create a new category
INSERT INTO product_category (category_name, category_description, level, is_active, parent_category_id)
VALUES ('Smart Watches', 'Smart watches and fitness trackers', 2, TRUE, 1);

-- 4. Create a new seller
INSERT INTO sellers (business_name, business_email, business_phone, gstin, pan_number, business_address, city, state, pincode, seller_rating, commission_rate, account_status, verified_seller)
VALUES ('GadgetZone', 'gadgetzone@example.com', '+919123456784', '29XYZAB7890C5D9', 'XYZAB7890C', '999 Tech Plaza', 'Bangalore', 'Karnataka', '560001', 0.00, 10.00, 'UnderReview', FALSE);

-- 5. Create a new address for user
INSERT INTO user_addresses (user_id, address_type, full_name, phone_number, address_line1, city, state, pincode, is_default)
VALUES (1, 'Work', 'John Doe', '+919876543210', '999 Corporate Tower', 'Bangalore', 'Karnataka', '560001', FALSE);

-- ============================================
-- READ OPERATIONS (SELECT)
-- ============================================

-- 1. Read all active products
SELECT product_id, product_name, brand, selling_price, stock_quantity, average_rating
FROM products
WHERE product_status = 'Active'
ORDER BY product_name;

-- 2. Read user details with membership
SELECT u.user_id, u.first_name, u.last_name, u.email, u.loyalty_points,
       mp.plan_name, mp.plan_type, um.membership_status
FROM users u
LEFT JOIN user_membership um ON u.user_id = um.user_id
LEFT JOIN membership_plans mp ON um.plan_id = mp.plan_id
WHERE u.account_status = 'Active';

-- 3. Read products by category
SELECT p.product_id, p.product_name, p.brand, p.selling_price, pc.category_name
FROM products p
JOIN product_category pc ON p.category_id = pc.category_id
WHERE pc.category_name = 'Mobile Phones'
ORDER BY p.selling_price DESC;

-- 4. Read order details with items
SELECT o.order_number, o.total_amount, o.order_status, o.created_at,
       oi.product_name, oi.quantity, oi.unit_price, oi.total_price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.user_id = 1
ORDER BY o.created_at DESC;

-- 5. Read seller performance
SELECT s.business_name, s.seller_rating, COUNT(p.product_id) as total_products,
       SUM(p.total_sales) as total_units_sold
FROM sellers s
LEFT JOIN products p ON s.seller_id = p.seller_id
GROUP BY s.seller_id
ORDER BY s.seller_rating DESC;

-- 6. Read flash deals with products
SELECT fd.deal_name, fd.discount_value, fd.start_time, fd.end_time,
       p.product_name, fdp.deal_price, fdp.stock_remaining
FROM flash_deals fd
JOIN flash_deal_products fdp ON fd.deal_id = fdp.deal_id
JOIN products p ON fdp.product_id = p.product_id
WHERE fd.deal_status = 'Active'
ORDER BY fd.start_time;

-- 7. Read reviews for a product
SELECT r.rating, r.review_title, r.review_text, u.first_name, u.last_name, r.created_at
FROM reviews r
JOIN users u ON r.user_id = u.user_id
WHERE r.product_id = 1 AND r.review_status = 'Approved'
ORDER BY r.created_at DESC;

-- 8. Read cart items for a user
SELECT ci.cart_item_id, p.product_name, p.brand, ci.quantity, ci.price_at_addition,
       (ci.quantity * ci.price_at_addition) as total_price
FROM cart_items ci
JOIN cart c ON ci.cart_id = c.cart_id
JOIN products p ON ci.product_id = p.product_id
WHERE c.user_id = 1;

-- ============================================
-- UPDATE OPERATIONS
-- ============================================

-- 1. Update product price
UPDATE products
SET selling_price = 139900.00,
    discount_percentage = ((original_price - 139900.00) / original_price) * 100
WHERE product_id = 1;

-- 2. Update product stock
UPDATE products
SET stock_quantity = stock_quantity + 10
WHERE product_id = 1;

-- 3. Update order status
UPDATE orders
SET order_status = 'Shipped',
    shipped_at = NOW()
WHERE order_id = 2;

-- 4. Update user loyalty points
UPDATE users
SET loyalty_points = loyalty_points + 100
WHERE user_id = 1;

-- 5. Update product rating (after new review)
UPDATE products
SET average_rating = (
    SELECT AVG(rating)
    FROM reviews
    WHERE product_id = 1 AND review_status = 'Approved'
),
total_reviews = (
    SELECT COUNT(*)
    FROM reviews
    WHERE product_id = 1 AND review_status = 'Approved'
)
WHERE product_id = 1;

-- 6. Update seller rating
UPDATE sellers
SET seller_rating = (
    SELECT AVG(average_rating)
    FROM products
    WHERE seller_id = 1
)
WHERE seller_id = 1;

-- 7. Update membership status
UPDATE user_membership
SET membership_status = 'Expired'
WHERE end_date < CURDATE() AND membership_status = 'Active';

-- 8. Update delivery status
UPDATE delivery
SET delivery_status = 'Delivered',
    actual_delivery_date = CURDATE()
WHERE order_id = 1;

-- ============================================
-- DELETE OPERATIONS
-- ============================================

-- 1. Delete cart item
DELETE FROM cart_items
WHERE cart_item_id = 1;

-- 2. Delete wishlist item
DELETE FROM wishlist_items
WHERE wishlist_id = 1 AND product_id = 1;

-- 3. Delete inactive product
DELETE FROM products
WHERE product_id = 13 AND product_status = 'Inactive';

-- 4. Delete expired coupon
DELETE FROM coupons
WHERE end_date < CURDATE() AND is_active = TRUE;

-- 5. Delete cancelled order items (soft delete by updating status)
UPDATE order_items
SET item_status = 'Cancelled'
WHERE order_id = 3 AND item_status = 'Pending';

-- 6. Delete user address
DELETE FROM user_addresses
WHERE address_id = 6 AND is_default = FALSE;

-- 7. Delete old reviews (flagged/rejected)
DELETE FROM reviews
WHERE review_status = 'Rejected' AND created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 8. Delete inactive flash deal
DELETE FROM flash_deals
WHERE deal_status = 'Expired' AND end_time < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ============================================
-- END OF CRUD OPERATIONS
-- ============================================

