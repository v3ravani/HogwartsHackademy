<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$data = getJsonInput();
$user_id = isset($data['user_id']) ? trim($data['user_id']) : '';
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Missing user_id']);
    exit;
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT id, email FROM users WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    if (!$user) {
        echo json_encode(['success'=>false,'message'=>'User not found']);
        exit;
    }
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $expires = date('Y-m-d H:i:s', time() + 10 * 60);
    $ins = $pdo->prepare('INSERT INTO otps (user_id, otp_code, expires_at, used, created_at) VALUES (?, ?, ?, 0, NOW())');
    $ins->execute([$user['id'], $otp, $expires]);
    @mail($user['email'], 'Your StockMaster OTP', "Your one-time code is: {$otp} (valid 10 minutes)", 'From: noreply@localhost');
    echo json_encode(['success'=>true,'message'=>'OTP resent']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
