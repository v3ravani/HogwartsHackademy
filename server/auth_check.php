<?php
// Simple server-side include to enforce session authentication for PHP endpoints.
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
// If included, script continues and $_SESSION contains user_id and name
?>
