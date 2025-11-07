-- ============================================
-- MASTER SCRIPT - RUN ALL SQL FILES IN ORDER
-- ============================================
-- This script runs all database setup files in the correct order
-- Execute this file to set up the complete database

-- Step 1: Create Schema
SOURCE 01_complete_schema.sql;

-- Step 2: Insert Sample Data
SOURCE 02_sample_data.sql;

-- Step 3: Create Triggers
SOURCE 04_triggers.sql;

-- Step 4: Create Procedures and Functions
SOURCE 05_procedures_functions.sql;

-- Step 5: Create Views
SOURCE 08_views.sql;

-- Step 6: Create Users and Privileges
SOURCE 07_user_management.sql;

-- ============================================
-- Note: CRUD operations (03_crud_operations.sql) and 
-- Complex queries (06_complex_queries.sql) are for 
-- demonstration purposes and can be run separately
-- ============================================

