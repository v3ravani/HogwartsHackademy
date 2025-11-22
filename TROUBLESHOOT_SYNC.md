# Troubleshooting MySQL Sync - Step by Step

## Step 1: Verify PHP Server is Running

Open a **new terminal/command prompt** and run:

```bash
cd C:\Users\ravan\odoo
php -S localhost:8000
```

**Keep this terminal open!** The server must be running for sync to work.

## Step 2: Test API Connection

Open your browser and visit:
```
http://localhost:8000/api/products.php
```

**Expected result:**
- ✅ If you see `[]` (empty array) or JSON data → API is working
- ❌ If you see error or "can't connect" → PHP server not running or wrong path

## Step 3: Check Browser Console

1. Open your app: `http://localhost:8000/stockmaster/login.html`
2. Login: `team123` / `pass123`
3. Press **F12** to open Developer Tools
4. Go to **Console** tab
5. Create a new product or make any change
6. Look for any error messages (red text)

**What to look for:**
- ✅ No errors = Good
- ❌ "Failed to fetch" or "Network error" = PHP server not running
- ❌ "CORS error" = Check API headers

## Step 4: Test Sync Manually

1. Go to Products page
2. Click "Add Product"
3. Fill in the form and submit
4. Check browser console (F12) for any warnings
5. Wait 2-3 seconds
6. Check MySQL:

```sql
USE stockmaster;
SELECT * FROM products ORDER BY id DESC LIMIT 5;
```

## Step 5: Verify Files Are Loaded

Check if `mysql-sync.js` is loaded:

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for `mysql-sync.js` in the list
5. It should show status **200** (success)

## Step 6: Check API Response

Test directly in browser console (F12):

```javascript
fetch('http://localhost:8000/api/products.php')
  .then(r => r.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('Error:', err));
```

**Expected:**
- ✅ Shows array of products (or empty array)
- ❌ Shows error = API connection problem

## Step 7: Common Issues & Fixes

### Issue: "Failed to fetch"
**Fix:** PHP server not running. Start it with `php -S localhost:8000`

### Issue: "CORS error"
**Fix:** Make sure you're accessing via `http://localhost:8000`, not `file://`

### Issue: "Database connection failed"
**Fix:** 
- Check MySQL is running
- Verify password in `api/config.php` is `root123`
- Check database exists: `USE stockmaster;`

### Issue: Data not syncing
**Fix:**
- Check browser console for errors
- Verify `mysql-sync.js` is loaded (Network tab)
- Make sure PHP server is running
- Check API endpoint works: `http://localhost:8000/api/products.php`

## Step 8: Manual Sync Test

Test sync function directly in browser console:

```javascript
// Test product sync
fetch('http://localhost:8000/api/products.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Product',
    sku: 'TEST-001',
    category: 'Electronics',
    unit: 'Unit',
    location: 'WH1',
    stock: 10,
    price: 99.99
  })
})
.then(r => r.json())
.then(data => {
  console.log('Success:', data);
  // Check MySQL now
})
.catch(err => console.error('Error:', err));
```

Then check MySQL:
```sql
SELECT * FROM products WHERE sku = 'TEST-001';
```

## Step 9: Verify Database Schema

Make sure all tables exist:

```sql
USE stockmaster;
SHOW TABLES;
```

You should see:
- products
- receipts
- deliveries
- transfers
- adjustments
- customers
- warehouses
- categories
- move_history

## Step 10: Check Sync Function is Called

In browser console, after creating a product, check:

```javascript
// This should exist
typeof syncProduct
// Should return: "function"
```

If it returns "undefined", `mysql-sync.js` is not loaded.

