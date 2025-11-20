-- ============================================
-- STEP 1: Add Sample Ratings to Database
-- ============================================
-- This adds diverse reviews for different products

-- Add reviews for iPhone 15 Pro (product_id = 1)
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(1, 1, 1, 5, 'Excellent Phone!', 'Best iPhone yet. Camera is amazing, battery life is great.', 'Approved', TRUE),
(1, 2, 2, 5, 'Worth every penny', 'Premium build quality and smooth performance.', 'Approved', TRUE),
(1, 3, 3, 4, 'Great but expensive', 'Love the phone but wish it was more affordable.', 'Approved', TRUE);

-- Add reviews for Samsung Galaxy S24 (product_id = 2)
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(2, 1, 4, 5, 'Amazing Display!', 'The screen is absolutely stunning. Best Android phone.', 'Approved', TRUE),
(2, 4, 5, 5, 'Perfect Phone', 'Everything works flawlessly. Highly recommend!', 'Approved', TRUE),
(2, 5, 6, 5, 'Best Purchase Ever', 'Camera quality is outstanding. Battery lasts all day.', 'Approved', TRUE);

-- Add reviews for MacBook Pro (product_id = 3)
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(3, 2, 7, 5, 'Perfect for Developers', 'M2 chip is incredibly fast. Best laptop for coding.', 'Approved', TRUE),
(3, 3, 8, 5, 'MacBook Excellence', 'Build quality is top-notch. Worth the investment.', 'Approved', TRUE);

-- Add reviews for Dell XPS 15 (product_id = 4)
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(4, 4, 9, 4, 'Great Windows Laptop', 'Powerful performance, good screen. Bit heavy though.', 'Approved', TRUE),
(4, 5, 10, 4, 'Solid Choice', 'Good for work and gaming. Battery could be better.', 'Approved', TRUE);

-- Add reviews for Men Casual Shirt (product_id = 5)
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(5, 1, 11, 3, 'Decent Shirt', 'Quality is okay for the price. Color faded after few washes.', 'Approved', TRUE),
(5, 2, 12, 4, 'Good Fit', 'Comfortable and fits well. Good value for money.', 'Approved', TRUE);

-- ============================================
-- STEP 2: Query to Find Highest Rated Product
-- ============================================

-- Option 1: Find THE Highest Rated Product with User Details
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.average_rating,
    p.total_reviews,
    r.review_id,
    r.rating AS user_rating,
    CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name,
    u.email AS reviewer_email,
    r.review_title,
    r.review_text,
    r.is_verified_purchase,
    r.created_at AS review_date
FROM products p
INNER JOIN reviews r ON p.product_id = r.product_id
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
    AND p.product_id = (
        -- Subquery to find product with highest average rating
        SELECT product_id 
        FROM products 
        WHERE total_reviews > 0
        ORDER BY average_rating DESC, total_reviews DESC 
        LIMIT 1
    )
ORDER BY r.rating DESC, r.created_at DESC;

-- ============================================
-- Option 2: Top 5 Products by Rating with All Reviews
-- ============================================

SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.average_rating,
    p.total_reviews,
    r.review_id,
    r.rating AS user_rating,
    CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name,
    u.email AS reviewer_email,
    r.review_title,
    r.review_text,
    r.is_verified_purchase,
    r.created_at AS review_date
FROM products p
INNER JOIN reviews r ON p.product_id = r.product_id
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
    AND p.total_reviews > 0
ORDER BY p.average_rating DESC, p.total_reviews DESC, r.rating DESC
LIMIT 10;

-- ============================================
-- Option 3: Product with Most 5-Star Reviews
-- ============================================

SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.average_rating,
    p.total_reviews,
    COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS five_star_count,
    GROUP_CONCAT(
        CONCAT(u.first_name, ' ', u.last_name, ' (', r.rating, '⭐)')
        ORDER BY r.rating DESC
        SEPARATOR ', '
    ) AS all_reviewers
FROM products p
INNER JOIN reviews r ON p.product_id = r.product_id
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
GROUP BY p.product_id
HAVING COUNT(CASE WHEN r.rating = 5 THEN 1 END) > 0
ORDER BY five_star_count DESC, p.average_rating DESC
LIMIT 1;

-- ============================================
-- Option 4: Detailed Breakdown of Top Product
-- ============================================

-- First, get the top product
SET @top_product_id = (
    SELECT product_id 
    FROM products 
    WHERE total_reviews > 0
    ORDER BY average_rating DESC, total_reviews DESC 
    LIMIT 1
);

-- Show product details
SELECT 
    product_id,
    product_name,
    brand,
    average_rating,
    total_reviews,
    price,
    discount_percentage
FROM products 
WHERE product_id = @top_product_id;

-- Show all reviews for top product
SELECT 
    r.review_id,
    CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name,
    u.email AS reviewer_email,
    r.rating,
    r.review_title,
    r.review_text,
    r.is_verified_purchase,
    r.helpful_count,
    r.created_at AS review_date
FROM reviews r
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.product_id = @top_product_id
    AND r.review_status = 'Approved'
ORDER BY r.rating DESC, r.created_at DESC;

-- Show rating distribution
SELECT 
    p.product_name,
    p.average_rating,
    SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) AS five_star,
    SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END) AS four_star,
    SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END) AS three_star,
    SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END) AS two_star,
    SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) AS one_star,
    COUNT(*) AS total_reviews
FROM products p
INNER JOIN reviews r ON p.product_id = r.product_id
WHERE r.review_status = 'Approved'
    AND p.product_id = @top_product_id
GROUP BY p.product_id;

