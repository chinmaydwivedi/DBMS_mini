# MySQL Workbench GUI Guide for Flipkart E-Commerce Database

This guide explains how to perform all database operations using MySQL Workbench GUI to meet the project requirements.

## Table of Contents
1. [Installation and Setup](#installation-and-setup)
2. [Creating Tables (DDL)](#creating-tables-ddl)
3. [CRUD Operations](#crud-operations)
4. [Creating Triggers](#creating-triggers)
5. [Creating Procedures and Functions](#creating-procedures-and-functions)
6. [Creating Views](#creating-views)
7. [User Management and Privileges](#user-management-and-privileges)
8. [Running Complex Queries](#running-complex-queries)
9. [Screenshots Guide](#screenshots-guide)

---

## Installation and Setup

### Step 1: Install MySQL Workbench
1. Download MySQL Workbench from https://dev.mysql.com/downloads/workbench/
2. Install and launch MySQL Workbench
3. Connect to your MySQL server (usually `localhost:3306`)

### Step 2: Create Database Connection
1. Click on the "+" icon next to "MySQL Connections"
2. Enter connection name: `Flipkart E-Commerce`
3. Enter username: `root` (or your MySQL username)
4. Click "Store in Vault" and enter password
5. Click "Test Connection" to verify
6. Click "OK" to save

---

## Creating Tables (DDL)

### Method 1: Using SQL Scripts (Recommended)
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click **File → Open SQL Script**
4. Navigate to `database/01_complete_schema.sql`
5. Click **Execute** (⚡ icon) or press `Ctrl+Shift+Enter`
6. Verify tables are created in the **Schemas** panel

### Method 2: Using GUI Table Editor
1. Right-click on `flipkart_ecommerce` database → **Create Table**
2. Enter table name (e.g., `users`)
3. Add columns using the GUI:
   - Click **Add Column**
   - Enter column name, data type, constraints
   - Set Primary Key, Not Null, Auto Increment as needed
4. Click **Apply** to create table
5. Repeat for all tables

**Screenshot Points:**
- Database schema panel showing all tables
- Table structure view
- Foreign key relationships

---

## CRUD Operations

### CREATE Operations (INSERT)

#### Using SQL Editor:
1. Open a new SQL tab (`File → New Query Tab`)
2. Write INSERT statement:
```sql
INSERT INTO users (email, password_hash, first_name, last_name, phone_number)
VALUES ('test@example.com', 'hash123', 'Test', 'User', '+919876543210');
```
3. Click **Execute** (⚡)
4. Verify in table data view

#### Using GUI:
1. Right-click on table → **Select Rows - Limit 1000**
2. Click **Insert Row** button (or press `Ctrl+Insert`)
3. Fill in the values
4. Click **Apply** to save

**Screenshot:** Table with new row inserted

### READ Operations (SELECT)

#### Using SQL Editor:
1. Write SELECT query:
```sql
SELECT * FROM products WHERE product_status = 'Active';
```
2. Click **Execute**
3. View results in Result Grid

#### Using GUI:
1. Right-click on table → **Select Rows - Limit 1000**
2. Use filter/search options
3. Sort by clicking column headers

**Screenshot:** Query results showing data

### UPDATE Operations

#### Using SQL Editor:
```sql
UPDATE products 
SET selling_price = 139900.00 
WHERE product_id = 1;
```

#### Using GUI:
1. Right-click on table → **Select Rows**
2. Double-click on cell to edit
3. Modify value
4. Click **Apply** to save changes

**Screenshot:** Before and after update

### DELETE Operations

#### Using SQL Editor:
```sql
DELETE FROM cart_items WHERE cart_item_id = 1;
```

#### Using GUI:
1. Right-click on table → **Select Rows**
2. Right-click on row → **Delete Row(s)**
3. Click **Apply** to confirm

**Screenshot:** Row deletion confirmation

---

## Creating Triggers

### Method 1: Using SQL Scripts
1. Open `database/04_triggers.sql`
2. Execute the entire file
3. Verify triggers in **Schemas → flipkart_ecommerce → Triggers**

### Method 2: Using GUI
1. Expand database → **Triggers**
2. Right-click → **Create Trigger**
3. Fill in trigger details:
   - **Trigger Name**: `after_user_insert`
   - **Trigger Time**: `AFTER`
   - **Trigger Event**: `INSERT`
   - **Table**: `users`
4. Write trigger body in SQL editor
5. Click **Apply**

**Screenshot Points:**
- Trigger creation dialog
- Trigger list in schema panel
- Testing trigger by inserting data

**Testing Triggers:**
```sql
-- Test trigger
INSERT INTO users (email, password_hash, first_name, last_name, phone_number)
VALUES ('trigger_test@example.com', 'hash', 'Trigger', 'Test', '+919876543211');

-- Verify cart and wishlist were created automatically
SELECT * FROM cart WHERE user_id = LAST_INSERT_ID();
SELECT * FROM wishlist WHERE user_id = LAST_INSERT_ID();
```

---

## Creating Procedures and Functions

### Creating Stored Procedures

#### Using SQL Scripts:
1. Open `database/05_procedures_functions.sql`
2. Execute the file
3. Verify in **Schemas → flipkart_ecommerce → Stored Procedures**

#### Using GUI:
1. Expand database → **Stored Procedures**
2. Right-click → **Create Stored Procedure**
3. Enter procedure name and parameters
4. Write procedure body
5. Click **Apply**

**Screenshot Points:**
- Procedure creation dialog
- Procedure list
- Calling procedure and viewing results

**Testing Procedures:**
```sql
-- Test place_order procedure
CALL place_order(1, 1, 1, 'Prepaid', 'WELCOME100');

-- Test get_user_orders procedure
CALL get_user_orders(1, 10, 0);

-- Test get_top_selling_products procedure
CALL get_top_selling_products(5, NULL);
```

### Creating Functions

#### Using GUI:
1. Expand database → **Functions**
2. Right-click → **Create Function**
3. Enter function name, return type, parameters
4. Write function body
5. Click **Apply**

**Screenshot Points:**
- Function creation dialog
- Function list
- Using function in SELECT query

**Testing Functions:**
```sql
-- Test get_loyalty_tier function
SELECT user_id, first_name, loyalty_points, get_loyalty_tier(loyalty_points) as tier
FROM users;

-- Test is_product_available function
SELECT product_id, product_name, 
       is_product_available(product_id, 5) as available
FROM products;
```

---

## Creating Views

### Method 1: Using SQL Scripts
1. Open `database/08_views.sql`
2. Execute the file
3. Verify in **Schemas → flipkart_ecommerce → Views**

### Method 2: Using GUI
1. Expand database → **Views**
2. Right-click → **Create View**
3. Enter view name
4. Write SELECT query
5. Click **Apply**

**Screenshot Points:**
- View creation dialog
- View list
- Querying view and viewing results

**Testing Views:**
```sql
-- Query views
SELECT * FROM v_active_products LIMIT 10;
SELECT * FROM v_order_summary;
SELECT * FROM v_user_membership_details;
```

---

## User Management and Privileges

### Creating Users

#### Using SQL Scripts:
1. Open `database/07_user_management.sql`
2. Execute the file
3. Verify users in **Administration → Users and Privileges**

#### Using GUI:
1. Click **Administration** tab
2. Click **Users and Privileges**
3. Click **Add Account**
4. Enter:
   - **Login Name**: `flipkart_customer`
   - **Authentication Type**: `Standard`
   - **Password**: Enter password
5. Click **Apply**
6. Go to **Administrative Roles** tab to assign roles
7. Go to **Schema Privileges** tab to grant table privileges
8. Click **Apply**

**Screenshot Points:**
- User creation dialog
- Privilege assignment
- User list
- Testing user login

**Testing User Privileges:**
```sql
-- Login as different user and test privileges
-- (Use different connection in MySQL Workbench)
SHOW GRANTS FOR CURRENT_USER();
```

---

## Running Complex Queries

### Nested Queries
1. Open `database/06_complex_queries.sql`
2. Execute Query 1 (Nested Query)
3. View results
4. Take screenshot

**Screenshot:** Query and results

### Join Queries
1. Execute Query 2 (Join Query)
2. View results showing joined data
3. Take screenshot

**Screenshot:** Join query with multiple tables

### Aggregate Queries
1. Execute Query 3 (Aggregate Query)
2. View aggregated results
3. Take screenshot

**Screenshot:** Aggregate query with GROUP BY and functions

---

## Screenshots Guide

### Required Screenshots for Project Report:

1. **Database Schema**
   - Screenshot of all tables in schema panel
   - ER Diagram (create using MySQL Workbench or draw.io)

2. **Table Creation (DDL)**
   - Screenshot of CREATE TABLE statements
   - Screenshot of table structure

3. **CRUD Operations**
   - **Create**: Screenshot of INSERT statement and result
   - **Read**: Screenshot of SELECT query and results
   - **Update**: Screenshot before and after UPDATE
   - **Delete**: Screenshot of DELETE operation

4. **Triggers**
   - Screenshot of trigger creation
   - Screenshot of trigger list
   - Screenshot of trigger execution (before/after data)

5. **Procedures**
   - Screenshot of procedure creation
   - Screenshot of procedure call and results

6. **Functions**
   - Screenshot of function creation
   - Screenshot of function usage in query

7. **Views**
   - Screenshot of view creation
   - Screenshot of view query results

8. **User Management**
   - Screenshot of user creation
   - Screenshot of privilege assignment
   - Screenshot of user list

9. **Complex Queries**
   - Screenshot of nested query
   - Screenshot of join query
   - Screenshot of aggregate query

10. **Database Relationships**
    - Screenshot of foreign key relationships
    - Screenshot of database diagram (Database → Reverse Engineer)

---

## Tips for Screenshots

1. **Use High Resolution**: Take screenshots at full resolution
2. **Include Context**: Show SQL editor, results, and schema panel
3. **Label Screenshots**: Add text labels if needed
4. **Show Results**: Always include query results in screenshots
5. **Before/After**: For UPDATE/DELETE, show before and after states

---

## Common Issues and Solutions

### Issue: Cannot connect to MySQL
**Solution**: Check MySQL service is running, verify credentials

### Issue: Foreign key constraint fails
**Solution**: Ensure parent records exist before inserting child records

### Issue: Trigger not firing
**Solution**: Check trigger syntax, verify trigger is enabled

### Issue: Procedure/Function error
**Solution**: Check DELIMITER usage, verify syntax

### Issue: Permission denied
**Solution**: Login as root or user with sufficient privileges

---

## Quick Reference Commands

```sql
-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Show triggers
SHOW TRIGGERS;

-- Show procedures
SHOW PROCEDURE STATUS WHERE Db = 'flipkart_ecommerce';

-- Show functions
SHOW FUNCTION STATUS WHERE Db = 'flipkart_ecommerce';

-- Show views
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- Show users
SELECT User, Host FROM mysql.user;

-- Show grants
SHOW GRANTS FOR 'flipkart_customer'@'localhost';
```

---

## Next Steps

1. Execute all SQL files in order
2. Take screenshots of all operations
3. Test all triggers, procedures, and functions
4. Create ER diagram
5. Document all operations in project report

---

**End of Guide**

