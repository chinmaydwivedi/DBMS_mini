-- ============================================
-- FLIPKART E-COMMERCE DATABASE APPLICATION
-- Team Members: [Student Name 1], [Student Name 2]
-- Database Management System Project
-- ============================================

-- CREATE DATABASE
DROP DATABASE IF EXISTS flipkart_ecommerce;
CREATE DATABASE flipkart_ecommerce;
USE flipkart_ecommerce;

-- ============================================
-- DROP EXISTING TABLES (in reverse order of dependencies)
-- ============================================

DROP TABLE IF EXISTS returns;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS delivery;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS coupon_usage;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS product_qna;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS flash_deal_products;
DROP TABLE IF EXISTS flash_deals;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_category;
DROP TABLE IF EXISTS customer_support_tickets;
DROP TABLE IF EXISTS seller_bank_details;
DROP TABLE IF EXISTS sellers;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS membership_benefits;
DROP TABLE IF EXISTS user_membership;
DROP TABLE IF EXISTS membership_plans;
DROP TABLE IF EXISTS users;

-- ============================================
-- USER TABLE
-- ============================================

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
    profile_picture_url VARCHAR(500),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    account_status ENUM('Active', 'Suspended', 'Closed') DEFAULT 'Active',
    loyalty_points INT DEFAULT 0,
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    INDEX idx_account_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MEMBERSHIP PLANS TABLE
-- ============================================

CREATE TABLE membership_plans (
    plan_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plan_name VARCHAR(100) NOT NULL UNIQUE,
    plan_type ENUM('Free', 'Silver', 'Gold', 'Platinum') NOT NULL,
    plan_description TEXT,
    monthly_price DECIMAL(10, 2) DEFAULT 0.00,
    annual_price DECIMAL(10, 2) DEFAULT 0.00,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    free_delivery BOOLEAN DEFAULT FALSE,
    priority_support BOOLEAN DEFAULT FALSE,
    early_sale_access BOOLEAN DEFAULT FALSE,
    cashback_percentage DECIMAL(5, 2) DEFAULT 0.00,
    max_cashback_per_order DECIMAL(10, 2) DEFAULT 0.00,
    warranty_extension_months INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_plan_type (plan_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER MEMBERSHIP TABLE
-- ============================================

CREATE TABLE user_membership (
    membership_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renewal BOOLEAN DEFAULT FALSE,
    membership_status ENUM('Active', 'Expired', 'Cancelled', 'Suspended') DEFAULT 'Active',
    payment_method VARCHAR(50),
    amount_paid DECIMAL(10, 2) NOT NULL,
    benefits_used JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(plan_id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_membership_status (membership_status),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MEMBERSHIP BENEFITS TABLE
-- ============================================

CREATE TABLE membership_benefits (
    benefit_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    membership_id BIGINT NOT NULL,
    benefit_type ENUM('Discount', 'Cashback', 'FreeDelivery', 'PrioritySupport', 'EarlyAccess', 'WarrantyExtension', 'Other') NOT NULL,
    benefit_description TEXT,
    benefit_value DECIMAL(10, 2),
    usage_count INT DEFAULT 0,
    usage_limit INT DEFAULT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES user_membership(membership_id) ON DELETE CASCADE,
    INDEX idx_membership_id (membership_id),
    INDEX idx_benefit_type (benefit_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER ADDRESSES TABLE
-- ============================================

CREATE TABLE user_addresses (
    address_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    address_type ENUM('Home', 'Work', 'Other') NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_pincode (pincode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SELLER TABLE
-- ============================================

CREATE TABLE sellers (
    seller_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_email VARCHAR(255) UNIQUE NOT NULL,
    business_phone VARCHAR(15) NOT NULL,
    gstin VARCHAR(15) UNIQUE NOT NULL,
    pan_number VARCHAR(10) UNIQUE NOT NULL,
    business_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    seller_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_products INT DEFAULT 0,
    total_sales BIGINT DEFAULT 0,
    commission_rate DECIMAL(5, 2) DEFAULT 10.00,
    account_status ENUM('Active', 'Suspended', 'UnderReview', 'Rejected') DEFAULT 'UnderReview',
    verified_seller BOOLEAN DEFAULT FALSE,
    return_policy TEXT,
    shipping_policy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_business_email (business_email),
    INDEX idx_account_status (account_status),
    INDEX idx_seller_rating (seller_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SELLER BANK DETAILS TABLE
-- ============================================

CREATE TABLE seller_bank_details (
    bank_detail_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT UNIQUE NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255),
    account_type ENUM('Savings', 'Current') DEFAULT 'Current',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(seller_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCT CATEGORY TABLE
-- ============================================

CREATE TABLE product_category (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    parent_category_id BIGINT DEFAULT NULL,
    category_description TEXT,
    category_image_url VARCHAR(500),
    level INT DEFAULT 1,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES product_category(category_id) ON DELETE SET NULL,
    INDEX idx_parent_category (parent_category_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE products (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    brand VARCHAR(255),
    model_number VARCHAR(100),
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    specifications JSON,
    original_price DECIMAL(12, 2) NOT NULL,
    selling_price DECIMAL(12, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    weight DECIMAL(8, 2),
    dimensions VARCHAR(100),
    color VARCHAR(50),
    size VARCHAR(50),
    material VARCHAR(100),
    warranty_period VARCHAR(100),
    product_status ENUM('Active', 'Inactive', 'OutOfStock', 'Discontinued') DEFAULT 'Active',
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    hsn_code VARCHAR(10),
    tax_rate DECIMAL(5, 2) DEFAULT 18.00,
    return_eligible BOOLEAN DEFAULT TRUE,
    cod_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_category(category_id) ON DELETE RESTRICT,
    INDEX idx_seller_id (seller_id),
    INDEX idx_category_id (category_id),
    INDEX idx_sku (sku),
    INDEX idx_product_status (product_status),
    INDEX idx_selling_price (selling_price),
    INDEX idx_average_rating (average_rating),
    FULLTEXT idx_product_search (product_name, brand, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================

CREATE TABLE product_images (
    image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('Primary', 'Gallery', 'Thumbnail') DEFAULT 'Gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FLASH DEALS TABLE
-- ============================================

CREATE TABLE flash_deals (
    deal_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    deal_name VARCHAR(255) NOT NULL,
    deal_description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    discount_type ENUM('Percentage', 'FixedAmount') DEFAULT 'Percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2),
    deal_status ENUM('Scheduled', 'Active', 'Expired', 'Cancelled') DEFAULT 'Scheduled',
    banner_image_url VARCHAR(500),
    total_quantity INT,
    remaining_quantity INT,
    max_orders_per_user INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_deal_status (deal_status),
    INDEX idx_start_end_time (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FLASH DEAL PRODUCTS TABLE
-- ============================================

CREATE TABLE flash_deal_products (
    deal_product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    deal_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    deal_price DECIMAL(12, 2) NOT NULL,
    stock_allocated INT NOT NULL,
    stock_remaining INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES flash_deals(deal_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_deal_product (deal_id, product_id),
    INDEX idx_deal_id (deal_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    review_images JSON,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    review_status ENUM('Pending', 'Approved', 'Rejected', 'Flagged') DEFAULT 'Pending',
    seller_response TEXT,
    seller_response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_review_status (review_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCT Q&A TABLE
-- ============================================

CREATE TABLE product_qna (
    qna_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by BIGINT,
    answered_by_type ENUM('Seller', 'User', 'Admin'),
    is_verified_answer BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    question_status ENUM('Pending', 'Answered', 'Flagged') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_question_status (question_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WISHLIST TABLE
-- ============================================

CREATE TABLE wishlist (
    wishlist_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WISHLIST ITEMS TABLE
-- ============================================

CREATE TABLE wishlist_items (
    wishlist_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    wishlist_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES wishlist(wishlist_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_product (wishlist_id, product_id),
    INDEX idx_wishlist_id (wishlist_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COUPONS TABLE
-- ============================================

CREATE TABLE coupons (
    coupon_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    coupon_name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('Percentage', 'FixedAmount', 'FreeShipping') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2),
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    usage_limit_per_user INT DEFAULT 1,
    applicable_categories JSON,
    applicable_products JSON,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    coupon_type ENUM('Public', 'Private', 'FirstOrder', 'Referral', 'Membership') DEFAULT 'Public',
    membership_plan_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_plan_id) REFERENCES membership_plans(plan_id) ON DELETE SET NULL,
    INDEX idx_coupon_code (coupon_code),
    INDEX idx_is_active (is_active),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COUPON USAGE TABLE
-- ============================================

CREATE TABLE coupon_usage (
    usage_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CART TABLE
-- ============================================

CREATE TABLE cart (
    cart_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CART ITEMS TABLE
-- ============================================

CREATE TABLE cart_items (
    cart_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_addition DECIMAL(12, 2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id),
    INDEX idx_cart_id (cart_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PAYMENT TABLE
-- ============================================

CREATE TABLE payment (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    payment_method ENUM('CreditCard', 'DebitCard', 'NetBanking', 'UPI', 'Wallet', 'COD', 'EMI') NOT NULL,
    payment_gateway VARCHAR(100),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status ENUM('Pending', 'Processing', 'Success', 'Failed', 'Refunded', 'PartiallyRefunded') DEFAULT 'Pending',
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(12, 2) DEFAULT 0.00,
    refund_date TIMESTAMP NULL,
    gateway_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    payment_id BIGINT,
    membership_id BIGINT,
    shipping_address_id BIGINT NOT NULL,
    billing_address_id BIGINT NOT NULL,
    subtotal_amount DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_charges DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    membership_discount DECIMAL(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    total_amount DECIMAL(12, 2) NOT NULL,
    order_status ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded') DEFAULT 'Pending',
    payment_mode ENUM('Prepaid', 'COD') NOT NULL,
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE RESTRICT,
    FOREIGN KEY (membership_id) REFERENCES user_membership(membership_id) ON DELETE SET NULL,
    FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(address_id) ON DELETE RESTRICT,
    FOREIGN KEY (billing_address_id) REFERENCES user_addresses(address_id) ON DELETE RESTRICT,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_order_status (order_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================

CREATE TABLE order_items (
    order_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_price DECIMAL(12, 2) NOT NULL,
    item_status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_id) REFERENCES sellers(seller_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_item_status (item_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DELIVERY TABLE
-- ============================================

CREATE TABLE delivery (
    delivery_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNIQUE NOT NULL,
    tracking_number VARCHAR(100) UNIQUE,
    courier_partner VARCHAR(255),
    shipping_method ENUM('Standard', 'Express', 'SameDay', 'NextDay') DEFAULT 'Standard',
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    shipped_date TIMESTAMP NULL,
    out_for_delivery_date TIMESTAMP NULL,
    delivery_status ENUM('Pending', 'PickedUp', 'InTransit', 'OutForDelivery', 'Delivered', 'Failed', 'Returned') DEFAULT 'Pending',
    delivery_attempts INT DEFAULT 0,
    delivery_instructions TEXT,
    delivered_to VARCHAR(255),
    signature_image_url VARCHAR(500),
    delivery_proof_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_delivery_status (delivery_status),
    INDEX idx_estimated_delivery (estimated_delivery_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RETURNS TABLE
-- ============================================

CREATE TABLE returns (
    return_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    return_number VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT NOT NULL,
    order_item_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    return_reason ENUM('Defective', 'WrongItem', 'NotAsDescribed', 'NotNeeded', 'BetterPriceAvailable', 'Other') NOT NULL,
    return_description TEXT,
    return_images JSON,
    return_quantity INT NOT NULL,
    refund_amount DECIMAL(12, 2) NOT NULL,
    return_status ENUM('Requested', 'Approved', 'PickupScheduled', 'PickedUp', 'InTransit', 'Received', 'Inspected', 'Refunded', 'Rejected', 'Cancelled') DEFAULT 'Requested',
    pickup_address_id BIGINT,
    tracking_number VARCHAR(100),
    admin_notes TEXT,
    refund_method ENUM('OriginalPayment', 'Wallet', 'BankTransfer'),
    refund_initiated_at TIMESTAMP NULL,
    refund_completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (pickup_address_id) REFERENCES user_addresses(address_id) ON DELETE SET NULL,
    INDEX idx_return_number (return_number),
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_return_status (return_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CUSTOMER SUPPORT TICKETS TABLE
-- ============================================

CREATE TABLE customer_support_tickets (
    ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    product_id BIGINT,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    ticket_category ENUM('Order', 'Product', 'Payment', 'Delivery', 'Return', 'Membership', 'Technical', 'General', 'Complaint') NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    ticket_status ENUM('Open', 'InProgress', 'Waiting', 'Resolved', 'Closed', 'Reopened') DEFAULT 'Open',
    assigned_to BIGINT,
    resolution TEXT,
    attachments JSON,
    customer_satisfaction_rating INT CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL,
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_user_id (user_id),
    INDEX idx_ticket_status (ticket_status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADD FOREIGN KEY FOR COUPON_USAGE TO ORDERS
-- ============================================

ALTER TABLE coupon_usage 
ADD CONSTRAINT fk_coupon_usage_order 
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL;

-- ============================================
-- END OF SCHEMA CREATION
-- ============================================

