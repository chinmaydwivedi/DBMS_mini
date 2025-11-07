-- ============================================
-- USER MANAGEMENT AND PRIVILEGES
-- ============================================

USE flipkart_ecommerce;

-- ============================================
-- CREATE USERS WITH DIFFERENT PRIVILEGES
-- ============================================

-- Create Admin User (Full privileges)
CREATE USER IF NOT EXISTS 'flipkart_admin'@'localhost' IDENTIFIED BY 'Admin@123';
GRANT ALL PRIVILEGES ON flipkart_ecommerce.* TO 'flipkart_admin'@'localhost';
FLUSH PRIVILEGES;

-- Create Seller User (Limited privileges - can only manage their own products)
CREATE USER IF NOT EXISTS 'flipkart_seller'@'localhost' IDENTIFIED BY 'Seller@123';
GRANT SELECT, INSERT, UPDATE ON flipkart_ecommerce.products TO 'flipkart_seller'@'localhost';
GRANT SELECT, INSERT, UPDATE ON flipkart_ecommerce.product_images TO 'flipkart_seller'@'localhost';
GRANT SELECT ON flipkart_ecommerce.product_category TO 'flipkart_seller'@'localhost';
GRANT SELECT ON flipkart_ecommerce.sellers TO 'flipkart_seller'@'localhost';
GRANT SELECT ON flipkart_ecommerce.order_items TO 'flipkart_seller'@'localhost';
GRANT SELECT ON flipkart_ecommerce.orders TO 'flipkart_seller'@'localhost';
GRANT SELECT ON flipkart_ecommerce.reviews TO 'flipkart_seller'@'localhost';
GRANT EXECUTE ON PROCEDURE flipkart_ecommerce.calculate_seller_commission TO 'flipkart_seller'@'localhost';
FLUSH PRIVILEGES;

-- Create Customer User (Read-only and limited write privileges)
CREATE USER IF NOT EXISTS 'flipkart_customer'@'localhost' IDENTIFIED BY 'Customer@123';
GRANT SELECT ON flipkart_ecommerce.products TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.product_category TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.product_images TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.reviews TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.flash_deals TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.flash_deal_products TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.coupons TO 'flipkart_customer'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON flipkart_ecommerce.cart TO 'flipkart_customer'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON flipkart_ecommerce.cart_items TO 'flipkart_customer'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON flipkart_ecommerce.wishlist TO 'flipkart_customer'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON flipkart_ecommerce.wishlist_items TO 'flipkart_customer'@'localhost';
GRANT SELECT, INSERT ON flipkart_ecommerce.reviews TO 'flipkart_customer'@'localhost';
GRANT SELECT, INSERT ON flipkart_ecommerce.product_qna TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.orders TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.order_items TO 'flipkart_customer'@'localhost';
GRANT SELECT ON flipkart_ecommerce.delivery TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON PROCEDURE flipkart_ecommerce.place_order TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON PROCEDURE flipkart_ecommerce.get_user_orders TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON FUNCTION flipkart_ecommerce.get_loyalty_tier TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON FUNCTION flipkart_ecommerce.calculate_delivery_days TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON FUNCTION flipkart_ecommerce.is_product_available TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON FUNCTION flipkart_ecommerce.calculate_order_discount TO 'flipkart_customer'@'localhost';
GRANT EXECUTE ON FUNCTION flipkart_ecommerce.get_user_total_spending TO 'flipkart_customer'@'localhost';
FLUSH PRIVILEGES;

-- Create Analyst User (Read-only for reporting)
CREATE USER IF NOT EXISTS 'flipkart_analyst'@'localhost' IDENTIFIED BY 'Analyst@123';
GRANT SELECT ON flipkart_ecommerce.* TO 'flipkart_analyst'@'localhost';
GRANT EXECUTE ON PROCEDURE flipkart_ecommerce.get_top_selling_products TO 'flipkart_analyst'@'localhost';
GRANT EXECUTE ON PROCEDURE flipkart_ecommerce.calculate_seller_commission TO 'flipkart_analyst'@'localhost';
GRANT EXECUTE ON FUNCTION flipkart_ecommerce.get_user_total_spending TO 'flipkart_analyst'@'localhost';
FLUSH PRIVILEGES;

-- Create Support User (Can view and update support tickets)
CREATE USER IF NOT EXISTS 'flipkart_support'@'localhost' IDENTIFIED BY 'Support@123';
GRANT SELECT ON flipkart_ecommerce.users TO 'flipkart_support'@'localhost';
GRANT SELECT ON flipkart_ecommerce.orders TO 'flipkart_support'@'localhost';
GRANT SELECT ON flipkart_ecommerce.order_items TO 'flipkart_support'@'localhost';
GRANT SELECT ON flipkart_ecommerce.products TO 'flipkart_support'@'localhost';
GRANT SELECT, INSERT, UPDATE ON flipkart_ecommerce.customer_support_tickets TO 'flipkart_support'@'localhost';
GRANT SELECT, INSERT, UPDATE ON flipkart_ecommerce.returns TO 'flipkart_support'@'localhost';
GRANT EXECUTE ON PROCEDURE flipkart_ecommerce.process_return TO 'flipkart_support'@'localhost';
FLUSH PRIVILEGES;

-- ============================================
-- VIEW PRIVILEGES
-- ============================================

-- View privileges for admin user
SHOW GRANTS FOR 'flipkart_admin'@'localhost';

-- View privileges for seller user
SHOW GRANTS FOR 'flipkart_seller'@'localhost';

-- View privileges for customer user
SHOW GRANTS FOR 'flipkart_customer'@'localhost';

-- View privileges for analyst user
SHOW GRANTS FOR 'flipkart_analyst'@'localhost';

-- View privileges for support user
SHOW GRANTS FOR 'flipkart_support'@'localhost';

-- ============================================
-- REVOKE PRIVILEGES (Example)
-- ============================================

-- Example: Revoke DELETE privilege from seller
-- REVOKE DELETE ON flipkart_ecommerce.products FROM 'flipkart_seller'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- DROP USERS (Use with caution)
-- ============================================

-- Example: Drop a user
-- DROP USER IF EXISTS 'flipkart_test'@'localhost';

-- ============================================
-- CHANGE PASSWORD
-- ============================================

-- Example: Change password for a user
-- ALTER USER 'flipkart_customer'@'localhost' IDENTIFIED BY 'NewPassword@123';
-- FLUSH PRIVILEGES;

-- ============================================
-- END OF USER MANAGEMENT
-- ============================================

