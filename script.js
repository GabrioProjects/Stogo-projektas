// Get all input elements
const inputs = {
    length: document.getElementById('length'),
    width: document.getElementById('width'),
    pitch: document.getElementById('pitch'),
    materialType: document.getElementById('materialType'),
    quality: document.getElementById('quality'),
    levels: document.getElementById('levels'),
    chimneys: document.getElementById('chimneys'),
    skylights: document.getElementById('skylights'),
    valleys: document.getElementById('valleys')
};

// Get result elements
const results = {
    container: document.getElementById('results'),
    roofArea: document.getElementById('roofArea'),
    materialCost: document.getElementById('materialCost'),
    laborCost: document.getElementById('laborCost'),
    markup: document.getElementById('markup'),
    total: document.getElementById('total'),
    perSqFt: document.getElementById('perSqFt')
};

async function calculateEstimate() {
    const length = parseFloat(inputs.length.value) || 0;
    const width = parseFloat(inputs.width.value) || 0;
    
    if (length === 0 || width === 0) {
        results.container.classList.add('hidden');
        return;
    }
    
    // Show loading state
    const calculateBtn = document.getElementById('calculateBtn');
    const originalText = calculateBtn.textContent;
    calculateBtn.textContent = 'Skaičiuojama...';
    calculateBtn.disabled = true;
    
    // Prepare data to send to PHP
    const calculationData = {
        length: length,
        width: width,
        pitch: inputs.pitch.value,
        materialType: inputs.materialType.value,
        quality: inputs.quality.value,
        levels: parseInt(inputs.levels.value) || 1,
        chimneys: parseInt(inputs.chimneys.value) || 0,
        skylights: parseInt(inputs.skylights.value) || 0,
        valleys: parseInt(inputs.valleys.value) || 0
    };
    
    try {
        // Send data to PHP backend
        const response = await fetch('calculate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(calculationData)
        });
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        
        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Invalid JSON response:', responseText);
            throw new Error('Server returned invalid response');
        }
        
        if (data.error) {
            console.error('Calculation error:', data.error);
            results.container.classList.add('hidden');
            return;
        }
        
        // Update display with results from PHP
        results.roofArea.textContent = data.roofArea + ' m²';
        results.materialCost.textContent = '€' + data.materialCost.toLocaleString();
        results.laborCost.textContent = '€' + data.laborCost.toLocaleString();
        results.markup.textContent = '€' + data.markup.toLocaleString();
        results.total.textContent = '€' + data.total.toLocaleString();
        results.perSqFt.textContent = '€' + data.perSqM.toFixed(2);
        
        // Show results
        results.container.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error calculating estimate:', error);
        alert('Klaida skaičiuojant kainą. Bandykite dar kartą arba susisiekite su mumis.');
        results.container.classList.add('hidden');
    } finally {
        // Reset button
        calculateBtn.textContent = originalText;
        calculateBtn.disabled = false;
    }
}

// Add calculate button event listener
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateEstimate);
    }
});
