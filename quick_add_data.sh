#!/bin/bash
# Quick script to add data via command line

DB_HOST="Chinmays-M2.local"
DB_USER="root"
DB_NAME="flipkart_ecommerce"

echo "Enter MySQL password:"
read -s PASSWORD

mysql -h "$DB_HOST" -u "$DB_USER" -p"$PASSWORD" "$DB_NAME" << SQL
-- Add your INSERT statements here
INSERT INTO products (seller_id, category_id, product_name, brand, sku, description, original_price, selling_price, discount_percentage, stock_quantity, product_status, is_featured, cod_available)
VALUES (1, 5, 'Test Product', 'Test Brand', 'TEST-001', 'Test description', 1000.00, 900.00, 10.00, 50, 'Active', FALSE, TRUE);
SQL

echo "Data added successfully!"
