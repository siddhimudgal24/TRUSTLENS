export interface ScenarioSettings {
  floodSeverity: number;
  roadClosures: number;
  populationDemand: number;
  shelterFailure: string;
}

export const defaultScenario: ScenarioSettings = {
  floodSeverity: 30,
  roadClosures: 20,
  populationDemand: 20,
  shelterFailure: "none",
};