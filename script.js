
        // Kainų duomenys (tikroje aplikacijoje šie duomenys būtų iš jūsų skaičiuoklės/duombazės)
        const pricingData = {
            materials: {
                asphalt: { standard: 35.00, premium: 55.00 }, // EUR už m²
                metal: { standard: 80.00, premium: 120.00 },
                tile: { standard: 70.00, premium: 100.00 },
                slate: { standard: 150.00, premium: 200.00 }
            },
            labor: {
                baseRate: 40.00, // EUR už m²
                pitchMultiplier: {
                    low: 1.0,
                    standard: 1.2,
                    steep: 1.5,
                    extreme: 2.0
                }
            },
            complexity: {
                additionalLevel: 5.00, // EUR už m²
                chimney: 200, // EUR už vienetą
                skylight: 150,
                valley: 100
            }
        };

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

        function calculateEstimate() {
            const length = parseFloat(inputs.length.value) || 0;
            const width = parseFloat(inputs.width.value) || 0;
            const baseArea = length * width;

            if (baseArea === 0) {
                results.container.classList.add('hidden');
                return;
            }

            // Apskaičiuojame faktinį stogo plotą su nuolydžiu
            const pitchMultipliers = {
                low: 1.05,
                standard: 1.15,
                steep: 1.3,
                extreme: 1.5
            };

            const roofArea = baseArea * pitchMultipliers[inputs.pitch.value];

            // Medžiagų kaštai
            const materialCostPerSqM = pricingData.materials[inputs.materialType.value][inputs.quality.value];
            const materialCost = roofArea * materialCostPerSqM;

            // Darbo kaštai
            const laborRate = pricingData.labor.baseRate * pricingData.labor.pitchMultiplier[inputs.pitch.value];
            const baseLaborCost = roofArea * laborRate;

            // Sudėtingumo priedai
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

            // Suma ir antkainis
            const subtotal = materialCost + totalLaborCost;
            const markupAmount = subtotal * 0.25; // 25% antkainis
            const total = subtotal + markupAmount;

            // Atnaujinti rodmenis
            results.roofArea.textContent = Math.round(roofArea) + ' m²';
            results.materialCost.textContent = '€' + Math.round(materialCost).toLocaleString();
            results.laborCost.textContent = '€' + Math.round(totalLaborCost).toLocaleString();
            results.markup.textContent = '€' + Math.round(markupAmount).toLocaleString();
            results.total.textContent = '€' + Math.round(total).toLocaleString();
            results.perSqFt.textContent = '€' + (Math.round(total / roofArea * 100) / 100).toFixed(2);

            // Show results
            results.container.classList.remove('hidden');
        }

        // Add event listeners to all inputs
        Object.values(inputs).forEach(input => {
            input.addEventListener('input', calculateEstimate);
            input.addEventListener('change', calculateEstimate);
        });

        // Initial calculation
        calculateEstimate();
