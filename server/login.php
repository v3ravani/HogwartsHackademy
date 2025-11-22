<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
session_start();

$data = getJsonInput();
$user_id = isset($data['user_id']) ? trim($data['user_id']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$user_id || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT id, password, name FROM users WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    // Set session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['name'] = $user['name'];

    echo json_encode(['success' => true, 'message' => 'Authenticated']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
