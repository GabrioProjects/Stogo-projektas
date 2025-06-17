export default function handler(req, res) {
  res.status(200).json({
    markup: 0.25,
    pitchMultipliers: {
      low: 1.05,
      standard: 1.15,
      steep: 1.3,
      extreme: 1.5
    },
    materials: {
      asphalt: { standard: 35.0, premium: 55.0 },
      metal: { standard: 80.0, premium: 120.0 },
      tile: { standard: 70.0, premium: 100.0 },
      slate: { standard: 150.0, premium: 200.0 }
    },
    labor: {
      baseRate: 40.0,
      pitchMultiplier: {
        low: 1.0,
        standard: 1.2,
        steep: 1.5,
        extreme: 2.0
      }
    },
    complexity: {
      additionalLevel: 5.0,
      chimney: 200,
      skylight: 150,
      valley: 100
    }
  });
}
