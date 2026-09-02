import { useState } from "react";

import type { ScenarioSettings } from "../../data/scenarioData";
import { defaultScenario } from "../../data/scenarioData";

import { shelters } from "../../data/mockData";

function ScenarioSimulator() {
  const [scenario, setScenario] =
    useState<ScenarioSettings>(defaultScenario);

  const [simulated, setSimulated] = useState(false);

  const updateScenario = (
    key: keyof ScenarioSettings,
    value: number | string
  ) => {
    setScenario((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSimulated(false);
  };

  const resetScenario = () => {
    setScenario(defaultScenario);
    setSimulated(false);
  };

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}

      <div>
        <p className="text-sm text-gray-400">
          WHAT-IF ANALYSIS
        </p>

        <h1 className="text-2xl font-bold mt-1">
          Scenario Simulator
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Test disaster conditions and observe their operational impact.
        </p>
      </div>


      {/* CONTROL PANEL */}

      <div className="bg-[#111827] border border-white/10 rounded-xl p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="font-semibold">
              Scenario Conditions
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Adjust conditions and simulate the outcome.
            </p>
          </div>

          <button
            onClick={resetScenario}
            className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition"
          >
            Reset
          </button>

        </div>


        {/* FLOOD SEVERITY */}

        <ScenarioSlider
          label="Flood Severity"
          value={scenario.floodSeverity}
          onChange={(value) =>
            updateScenario("floodSeverity", value)
          }
        />


        {/* ROAD CLOSURES */}

        <ScenarioSlider
          label="Road Closures"
          value={scenario.roadClosures}
          onChange={(value) =>
            updateScenario("roadClosures", value)
          }
        />


        {/* POPULATION DEMAND */}

        <ScenarioSlider
          label="Population Demand"
          value={scenario.populationDemand}
          onChange={(value) =>
            updateScenario("populationDemand", value)
          }
        />


        {/* SHELTER FAILURE */}

        <div className="mt-6">

          <label className="text-sm text-gray-300">
            Shelter Failure
          </label>

          <select
            value={scenario.shelterFailure}
            onChange={(event) =>
              updateScenario(
                "shelterFailure",
                event.target.value
              )
            }
            className="mt-2 w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none"
          >

            <option value="none">
              No Shelter Failure
            </option>

            {shelters.map((shelter) => (
              <option
                key={shelter.id}
                value={shelter.id}
              >
                {shelter.name}
              </option>
            ))}

          </select>

        </div>


        {/* SIMULATE */}

        <button
          onClick={() => setSimulated(true)}
          className="w-full mt-7 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          {simulated
            ? "Scenario Simulated"
            : "Run Simulation"}
        </button>

      </div>


      {/* RESULTS */}

      {simulated && (
        <ScenarioResults
          scenario={scenario}
        />
      )}

    </div>
  );
}


interface ScenarioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function ScenarioSlider({
  label,
  value,
  onChange,
}: ScenarioSliderProps) {
  return (
    <div className="mt-6">

      <div className="flex justify-between mb-2">

        <label className="text-sm text-gray-300">
          {label}
        </label>

        <span className="text-sm font-semibold">
          {value}%
        </span>

      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full"
      />

    </div>
  );
}


function ScenarioResults({
  scenario,
}: {
  scenario: ScenarioSettings;
}) {
  const basePopulation = 8420;

  const affectedPopulation = Math.round(
    basePopulation *
      (1 + scenario.populationDemand / 100)
  );

  const estimatedCoverage = Math.max(
    0,
    94 -
      scenario.floodSeverity * 0.25 -
      scenario.roadClosures * 0.2 -
      scenario.populationDemand * 0.15
  );

  const operationalRisk =
    Math.round(
      (scenario.floodSeverity +
        scenario.roadClosures +
        scenario.populationDemand) /
        3
    );

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Simulation Result
      </h2>


      <div className="grid grid-cols-3 gap-4">

        <ResultCard
          label="Projected Population"
          value={affectedPopulation.toLocaleString()}
        />

        <ResultCard
          label="Estimated Coverage"
          value={`${Math.round(estimatedCoverage)}%`}
        />

        <ResultCard
          label="Operational Risk"
          value={`${operationalRisk}%`}
        />

      </div>


      <div className="bg-[#111827] border border-white/10 rounded-xl p-5">

        <h3 className="font-semibold">
          Scenario Impact
        </h3>

        <div className="mt-4 space-y-3 text-sm">

          <ImpactRow
            label="Flood Severity"
            value={`${scenario.floodSeverity}%`}
          />

          <ImpactRow
            label="Road Closures"
            value={`${scenario.roadClosures}%`}
          />

          <ImpactRow
            label="Population Demand"
            value={`${scenario.populationDemand}%`}
          />

          <ImpactRow
            label="Shelter Failure"
            value={
              scenario.shelterFailure === "none"
                ? "None"
                : scenario.shelterFailure
            }
          />

        </div>

      </div>


      <div className="bg-[#111827] border border-white/10 rounded-xl p-5">

        <h3 className="font-semibold">
          Recommended Response
        </h3>

        <p className="text-sm text-gray-400 mt-3">

          {operationalRisk >= 70
            ? "High operational risk detected. Prioritize safe shelters, reassess blocked routes, and prepare immediate reallocation."
            : operationalRisk >= 40
            ? "Moderate operational risk detected. Monitor shelter capacity and accessibility closely."
            : "Current scenario remains relatively stable. Continue monitoring shelter readiness and demand."}

        </p>

      </div>

    </div>
  );
}


function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-5">

      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}


function ImpactRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-3">

      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>

    </div>
  );
}

export default ScenarioSimulator;