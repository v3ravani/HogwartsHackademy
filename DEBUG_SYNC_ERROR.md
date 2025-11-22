# Debug MySQL Sync Error

## Step 1: Check the Full Error Message

In browser console (F12), look for the error. It should show:
```
❌ MySQL sync error: products.php Failed to fetch
```

**What does your error say?** Copy the full error message.

## Step 2: Test API Directly

Open browser and go to:
```
http://localhost:8000/api/products.php
```

**What do you see?**
- ✅ `[]` or JSON data = API works
- ❌ Error page = API problem
- ❌ "Can't connect" = PHP server not running

## Step 3: Check PHP Server

Is the PHP server running? You should have a terminal window with:
```
PHP 7.x.x Development Server started
Listening on http://localhost:8000
```

If not, start it:
```bash
cd C:\Users\ravan\odoo
php -S localhost:8000
```

## Step 4: Test API with Browser Console

Open browser console (F12) and run:
```javascript
fetch('http://localhost:8000/api/products.php')
  .then(r => r.json())
  .then(data => console.log('✅ API works:', data))
  .catch(err => console.error('❌ API error:', err));
```

**What does this show?**

## Step 5: Common Errors & Fixes

### Error: "Failed to fetch"
**Cause:** PHP server not running or wrong URL
**Fix:** 
1. Start PHP server: `php -S localhost:8000`
2. Make sure you're using `http://localhost:8000`, not `file://`

### Error: "Database connection failed"
**Cause:** MySQL connection problem
**Fix:**
1. Check MySQL is running
2. Verify password in `api/config.php` is `'root123'`
3. Test: `mysql -u root -proot123 stockmaster`

### Error: "CORS policy"
**Cause:** Accessing via `file://` instead of `http://`
**Fix:** Use `http://localhost:8000/stockmaster/login.html`

### Error: "404 Not Found"
**Cause:** Wrong path or PHP server not in right directory
**Fix:** Make sure you run `php -S localhost:8000` from `C:\Users\ravan\odoo`

## Step 6: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Make a change in the app (create product)
4. Look for requests to `api/products.php`
5. Click on it and check:
   - **Status:** Should be 200 (green)
   - **Response:** Should show JSON
   - **Error:** If red, check the error message

## Step 7: Verify File Paths

Make sure these files exist:
- ✅ `C:\Users\ravan\odoo\api\config.php`
- ✅ `C:\Users\ravan\odoo\api\products.php`
- ✅ `C:\Users\ravan\odoo\js\mysql-sync.js`

## Step 8: Manual API Test

Test creating a product via API:

```javascript
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
.then(data => console.log('✅ Created:', data))
.catch(err => console.error('❌ Error:', err));
```

**What does this return?**

