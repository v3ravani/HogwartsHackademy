# Quick Start - Get MySQL Sync Working

## ⚡ Fast Setup (3 Steps)

### Step 1: Start PHP Server
Open **Command Prompt** or **PowerShell** and run:
```bash
cd C:\Users\ravan\odoo
php -S localhost:8000
```
**⚠️ IMPORTANT:** Keep this window open! Don't close it.

### Step 2: Test API
Open browser and go to:
```
http://localhost:8000/api/products.php
```
**Expected:** You should see `[]` or JSON data (not an error)

### Step 3: Use the App
1. Open: `http://localhost:8000/stockmaster/login.html`
2. Login: `team123` / `pass123`
3. Create a product or make any change
4. Open browser console (F12) → Look for sync messages:
   - ✅ `✅ MySQL sync success` = Working!
   - ❌ `❌ MySQL sync error` = Check PHP server

### Step 4: Verify in MySQL
```sql
USE stockmaster;
SELECT * FROM products ORDER BY id DESC LIMIT 5;
```

## 🔍 Troubleshooting

### Problem: "Failed to fetch" in console
**Solution:** PHP server not running. Go back to Step 1.

### Problem: "CORS error"
**Solution:** Make sure you're using `http://localhost:8000`, not `file://`

### Problem: "Database connection failed"
**Solution:** 
1. Check MySQL is running
2. Verify `api/config.php` has password: `'root123'`
3. Test connection: `mysql -u root -proot123 stockmaster`

### Problem: No sync messages in console
**Solution:**
1. Check if `mysql-sync.js` is loaded (F12 → Network tab)
2. Refresh the page
3. Make sure scripts load in order: `data.js` → `mysql-sync.js`

## 📋 Checklist

- [ ] PHP server running (`php -S localhost:8000`)
- [ ] API test works (`http://localhost:8000/api/products.php`)
- [ ] Browser console shows sync messages (F12)
- [ ] MySQL database `stockmaster` exists
- [ ] Password in `api/config.php` is `'root123'`
- [ ] All tables exist (run `SHOW TABLES;` in MySQL)

## 🎯 Quick Test

After creating a product in the app, run this in MySQL:
```sql
USE stockmaster;
SELECT id, name, sku, stock FROM products ORDER BY id DESC LIMIT 1;
```

You should see your newly created product!

