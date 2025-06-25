<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Secure pricing data - hidden from clients
$pricingData = [
    'materials' => [
        'asphalt' => ['standard' => 35.00, 'premium' => 55.00],
        'metal' => ['standard' => 80.00, 'premium' => 120.00],
        'tile' => ['standard' => 70.00, 'premium' => 100.00],
        'slate' => ['standard' => 150.00, 'premium' => 200.00]
    ],
    'labor' => [
        'baseRate' => 40.00,
        'pitchMultiplier' => [
            'low' => 1.0,
            'standard' => 1.2,
            'steep' => 1.5,
            'extreme' => 2.0
        ]
    ],
    'complexity' => [
        'additionalLevel' => 5.00,
        'chimney' => 200,
        'skylight' => 150,
        'valley' => 100
    ]
];

$pitchMultipliers = [
    'low' => 1.05,
    'standard' => 1.15,
    'steep' => 1.3,
    'extreme' => 1.5
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Get input values with defaults
    $length = floatval($input['length'] ?? 0);
    $width = floatval($input['width'] ?? 0);
    $pitch = $input['pitch'] ?? 'standard';
    $materialType = $input['materialType'] ?? 'asphalt';
    $quality = $input['quality'] ?? 'standard';
    $levels = intval($input['levels'] ?? 1);
    $chimneys = intval($input['chimneys'] ?? 0);
    $skylights = intval($input['skylights'] ?? 0);
    $valleys = intval($input['valleys'] ?? 0);
    
    $baseArea = $length * $width;
    
    if ($baseArea === 0) {
        echo json_encode(['error' => 'Invalid dimensions']);
        exit;
    }
    
    // Calculate roof area with pitch
    $roofArea = $baseArea * $pitchMultipliers[$pitch];
    
    // Material costs
    $materialCostPerSqM = $pricingData['materials'][$materialType][$quality];
    $materialCost = $roofArea * $materialCostPerSqM;
    
    // Labor costs
    $laborRate = $pricingData['labor']['baseRate'] * $pricingData['labor']['pitchMultiplier'][$pitch];
    $baseLaborCost = $roofArea * $laborRate;
    
    // Complexity additions
    $complexityAdditions = 
        ($levels - 1) * $roofArea * $pricingData['complexity']['additionalLevel'] +
        $chimneys * $pricingData['complexity']['chimney'] +
        $skylights * $pricingData['complexity']['skylight'] +
        $valleys * $pricingData['complexity']['valley'];
        
    $totalLaborCost = $baseLaborCost + $complexityAdditions;
    
    // Totals
    $subtotal = $materialCost + $totalLaborCost;
    $markupAmount = $subtotal * 0.25; // 25% markup
    $total = $subtotal + $markupAmount;
    
    // Return results
    echo json_encode([
        'roofArea' => round($roofArea),
        'materialCost' => round($materialCost),
        'laborCost' => round($totalLaborCost),
        'markup' => round($markupAmount),
        'total' => round($total),
        'perSqM' => round($total / $roofArea * 100) / 100
    ]);
} else {
    echo json_encode(['error' => 'Only POST method allowed']);
}
?>
