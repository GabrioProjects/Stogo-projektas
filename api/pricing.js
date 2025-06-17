export default function handler(req, res) {
  const pricingData = {
    materials: {
      asphalt: { standard: 35.00, premium: 55.00 },
      metal: { standard: 80.00, premium: 120.00 },
      tile: { standard: 70.00, premium: 100.00 },
      slate: { standard: 150.00, premium: 200.00 }
    },
    labor: {
      baseRate: 40.00,
      pitchMultiplier: {
        low: 1.0,
        standard: 1.2,
        steep: 1.5,
        extreme: 2.0
      }
    },
    complexity: {
      additionalLevel: 5.00,
      chimney: 200,
      skylight: 150,
      valley: 100
    },
    pitchMultipliers: {       // for roof area calc with pitch
      low: 1.05,
      standard: 1.15,
      steep: 1.3,
      extreme: 1.5
    },
    markup: 0.25  // 25% markup
  };

  res.status(200).json(pricingData);
}
