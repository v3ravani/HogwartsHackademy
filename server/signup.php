<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$data = getJsonInput();
$user_id = isset($data['user_id']) ? trim($data['user_id']) : '';
$password = isset($data['password']) ? $data['password'] : '';
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';

if (!$user_id || !$password || !$name) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Missing required fields']);
    exit;
}

try {
    $pdo = getPDO();
    // Check duplicate
    $stmt = $pdo->prepare('SELECT id FROM users WHERE user_id = ?');
    $stmt->execute([$user_id]);
    if ($stmt->fetch()) {
        echo json_encode(['success'=>false,'message'=>'User ID already exists']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins = $pdo->prepare('INSERT INTO users (user_id, password, name, email) VALUES (?, ?, ?, ?)');
    $ins->execute([$user_id, $hash, $name, $email]);

    echo json_encode(['success'=>true,'message'=>'Account created']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
