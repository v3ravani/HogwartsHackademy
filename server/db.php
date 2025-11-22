<?php
// Database connection using PDO
// Update these constants if your XAMPP uses different credentials
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'stockmaster');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Development helpers
// Set DEV_MODE to true to enable dev-only endpoints like get_latest_otp.php
define('DEV_MODE', true);
// If DEV_MODE is true, requests to dev endpoints must provide this DEV_KEY
define('DEV_KEY', 'local_dev_key_please_change');

function getPDO() {
    static $pdo = null;
    if ($pdo) return $pdo;
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}

// Helper to read JSON body
function getJsonInput() {
    $body = file_get_contents('php://input');
    if (!$body) return [];
    $data = json_decode($body, true);
    return is_array($data) ? $data : [];
}

?>
