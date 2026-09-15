import { useState } from "react";

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

function Allocation() {
  const [isRunning, setIsRunning] = useState(false);
  const [isAllocated, setIsAllocated] = useState(false);

  const [records, setRecords] = useState<AllocationRecord[]>([
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

  const runAllocation = () => {
    setIsRunning(true);
    setIsAllocated(false);

    setTimeout(() => {
      setIsRunning(false);
      setIsAllocated(true);
    }, 2000);
  };

  const resetAllocation = () => {
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
    <div className="min-h-screen bg-[#070B14] text-white p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">
            SHELTERX / EMERGENCY ALLOCATION ENGINE
          </p>

          <h1 className="text-3xl font-bold">
            Smart Allocation
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Intelligently assign affected populations to the safest
            available shelters.
          </p>
        </div>

        <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-lg">

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-emerald-400">
            ALLOCATION ENGINE ONLINE
          </span>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-4 mb-6">

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

      <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5 mb-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-gray-500 uppercase">
              Allocation Strategy
            </p>

            <h2 className="text-sm font-semibold mt-1">
              Risk-aware multi-factor allocation
            </h2>

          </div>


          <div className="flex gap-3">

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

        <div className="grid grid-cols-6 gap-3 mt-5">

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

      <div className="grid grid-cols-3 gap-6">


        {/* ALLOCATION TABLE */}

        <div className="col-span-2 bg-[#0D1320] border border-white/10 rounded-xl p-6">

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


          <div className="overflow-hidden rounded-xl border border-white/10">

            {/* TABLE HEADER */}

            <div className="grid grid-cols-7 gap-3 px-4 py-3 bg-[#070B14] text-[10px] text-gray-500 uppercase">

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
                className="grid grid-cols-7 gap-3 px-4 py-4 border-t border-white/5 items-center hover:bg-white/[0.02]"
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

          <div className="bg-[#0D1320] border border-white/10 rounded-xl p-6">

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

          <div className="bg-[#0D1320] border border-white/10 rounded-xl p-6">

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

      <div className="bg-[#0D1320] border border-white/10 rounded-xl p-6 mt-6">

        <div className="flex items-center justify-between">

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


        <div className="grid grid-cols-4 gap-4 mt-6">


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
          SHELTERX DECISION SUPPORT
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