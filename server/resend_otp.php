<?php
// OTP functionality has been removed from this installation.
header('Content-Type: application/json; charset=utf-8');
http_response_code(410);
echo json_encode(['success' => false, 'message' => 'OTP functionality disabled.']);
exit;
