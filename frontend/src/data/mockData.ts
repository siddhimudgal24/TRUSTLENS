export type ShelterStatus =
  | "recommended"
  | "conditional"
  | "avoid"
  | "unavailable";

export interface Shelter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  readiness: number;
  capacity: number;
  occupied: number;
  status: ShelterStatus;
  accessibility: number;
  safety: number;
  hazardExposure: number;
  essentialServices: number;
  roadAccess: number;
}

export const shelters: Shelter[] = [
  {
    id: "S001",
    name: "Shelter A",
    lat: 26.9124,
    lng: 75.7873,
    readiness: 86,
    capacity: 500,
    occupied: 320,
    status: "recommended",
    accessibility: 88,
    safety: 92,
    hazardExposure: 90,
    essentialServices: 76,
    roadAccess: 85,
  },

  {
    id: "S002",
    name: "Shelter B",
    lat: 26.9198,
    lng: 75.8056,
    readiness: 49,
    capacity: 350,
    occupied: 290,
    status: "avoid",
    accessibility: 42,
    safety: 55,
    hazardExposure: 38,
    essentialServices: 62,
    roadAccess: 35,
  },

  {
    id: "S003",
    name: "Shelter C",
    lat: 26.8988,
    lng: 75.8121,
    readiness: 72,
    capacity: 300,
    occupied: 245,
    status: "conditional",
    accessibility: 70,
    safety: 84,
    hazardExposure: 68,
    essentialServices: 75,
    roadAccess: 72,
  },

  {
    id: "S004",
    name: "Shelter D",
    lat: 26.9275,
    lng: 75.7708,
    readiness: 91,
    capacity: 600,
    occupied: 210,
    status: "recommended",
    accessibility: 94,
    safety: 95,
    hazardExposure: 88,
    essentialServices: 90,
    roadAccess: 91,
  },
];
export const floodZone: [number, number][] = [
  [26.925, 75.760],
  [26.930, 75.790],
  [26.918, 75.825],
  [26.900, 75.835],
  [26.885, 75.810],
  [26.890, 75.775],
];
export interface AffectedZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
}

export const affectedZones: AffectedZone[] = [
  {
    id: "Z001",
    name: "Affected Zone A",
    lat: 26.905,
    lng: 75.780,
    population: 2400,
  },

  {
    id: "Z002",
    name: "Affected Zone B",
    lat: 26.920,
    lng: 75.815,
    population: 1800,
  },

  {
    id: "Z003",
    name: "Affected Zone C",
    lat: 26.895,
    lng: 75.800,
    population: 950,
  },
];
export const roads: [number, number][][] = [
  [
    [26.885, 75.765],
    [26.900, 75.780],
    [26.912, 75.787],
    [26.925, 75.805],
    [26.935, 75.820],
  ],

  [
    [26.875, 75.800],
    [26.895, 75.800],
    [26.915, 75.800],
    [26.935, 75.800],
  ],

  [
    [26.905, 75.750],
    [26.915, 75.775],
    [26.925, 75.795],
    [26.935, 75.815],
  ],
];
export const blockedRoads: [number, number][][] = [
  [
    [26.912, 75.787],
    [26.925, 75.805],
  ],
];