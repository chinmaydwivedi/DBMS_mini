# Flipkart E-Commerce Database Management System

**Team Members:**
- [Student Name 1] - [Student ID]
- [Student Name 2] - [Student ID]

**Course:** Database Management Systems  
**Institution:** PES University  
**Academic Year:** 2024-2025

---

## 1. Title Page

**Title:** Flipkart E-Commerce Database Management System

**Team Details:**
- Member 1: [Name], [ID]
- Member 2: [Name], [ID]

**Date:** [Submission Date]

---

## 2. Abstract

This project implements a comprehensive database management system for an e-commerce platform inspired by Flipkart. The system manages users, products, orders, payments, deliveries, and various e-commerce functionalities. The database is designed using MySQL with proper normalization, constraints, triggers, stored procedures, and functions to ensure data integrity and efficient operations.

**Key Features:**
- User management with membership plans
- Product catalog with categories
- Order processing and management
- Payment and delivery tracking
- Seller management
- Reviews and ratings
- Flash deals and coupons
- Customer support system

---

## 3. User Requirement Specification

### 3.1 Purpose of the Project

The purpose of this project is to design and implement a robust database management system for an e-commerce platform that handles all aspects of online shopping including user registration, product management, order processing, payment handling, and customer support. The system aims to provide a scalable and efficient solution for managing large volumes of e-commerce transactions while maintaining data integrity and security.

### 3.2 Scope of the Project

The scope includes:
- Database design and implementation
- User authentication and authorization
- Product catalog management
- Shopping cart and wishlist functionality
- Order processing and tracking
- Payment gateway integration (database level)
- Delivery management
- Review and rating system
- Seller management
- Membership and loyalty programs
- Flash deals and promotional offers
- Customer support ticket system

### 3.3 Detailed Description

The Flipkart E-Commerce Database Management System is designed to handle the complete lifecycle of an e-commerce transaction. The system manages multiple user types including customers, sellers, and administrators. Customers can browse products, add items to cart, place orders, make payments, and track deliveries. Sellers can manage their product listings, view sales reports, and handle orders. The system also includes features like membership plans, flash deals, coupons, and customer support.

**Key Entities:**
- Users (Customers, Sellers)
- Products and Categories
- Orders and Order Items
- Payments
- Deliveries
- Reviews and Ratings
- Membership Plans
- Flash Deals
- Coupons
- Customer Support Tickets

### 3.4 Functional Requirements

#### System Functionality 1: User Management
- User registration and authentication
- User profile management
- Address management
- Membership subscription management

#### System Functionality 2: Product Management
- Product catalog with categories
- Product search and filtering
- Product images management
- Stock management
- Product reviews and ratings

#### System Functionality 3: Order Management
- Shopping cart functionality
- Order placement
- Order tracking
- Order status updates
- Order history

#### System Functionality 4: Payment Processing
- Multiple payment methods
- Payment status tracking
- Refund management
- Transaction history

#### System Functionality 5: Delivery Management
- Delivery tracking
- Courier partner management
- Delivery status updates
- Delivery proof management

#### System Functionality 6: Seller Management
- Seller registration
- Product listing management
- Sales reports
- Commission calculation

#### System Functionality 7: Membership and Loyalty
- Membership plan management
- Loyalty points system
- Membership benefits tracking

#### System Functionality 8: Promotions
- Flash deals management
- Coupon management
- Discount application

#### System Functionality 9: Customer Support
- Ticket creation and management
- Ticket assignment
- Resolution tracking

#### System Functionality 10: Reporting and Analytics
- Sales reports
- Product performance reports
- Customer analytics
- Seller performance reports

---

## 4. Software/Tools/Programming Languages Used

- **Database Management System:** MySQL 8.0
- **Database GUI Tool:** MySQL Workbench
- **Programming Language:** SQL (Structured Query Language)
- **Version Control:** Git/GitHub
- **Documentation:** Markdown, Microsoft Word
- **Diagramming Tool:** MySQL Workbench (ER Diagram), Draw.io

---

## 5. ER Diagram

[Insert ER Diagram here - Created using MySQL Workbench or Draw.io]

**Entities:**
- Users
- Membership Plans
- User Membership
- User Addresses
- Sellers
- Seller Bank Details
- Product Category
- Products
- Product Images
- Flash Deals
- Flash Deal Products
- Reviews
- Product Q&A
- Wishlist
- Wishlist Items
- Coupons
- Coupon Usage
- Cart
- Cart Items
- Payment
- Orders
- Order Items
- Delivery
- Returns
- Customer Support Tickets

**Relationships:**
- One-to-Many: User to Orders, User to Addresses
- Many-to-Many: Products to Categories (through hierarchy)
- One-to-One: User to Cart, User to Wishlist
- [Add all relationships]

---

## 6. Relational Schema

[Insert Relational Schema here - Show all tables with attributes and relationships]

### Normalization

**First Normal Form (1NF):** ✓ All attributes are atomic

**Second Normal Form (2NF):** ✓ All non-key attributes fully dependent on primary key

**Third Normal Form (3NF):** ✓ No transitive dependencies

**The database is normalized to 3NF.**

---

## 7. DDL Commands

[Include screenshots and code for all CREATE TABLE statements]

### 7.1 Users Table
```sql
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- [Full DDL]
);
```

[Screenshot: Table creation in MySQL Workbench]

### 7.2 Products Table
[Similar format for all tables]

---

## 8. CRUD Operation Screenshots

### 8.1 CREATE Operations

#### Insert User
[Screenshot: INSERT statement and result]

#### Insert Product
[Screenshot: INSERT statement and result]

[Include screenshots for all CREATE operations]

### 8.2 READ Operations

#### Select All Products
[Screenshot: SELECT query and results]

#### Select Orders with Joins
[Screenshot: JOIN query and results]

[Include screenshots for all READ operations]

### 8.3 UPDATE Operations

#### Update Product Price
[Screenshot: Before UPDATE]
[Screenshot: UPDATE statement]
[Screenshot: After UPDATE]

[Include screenshots for all UPDATE operations]

### 8.4 DELETE Operations

#### Delete Cart Item
[Screenshot: DELETE statement and result]

[Include screenshots for all DELETE operations]

---

## 9. List of Functionalities/Features

### 9.1 User Registration and Login
[Screenshot: User registration form/data]
[Screenshot: User login verification]

### 9.2 Product Browsing
[Screenshot: Product listing]
[Screenshot: Product details]

### 9.3 Shopping Cart
[Screenshot: Add to cart]
[Screenshot: Cart view]

### 9.4 Order Placement
[Screenshot: Order creation]
[Screenshot: Order confirmation]

### 9.5 Payment Processing
[Screenshot: Payment record]
[Screenshot: Payment status]

### 9.6 Order Tracking
[Screenshot: Order status]
[Screenshot: Delivery tracking]

[Include screenshots for all features]

---

## 10. Triggers, Procedures/Functions

### 10.1 Triggers

#### Trigger 1: Auto-create Cart and Wishlist
**Purpose:** Automatically create cart and wishlist when a new user registers

**Code:**
```sql
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO cart (user_id) VALUES (NEW.user_id);
    INSERT INTO wishlist (user_id) VALUES (NEW.user_id);
END;
```

**Screenshot:** Trigger creation in MySQL Workbench
**Screenshot:** Testing trigger (before and after user insertion)

[Include all triggers with screenshots]

### 10.2 Stored Procedures

#### Procedure 1: place_order
**Purpose:** Place an order from user's cart

**Code:**
```sql
CREATE PROCEDURE place_order(
    IN p_user_id BIGINT,
    IN p_shipping_address_id BIGINT,
    -- [Full procedure]
);
```

**Screenshot:** Procedure creation
**Screenshot:** Calling procedure
**Screenshot:** Procedure results

[Include all procedures with screenshots]

### 10.3 Functions

#### Function 1: get_loyalty_tier
**Purpose:** Calculate user's loyalty tier based on points

**Code:**
```sql
CREATE FUNCTION get_loyalty_tier(p_loyalty_points INT)
RETURNS VARCHAR(20)
-- [Full function]
```

**Screenshot:** Function creation
**Screenshot:** Using function in query

[Include all functions with screenshots]

---

## 11. Complex Queries

### 11.1 Nested Query

**Query:** Get users who have spent more than average

**Code:**
```sql
SELECT u.user_id, u.first_name, SUM(o.total_amount) as total_spent
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE o.order_status = 'Delivered'
GROUP BY u.user_id
HAVING total_spent > (
    SELECT AVG(total_spent)
    FROM (SELECT SUM(total_amount) as total_spent
          FROM orders
          WHERE order_status = 'Delivered'
          GROUP BY user_id) as user_totals
);
```

**Screenshot:** Query and results

### 11.2 Join Query

**Query:** Get order details with user and product information

**Code:**
```sql
SELECT o.order_number, u.first_name, p.product_name, oi.quantity
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;
```

**Screenshot:** Query and results

### 11.3 Aggregate Query

**Query:** Seller performance report

**Code:**
```sql
SELECT s.business_name, 
       COUNT(DISTINCT p.product_id) as total_products,
       SUM(oi.total_price) as revenue
FROM sellers s
LEFT JOIN products p ON s.seller_id = p.seller_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY s.seller_id;
```

**Screenshot:** Query and results

---

## 12. SQL Queries File

All SQL queries are available in the following files:
- `database/01_complete_schema.sql` - Database schema
- `database/02_sample_data.sql` - Sample data
- `database/03_crud_operations.sql` - CRUD operations
- `database/04_triggers.sql` - Triggers
- `database/05_procedures_functions.sql` - Procedures and Functions
- `database/06_complex_queries.sql` - Complex queries
- `database/07_user_management.sql` - User management
- `database/08_views.sql` - Views

[Include .sql file in project submission]

---

## 13. GitHub Repository

**Repository Link:** [Your GitHub Repository URL]

**Repository Structure:**
```
flipkart-ecommerce-dbms/
├── database/
│   ├── 01_complete_schema.sql
│   ├── 02_sample_data.sql
│   ├── 03_crud_operations.sql
│   ├── 04_triggers.sql
│   ├── 05_procedures_functions.sql
│   ├── 06_complex_queries.sql
│   ├── 07_user_management.sql
│   └── 08_views.sql
├── documentation/
│   ├── ER_Diagram.png
│   ├── Relational_Schema.png
│   └── Screenshots/
├── README.md
└── PROJECT_REPORT.pdf
```

---

## 14. Conclusion

This project successfully implements a comprehensive database management system for an e-commerce platform. The system includes proper database design with normalization, efficient data management through triggers and stored procedures, and comprehensive query capabilities. The implementation demonstrates understanding of database concepts including ER modeling, relational schema design, SQL programming, and database administration.

**Key Achievements:**
- ✓ Complete database schema with 20+ tables
- ✓ Proper normalization to 3NF
- ✓ 8+ triggers for data integrity
- ✓ 6+ stored procedures for business logic
- ✓ 5+ functions for calculations
- ✓ Complex queries (nested, join, aggregate)
- ✓ User management with varied privileges
- ✓ Views for reporting
- ✓ Complete CRUD operations

**Future Enhancements:**
- Integration with web application
- Real-time inventory management
- Advanced analytics and reporting
- Machine learning for recommendations
- Mobile application integration

---

## 15. References

1. MySQL Documentation: https://dev.mysql.com/doc/
2. Database System Concepts - Silberschatz, Korth, Sudarshan
3. MySQL Workbench Documentation
4. SQL Tutorial: https://www.w3schools.com/sql/

---

## Appendices

### Appendix A: Complete SQL Scripts
[Include all SQL files]

### Appendix B: Screenshots
[Include all screenshots]

### Appendix C: Test Cases
[Include test cases for all operations]

---

**End of Report**

