-- ============================================
-- QUICK DATA ADDITION TEMPLATE
-- ============================================

USE flipkart_ecommerce;

-- 1. ADD A NEW PRODUCT
INSERT INTO products (
    seller_id,           -- Check: SELECT seller_id FROM sellers;
    category_id,         -- Check: SELECT category_id FROM product_category;
    product_name,
    brand,
    sku,                 -- Must be UNIQUE
    description,
    original_price,
    selling_price,
    discount_percentage,
    stock_quantity,
    product_status,      -- 'Active', 'Inactive', 'OutOfStock', 'Discontinued'
    is_featured,         -- TRUE or FALSE
    cod_available        -- TRUE or FALSE
) VALUES (
    1,                   -- Replace with actual seller_id
    5,                   -- Replace with actual category_id
    'Product Name',
    'Brand Name',
    'SKU-UNIQUE-001',    -- Must be unique
    'Product description here',
    10000.00,
    9000.00,
    10.00,
    50,
    'Active',
    FALSE,
    TRUE
);

-- Get the product_id that was just inserted
SET @new_product_id = LAST_INSERT_ID();

-- 2. ADD PRODUCT IMAGE
INSERT INTO product_images (product_id, image_url, image_type, display_order)
VALUES (@new_product_id, 'https://example.com/image.jpg', 'Primary', 1);

-- 3. ADD A NEW USER
INSERT INTO users (
    email,               -- Must be UNIQUE
    password_hash,
    first_name,
    last_name,
    phone_number,       -- Must be UNIQUE
    gender,
    account_status
) VALUES (
    'newuser@example.com',
    '$2y$10$hashedpasswordhere',
    'First',
    'Last',
    '+919999999999',
    'Male',
    'Active'
);

-- 4. ADD A NEW CATEGORY
INSERT INTO product_category (
    category_name,
    parent_category_id,  -- NULL for top-level categories
    category_description,
    level,
    is_active
) VALUES (
    'New Category',
    NULL,                -- NULL for top-level, or category_id for subcategory
    'Category description',
    1,
    TRUE
);

-- 5. ADD A NEW SELLER
INSERT INTO sellers (
    business_name,
    business_email,     -- Must be UNIQUE
    business_phone,
    gstin,              -- Must be UNIQUE
    pan_number,         -- Must be UNIQUE
    business_address,
    city,
    state,
    pincode,
    account_status,
    verified_seller
) VALUES (
    'New Seller Business',
    'seller@example.com',
    '+919888888888',
    '29ABCDE1234F1Z5',
    'ABCDE1234F',
    'Business Address',
    'City',
    'State',
    '123456',
    'Active',
    FALSE
);
