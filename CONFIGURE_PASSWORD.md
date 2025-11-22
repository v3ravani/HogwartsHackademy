# How to Configure MySQL Password

## Important: Edit the PHP File, NOT MySQL!

The password configuration is in a **PHP file**, not in MySQL. You need to edit it in a text editor.

## Steps:

### 1. Open the file in a text editor
Open: `C:\Users\ravan\odoo\api\config.php`

### 2. Find line 18
Look for this line:
```php
define('DB_PASS', ''); // Change this to your MySQL password
```

### 3. Set your password

**If your MySQL root user has NO password** (default):
- Leave it as: `define('DB_PASS', 'root123');`
- No changes needed!

**If your MySQL root user HAS a password**:
- Replace the empty string with your password:
```php
define('DB_PASS', 'your_actual_password_here');
```

For example, if your password is `mypassword123`:
```php
define('DB_PASS', 'mypassword123');
```

### 4. Save the file

## How to Check Your MySQL Password

If you're not sure if you have a password:

1. Try connecting to MySQL:
   ```bash
   mysql -u root
   ```
   - If it connects without asking for password → password is empty (use `''`)
   - If it asks for password → you have a password (use that password)

2. Or try:
   ```bash
   mysql -u root -p
   ```
   - If it asks for password and you enter it → use that password in config.php

## Current Configuration

Your current `api/config.php` has:
- **Host**: `localhost`
- **User**: `root`
- **Password**: `''` (empty - no password)
- **Database**: `stockmaster`

If this matches your MySQL setup, **you don't need to change anything!**

## Testing the Connection

After configuring, start PHP server and test:
```bash
php -S localhost:8000
```

Then visit: `http://localhost:8000/api/products.php`

If you see JSON (even empty array `[]`), the connection works!

