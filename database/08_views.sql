-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

USE flipkart_ecommerce;

-- ============================================
-- VIEW 1: Active Products with Seller Info
-- ============================================

DROP VIEW IF EXISTS v_active_products;

CREATE VIEW v_active_products AS
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.selling_price,
    p.original_price,
    p.discount_percentage,
    p.stock_quantity,
    p.average_rating,
    p.total_reviews,
    p.total_sales,
    pc.category_name,
    s.business_name as seller_name,
    s.seller_rating,
    s.verified_seller
FROM products p
JOIN product_category pc ON p.category_id = pc.category_id
JOIN sellers s ON p.seller_id = s.seller_id
WHERE p.product_status = 'Active';

-- ============================================
-- VIEW 2: Order Summary
-- ============================================

DROP VIEW IF EXISTS v_order_summary;

CREATE VIEW v_order_summary AS
SELECT 
    o.order_id,
    o.order_number,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.email,
    u.phone_number,
    o.total_amount,
    o.order_status,
    o.payment_mode,
    COUNT(oi.order_item_id) as total_items,
    o.created_at,
    d.delivery_status,
    d.tracking_number
FROM orders o
JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN delivery d ON o.order_id = d.order_id
GROUP BY o.order_id;

-- ============================================
-- VIEW 3: User Membership Details
-- ============================================

DROP VIEW IF EXISTS v_user_membership_details;

CREATE VIEW v_user_membership_details AS
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as user_name,
    u.email,
    u.loyalty_points,
    get_loyalty_tier(u.loyalty_points) as loyalty_tier,
    mp.plan_name,
    mp.plan_type,
    um.membership_status,
    um.start_date,
    um.end_date,
    um.auto_renewal,
    mp.discount_percentage,
    mp.cashback_percentage,
    mp.free_delivery
FROM users u
LEFT JOIN user_membership um ON u.user_id = um.user_id
LEFT JOIN membership_plans mp ON um.plan_id = mp.plan_id;

-- ============================================
-- VIEW 4: Product Sales Report
-- ============================================

DROP VIEW IF EXISTS v_product_sales_report;

CREATE VIEW v_product_sales_report AS
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    pc.category_name,
    s.business_name as seller_name,
    p.selling_price,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue,
    p.average_rating,
    p.total_reviews,
    COUNT(DISTINCT oi.order_id) as total_orders
FROM products p
JOIN product_category pc ON p.category_id = pc.category_id
JOIN sellers s ON p.seller_id = s.seller_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'Delivered'
GROUP BY p.product_id;

-- ============================================
-- VIEW 5: Customer Order History
-- ============================================

DROP VIEW IF EXISTS v_customer_order_history;

CREATE VIEW v_customer_order_history AS
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    o.order_number,
    o.order_id,
    o.total_amount,
    o.order_status,
    o.created_at,
    COUNT(oi.order_item_id) as item_count,
    d.delivery_status,
    d.tracking_number
FROM users u
JOIN orders o ON u.user_id = o.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN delivery d ON o.order_id = d.order_id
GROUP BY o.order_id
ORDER BY o.created_at DESC;

-- ============================================
-- VIEW 6: Flash Deal Products
-- ============================================

DROP VIEW IF EXISTS v_flash_deal_products;

CREATE VIEW v_flash_deal_products AS
SELECT 
    fd.deal_id,
    fd.deal_name,
    fd.deal_description,
    fd.start_time,
    fd.end_time,
    fd.discount_type,
    fd.discount_value,
    fd.deal_status,
    p.product_id,
    p.product_name,
    p.brand,
    p.original_price,
    fdp.deal_price,
    (p.original_price - fdp.deal_price) as savings,
    fdp.stock_allocated,
    fdp.stock_remaining,
    ROUND((fdp.stock_allocated - fdp.stock_remaining) * 100.0 / fdp.stock_allocated, 2) as sold_percentage
FROM flash_deals fd
JOIN flash_deal_products fdp ON fd.deal_id = fdp.deal_id
JOIN products p ON fdp.product_id = p.product_id
WHERE fd.deal_status IN ('Active', 'Scheduled');

-- ============================================
-- VIEW 7: Seller Performance Dashboard
-- ============================================

DROP VIEW IF EXISTS v_seller_performance;

CREATE VIEW v_seller_performance AS
SELECT 
    s.seller_id,
    s.business_name,
    s.business_email,
    s.seller_rating,
    s.verified_seller,
    COUNT(DISTINCT p.product_id) as total_products,
    COUNT(DISTINCT oi.order_id) as total_orders,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.total_price) as total_revenue,
    AVG(p.average_rating) as avg_product_rating,
    s.commission_rate,
    (SUM(oi.total_price) * s.commission_rate / 100) as commission_earned
FROM sellers s
LEFT JOIN products p ON s.seller_id = p.seller_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'Delivered'
GROUP BY s.seller_id;

-- ============================================
-- VIEW 8: Category-wise Product Statistics
-- ============================================

DROP VIEW IF EXISTS v_category_statistics;

CREATE VIEW v_category_statistics AS
SELECT 
    pc.category_id,
    pc.category_name,
    COUNT(DISTINCT p.product_id) as total_products,
    COUNT(DISTINCT CASE WHEN p.product_status = 'Active' THEN p.product_id END) as active_products,
    AVG(p.selling_price) as avg_price,
    MIN(p.selling_price) as min_price,
    MAX(p.selling_price) as max_price,
    AVG(p.average_rating) as avg_rating,
    SUM(p.total_sales) as total_sales,
    SUM(oi.total_price) as total_revenue
FROM product_category pc
LEFT JOIN products p ON pc.category_id = p.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'Delivered'
WHERE pc.is_active = TRUE
GROUP BY pc.category_id, pc.category_name;

-- ============================================
-- END OF VIEWS
-- ============================================

