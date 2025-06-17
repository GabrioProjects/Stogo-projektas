let pricingData = null;

// inputs and results elements remain the same...

function calculateEstimate() {
    if (!pricingData) {
        results.container.classList.add('hidden');
        return;
    }

    const length = parseFloat(inputs.length.value) || 0;
    const width = parseFloat(inputs.width.value) || 0;
    const baseArea = length * width;

    if (baseArea === 0) {
        results.container.classList.add('hidden');
        return;
    }

    // Use pitchMultipliers from pricingData now
    const roofArea = baseArea * pricingData.pitchMultipliers[inputs.pitch.value];

    const materialCostPerSqM = pricingData.materials[inputs.materialType.value][inputs.quality.value];
    const materialCost = roofArea * materialCostPerSqM;

    const laborRate = pricingData.labor.baseRate * pricingData.labor.pitchMultiplier[inputs.pitch.value];
    const baseLaborCost = roofArea * laborRate;

    const levels = parseInt(inputs.levels.value) || 1;
    const chimneys = parseInt(inputs.chimneys.value) || 0;
    const skylights = parseInt(inputs.skylights.value) || 0;
    const valleys = parseInt(inputs.valleys.value) || 0;

    const complexityAdditions =
        (levels - 1) * roofArea * pricingData.complexity.additionalLevel +
        chimneys * pricingData.complexity.chimney +
        skylights * pricingData.complexity.skylight +
        valleys * pricingData.complexity.valley;

    const totalLaborCost = baseLaborCost + complexityAdditions;

    const subtotal = materialCost + totalLaborCost;

    // Use markup from pricingData
    const markupAmount = subtotal * pricingData.markup;
    const total = subtotal + markupAmount;

    results.roofArea.textContent = Math.round(roofArea) + ' m²';
    results.materialCost.textContent = '€' + Math.round(materialCost).toLocaleString();
    results.laborCost.textContent = '€' + Math.round(totalLaborCost).toLocaleString();
    results.markup.textContent = '€' + Math.round(markupAmount).toLocaleString();
    results.total.textContent = '€' + Math.round(total).toLocaleString();
    results.perSqFt.textContent = '€' + (Math.round(total / roofArea * 100) / 100).toFixed(2);

    results.container.classList.remove('hidden');
}

function addInputListeners() {
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateEstimate);
        input.addEventListener('change', calculateEstimate);
    });
}

fetch('/api/pricing')
    .then(res => res.json())
    .then(data => {
        pricingData = data;
        addInputListeners();
        calculateEstimate();
    })
    .catch(err => {
        console.error('Failed to load pricing data', err);
    });
