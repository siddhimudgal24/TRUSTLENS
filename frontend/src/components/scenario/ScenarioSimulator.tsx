import { useState } from "react";
import PageHeader from "../layout/PageHeader";

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

      <PageHeader
        eyebrow="What-if analysis"
        title="Scenario Simulator"
        description="Explore the effect of changing disaster conditions using the local scenario model."
      />

      <p className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] text-blue-800">
        Scenario results are illustrative and use a local model, not live hazard or capacity feeds.
      </p>


      {/* CONTROL PANEL */}

      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

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
            className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
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

          <label htmlFor="shelter-failure" className="text-sm text-gray-300">
            Shelter Failure
          </label>

          <select
            id="shelter-failure"
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
          className="mt-7 w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
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
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mt-6">

      <div className="flex justify-between mb-2">

        <label htmlFor={inputId} className="text-sm text-gray-300">
          {label}
        </label>

        <span className="text-sm font-semibold">
          {value}%
        </span>

      </div>

      <input
        id={inputId}
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
  const failedShelter = shelters.find(
    (shelter) => shelter.id === scenario.shelterFailure
  );
  const totalCapacity = shelters.reduce(
    (total, shelter) => total + shelter.capacity,
    0
  );
  const failedCapacityShare =
    failedShelter && totalCapacity > 0
      ? (failedShelter.capacity / totalCapacity) * 100
      : 0;

  const affectedPopulation = Math.round(
    basePopulation *
      (1 + scenario.populationDemand / 100)
  );

  const estimatedCoverage = Math.max(
    0,
    94 -
      scenario.floodSeverity * 0.25 -
      scenario.roadClosures * 0.2 -
      scenario.populationDemand * 0.15 -
      failedCapacityShare
  );

  const operationalRisk = Math.min(
    100,
    Math.round(
      (scenario.floodSeverity +
        scenario.roadClosures +
        scenario.populationDemand) /
        3 +
        failedCapacityShare
    )
  );

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Simulation Result
      </h2>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

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


      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-5">

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
              failedShelter?.name ?? "None"
            }
          />

        </div>

      </div>


      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-5">

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
    <div className="rounded-xl border border-white/10 bg-[#0D1320] p-5">

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