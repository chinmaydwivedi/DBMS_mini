-- ============================================
-- TRIGGERS
-- ============================================

USE flipkart_ecommerce;

-- ============================================
-- Trigger 1: Auto-create cart and wishlist when a new user registers
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS after_user_insert //

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO cart (user_id) VALUES (NEW.user_id);
    INSERT INTO wishlist (user_id) VALUES (NEW.user_id);
END //

DELIMITER ;

-- ============================================
-- Trigger 2: Update product average rating after review insertion
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS after_review_insert //

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET average_rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE product_id = NEW.product_id AND review_status = 'Approved'
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE product_id = NEW.product_id AND review_status = 'Approved'
    )
    WHERE product_id = NEW.product_id;
END //

DELIMITER ;

-- ============================================
-- Trigger 3: Update product stock after order placement (REMOVED)
-- This logic has been moved into the `place_order` stored procedure 
-- to avoid "Can't update table 'products' in stored function/trigger" errors.
-- ============================================

-- DELIMITER //
-- 
-- DROP TRIGGER IF EXISTS after_order_item_insert //
-- 
-- CREATE TRIGGER after_order_item_insert
-- AFTER INSERT ON order_items
-- FOR EACH ROW
-- BEGIN
--     UPDATE products 
--     SET stock_quantity = stock_quantity - NEW.quantity,
--         total_sales = total_sales + NEW.quantity
--     WHERE product_id = NEW.product_id;
--     
--     -- Update product status if out of stock
--     UPDATE products 
--     SET product_status = 'OutOfStock'
--     WHERE product_id = NEW.product_id AND stock_quantity <= 0;
-- END //
-- 
-- DELIMITER ;

-- ============================================
-- Trigger 4: Update seller statistics after new product addition
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS after_product_insert //

CREATE TRIGGER after_product_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    UPDATE sellers 
    SET total_products = total_products + 1
    WHERE seller_id = NEW.seller_id;
END //

DELIMITER ;

-- ============================================
-- Trigger 5: Auto-generate order number before insert
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS before_order_insert //

CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE order_count INT;
    SET order_count = (SELECT COUNT(*) FROM orders) + 1;
    SET NEW.order_number = CONCAT('ORD', LPAD(order_count, 10, '0'));
END //

DELIMITER ;

-- ============================================
-- Trigger 6: Update membership status on expiry
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS check_membership_expiry //

CREATE TRIGGER check_membership_expiry
BEFORE UPDATE ON user_membership
FOR EACH ROW
BEGIN
    IF NEW.end_date < CURDATE() AND NEW.membership_status = 'Active' THEN
        SET NEW.membership_status = 'Expired';
    END IF;
END //

DELIMITER ;

-- ============================================
-- Trigger 7: Apply loyalty points on order delivery
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS after_order_delivered //

CREATE TRIGGER after_order_delivered
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'Delivered' AND OLD.order_status != 'Delivered' THEN
        UPDATE users 
        SET loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 100)
        WHERE user_id = NEW.user_id;
    END IF;
END //

DELIMITER ;

-- ============================================
-- Trigger 8: Auto-generate return number
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS before_return_insert //

CREATE TRIGGER before_return_insert
BEFORE INSERT ON returns
FOR EACH ROW
BEGIN
    DECLARE return_count INT;
    SET return_count = (SELECT COUNT(*) FROM returns) + 1;
    SET NEW.return_number = CONCAT('RET', LPAD(return_count, 10, '0'));
END //

DELIMITER ;

-- ============================================
-- Trigger 9: Update flash deal status based on time
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS update_flash_deal_status //

CREATE TRIGGER update_flash_deal_status
BEFORE UPDATE ON flash_deals
FOR EACH ROW
BEGIN
    IF NOW() >= NEW.start_time AND NOW() <= NEW.end_time AND NEW.deal_status = 'Scheduled' THEN
        SET NEW.deal_status = 'Active';
    ELSEIF NOW() > NEW.end_time AND NEW.deal_status = 'Active' THEN
        SET NEW.deal_status = 'Expired';
    END IF;
END //

DELIMITER ;

-- ============================================
-- Trigger 10: Update product status when stock is low
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS check_low_stock //

CREATE TRIGGER check_low_stock
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity <= NEW.low_stock_threshold AND NEW.stock_quantity > 0 THEN
        -- You can add notification logic here
        SET @low_stock_alert = CONCAT('Low stock alert for product: ', NEW.product_name);
    END IF;
END //

DELIMITER ;

-- ============================================
-- END OF TRIGGERS
-- ============================================

