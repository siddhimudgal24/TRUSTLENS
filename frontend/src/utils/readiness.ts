import type { Shelter } from "../data/mockData";

export function calculateReadiness(
  shelter: Shelter
) {
  const capacityScore =
    ((shelter.capacity - shelter.occupied) /
      shelter.capacity) *
    100;

  const score =
    shelter.safety * 0.30 +
    shelter.accessibility * 0.20 +
    capacityScore * 0.15 +
    shelter.hazardExposure * 0.15 +
    shelter.essentialServices * 0.10 +
    shelter.roadAccess * 0.10;

  return Math.round(score);
}

export function getShelterStatus(
  readiness: number
) {
  if (readiness >= 75) {
    return "recommended";
  }

  if (readiness >= 50) {
    return "conditional";
  }

  return "avoid";
}