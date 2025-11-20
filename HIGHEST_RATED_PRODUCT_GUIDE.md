# 🌟 Highest Rated Product Query Guide

This guide contains MySQL queries to add sample ratings and find the highest rated products with user details.

---

## 📋 Quick Copy-Paste for MySQL Workbench

### STEP 1: Add Sample Reviews to Database

```sql
USE flipkart_ecommerce;

-- Add reviews for iPhone 15 Pro
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(1, 1, 1, 5, 'Excellent Phone!', 'Best iPhone yet. Camera is amazing, battery life is great.', 'Approved', TRUE),
(1, 2, 2, 5, 'Worth every penny', 'Premium build quality and smooth performance.', 'Approved', TRUE),
(1, 3, 3, 4, 'Great but expensive', 'Love the phone but wish it was more affordable.', 'Approved', TRUE);

-- Add reviews for Samsung Galaxy S24
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(2, 1, 4, 5, 'Amazing Display!', 'The screen is absolutely stunning. Best Android phone.', 'Approved', TRUE),
(2, 4, 5, 5, 'Perfect Phone', 'Everything works flawlessly. Highly recommend!', 'Approved', TRUE),
(2, 5, 6, 5, 'Best Purchase Ever', 'Camera quality is outstanding. Battery lasts all day.', 'Approved', TRUE);

-- Add reviews for MacBook Pro
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(3, 2, 7, 5, 'Perfect for Developers', 'M2 chip is incredibly fast. Best laptop for coding.', 'Approved', TRUE),
(3, 3, 8, 5, 'MacBook Excellence', 'Build quality is top-notch. Worth the investment.', 'Approved', TRUE);

SELECT 'Sample reviews added successfully!' AS Status;
```

---

### STEP 2: Find Highest Rated Product with User Details

```sql
-- Find THE highest rated product with all reviewer details
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.average_rating,
    p.total_reviews,
    r.rating AS user_rating,
    CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name,
    u.email AS reviewer_email,
    r.review_title,
    r.review_text,
    r.is_verified_purchase,
    DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS review_date
FROM products p
INNER JOIN reviews r ON p.product_id = r.product_id
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
    AND p.product_id = (
        -- Find product with highest average rating
        SELECT product_id 
        FROM products 
        WHERE total_reviews > 0
        ORDER BY average_rating DESC, total_reviews DESC 
        LIMIT 1
    )
ORDER BY r.rating DESC, r.created_at DESC;
```

---

## 📊 Additional Useful Queries

### Query 1: Top 5 Highest Rated Products

```sql
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.average_rating,
    p.total_reviews,
    p.price,
    CONCAT('₹', FORMAT(p.price, 0)) AS formatted_price
FROM products p
WHERE p.total_reviews > 0
ORDER BY p.average_rating DESC, p.total_reviews DESC
LIMIT 5;
```

### Query 2: Product with Most 5-Star Reviews

```sql
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.average_rating,
    COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS five_star_count,
    GROUP_CONCAT(
        CONCAT(u.first_name, ' ', u.last_name)
        ORDER BY r.created_at DESC
        SEPARATOR ', '
    ) AS reviewers_with_5_stars
FROM products p
INNER JOIN reviews r ON p.product_id = r.product_id
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
GROUP BY p.product_id
HAVING five_star_count > 0
ORDER BY five_star_count DESC, p.average_rating DESC
LIMIT 1;
```

### Query 3: Detailed Rating Distribution

```sql
SELECT 
    p.product_name,
    p.brand,
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
    AND p.product_id = (
        SELECT product_id 
        FROM products 
        WHERE total_reviews > 0
        ORDER BY average_rating DESC 
        LIMIT 1
    )
GROUP BY p.product_id;
```

### Query 4: All Reviews for Highest Rated Product

```sql
-- Set variable for top product
SET @top_product_id = (
    SELECT product_id 
    FROM products 
    WHERE total_reviews > 0
    ORDER BY average_rating DESC, total_reviews DESC 
    LIMIT 1
);

-- Show all reviews
SELECT 
    r.review_id,
    CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name,
    u.email AS reviewer_email,
    r.rating,
    r.review_title,
    r.review_text,
    CASE WHEN r.is_verified_purchase THEN '✓ Verified' ELSE '' END AS verified,
    DATE_FORMAT(r.created_at, '%d %b %Y') AS review_date
FROM reviews r
INNER JOIN users u ON r.user_id = u.user_id
WHERE r.product_id = @top_product_id
    AND r.review_status = 'Approved'
ORDER BY r.rating DESC, r.created_at DESC;
```

### Query 5: User Who Gave Highest Rating

```sql
-- Find users who gave 5-star ratings to the highest rated product
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    u.email,
    u.phone_number,
    r.rating,
    r.review_title,
    r.review_text,
    DATE_FORMAT(r.created_at, '%d %b %Y at %H:%i') AS reviewed_on
FROM reviews r
INNER JOIN users u ON r.user_id = u.user_id
INNER JOIN products p ON r.product_id = p.product_id
WHERE r.rating = 5
    AND r.review_status = 'Approved'
    AND p.product_id = (
        SELECT product_id 
        FROM products 
        WHERE total_reviews > 0
        ORDER BY average_rating DESC, total_reviews DESC 
        LIMIT 1
    )
ORDER BY r.created_at DESC;
```

---

## 🎯 Current Test Results

Based on our test, here's what we found:

**Highest Rated Product:**
- **Product:** MacBook Air M2 13-inch
- **Brand:** Apple
- **Average Rating:** 5.00 ⭐⭐⭐⭐⭐
- **Total Reviews:** 2

**Reviewers:**
1. **Jane Smith** (jane.smith@example.com) - 5⭐ - "Excellent Laptop"
2. **Robert Wilson** (robert.wilson@example.com) - 5⭐ - "Best Laptop"

---

## 📝 How to Use in MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Copy STEP 1** code above
4. **Paste in query editor**
5. **Click Execute** (⚡ icon)
6. **Copy STEP 2** code
7. **Paste and Execute**
8. **View Results!**

---

## 🔍 Understanding the Query

The main query does the following:

1. **INNER JOIN products & reviews** - Links products with their reviews
2. **INNER JOIN users** - Gets reviewer information
3. **WHERE r.review_status = 'Approved'** - Only counts approved reviews
4. **Subquery** - Finds product with highest average_rating
5. **ORDER BY** - Shows highest ratings first
6. **Returns:**
   - Product details (name, brand, rating)
   - User details (name, email)
   - Review details (rating, title, text)

---

## ⚡ Quick Single Query (Copy This!)

```sql
USE flipkart_ecommerce;

-- Add sample reviews first
INSERT INTO reviews (product_id, user_id, order_id, rating, review_title, review_text, review_status, is_verified_purchase) 
VALUES 
(1, 1, 1, 5, 'Excellent!', 'Amazing product, highly recommend!', 'Approved', TRUE),
(2, 2, 2, 5, 'Perfect!', 'Best purchase ever!', 'Approved', TRUE),
(3, 3, 3, 5, 'Outstanding!', 'Exceeded expectations!', 'Approved', TRUE);

-- Find highest rated product with reviewers
SELECT 
    p.product_name AS 'Product',
    p.brand AS 'Brand',
    p.average_rating AS 'Rating',
    p.total_reviews AS 'Reviews',
    CONCAT(u.first_name, ' ', u.last_name) AS 'Reviewer',
    r.rating AS 'User Rating',
    r.review_title AS 'Review Title'
FROM products p
JOIN reviews r ON p.product_id = r.product_id
JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
    AND p.product_id = (
        SELECT product_id 
        FROM products 
        WHERE total_reviews > 0
        ORDER BY average_rating DESC, total_reviews DESC 
        LIMIT 1
    )
ORDER BY r.rating DESC;
```

---

## ✅ Expected Output Format

| Product | Brand | Rating | Reviews | Reviewer | User Rating | Review Title |
|---------|-------|--------|---------|----------|-------------|--------------|
| MacBook Air M2 | Apple | 5.00 | 2 | Jane Smith | 5 | Excellent Laptop |
| MacBook Air M2 | Apple | 5.00 | 2 | Robert Wilson | 5 | Best Laptop |

---

## 🎨 Bonus: Pretty Formatted Output

```sql
SELECT 
    CONCAT('🏆 ', p.product_name) AS 'Top Product',
    CONCAT('⭐ ', p.average_rating, '/5') AS 'Rating',
    CONCAT('👤 ', u.first_name, ' ', u.last_name) AS 'Reviewer',
    CONCAT('⭐', r.rating) AS 'User Rating',
    r.review_title AS 'Review'
FROM products p
JOIN reviews r ON p.product_id = r.product_id
JOIN users u ON r.user_id = u.user_id
WHERE r.review_status = 'Approved'
    AND p.product_id = (
        SELECT product_id 
        FROM products 
        WHERE total_reviews > 0
        ORDER BY average_rating DESC 
        LIMIT 1
    )
ORDER BY r.rating DESC;
```

---

**File Location:** `/Users/chinmaydwivedi/Documents/DBMS_MINI/highest_rated_product_query.sql`

**Last Updated:** November 20, 2025


