export function evaluateDecision(
  water: number,
  roads: number,
  education: number,
  eventImpact: string
) {
  let score = 50;

  if (water >= 4) score += 10;
  if (roads >= 3) score += 10;
  if (education >= 2) score += 10;

  switch (eventImpact) {
    case "Water":
      score += water * 3;
      break;

    case "Roads":
      score += roads * 3;
      break;

    case "Education":
      score += education * 3;
      break;

    default:
      break;
  }

  return Math.min(score, 100);
}