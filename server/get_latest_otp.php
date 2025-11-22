<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

// Development-only endpoint to fetch latest OTP for a user.
// Requires DEV_MODE = true in db.php and the dev key to be provided.
$data = getJsonInput();
$user_id = isset($data['user_id']) ? trim($data['user_id']) : '';
$dev_key = isset($data['dev_key']) ? $data['dev_key'] : '';

if (!defined('DEV_MODE') || DEV_MODE !== true) {
    http_response_code(403);
    echo json_encode(['success'=>false,'message'=>'Dev endpoints disabled']);
    exit;
}
if ($dev_key !== DEV_KEY) {
    http_response_code(401);
    echo json_encode(['success'=>false,'message'=>'Invalid dev key']);
    exit;
}
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Missing user_id']);
    exit;
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT u.id FROM users u WHERE u.user_id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    if (!$user) {
        echo json_encode(['success'=>false,'message'=>'User not found']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT otp_code, expires_at, used, created_at FROM otps WHERE user_id = ? ORDER BY id DESC LIMIT 1');
    $stmt->execute([$user['id']]);
    $otp = $stmt->fetch();
    if (!$otp) {
        echo json_encode(['success'=>false,'message'=>'No OTP found']);
        exit;
    }
    echo json_encode(['success'=>true,'otp'=> $otp]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
?>