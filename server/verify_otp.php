<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
session_start();

$data = getJsonInput();
$user_id = isset($data['user_id']) ? trim($data['user_id']) : '';
$otp_code = isset($data['otp']) ? trim($data['otp']) : '';

if (!$user_id || !$otp_code) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Missing parameters']);
    exit;
}

try {
    $pdo = getPDO();
    // find user id
    $stmt = $pdo->prepare('SELECT id, email, name FROM users WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    if (!$user) {
        echo json_encode(['success'=>false,'message'=>'Invalid user']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT id FROM otps WHERE user_id = ? AND otp_code = ? AND used = 0 AND expires_at >= NOW() ORDER BY id DESC LIMIT 1');
    $stmt->execute([$user['id'], $otp_code]);
    $row = $stmt->fetch();
    if (!$row) {
        echo json_encode(['success'=>false,'message'=>'Invalid or expired OTP']);
        exit;
    }

    // mark used
    $upd = $pdo->prepare('UPDATE otps SET used = 1 WHERE id = ?');
    $upd->execute([$row['id']]);

    // Set session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['name'] = $user['name'];

    echo json_encode(['success'=>true,'message'=>'Authenticated']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
