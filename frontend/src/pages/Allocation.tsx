import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { affectedZones, type AffectedZone, type Shelter } from "../data/mockData";
import { useShelterStore } from "../store/shelterStore";
import { calculateReadiness } from "../utils/readiness";

interface AllocationRecord {
  id: number;
  zone: string;
  population: number;
  shelter: string;
  allocated: number;
  distance: string;
  readiness: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
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

function findSuitableShelters(
  zone: AffectedZone,
  shelters: Shelter[]
): ShelterRecommendation[] {
  const rankedShelters = shelters
    .filter((shelter) => {
      const available = shelter.capacity - shelter.occupied;
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
      const proximityScore = Math.max(0, 100 - distanceKm * 10);

      return {
        shelter,
        distanceKm,
        suitability: Math.round(readiness * 0.8 + proximityScore * 0.2),
      };
    })
    .sort(
      (first, second) =>
        second.suitability - first.suitability ||
        first.distanceKm - second.distanceKm
    );

  let peopleRemaining = zone.population;

  return rankedShelters.map(({ shelter, distanceKm, suitability }) => {
    const available = Math.max(0, shelter.capacity - shelter.occupied);
    const suggestedPeople = Math.min(peopleRemaining, available);
    peopleRemaining -= suggestedPeople;

    return { shelter, distanceKm, suitability, suggestedPeople };
  });
}

function Allocation() {
  const shelters = useShelterStore((state) => state.shelters);
  const [isRunning, setIsRunning] = useState(false);
  const [isAllocated, setIsAllocated] = useState(false);
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

  const [records] = useState<AllocationRecord[]>([
    {
      id: 1,
      zone: "Zone A — Mansarovar",
      population: 850,
      shelter: "Shelter A-102",
      allocated: 520,
      distance: "2.1 km",
      readiness: 94,
      priority: "HIGH",
    },
    {
      id: 2,
      zone: "Zone B — Sanganer",
      population: 620,
      shelter: "Shelter B-204",
      allocated: 410,
      distance: "3.4 km",
      readiness: 87,
      priority: "HIGH",
    },
    {
      id: 3,
      zone: "Zone C — Durgapura",
      population: 480,
      shelter: "Shelter C-301",
      allocated: 320,
      distance: "4.2 km",
      readiness: 81,
      priority: "MEDIUM",
    },
    {
      id: 4,
      zone: "Zone D — Jagatpura",
      population: 350,
      shelter: "Shelter D-118",
      allocated: 260,
      distance: "5.1 km",
      readiness: 76,
      priority: "LOW",
    },
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const timeoutId = window.setTimeout(() => {
      setIsRunning(false);
      setIsAllocated(true);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [isRunning]);

  const runAllocation = () => {
    setIsRunning(true);
    setIsAllocated(false);
  };

  const resetAllocation = () => {
    setIsRunning(false);
    setIsAllocated(false);
  };

  const totalPopulation = records.reduce(
    (sum, record) => sum + record.population,
    0
  );

  const totalAllocated = records.reduce(
    (sum, record) => sum + record.allocated,
    0
  );

  const allocationPercentage =
    totalPopulation > 0
      ? Math.round((totalAllocated / totalPopulation) * 100)
      : 0;

  return (
    <div className="space-y-6 text-white">
      <PageHeader
        eyebrow="Emergency allocation engine"
        title="Smart Allocation"
        description="Review sample assignments and run the local allocation demonstration."
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
        Allocation records are sample data. This demonstration does not contact a live allocation service.
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
              Rank available shelters by readiness, safety, road access and distance.
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

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {recommendations.map(
                    ({ shelter, distanceKm, suitability, suggestedPeople }) => (
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
                          <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                            {suitability}% match
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
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
                        </div>
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
            {records.length}
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
              30%
            </p>
          </div>

          <div className="bg-[#070B14] rounded-lg p-3">
            <p className="text-[10px] text-gray-500">
              ACCESSIBILITY
            </p>
            <p className="text-sm font-bold mt-1">
              20%
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

            {records.map((record) => (

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


                <span className="text-xs text-cyan-400">
                  {record.shelter}
                </span>


                <span className="text-xs font-semibold text-emerald-400">
                  {record.allocated}
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
                  {record.readiness}%
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

            ))}

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
                    Calculate optimal assignment
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    Minimize risk and evacuation distance.
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


            <div className="mt-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4">

              <div className="flex gap-3">

                <div className="text-emerald-400 text-xl">
                  ✓
                </div>

                <div>

                  <p className="text-sm font-semibold text-emerald-400">
                    Allocation feasible
                  </p>

                  <p className="text-[10px] text-gray-500 mt-2 leading-5">
                    Available shelter capacity is sufficient for the
                    current simulated demand. Priority should be given
                    to high-risk zones.
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
                  {(totalPopulation - totalAllocated).toLocaleString()}
                </p>

              </div>


              <div className="bg-[#070B14] rounded-lg p-3">

                <p className="text-[10px] text-gray-500">
                  AVG DISTANCE
                </p>

                <p className="text-lg font-bold mt-1">
                  3.7 km
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


        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">


          <div className="bg-[#070B14] border border-white/5 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              AFFECTED ZONE
            </p>

            <p className="text-sm font-semibold mt-2">
              Mansarovar
            </p>

            <div className="flex items-center gap-2 mt-4">

              <span className="text-red-400 text-lg">
                ●
              </span>

              <span className="text-xs text-gray-400">
                850 people
              </span>

            </div>

          </div>


          <div className="flex items-center justify-center text-cyan-400 text-2xl">
            →
          </div>


          <div className="bg-[#070B14] border border-white/5 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              ROUTE
            </p>

            <p className="text-sm font-semibold mt-2">
              Safe Corridor 01
            </p>

            <div className="flex items-center gap-2 mt-4">

              <span className="text-yellow-400 text-lg">
                ●
              </span>

              <span className="text-xs text-gray-400">
                2.1 km
              </span>

            </div>

          </div>


          <div className="flex items-center justify-center text-cyan-400 text-2xl">
            →
          </div>


          <div className="bg-[#070B14] border border-emerald-500/10 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              DESTINATION
            </p>

            <p className="text-sm font-semibold mt-2">
              Shelter A-102
            </p>

            <div className="flex items-center gap-2 mt-4">

              <span className="text-emerald-400 text-lg">
                ●
              </span>

              <span className="text-xs text-gray-400">
                94% readiness
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* DISCLAIMER */}

      <div className="mt-6 border border-cyan-500/10 bg-cyan-500/5 rounded-xl p-4">

        <p className="text-[10px] text-cyan-400 font-semibold uppercase">
          TRUSTLENS DECISION SUPPORT
        </p>

        <p className="text-[10px] text-gray-500 mt-2 leading-5">
          Allocation recommendations are generated using simulated
          disaster conditions and shelter data for demonstration.
          Actual evacuation decisions should be validated by authorized
          emergency response personnel.
        </p>

      </div>

    </div>
  );
}

export default Allocation;