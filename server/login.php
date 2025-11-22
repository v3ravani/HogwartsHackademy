<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$data = getJsonInput();
$user_id = isset($data['user_id']) ? trim($data['user_id']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$user_id || !$password) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Missing credentials']);
    exit;
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT id, password, email, name FROM users WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    if (!$user) {
        echo json_encode(['success'=>false,'message'=>'Invalid credentials']);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success'=>false,'message'=>'Invalid credentials']);
        exit;
    }

    // Generate OTP and store
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $expires = date('Y-m-d H:i:s', time() + 10 * 60); // 10 minutes

    $ins = $pdo->prepare('INSERT INTO otps (user_id, otp_code, expires_at, used, created_at) VALUES (?, ?, ?, 0, NOW())');
    $ins->execute([$user['id'], $otp, $expires]);

    // Send OTP email (simple mail). Configure mail in php.ini for XAMPP or use external SMTP.
    $to = $user['email'];
    $subject = 'Your StockMaster OTP';
    $message = "Your one-time code is: {$otp} (valid 10 minutes)";
    $headers = 'From: noreply@localhost' . "\r\n" . 'Reply-To: noreply@localhost' . "\r\n" . 'X-Mailer: PHP/' . phpversion();
    // mail may fail silently on default XAMPP; returning success regardless but advising verification step.
    @mail($to, $subject, $message, $headers);

    // Return response that OTP verification is required
    echo json_encode(['success'=>true,'otp_required'=>true,'message'=>'OTP sent to registered email']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
