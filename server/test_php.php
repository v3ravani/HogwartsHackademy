<?php
// Simple test to verify the server executes PHP.
header('Content-Type: text/plain; charset=utf-8');
echo "PHP test OK\n";
echo "PHP version: " . PHP_VERSION . "\n";
echo "Server API: " . php_sapi_name() . "\n";
?>
