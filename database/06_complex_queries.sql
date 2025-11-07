-- ============================================
-- COMPLEX QUERIES
-- ============================================

USE flipkart_ecommerce;

-- ============================================
-- QUERY 1: NESTED QUERY - Get users who have spent more than average
-- ============================================

SELECT 
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    SUM(o.total_amount) as total_spent,
    get_loyalty_tier(u.loyalty_points) as loyalty_tier
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE o.order_status = 'Delivered'
GROUP BY u.user_id
HAVING total_spent > (
    SELECT AVG(total_spent)
    FROM (
        SELECT SUM(total_amount) as total_spent
        FROM orders
        WHERE order_status = 'Delivered'
        GROUP BY user_id
    ) as user_totals
)
ORDER BY total_spent DESC;

-- ============================================
-- QUERY 2: JOIN QUERY - Get order details with user and product information
-- ============================================

SELECT 
    o.order_number,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.email,
    u.phone_number,
    p.product_name,
    p.brand,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    o.order_status,
    d.delivery_status,
    d.tracking_number,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN delivery d ON o.order_id = d.order_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY o.created_at DESC;

-- ============================================
-- QUERY 3: AGGREGATE QUERY - Seller performance report
-- ============================================

SELECT 
    s.seller_id,
    s.business_name,
    s.business_email,
    COUNT(DISTINCT p.product_id) as total_products,
    COUNT(DISTINCT oi.order_id) as total_orders,
    SUM(oi.quantity) as units_sold,
    SUM(oi.total_price) as revenue,
    AVG(p.average_rating) as avg_product_rating,
    s.seller_rating,
    s.commission_rate,
    (SUM(oi.total_price) * s.commission_rate / 100) as commission_earned
FROM sellers s
LEFT JOIN products p ON s.seller_id = p.seller_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'Delivered'
GROUP BY s.seller_id
ORDER BY revenue DESC;

-- ============================================
-- QUERY 4: NESTED QUERY WITH JOIN - Products with above-average sales in their category
-- ============================================

SELECT 
    p.product_id,
    p.product_name,
    pc.category_name,
    p.total_sales,
    p.selling_price,
    p.average_rating,
    s.business_name as seller_name
FROM products p
JOIN product_category pc ON p.category_id = pc.category_id
JOIN sellers s ON p.seller_id = s.seller_id
WHERE p.total_sales > (
    SELECT AVG(total_sales)
    FROM products
    WHERE category_id = p.category_id AND product_status = 'Active'
)
AND p.product_status = 'Active'
ORDER BY p.total_sales DESC;

-- ============================================
-- QUERY 5: AGGREGATE WITH HAVING - Top customers by order value
-- ============================================

SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.created_at) as last_order_date,
    get_loyalty_tier(u.loyalty_points) as loyalty_tier,
    mp.plan_name as membership_plan
FROM users u
JOIN orders o ON u.user_id = o.user_id
LEFT JOIN user_membership um ON u.user_id = um.user_id AND um.membership_status = 'Active'
LEFT JOIN membership_plans mp ON um.plan_id = mp.plan_id
WHERE o.order_status IN ('Delivered', 'Shipped')
GROUP BY u.user_id
HAVING total_spent > 10000
ORDER BY total_spent DESC
LIMIT 10;

-- ============================================
-- QUERY 6: NESTED QUERY - Products with highest ratings in each category
-- ============================================

SELECT 
    p.product_id,
    p.product_name,
    pc.category_name,
    p.average_rating,
    p.total_reviews,
    p.selling_price
FROM products p
JOIN product_category pc ON p.category_id = pc.category_id
WHERE p.average_rating = (
    SELECT MAX(average_rating)
    FROM products
    WHERE category_id = p.category_id 
    AND product_status = 'Active'
    AND total_reviews >= 5
)
AND p.product_status = 'Active'
AND p.total_reviews >= 5
ORDER BY pc.category_name, p.average_rating DESC;

-- ============================================
-- QUERY 7: JOIN WITH AGGREGATE - Monthly sales report
-- ============================================

SELECT 
    DATE_FORMAT(o.created_at, '%Y-%m') as month,
    COUNT(DISTINCT o.order_id) as total_orders,
    COUNT(DISTINCT o.user_id) as unique_customers,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    SUM(oi.quantity) as total_items_sold
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status IN ('Delivered', 'Shipped')
AND o.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
ORDER BY month DESC;

-- ============================================
-- QUERY 8: NESTED QUERY - Users who haven't placed orders in last 90 days
-- ============================================

SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.email,
    u.phone_number,
    MAX(o.created_at) as last_order_date,
    DATEDIFF(NOW(), MAX(o.created_at)) as days_since_last_order,
    get_user_total_spending(u.user_id) as total_spending
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.account_status = 'Active'
GROUP BY u.user_id
HAVING last_order_date IS NULL OR days_since_last_order > 90
ORDER BY days_since_last_order DESC;

-- ============================================
-- QUERY 9: JOIN WITH MULTIPLE TABLES - Complete order details
-- ============================================

SELECT 
    o.order_number,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.email,
    CONCAT(ua.address_line1, ', ', ua.city, ', ', ua.state, ' - ', ua.pincode) as shipping_address,
    p.product_name,
    p.brand,
    s.business_name as seller_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    o.order_status,
    d.tracking_number,
    d.delivery_status,
    pm.payment_method,
    pm.payment_status,
    o.total_amount,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN user_addresses ua ON o.shipping_address_id = ua.address_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN sellers s ON oi.seller_id = s.seller_id
LEFT JOIN delivery d ON o.order_id = d.order_id
LEFT JOIN payment pm ON o.payment_id = pm.payment_id
ORDER BY o.created_at DESC
LIMIT 20;

-- ============================================
-- QUERY 10: AGGREGATE WITH GROUP BY - Category-wise sales analysis
-- ============================================

SELECT 
    pc.category_name,
    COUNT(DISTINCT p.product_id) as total_products,
    COUNT(DISTINCT oi.order_item_id) as total_items_sold,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue,
    AVG(p.average_rating) as avg_category_rating,
    AVG(p.selling_price) as avg_product_price
FROM product_category pc
LEFT JOIN products p ON pc.category_id = p.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'Delivered'
WHERE pc.is_active = TRUE
GROUP BY pc.category_id, pc.category_name
HAVING total_products > 0
ORDER BY total_revenue DESC;

-- ============================================
-- END OF COMPLEX QUERIES
-- ============================================

