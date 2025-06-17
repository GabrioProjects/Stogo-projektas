export default function handler(req, res) {
  res.status(200).json({
    markup: parseFloat(process.env.MARKUP),
    pitchMultipliers: JSON.parse(process.env.PITCH_MULTIPLIERS),
    materials: JSON.parse(process.env.MATERIALS),
    labor: JSON.parse(process.env.LABOR),
    complexity: JSON.parse(process.env.COMPLEXITY),
  });
}
