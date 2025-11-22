# StockMaster — Auth setup and OTP testing

This guide explains how to set up and test the MySQL + PHP authentication (signup/login with OTP) locally using XAMPP. It also explains the developer-only OTP retrieval endpoint for testing when email isn't configured.

## 1) Import database schema
- Open phpMyAdmin or use the MySQL CLI and import `database_schema.sql`.
- This will create the `stockmaster` database, tables (`users`, `otps`, etc.) and sample data (including demo user `team123`).

## 2) Place project under Apache
- Move the project folder into your XAMPP `htdocs` (for example `C:\xampp\htdocs\stockmaster`) or configure Apache to point to the workspace.
- Ensure PHP (7.4+/8.x) and PDO MySQL extension are enabled.

## 3) Configure database credentials (if needed)
- Edit `server/db.php` and update `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` to match your MySQL setup.

## 4) Email (OTP) delivery options
By default the server uses PHP `mail()` to send OTP emails. On XAMPP/mail this often requires SMTP configuration in `php.ini`.

Two options:

Option A — Quick dev/testing (no email):
- Use the dev OTP retrieval endpoint to read the latest OTP directly from the DB (dev only):
  - `POST /server/get_latest_otp.php` with JSON body { "user_id": "team123", "dev_key": "local_dev_key_please_change" }
  - The response contains the latest OTP. Make sure `DEV_MODE` is true in `server/db.php` and `DEV_KEY` matches the request.

Option B — Real email sending (recommended for full flow):
- Configure SMTP in `php.ini` (for Windows set SMTP and smtp_port and sendmail_from) or integrate PHPMailer.
- If you prefer, I can add PHPMailer + sample SMTP config so OTPs are delivered via Gmail/SendGrid.

## 5) Test end-to-end
1. Open `login.html`, enter your credentials (sample: `team123` with password `pass123` if you used sample data). After successful password verification you'll be redirected to `otp_verify.html`.
2. If email is configured, check your email for OTP and enter it. If not configured, use the dev OTP endpoint to fetch the code.
3. On successful verification you'll get a JSON success and a PHP session will be established. Client-side pages still set a legacy `localStorage` flag for compatibility.

## 6) Dev-only endpoints and keys
- `server/get_latest_otp.php` — returns latest OTP for a given user when `DEV_MODE` is true.
- Set `DEV_KEY` in `server/db.php` to a locally random value and use it when calling the endpoint.

## 7) Session checking from client
- `server/session.php` returns JSON { authenticated: true/false, user_id, name }.
- Use this from client JS on page load to redirect or show UI accordingly.

## 8) Hardening & next steps (recommended)
- Replace dev OTP endpoint with a secure test harness or remove it in production.
- Integrate PHPMailer and SMTP for reliable delivery.
- Add rate-limiting and resend cooldown for OTPs.
- Convert protected static HTML pages to PHP (or implement a server-side router) and include session checks to prevent unauthenticated access.

---
If you want, I can now:
- Integrate PHPMailer and show example SMTP configuration, or
- Add client-side checks that call `server/session.php` on protected pages, or
- Convert `dashboard.html` into `dashboard.php` and add a server-side session guard.

Tell me which next step you prefer and I will implement it.