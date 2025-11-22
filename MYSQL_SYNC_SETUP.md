# MySQL Sync Setup Guide

## Overview
The StockMaster application now uses **localStorage as the primary storage** (fast, works offline), and **automatically syncs to MySQL** in the background whenever data changes.

## How It Works

1. **localStorage is Primary**: All operations save to localStorage first (instant, synchronous)
2. **MySQL Sync is Background**: After localStorage saves, data is synced to MySQL (async, non-blocking)
3. **Silent Failures**: If MySQL sync fails, the app continues working normally (localStorage is the source of truth)

## Setup Steps

### 1. Configure Database Connection

Edit `api/config.php` and set your MySQL password:

```php
define('DB_PASS', 'your_password_here');
```

### 2. Start PHP Server

```bash
cd C:\Users\ravan\odoo
php -S localhost:8000
```

### 3. Access the Application

Open: `http://localhost:8000/stockmaster/login.html`

## What Gets Synced

- ✅ **Products**: Created, updated, stock changes
- ✅ **Receipts**: All new receipts with products
- ✅ **Deliveries**: All new deliveries with products
- ✅ **Transfers**: All new transfers with products
- ✅ **Adjustments**: All new stock adjustments
- ✅ **Customers**: Created, updated, deleted
- ✅ **Warehouses**: Added, deleted
- ✅ **Categories**: Added, deleted

## Benefits

1. **Fast Performance**: localStorage is instant, no waiting for server
2. **Offline Support**: App works even if MySQL server is down
3. **Data Backup**: All changes are automatically backed up to MySQL
4. **No Breaking Changes**: Existing code works exactly the same

## Viewing Data in MySQL

After making changes in the app, you can view them in MySQL:

```sql
USE stockmaster;

-- View products
SELECT * FROM products;

-- View receipts
SELECT * FROM receipts;

-- View deliveries
SELECT * FROM deliveries;

-- View transfers
SELECT * FROM transfers;

-- View adjustments
SELECT * FROM adjustments;

-- View customers
SELECT * FROM customers;

-- View move history
SELECT * FROM move_history ORDER BY timestamp DESC LIMIT 20;
```

## Troubleshooting

### MySQL Sync Not Working?

1. **Check PHP Server**: Make sure `php -S localhost:8000` is running
2. **Check Database**: Verify MySQL is running and `stockmaster` database exists
3. **Check Config**: Verify password in `api/config.php` is correct
4. **Check Browser Console**: Look for sync warnings (they're non-critical)

### Sync Errors Are Silent

This is by design! The app prioritizes localStorage. MySQL sync errors won't break the app. Check browser console for warnings if you want to debug.

## Notes

- **localStorage is the source of truth** - MySQL is just a backup/sync
- Sync happens in the background - doesn't slow down the app
- If MySQL is unavailable, the app works normally with localStorage only
- All sync functions are async and fire-and-forget (non-blocking)

