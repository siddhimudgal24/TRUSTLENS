import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import { affectedZones, type AffectedZone, type Shelter } from "../data/mockData";
import { useShelterStore } from "../store/shelterStore";
import { calculateReadiness } from "../utils/readiness";

interface AllocationRecord {
  id: string;
  zoneId: string;
  zone: string;
  population: number;
  shelter: string;
  allocated: number;
  distance: string;
  readiness: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface AllocationCandidate {
  zone: AffectedZone;
  shelter: Shelter;
  distanceKm: number;
  readiness: number;
  suitability: number;
}

interface ShelterRecommendation {
  shelter: Shelter;
  distanceKm: number;
  suitability: number;
  suggestedPeople: number;
}

function getDistanceKm(
  origin: Pick<AffectedZone, "lat" | "lng">,
  destination: Pick<Shelter, "lat" | "lng">
) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDifference = radians(destination.lat - origin.lat);
  const longitudeDifference = radians(destination.lng - origin.lng);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(origin.lat)) *
      Math.cos(radians(destination.lat)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getAvailableCapacity(shelter: Shelter) {
  if (
    !Number.isFinite(shelter.capacity) ||
    !Number.isFinite(shelter.occupied) ||
    shelter.capacity <= 0
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(shelter.capacity, shelter.capacity - shelter.occupied)
  );
}

function getSuitabilityScore(shelter: Shelter, distanceKm: number) {
  const availableCapacity = getAvailableCapacity(shelter);
  const capacityScore =
    shelter.capacity > 0
      ? Math.min(100, (availableCapacity / shelter.capacity) * 100)
      : 0;
  const proximityScore = Math.max(0, 100 - distanceKm * 10);

  return Math.round(
    shelter.safety * 0.25 +
      shelter.accessibility * 0.15 +
      capacityScore * 0.15 +
      shelter.hazardExposure * 0.15 +
      shelter.essentialServices * 0.1 +
      shelter.roadAccess * 0.1 +
      proximityScore * 0.1
  );
}

function findSuitableShelters(
  zone: AffectedZone,
  shelters: Shelter[]
): ShelterRecommendation[] {
  const rankedShelters = shelters
    .filter((shelter) => {
      const available = getAvailableCapacity(shelter);
      return (
        (shelter.status === "recommended" ||
          shelter.status === "conditional") &&
        shelter.safety >= 60 &&
        shelter.roadAccess >= 50 &&
        available > 0
      );
    })
    .map((shelter) => {
      const distanceKm = getDistanceKm(zone, shelter);
      const readiness = calculateReadiness(shelter);

      return {
        shelter,
        distanceKm,
        suitability: Math.round(
          readiness * 0.8 + Math.max(0, 100 - distanceKm * 10) * 0.2
        ),
      };
    })
    .sort(
      (first, second) =>
        second.suitability - first.suitability ||
        first.distanceKm - second.distanceKm ||
        first.shelter.id.localeCompare(second.shelter.id)
    );

  let peopleRemaining = zone.population;

  return rankedShelters.flatMap(({ shelter, distanceKm, suitability }) => {
    const available = Math.max(0, shelter.capacity - shelter.occupied);
    const suggestedPeople = Math.min(
      Math.max(0, peopleRemaining),
      available
    );
    peopleRemaining -= suggestedPeople;

    return suggestedPeople > 0
      ? [{ shelter, distanceKm, suitability, suggestedPeople }]
      : [];
  });
}

function calculateAllocation(
  zones: AffectedZone[],
  shelters: Shelter[]
): AllocationRecord[] {
  const eligibleShelters = shelters.filter(
    (shelter) =>
      shelter.capacity > 0 &&
      getAvailableCapacity(shelter) > 0 &&
      (shelter.status === "recommended" ||
        shelter.status === "conditional") &&
      shelter.safety >= 60 &&
      shelter.roadAccess >= 50
  );
  const totalDemand = zones.reduce(
    (total, zone) => total + Math.max(0, Math.floor(zone.population)),
    0
  );
  const allocationBudget = Math.floor(
    Math.min(
      totalDemand,
      eligibleShelters.reduce(
        (total, shelter) => total + getAvailableCapacity(shelter),
        0
      )
    )
  );
  const proportionalTargets = zones.map((zone) => {
    const demand = Math.max(0, Math.floor(zone.population));
    const exactTarget =
      totalDemand > 0 ? (allocationBudget * demand) / totalDemand : 0;
    const target = Math.floor(exactTarget);

    return {
      zone,
      demand,
      target,
      remainder: exactTarget - target,
    };
  });
  let remainingBudget =
    allocationBudget -
    proportionalTargets.reduce((total, target) => total + target.target, 0);

  for (const target of [...proportionalTargets].sort(
    (first, second) =>
      second.remainder - first.remainder ||
      first.zone.id.localeCompare(second.zone.id)
  )) {
    if (remainingBudget <= 0) break;
    if (target.target >= target.demand) continue;

    target.target += 1;
    remainingBudget -= 1;
  }

  const candidates: AllocationCandidate[] = zones.flatMap((zone) =>
    eligibleShelters.map((shelter) => {
      const distanceKm = getDistanceKm(zone, shelter);

      return {
        zone,
        shelter,
        distanceKm,
        readiness: calculateReadiness(shelter),
        suitability: getSuitabilityScore(shelter, distanceKm),
      };
    })
  );

  candidates.sort(
    (first, second) =>
      second.suitability - first.suitability ||
      first.distanceKm - second.distanceKm ||
      first.zone.id.localeCompare(second.zone.id) ||
      first.shelter.id.localeCompare(second.shelter.id)
  );

  const remainingDemand = new Map(
    proportionalTargets.map(({ zone, target }) => [zone.id, target])
  );
  const remainingCapacity = new Map(
    eligibleShelters.map((shelter) => [
      shelter.id,
      getAvailableCapacity(shelter),
    ])
  );
  const assignedByZone = new Map<string, number>();
  const assignments: AllocationRecord[] = [];

  for (const candidate of candidates) {
    const demand = remainingDemand.get(candidate.zone.id) ?? 0;
    const capacity = remainingCapacity.get(candidate.shelter.id) ?? 0;
    const assigned = Math.min(demand, capacity);

    if (assigned <= 0) continue;

    remainingDemand.set(candidate.zone.id, demand - assigned);
    remainingCapacity.set(candidate.shelter.id, capacity - assigned);
    assignedByZone.set(
      candidate.zone.id,
      (assignedByZone.get(candidate.zone.id) ?? 0) + assigned
    );
    assignments.push({
      id: `${candidate.zone.id}-${candidate.shelter.id}`,
      zoneId: candidate.zone.id,
      zone: candidate.zone.name,
      population: candidate.zone.population,
      shelter: candidate.shelter.name,
      allocated: assigned,
      distance: `${candidate.distanceKm.toFixed(1)} km`,
      readiness: candidate.readiness,
      priority: "LOW",
    });
  }

  const remainingByZone = new Map(
    zones.map((zone) => [
      zone.id,
      Math.max(0, Math.floor(zone.population)) -
        (assignedByZone.get(zone.id) ?? 0),
    ])
  );

  for (const assignment of assignments) {
    const zone = zones.find((candidate) => candidate.id === assignment.zoneId);
    const unassigned = remainingByZone.get(assignment.zoneId) ?? 0;

    assignment.priority =
      unassigned === 0
        ? "LOW"
        : unassigned / Math.max(1, zone?.population ?? 0) >= 0.5
          ? "HIGH"
          : "MEDIUM";
  }

  for (const zone of zones) {
    const unassigned = remainingByZone.get(zone.id) ?? 0;
    if (unassigned <= 0) continue;

    assignments.push({
      id: `${zone.id}-unassigned`,
      zoneId: zone.id,
      zone: zone.name,
      population: zone.population,
      shelter: "Unassigned — no suitable capacity",
      allocated: 0,
      distance: "—",
      readiness: 0,
      priority:
        unassigned / Math.max(1, zone.population) >= 0.5
          ? "HIGH"
          : "MEDIUM",
    });
  }

  return assignments;
}

function Allocation() {
  const navigate = useNavigate();
  const shelters = useShelterStore((state) => state.shelters);
  const selectShelter = useShelterStore((state) => state.selectShelter);
  const [isRunning, setIsRunning] = useState(false);
  const [isAllocated, setIsAllocated] = useState(false);
  const [records, setRecords] = useState<AllocationRecord[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState(
    affectedZones[0]?.id ?? ""
  );
  const [hasSearched, setHasSearched] = useState(false);
  const selectedZone = affectedZones.find((zone) => zone.id === selectedZoneId);
  const recommendations = useMemo(
    () =>
      selectedZone
        ? findSuitableShelters(selectedZone, shelters)
        : [],
    [selectedZone, shelters]
  );
  const suggestedTotal = recommendations.reduce(
    (total, recommendation) => total + recommendation.suggestedPeople,
    0
  );
  const unassignedPopulation = selectedZone
    ? selectedZone.population - suggestedTotal
    : 0;

  useEffect(() => {
    if (!isRunning) return;

    const timeoutId = window.setTimeout(() => {
      setRecords(calculateAllocation(affectedZones, shelters));
      setIsRunning(false);
      setIsAllocated(true);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [isRunning, shelters]);

  const runAllocation = () => {
    setRecords([]);
    setIsRunning(true);
    setIsAllocated(false);
  };

  const resetAllocation = () => {
    setIsRunning(false);
    setIsAllocated(false);
    setRecords([]);
  };

  const totalPopulation = affectedZones.reduce(
    (total, zone) => total + Math.max(0, zone.population),
    0
  );

  const totalAllocated = records.reduce(
    (sum, record) => sum + record.allocated,
    0
  );
  const totalUnallocated = Math.max(0, totalPopulation - totalAllocated);

  const allocationPercentage =
    totalPopulation > 0
      ? Math.round((totalAllocated / totalPopulation) * 100)
      : 0;
  const weightedDistance = records.reduce((total, record) => {
    const distanceKm = Number.parseFloat(record.distance);
    return Number.isFinite(distanceKm)
      ? total + distanceKm * record.allocated
      : total;
  }, 0);
  const averageDistance =
    totalAllocated > 0
      ? `${(weightedDistance / totalAllocated).toFixed(1)} km`
      : "—";
  const isFullyAllocated = isAllocated && totalUnallocated === 0;

  return (
    <div className="space-y-6 text-white">
      <PageHeader
        eyebrow="Emergency allocation engine"
        title="Smart Allocation"
        description="Run a capacity-constrained allocation using affected-zone demand and current shelter readiness."
        status={
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-emerald-400">
            LOCAL DEMO
          </span>

          </div>
        }
      />

      <p className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] text-blue-800">
        This local decision-support demonstration uses bundled sample data and does not contact a live allocation service.
      </p>

      <section className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Shelter matching
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              Find Suitable Shelters
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Distribute safe capacity across zones by demand, then rank shelters
              by readiness (80%) and proximity (20%). Distances are straight-line
              estimates.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:min-w-[min(100%,24rem)] sm:flex-row">
            <label className="min-w-0 flex-1 text-xs text-gray-500">
              Affected zone
              <select
                aria-label="Affected zone"
                value={selectedZoneId}
                onChange={(event) => {
                  setSelectedZoneId(event.target.value);
                  setHasSearched(false);
                }}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#070B14] px-3 py-2.5 text-sm text-white"
              >
                {affectedZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.population.toLocaleString()} people)
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={!selectedZone}
              onClick={() => setHasSearched(true)}
              className="self-end rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              FIND SUITABLE SHELTERS
            </button>
          </div>
        </div>

        {hasSearched && selectedZone && (
          <div className="mt-5 border-t border-white/10 pt-5">
            {recommendations.length > 0 ? (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    Recommended for {selectedZone.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {suggestedTotal.toLocaleString()} of{" "}
                    {selectedZone.population.toLocaleString()} people can be
                    placed
                  </p>
                </div>

                <div
                  aria-label="Suitable shelter recommendations"
                  className="grid grid-cols-1 gap-3 lg:grid-cols-2"
                >
                  {recommendations.map(
                    (
                      { shelter, distanceKm, suitability, suggestedPeople },
                      index
                    ) => (
                      <article
                        key={shelter.id}
                        className="rounded-lg border border-white/10 bg-[#070B14] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {shelter.name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-gray-500">
                              {shelter.id} · {distanceKm.toFixed(1)} km away
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {index === 0 && (
                              <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-400">
                                BEST MATCH
                              </span>
                            )}
                            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                              {suitability}% match
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 text-[10px] sm:grid-cols-4">
                          <div>
                            <p className="text-gray-500">Readiness</p>
                            <p className="mt-1 font-semibold">
                              {calculateReadiness(shelter)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Spaces available</p>
                            <p className="mt-1 font-semibold">
                              {Math.max(
                                0,
                                shelter.capacity - shelter.occupied
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Suggested placement</p>
                            <p className="mt-1 font-semibold text-emerald-400">
                              {suggestedPeople.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Safety / road</p>
                            <p className="mt-1 font-semibold">
                              {shelter.safety}% / {shelter.roadAccess}%
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            selectShelter(shelter);
                            navigate("/shelters");
                          }}
                          className="mt-4 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-[10px] font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                        >
                          VIEW SHELTER DETAILS
                        </button>
                      </article>
                    )
                  )}
                </div>

                {unassignedPopulation > 0 && (
                  <p
                    role="status"
                    className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
                  >
                    Current suitable capacity leaves{" "}
                    {unassignedPopulation.toLocaleString()} people without a
                    placement. Review other resources before making an
                    operational decision.
                  </p>
                )}
              </>
            ) : (
              <p
                role="status"
                className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
              >
                No available shelters meet the current safety and access
                criteria for this zone.
              </p>
            )}
          </div>
        )}
      </section>


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Affected Population
          </p>

          <p className="text-3xl font-bold mt-2">
            {totalPopulation.toLocaleString()}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Requiring evacuation
          </p>

        </div>


        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Allocated
          </p>

          <p className="text-3xl font-bold mt-2 text-cyan-400">
            {totalAllocated.toLocaleString()}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            People assigned
          </p>

        </div>


        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Allocation Rate
          </p>

          <p className="text-3xl font-bold mt-2 text-emerald-400">
            {allocationPercentage}%
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Population covered
          </p>

        </div>


        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Active Zones
          </p>

          <p className="text-3xl font-bold mt-2">
            {affectedZones.length}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Requiring response
          </p>

        </div>

      </div>


      {/* CONTROL BAR */}

      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs text-gray-500 uppercase">
              Allocation Strategy
            </p>

            <h2 className="text-sm font-semibold mt-1">
              Risk-aware multi-factor allocation
            </h2>

          </div>


          <div className="flex flex-wrap gap-3">

            <button
              onClick={resetAllocation}
              className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 text-xs font-semibold hover:bg-white/10"
            >
              RESET
            </button>


            <button
              onClick={runAllocation}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 disabled:opacity-50"
            >
              {isRunning
                ? "CALCULATING..."
                : "RUN SMART ALLOCATION"}
            </button>

          </div>

        </div>


        {/* ALGORITHM FACTORS */}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              SAFETY
            </p>
            <p className="text-sm font-bold mt-1">
              25%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              ACCESSIBILITY
            </p>
            <p className="text-sm font-bold mt-1">
              15%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              CAPACITY
            </p>
            <p className="text-sm font-bold mt-1">
              15%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              HAZARD
            </p>
            <p className="text-sm font-bold mt-1">
              15%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              SERVICES
            </p>
            <p className="text-sm font-bold mt-1">
              10%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              ROAD ACCESS
            </p>
            <p className="text-sm font-bold mt-1">
              10%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              PROXIMITY
            </p>
            <p className="text-sm font-bold mt-1">
              10%
            </p>
          </div>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">


        {/* ALLOCATION TABLE */}

        <div className="min-w-0 rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6 2xl:col-span-2">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs text-cyan-400 uppercase">
                Allocation Matrix
              </p>

              <h2 className="text-lg font-semibold mt-1">
                Population → Shelter Assignment
              </h2>

            </div>

            {isAllocated && (
              <span className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                OPTIMIZATION COMPLETE
              </span>
            )}

          </div>


          <div className="overflow-x-auto rounded-xl border border-white/10">

            {/* TABLE HEADER */}

            <div className="grid min-w-[820px] grid-cols-7 gap-3 bg-[#070B14] px-4 py-3 text-[10px] uppercase text-gray-500">

              <span>Zone</span>
              <span>Population</span>
              <span>Shelter</span>
              <span>Allocated</span>
              <span>Distance</span>
              <span>Readiness</span>
              <span>Priority</span>

            </div>


            {/* TABLE ROWS */}

            {records.length > 0 ? records.map((record) => (

              <div
                key={record.id}
                className="grid min-w-[820px] grid-cols-7 items-center gap-3 border-t border-white/5 px-4 py-4 hover:bg-white/[0.02]"
              >

                <div>
                  <p className="text-xs font-medium">
                    {record.zone}
                  </p>
                </div>


                <span className="text-xs">
                  {record.population.toLocaleString()}
                </span>


                <span
                  className={`text-xs ${
                    record.allocated > 0
                      ? "text-cyan-400"
                      : "text-red-400"
                  }`}
                >
                  {record.shelter}
                </span>


                <span
                  className={`text-xs font-semibold ${
                    record.allocated > 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {record.allocated.toLocaleString()}
                </span>


                <span className="text-xs text-gray-400">
                  {record.distance}
                </span>


                <span
                  className={`text-xs font-bold ${
                    record.readiness >= 85
                      ? "text-emerald-400"
                      : record.readiness >= 70
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {record.readiness > 0 ? `${record.readiness}%` : "—"}
                </span>


                <span
                  className={`text-[9px] font-bold px-2 py-1 rounded-md w-fit ${
                    record.priority === "HIGH"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : record.priority === "MEDIUM"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {record.priority}
                </span>

              </div>

            )) : (
              <p className="border-t border-white/5 px-4 py-6 text-center text-xs text-gray-500">
                {isRunning
                  ? "Evaluating shelter capacity and zone demand..."
                  : "Run smart allocation to generate assignments from the current shelter and affected-zone data."}
              </p>
            )}

          </div>


          {/* ALLOCATION PROGRESS */}

          <div className="mt-6">

            <div className="flex justify-between mb-2">

              <span className="text-xs text-gray-400">
                Overall population allocation
              </span>

              <span className="text-xs font-semibold text-cyan-400">
                {allocationPercentage}%
              </span>

            </div>

            <div className="h-2 bg-white/5 rounded-full overflow-hidden">

              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                style={{
                  width: `${allocationPercentage}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="space-y-6">


          {/* ALGORITHM STATUS */}

          <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

            <p className="text-xs text-gray-500 uppercase">
              Optimization Engine
            </p>

            <h2 className="text-lg font-semibold mt-1">
              Decision Logic
            </h2>


            <div className="mt-5 space-y-4">


              <div className="flex gap-3">

                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  1
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Identify affected population
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    Analyze demand from affected zones.
                  </p>

                </div>

              </div>


              <div className="flex gap-3">

                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  2
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Rank shelters
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    Compare readiness, capacity and risk.
                  </p>

                </div>

              </div>


              <div className="flex gap-3">

                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  3
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Match available capacity
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    Share capacity by zone demand, then rank suitable matches; never exceed capacity.
                  </p>

                </div>

              </div>


              <div className="flex gap-3">

                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  4
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Generate response plan
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    Produce actionable shelter assignments.
                  </p>

                </div>

              </div>


            </div>

          </div>


          {/* SYSTEM RESULT */}

          <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

            <p className="text-xs text-gray-500 uppercase">
              System Recommendation
            </p>


            <div
              className={`mt-4 rounded-xl border p-4 ${
                !isAllocated
                  ? "border-slate-200 bg-slate-50"
                  : isFullyAllocated
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-amber-500/20 bg-amber-500/5"
              }`}
            >

              <div className="flex gap-3">

                <div
                  className={`text-xl ${
                    !isAllocated
                      ? "text-slate-400"
                      : isFullyAllocated
                        ? "text-emerald-400"
                        : "text-amber-500"
                  }`}
                >
                  {!isAllocated ? "…" : isFullyAllocated ? "✓" : "!"}
                </div>

                <div>

                  <p
                    className={`text-sm font-semibold ${
                      !isAllocated
                        ? "text-slate-600"
                        : isFullyAllocated
                          ? "text-emerald-400"
                          : "text-amber-600"
                    }`}
                  >
                    {!isAllocated
                      ? "Allocation not yet run"
                      : isFullyAllocated
                        ? "All demand assigned"
                        : "Capacity shortfall"}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-2 leading-5">
                    {!isAllocated
                      ? "Run smart allocation to calculate assignments from current shelter availability."
                      : isFullyAllocated
                        ? "All affected-zone demand was assigned within eligible shelter capacities."
                        : `${totalUnallocated.toLocaleString()} people remain without suitable shelter capacity. Coordinate additional resources before making an operational decision.`}
                  </p>

                </div>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-3 mt-4">

              <div className="bg-[#070B14] rounded-lg p-3">

                <p className="text-[10px] text-gray-500">
                  UNALLOCATED
                </p>

                <p className="text-lg font-bold text-orange-400 mt-1">
                  {isAllocated ? totalUnallocated.toLocaleString() : "—"}
                </p>

              </div>


              <div className="bg-[#070B14] rounded-lg p-3">

                <p className="text-[10px] text-gray-500">
                  AVG DISTANCE
                </p>

                <p className="text-lg font-bold mt-1">
                  {isAllocated ? averageDistance : "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* EVACUATION FLOW */}

      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs text-cyan-400 uppercase">
              Evacuation Flow
            </p>

            <h2 className="text-lg font-semibold mt-1">
              Population Movement Plan
            </h2>

          </div>

          <span className="text-[10px] text-gray-500">
            SIMULATED ROUTES
          </span>

        </div>


        {isAllocated ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {records.map((record) => (
              <article
                key={`flow-${record.id}`}
                className="rounded-xl border border-white/5 bg-[#070B14] p-5"
              >
                <p className="text-xs text-gray-500">AFFECTED ZONE</p>
                <p className="mt-2 text-sm font-semibold">{record.zone}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {record.allocated.toLocaleString()} of{" "}
                  {record.population.toLocaleString()} people assigned
                </p>

                <div className="my-3 flex items-center gap-2 text-cyan-400">
                  <span aria-hidden="true">→</span>
                  <span className="text-[10px] text-gray-500">
                    {record.distance === "—"
                      ? "No suitable route"
                      : `${record.distance} straight-line estimate`}
                  </span>
                </div>

                <p className="text-xs text-gray-500">DESTINATION</p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    record.allocated > 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {record.shelter}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {record.readiness > 0
                    ? `${record.readiness}% readiness`
                    : "Additional capacity required"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg bg-[#070B14] p-5 text-xs text-gray-500">
            Run smart allocation to generate evacuation assignments from the
            current zone and shelter data.
          </p>
        )}

      </div>


      {/* DISCLAIMER */}

      <div className="mt-6 border border-cyan-500/10 bg-cyan-500/5 rounded-xl p-4">

        <p className="text-[10px] text-cyan-400 font-semibold uppercase">
          TRUSTLENS DECISION SUPPORT
        </p>

        <p className="text-[10px] text-gray-500 mt-2 leading-5">
          Allocation recommendations are generated using local affected-zone
          and shelter sample data for demonstration.
          Actual evacuation decisions should be validated by authorized
          emergency response personnel.
        </p>

      </div>

    </div>
  );
}

export default Allocation;