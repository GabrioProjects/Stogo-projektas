<?php
// Simple test version
header('Content-Type: application/json');

// Test if PHP is working
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Only POST method allowed']);
    exit;
}

// Basic pricing (simplified for testing)
$prices = [
    'asphalt' => ['standard' => 35, 'premium' => 55],
    'metal' => ['standard' => 80, 'premium' => 120],
    'tile' => ['standard' => 70, 'premium' => 100],
    'slate' => ['standard' => 150, 'premium' => 200]
];

// Get POST data
$postData = file_get_contents('php://input');
$input = json_decode($postData, true);

if (!$input) {
    echo json_encode(['error' => 'Invalid input data']);
    exit;
}

// Basic calculation
$length = floatval($input['length'] ?? 0);
$width = floatval($input['width'] ?? 0);
$materialType = $input['materialType'] ?? 'asphalt';
$quality = $input['quality'] ?? 'standard';

if ($length <= 0 || $width <= 0) {
    echo json_encode(['error' => 'Invalid dimensions']);
    exit;
}

$area = $length * $width * 1.15; // Simple area calculation
$materialPrice = $prices[$materialType][$quality];
$materialCost = $area * $materialPrice;
$laborCost = $area * 40;
$markup = ($materialCost + $laborCost) * 0.25;
$total = $materialCost + $laborCost + $markup;

echo json_encode([
    'roofArea' => round($area),
    'materialCost' => round($materialCost),
    'laborCost' => round($laborCost),
    'markup' => round($markup),
    'total' => round($total),
    'perSqM' => round($total / $area, 2)
]);
?>
