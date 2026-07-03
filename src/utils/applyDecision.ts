import { VillageMetrics } from "../types/village";

export function applyDecision(
  metrics: VillageMetrics,
  allocations: {
    water: number;
    roads: number;
    education: number;
    drainage: number;
  },
  eventImpact: string
): VillageMetrics {

  const updated = { ...metrics };

  // Natural decline each round

  updated.water -= 2;
  updated.roads -= 2;
  updated.education -= 2;
  updated.drainage -= 2;

  // Investments improve sectors

  updated.water += allocations.water * 3;
  updated.roads += allocations.roads * 3;
  updated.education += allocations.education * 3;
  updated.drainage += allocations.drainage * 3;

  // Event bonus

  switch (eventImpact) {

    case "Water":
      updated.water += 10;
      break;

    case "Roads":
      updated.roads += 10;
      break;

    case "Education":
      updated.education += 10;
      break;

    case "Drainage":
      updated.drainage += 10;
      break;
  }

  return {
    water: Math.max(0, Math.min(updated.water, 100)),
    roads: Math.max(0, Math.min(updated.roads, 100)),
    education: Math.max(0, Math.min(updated.education, 100)),
    drainage: Math.max(0, Math.min(updated.drainage, 100)),
  };
}