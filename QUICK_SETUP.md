# Quick Setup - Create Tables in StockMaster Database

## Your database exists but tables are empty. Here's how to create them:

### Option 1: Using Command Line (Easiest)

1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```bash
   cd C:\Users\ravan\odoo
   ```

3. Run this command:
   ```bash
   mysql -u root -p stockmaster < database_schema.sql
   ```
   (Enter your MySQL password when prompted)

4. Verify:
   ```bash
   mysql -u root -p
   ```
   Then in MySQL:
   ```sql
   USE stockmaster;
   SHOW TABLES;
   ```

---

### Option 2: Using MySQL Command Line (Step by Step)

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Select the database:
   ```sql
   USE stockmaster;
   ```

3. Import the schema file:
   ```sql
   SOURCE C:/Users/ravan/odoo/database_schema.sql;
   ```
   
   **OR if you're already in the odoo directory:**
   ```sql
   SOURCE database_schema.sql;
   ```

4. Verify tables were created:
   ```sql
   SHOW TABLES;
   ```

---

### Option 3: Copy and Paste SQL Commands

If SOURCE command doesn't work, you can:

1. Open `database_schema.sql` in a text editor
2. Copy all the content (after the CREATE DATABASE and USE statements)
3. Paste it into MySQL command line
4. Press Enter

---

### Option 4: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Go to **File → Open SQL Script**
4. Select `database_schema.sql`
5. Make sure `stockmaster` database is selected in the dropdown
6. Click **Execute** (⚡ icon) or press `Ctrl+Shift+Enter`

---

## After Import - Verify Everything Works

```sql
-- Check tables
SHOW TABLES;

-- Should show 13 tables:
-- users, warehouses, categories, products, customers,
-- receipts, receipt_products, deliveries, delivery_products,
-- transfers, transfer_products, adjustments, move_history

-- Check sample data
SELECT * FROM warehouses;
SELECT * FROM categories;
SELECT * FROM products;
SELECT * FROM users;
```

---

## Troubleshooting

### If SOURCE command doesn't work:
- Make sure you're using forward slashes `/` in the path
- Or use the full path: `SOURCE C:/Users/ravan/odoo/database_schema.sql;`
- Check that the file exists: `ls database_schema.sql` (in MySQL: `\! dir database_schema.sql`)

### If you get "Access denied":
- Make sure you're using the correct MySQL username and password
- Try: `mysql -u root -p` (most common)

### If tables still don't appear:
- Make sure you're in the right database: `USE stockmaster;`
- Check for errors during import
- Try running the CREATE TABLE statements manually one by one

