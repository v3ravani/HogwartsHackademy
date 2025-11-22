# MySQL Command Line - Viewing Database Schema

## Basic Commands

### 1. Connect to MySQL
```bash
mysql -u root -p
# Enter your password when prompted
```

### 2. Show All Databases
```sql
SHOW DATABASES;
```

### 3. Select/Use a Database
```sql
USE stockmaster;
-- Replace 'stockmaster' with your database name
```

### 4. Show All Tables in Current Database
```sql
SHOW TABLES;
```

### 5. View Table Structure
```sql
-- View structure of a specific table
DESCRIBE products;
-- OR
DESC products;

-- More detailed structure
SHOW CREATE TABLE products;

-- Column information
SHOW COLUMNS FROM products;
```

### 6. View Table Data
```sql
-- View all data from a table
SELECT * FROM products;

-- View specific columns
SELECT id, name, sku, stock FROM products;

-- View with limit
SELECT * FROM products LIMIT 10;

-- View with conditions
SELECT * FROM products WHERE stock < 10;
```

### 7. View Database Schema Information
```sql
-- View all tables with their row counts
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'stockmaster';

-- View all columns in database
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'stockmaster'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- View all foreign keys
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'stockmaster'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- View all indexes
SHOW INDEX FROM products;
```

### 8. View Views
```sql
-- List all views
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';

-- View view definition
SHOW CREATE VIEW v_product_stock;
```

### 9. View Stored Procedures
```sql
-- List all stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'stockmaster';

-- View procedure definition
SHOW CREATE PROCEDURE sp_process_receipt;
```

### 10. Export Schema (Create Dump)
```bash
# Export structure only (no data)
mysqldump -u root -p --no-data stockmaster > schema_only.sql

# Export structure and data
mysqldump -u root -p stockmaster > full_dump.sql

# Export specific table
mysqldump -u root -p stockmaster products > products_table.sql
```

## Useful Queries for StockMaster

### View Product Stock Summary
```sql
SELECT * FROM v_product_stock;
```

### View Low Stock Items
```sql
SELECT * FROM v_product_stock WHERE stock < 10;
```

### View Recent Receipts
```sql
SELECT * FROM v_receipt_summary ORDER BY date DESC LIMIT 10;
```

### View Recent Deliveries
```sql
SELECT * FROM v_delivery_summary ORDER BY date DESC LIMIT 10;
```

### View Move History
```sql
SELECT * FROM move_history ORDER BY timestamp DESC LIMIT 20;
```

### Count Records in Each Table
```sql
SELECT 
    'products' AS table_name, COUNT(*) AS count FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'receipts', COUNT(*) FROM receipts
UNION ALL
SELECT 'deliveries', COUNT(*) FROM deliveries
UNION ALL
SELECT 'transfers', COUNT(*) FROM transfers
UNION ALL
SELECT 'adjustments', COUNT(*) FROM adjustments
UNION ALL
SELECT 'move_history', COUNT(*) FROM move_history;
```

### View Table Relationships
```sql
SELECT 
    kcu.TABLE_NAME,
    kcu.COLUMN_NAME,
    kcu.CONSTRAINT_NAME,
    kcu.REFERENCED_TABLE_NAME,
    kcu.REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE kcu
WHERE kcu.TABLE_SCHEMA = 'stockmaster'
AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY kcu.TABLE_NAME;
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `SHOW DATABASES;` | List all databases |
| `USE database_name;` | Select a database |
| `SHOW TABLES;` | List all tables |
| `DESCRIBE table_name;` | Show table structure |
| `SHOW CREATE TABLE table_name;` | Show CREATE TABLE statement |
| `SELECT * FROM table_name;` | View all data |
| `SHOW INDEX FROM table_name;` | Show indexes |
| `SHOW CREATE VIEW view_name;` | Show view definition |
| `EXIT;` or `\q` | Exit MySQL |

## Tips

1. **Use semicolon (;)** at the end of each SQL statement
2. **Use `\G`** instead of `;` for vertical output (easier to read)
   ```sql
   DESCRIBE products\G
   ```
3. **Use `\c`** to cancel current command
4. **Use `\s`** to show MySQL status
5. **Use `SOURCE filename.sql;`** to execute SQL file
   ```sql
   SOURCE /path/to/database_schema.sql;
   ```

