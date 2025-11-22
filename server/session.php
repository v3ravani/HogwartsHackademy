<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode(['authenticated' => true, 'user_id' => $_SESSION['user_id'], 'name' => $_SESSION['name'] ?? '']);
} else {
    echo json_encode(['authenticated' => false]);
}
?>