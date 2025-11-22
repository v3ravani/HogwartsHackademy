# Setting Up StockMaster MySQL Database

## Option 1: Using MySQL Command Line

### Step 1: Connect to MySQL
```bash
mysql -u root -p
```

### Step 2: Create and Import Database
```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS stockmaster 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Exit MySQL
EXIT;
```

### Step 3: Import the Schema
```bash
mysql -u root -p stockmaster < database_schema.sql
```

### Step 4: Verify
```bash
mysql -u root -p
```
```sql
SHOW DATABASES;
USE stockmaster;
SHOW TABLES;
```

---

## Option 2: Using MySQL Command Line (All in One)

### Step 1: Connect to MySQL
```bash
mysql -u root -p
```

### Step 2: Run the Schema File
```sql
SOURCE C:/Users/ravan/odoo/database_schema.sql;
```

**Note:** Use forward slashes `/` or double backslashes `\\` in the path on Windows.

---

## Option 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **File → Open SQL Script**
4. Select `database_schema.sql`
5. Click the **Execute** button (⚡ icon) or press `Ctrl+Shift+Enter`

---

## Option 4: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Click on **SQL** tab
3. Click **Import files** or paste the contents of `database_schema.sql`
4. Click **Go** to execute

---

## Quick Verification Commands

After setup, verify everything is working:

```sql
-- Connect to MySQL
mysql -u root -p

-- Show databases (should see stockmaster)
SHOW DATABASES;

-- Use the database
USE stockmaster;

-- Show all tables (should see 13 tables)
SHOW TABLES;

-- Check products table
DESCRIBE products;

-- Check if sample data exists
SELECT * FROM products;
SELECT * FROM warehouses;
SELECT * FROM categories;
```

## Expected Tables

After successful import, you should see these tables:
- users
- warehouses
- categories
- products
- customers
- receipts
- receipt_products
- deliveries
- delivery_products
- transfers
- transfer_products
- adjustments
- move_history

## Troubleshooting

### If you get "Access denied" error:
- Make sure you're using the correct username and password
- Try: `mysql -u root -p` (root user)
- Or: `mysql -u your_username -p`

### If database already exists:
- The schema file will drop and recreate tables
- Or manually drop: `DROP DATABASE stockmaster;` then recreate

### If path issues on Windows:
- Use forward slashes: `C:/Users/ravan/odoo/database_schema.sql`
- Or escape backslashes: `C:\\Users\\ravan\\odoo\\database_schema.sql`
- Or use relative path if in the same directory: `database_schema.sql`

