# How to Run UPDATE Query in MySQL Workbench

## Step-by-Step Instructions:

### Method 1: MySQL Workbench (Visual - Easiest)

1. **Open MySQL Workbench**
2. **Connect to your database** (click on your connection)
3. **Click on "SQL" tab** at the top (or press `Ctrl+T`)
4. **Type or paste this query:**

```sql
USE flipkart_ecommerce;

-- First, find your product ID
SELECT product_id, product_name, product_status 
FROM products 
ORDER BY product_id DESC 
LIMIT 5;
```

5. **Click the lightning bolt icon** (⚡) or press `Ctrl+Enter` to run
6. **Look at the results** - find your product and note its `product_id` number
7. **Now run this UPDATE** (replace `13` with your actual product_id):

```sql
UPDATE products 
SET 
    product_status = 'Active',
    is_featured = TRUE,
    stock_quantity = 50
WHERE product_id = 13;  -- Change 13 to your product_id
```

8. **Click the lightning bolt again** to run the UPDATE
9. **Refresh your browser** - the product should now appear!

### Method 2: Command Line

```bash
mysql -u root -p -h Chinmays-M2.local flipkart_ecommerce
```

Then type:
```sql
UPDATE products 
SET product_status = 'Active', is_featured = TRUE 
WHERE product_id = 13;
```

### Example:

If you added a product and its ID is 15:

```sql
UPDATE products 
SET 
    product_status = 'Active',
    is_featured = TRUE,
    stock_quantity = 50
WHERE product_id = 15;
```

That's it! Just replace `15` with your actual product ID number.

