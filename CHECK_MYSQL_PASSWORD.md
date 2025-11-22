# Check MySQL Password (MySQL Command Line)

## Step 1: Check if you have a password

In MySQL command line, run:

```sql
SELECT user, host, authentication_string FROM mysql.user WHERE user = 'root';
```

Or simply try to connect:

```bash
mysql -u root
```

- **If it connects without asking for password** → Your password is empty (no password)
- **If it asks for password** → You have a password

## Step 2: Edit the PHP file (NOT in MySQL!)

You need to edit `api/config.php` in a **text editor** (Notepad, VS Code, etc.), NOT in MySQL.

### Option A: If you have NO password (most common)
Open `api/config.php` in Notepad and make sure line 18 looks like this:
```php
define('DB_PASS', 'root123');  // Empty string = no password
```

### Option B: If you HAVE a password
Open `api/config.php` in Notepad and change line 18 to:
```php
define('DB_PASS', 'your_actual_password');
```

## Step 3: Save the file

Save the file after editing.

## Quick Test

After editing, you can test if it works by starting PHP server:
```bash
php -S localhost:8000
```

Then in your browser, visit: `http://localhost:8000/api/products.php`

If you see JSON (even `[]`), it's working!

