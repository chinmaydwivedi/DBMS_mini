-- Example: Add a new product
USE flipkart_ecommerce;

-- First, make sure you have a seller (check seller_id)
SELECT seller_id, business_name FROM sellers LIMIT 1;

-- Then add a product (replace seller_id and category_id with actual values)
INSERT INTO products (
    seller_id, 
    category_id, 
    product_name, 
    brand, 
    sku, 
    description, 
    original_price, 
    selling_price, 
    discount_percentage, 
    stock_quantity, 
    product_status, 
    is_featured, 
    cod_available
) VALUES (
    1,  -- seller_id (from sellers table)
    5,  -- category_id (Mobile Phones)
    'OnePlus 12 Pro',
    'OnePlus',
    'OP-12P-256',
    'Latest OnePlus flagship with Snapdragon 8 Gen 3',
    69999.00,
    64999.00,
    7.14,
    30,
    'Active',
    TRUE,
    TRUE
);

-- Add product image
INSERT INTO product_images (product_id, image_url, image_type, display_order)
VALUES (LAST_INSERT_ID(), 'https://example.com/images/oneplus12-1.jpg', 'Primary', 1);
