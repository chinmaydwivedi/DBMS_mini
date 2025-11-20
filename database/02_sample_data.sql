-- ============================================
-- SAMPLE DATA INSERTION (DML)
-- ============================================

USE flipkart_ecommerce;

-- Insert Membership Plans
INSERT INTO membership_plans (plan_name, plan_type, plan_description, monthly_price, annual_price, discount_percentage, free_delivery, priority_support, early_sale_access, cashback_percentage, max_cashback_per_order, warranty_extension_months)
VALUES 
('Free Plan', 'Free', 'Basic membership with standard benefits', 0, 0, 0, FALSE, FALSE, FALSE, 0, 0, 0),
('Silver Plus', 'Silver', 'Enhanced shopping experience with extra savings', 99, 999, 5, TRUE, FALSE, TRUE, 2, 100, 3),
('Gold Elite', 'Gold', 'Premium benefits with priority delivery', 199, 1999, 10, TRUE, TRUE, TRUE, 5, 300, 6),
('Platinum VIP', 'Platinum', 'Ultimate shopping experience with maximum benefits', 399, 3999, 15, TRUE, TRUE, TRUE, 10, 1000, 12);

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, gender, account_status, loyalty_points)
VALUES 
('john.doe@example.com', '$2y$10$abcdefghijklmnopqrstuv', 'John', 'Doe', '+919876543210', 'Male', 'Active', 500),
('jane.smith@example.com', '$2y$10$wxyzabcdefghijklmnopqr', 'Jane', 'Smith', '+919876543211', 'Female', 'Active', 1200),
('robert.wilson@example.com', '$2y$10$stuvwxyzabcdefghijklmn', 'Robert', 'Wilson', '+919876543212', 'Male', 'Active', 3500),
('sarah.jones@example.com', '$2y$10$mnopqrstuvwxyzabcdefgh', 'Sarah', 'Jones', '+919876543213', 'Female', 'Active', 800),
('michael.brown@example.com', '$2y$10$qrstuvwxyzabcdefghijkl', 'Michael', 'Brown', '+919876543214', 'Male', 'Active', 2500);

-- Insert user membership
INSERT INTO user_membership (user_id, plan_id, start_date, end_date, auto_renewal, membership_status, payment_method, amount_paid)
VALUES 
(2, 2, '2025-01-01', '2026-01-01', TRUE, 'Active', 'CreditCard', 999.00),
(3, 3, '2025-01-01', '2026-01-01', TRUE, 'Active', 'UPI', 1999.00),
(5, 4, '2025-01-01', '2026-01-01', TRUE, 'Active', 'NetBanking', 3999.00);

-- Insert user addresses
INSERT INTO user_addresses (user_id, address_type, full_name, phone_number, address_line1, address_line2, landmark, city, state, pincode, is_default)
VALUES 
(1, 'Home', 'John Doe', '+919876543210', '123 MG Road', 'Apartment 4B', 'Near City Mall', 'Bangalore', 'Karnataka', '560001', TRUE),
(2, 'Home', 'Jane Smith', '+919876543211', '456 Brigade Road', 'Tower A, Floor 5', 'Opposite Park', 'Bangalore', 'Karnataka', '560025', TRUE),
(3, 'Work', 'Robert Wilson', '+919876543212', '789 Whitefield Main Road', 'Tech Park Building', 'Near Metro Station', 'Bangalore', 'Karnataka', '560066', TRUE),
(4, 'Home', 'Sarah Jones', '+919876543213', '321 Indiranagar', 'House No. 15', 'Near Metro', 'Bangalore', 'Karnataka', '560038', TRUE),
(5, 'Home', 'Michael Brown', '+919876543214', '654 Koramangala', 'Block 3', 'Near Forum Mall', 'Bangalore', 'Karnataka', '560095', TRUE);

-- Insert sample categories
INSERT INTO product_category (category_name, category_description, level, is_active)
VALUES 
('Electronics', 'Electronic devices and accessories', 1, TRUE),
('Fashion', 'Clothing and fashion accessories', 1, TRUE),
('Home & Kitchen', 'Home appliances and kitchen items', 1, TRUE),
('Books', 'Books and stationery', 1, TRUE),
('Mobile Phones', 'Smartphones and mobile accessories', 2, TRUE),
('Laptops', 'Laptops and computer accessories', 2, TRUE),
('Men Fashion', 'Clothing for men', 2, TRUE),
('Women Fashion', 'Clothing for women', 2, TRUE);

-- Update parent categories
UPDATE product_category SET parent_category_id = 1 WHERE category_id IN (5, 6);
UPDATE product_category SET parent_category_id = 2 WHERE category_id IN (7, 8);

-- Insert sample sellers
INSERT INTO sellers (business_name, business_email, business_phone, gstin, pan_number, business_address, city, state, pincode, seller_rating, commission_rate, account_status, verified_seller)
VALUES 
('TechStore India', 'techstore@example.com', '+919123456780', '29ABCDE1234F1Z5', 'ABCDE1234F', '123 Business Park, Sector 5', 'Bangalore', 'Karnataka', '560001', 4.5, 10.00, 'Active', TRUE),
('Fashion Hub', 'fashionhub@example.com', '+919123456781', '29FGHIJ5678K2L6', 'FGHIJ5678K', '456 Commercial Complex', 'Mumbai', 'Maharashtra', '400001', 4.2, 12.00, 'Active', TRUE),
('Home Essentials', 'homeessentials@example.com', '+919123456782', '29MNOPQ9012M3N7', 'MNOPQ9012M', '789 Trade Center', 'Delhi', 'Delhi', '110001', 4.7, 8.00, 'Active', TRUE),
('BookWorld', 'bookworld@example.com', '+919123456783', '29QRSTU3456V4W8', 'QRSTU3456V', '321 Knowledge Hub', 'Bangalore', 'Karnataka', '560001', 4.6, 5.00, 'Active', TRUE);

-- Insert sample products
INSERT INTO products (seller_id, category_id, product_name, brand, sku, description, original_price, selling_price, discount_percentage, stock_quantity, product_status, is_featured, average_rating, cod_available)
VALUES 
(1, 5, 'iPhone 15 Pro Max 256GB', 'Apple', 'APL-IP15PM-256', 'Latest iPhone with A17 Pro chip', 159900.00, 149900.00, 6.25, 50, 'Active', TRUE, 4.5, TRUE),
(1, 5, 'Samsung Galaxy S24 Ultra', 'Samsung', 'SAM-GS24U-256', 'Premium Android smartphone', 139999.00, 129999.00, 7.14, 40, 'Active', TRUE, 4.6, TRUE),
(1, 6, 'MacBook Air M2 13-inch', 'Apple', 'APL-MBA-M2-13', 'Thin and light laptop with M2 chip', 119900.00, 109900.00, 8.34, 30, 'Active', TRUE, 4.8, TRUE),
(1, 6, 'Dell XPS 15', 'Dell', 'DEL-XPS15-512', 'High-performance laptop', 149999.00, 134999.00, 10.00, 25, 'Active', FALSE, 4.7, TRUE),
(2, 7, 'Men Casual Shirt', 'Raymond', 'RAY-CS-001', 'Premium cotton casual shirt', 2999.00, 1499.00, 50.00, 100, 'Active', FALSE, 4.2, TRUE),
(2, 7, 'Men Formal Trousers', 'Van Heusen', 'VH-FT-002', 'Classic formal trousers', 2499.00, 1799.00, 28.00, 80, 'Active', FALSE, 4.3, TRUE),
(2, 8, 'Women Ethnic Kurti', 'Fabindia', 'FAB-KRT-002', 'Traditional kurti with modern design', 1999.00, 1299.00, 35.00, 75, 'Active', FALSE, 4.3, TRUE),
(2, 8, 'Women Denim Jeans', 'Levis', 'LEV-DJ-003', 'Classic fit denim jeans', 3999.00, 2999.00, 25.00, 60, 'Active', FALSE, 4.4, TRUE),
(3, 3, 'Air Fryer 4.5L', 'Philips', 'PHI-AF-45', 'Healthy cooking with rapid air technology', 12995.00, 8999.00, 30.75, 45, 'Active', TRUE, 4.6, TRUE),
(3, 3, 'Microwave Oven 20L', 'LG', 'LG-MO-20', 'Compact microwave oven', 8999.00, 6999.00, 22.22, 35, 'Active', FALSE, 4.5, TRUE),
(4, 4, 'Database Management Systems Book', 'McGraw Hill', 'MGH-DBMS-001', 'Comprehensive DBMS textbook', 899.00, 699.00, 22.25, 200, 'Active', FALSE, 4.7, TRUE),
(4, 4, 'Data Structures and Algorithms', 'Pearson', 'PRS-DSA-002', 'Complete guide to DSA', 1299.00, 999.00, 23.09, 150, 'Active', FALSE, 4.8, TRUE);
(4, 4, 'Data Algorithms', 'Pearsons', 'PRS-DSA-002', 'Complete guide to DSA', 1299.00, 999.00, 23.09, 150, 'Active', FALSE, 4.8, TRUE);

-- Insert product images
INSERT INTO product_images (product_id, image_url, image_type, display_order)
VALUES 
(1, 'https://example.com/images/iphone15pro-1.jpg', 'Primary', 1),
(1, 'https://example.com/images/iphone15pro-2.jpg', 'Gallery', 2),
(2, 'https://example.com/images/samsungs24-1.jpg', 'Primary', 1),
(3, 'https://example.com/images/macbookair-1.jpg', 'Primary', 1),
(4, 'https://example.com/images/dellxps-1.jpg', 'Primary', 1),
(5, 'https://example.com/images/shirt-1.jpg', 'Primary', 1),
(6, 'https://example.com/images/trousers-1.jpg', 'Primary', 1),
(7, 'https://example.com/images/kurti-1.jpg', 'Primary', 1),
(8, 'https://example.com/images/jeans-1.jpg', 'Primary', 1),
(9, 'https://example.com/images/airfryer-1.jpg', 'Primary', 1),
(10, 'https://example.com/images/microwave-1.jpg', 'Primary', 1),
(11, 'https://example.com/images/dbms-book-1.jpg', 'Primary', 1),
(12, 'https://example.com/images/dsa-book-1.jpg', 'Primary', 1);

-- Insert coupons
INSERT INTO coupons (coupon_code, coupon_name, description, discount_type, discount_value, max_discount_amount, min_order_amount, usage_limit, start_date, end_date, is_active, coupon_type)
VALUES 
('WELCOME100', 'Welcome Offer', 'Get Rs.100 off on first order', 'FixedAmount', 100.00, 100.00, 500.00, 1000, '2025-01-01', '2025-12-31', TRUE, 'FirstOrder'),
('SAVE20', 'Save 20%', 'Get 20% off on orders above Rs.1000', 'Percentage', 20.00, 500.00, 1000.00, 5000, '2025-01-01', '2025-12-31', TRUE, 'Public'),
('PREMIUM50', 'Premium Member Special', 'Extra Rs.50 off for premium members', 'FixedAmount', 50.00, 50.00, 200.00, 10000, '2025-01-01', '2025-12-31', TRUE, 'Membership'),
('FLAT500', 'Flat Rs.500 Off', 'Get flat Rs.500 discount', 'FixedAmount', 500.00, 500.00, 3000.00, 2000, '2025-01-01', '2025-12-31', TRUE, 'Public');

-- Insert flash deals
INSERT INTO flash_deals (deal_name, deal_description, start_time, end_time, discount_type, discount_value, max_discount_amount, deal_status, total_quantity, remaining_quantity)
VALUES 
('Electronics Mega Sale', 'Huge discounts on electronics', '2025-11-10 00:00:00', '2025-11-12 23:59:59', 'Percentage', 30.00, 5000.00, 'Scheduled', 100, 100),
('Fashion Friday', 'End of season sale on fashion', '2025-11-15 00:00:00', '2025-11-17 23:59:59', 'Percentage', 40.00, 2000.00, 'Scheduled', 200, 200),
('Home & Kitchen Bonanza', 'Special deals on home appliances', '2025-11-20 00:00:00', '2025-11-22 23:59:59', 'Percentage', 25.00, 3000.00, 'Scheduled', 150, 150);

-- Insert flash deal products
INSERT INTO flash_deal_products (deal_id, product_id, deal_price, stock_allocated, stock_remaining)
VALUES 
(1, 1, 134900.00, 20, 20),
(1, 2, 119999.00, 15, 15),
(1, 3, 99900.00, 10, 10),
(2, 5, 1199.00, 50, 50),
(2, 6, 1399.00, 40, 40),
(2, 7, 999.00, 60, 60),
(3, 9, 7999.00, 30, 30),
(3, 10, 5999.00, 25, 25);

-- Insert reviews
INSERT INTO reviews (product_id, user_id, rating, review_title, review_text, is_verified_purchase, review_status)
VALUES 
(1, 1, 5, 'Excellent Phone', 'Great camera and performance', TRUE, 'Approved'),
(1, 2, 4, 'Good but expensive', 'Good features but pricey', TRUE, 'Approved'),
(3, 3, 5, 'Best Laptop', 'Amazing performance and battery', TRUE, 'Approved'),
(5, 4, 4, 'Comfortable Shirt', 'Good quality fabric', TRUE, 'Approved'),
(9, 5, 5, 'Great Air Fryer', 'Healthy cooking made easy', TRUE, 'Approved');

-- Insert cart and cart items (for users)
INSERT INTO cart (user_id) VALUES (1), (2), (3);

INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition)
VALUES 
(1, 1, 1, 149900.00),
(1, 3, 1, 109900.00),
(2, 5, 2, 1499.00),
(3, 9, 1, 8999.00);

-- Insert payment records
INSERT INTO payment (user_id, transaction_id, payment_method, payment_gateway, amount, payment_status, payment_date)
VALUES 
(1, 'TXN001234567890', 'CreditCard', 'Razorpay', 259800.00, 'Success', NOW()),
(2, 'TXN001234567891', 'UPI', 'PhonePe', 2998.00, 'Success', NOW()),
(3, 'TXN001234567892', 'DebitCard', 'Paytm', 8999.00, 'Success', NOW());

-- Insert orders
INSERT INTO orders (order_number, user_id, payment_id, shipping_address_id, billing_address_id, subtotal_amount, tax_amount, shipping_charges, total_amount, order_status, payment_mode)
VALUES 
('ORD0000000001', 1, 1, 1, 1, 259800.00, 46764.00, 0.00, 306564.00, 'Delivered', 'Prepaid'),
('ORD0000000002', 2, 2, 2, 2, 2998.00, 539.64, 50.00, 3587.64, 'Shipped', 'Prepaid'),
('ORD0000000003', 3, 3, 3, 3, 8999.00, 1619.82, 0.00, 10618.82, 'Confirmed', 'Prepaid');

-- Insert order items
INSERT INTO order_items (order_id, product_id, seller_id, product_name, quantity, unit_price, total_price, item_status)
VALUES 
(1, 1, 1, 'iPhone 15 Pro Max 256GB', 1, 149900.00, 149900.00, 'Delivered'),
(1, 3, 1, 'MacBook Air M2 13-inch', 1, 109900.00, 109900.00, 'Delivered'),
(2, 5, 2, 'Men Casual Shirt', 2, 1499.00, 2998.00, 'Shipped'),
(3, 9, 3, 'Air Fryer 4.5L', 1, 8999.00, 8999.00, 'Confirmed');

-- Insert delivery records
INSERT INTO delivery (order_id, tracking_number, courier_partner, shipping_method, estimated_delivery_date, delivery_status, shipped_date)
VALUES 
(1, 'TRACK001234567', 'BlueDart', 'Express', DATE_ADD(NOW(), INTERVAL 3 DAY), 'Delivered', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 'TRACK001234568', 'Delhivery', 'Standard', DATE_ADD(NOW(), INTERVAL 5 DAY), 'InTransit', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'TRACK001234569', 'FedEx', 'Express', DATE_ADD(NOW(), INTERVAL 2 DAY), 'PickedUp', NOW());

-- ============================================
-- END OF SAMPLE DATA
-- ============================================

