import { useMemo, useState } from "react";
import { useShelterStore } from "../store/shelterStore";
import PageHeader from "../components/layout/PageHeader";

function Shelters() {
  const shelters = useShelterStore((state) => state.shelters);
  const selectedShelter = useShelterStore((state) => state.selectedShelter);
  const selectShelter = useShelterStore((state) => state.selectShelter);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredShelters = useMemo(() => {
    return shelters.filter((shelter) => {
      const matchesSearch = shelter.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || shelter.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [shelters, search, filter]);

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + shelter.capacity,
    0
  );

  const occupied = shelters.reduce(
    (sum, shelter) => sum + shelter.occupied,
    0
  );

  const availableCapacity = totalCapacity - occupied;

  const averageReadiness =
    shelters.length > 0
      ? Math.round(
          shelters.reduce(
            (sum, shelter) => sum + shelter.readiness,
            0
          ) / shelters.length
        )
      : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

      case "conditional":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

      case "avoid":
        return "border-red-500/30 bg-red-500/10 text-red-400";

      default:
        return "border-red-500/30 bg-red-500/10 text-red-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "recommended":
        return "RECOMMENDED";

      case "conditional":
        return "CONDITIONAL";

      case "avoid":
        return "AVOID";

      default:
        return "UNAVAILABLE";
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6 text-white">
      <PageHeader
        eyebrow="Shelter operations"
        title="Shelter Management"
        description="Monitor shelter readiness, capacity and operational status."
        status={
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-emerald-400">
            SAMPLE RECORDS
          </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Total Shelters
          </p>

          <p className="text-3xl font-bold mt-2">
            {shelters.length}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Registered facilities
          </p>
        </div>

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Total Capacity
          </p>

          <p className="text-3xl font-bold mt-2">
            {totalCapacity.toLocaleString()}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Maximum population
          </p>
        </div>

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Available Capacity
          </p>

          <p className="text-3xl font-bold mt-2 text-cyan-400">
            {availableCapacity.toLocaleString()}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Currently available
          </p>
        </div>

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Average Readiness
          </p>

          <p
            className={`text-3xl font-bold mt-2 ${getReadinessColor(
              averageReadiness
            )}`}
          >
            {averageReadiness}%
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Overall readiness
          </p>
        </div>

      </div>

      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4">

        <div className="flex flex-wrap items-center gap-2">

          <input
            type="text"
            aria-label="Search shelters by name"
            placeholder="Search shelter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 flex-1 rounded-lg border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 sm:w-auto"
          />

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              filter === "all"
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-white/10 text-gray-400"
            }`}
          >
            ALL
          </button>

          <button
            onClick={() => setFilter("recommended")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              filter === "recommended"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 text-gray-400"
            }`}
          >
            READY
          </button>

          <button
            onClick={() => setFilter("conditional")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              filter === "conditional"
                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                : "border-white/10 text-gray-400"
            }`}
          >
            CONDITIONAL
          </button>

          <button
            onClick={() => setFilter("avoid")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              filter === "avoid"
                ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                : "border-white/10 text-gray-400"
            }`}
          >
            AVOID
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">

        {filteredShelters.map((shelter) => {

          const occupancy =
            shelter.capacity > 0
              ? Math.round(
                  (shelter.occupied / shelter.capacity) * 100
                )
              : 0;

          return (
            <div
              key={shelter.id}
              onClick={() => selectShelter(shelter)}
              role="button"
              tabIndex={0}
              aria-label={`View ${shelter.name} details`}
              onKeyDown={(event) => {
                if (
                  event.target === event.currentTarget &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  selectShelter(shelter);
                }
              }}
              className="cursor-pointer rounded-xl border border-white/10 bg-[#0D1320] p-5 transition-all hover:border-cyan-500/40 hover:bg-[#101827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Shelter ID
                  </p>

                  <p className="text-xs text-cyan-400 mt-1">
                    {shelter.id}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-md border text-[10px] font-bold ${getStatusColor(
                    shelter.status
                  )}`}
                >
                  {getStatusLabel(shelter.status)}
                </span>

              </div>

              <h2 className="text-lg font-semibold mt-4">
                {shelter.name}
              </h2>

              <div className="mt-5">

                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    Readiness Score
                  </span>

                  <span
                    className={`text-sm font-bold ${getReadinessColor(
                      shelter.readiness
                    )}`}
                  >
                    {shelter.readiness}%
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        shelter.readiness,
                        100
                      )}%`,
                    }}
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="bg-[#070B14] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 uppercase">
                    Capacity
                  </p>

                  <p className="text-sm font-semibold mt-1">
                    {shelter.capacity.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[#070B14] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 uppercase">
                    Occupied
                  </p>

                  <p className="text-sm font-semibold mt-1">
                    {shelter.occupied.toLocaleString()}
                  </p>
                </div>

              </div>

              <div className="mt-4">

                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    Occupancy
                  </span>

                  <span className="text-xs text-gray-300">
                    {occupancy}%
                  </span>
                </div>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        occupancy,
                        100
                      )}%`,
                    }}
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Safety
                  </p>

                  <p className="text-sm font-semibold mt-1">
                    {shelter.safety}%
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Accessibility
                  </p>

                  <p className="text-sm font-semibold mt-1">
                    {shelter.accessibility}%
                  </p>
                </div>

              </div>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  selectShelter(shelter);
                }}
                className="w-full mt-5 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20"
              >
                VIEW DETAILS
              </button>

            </div>
          );
        })}

      </div>

      {filteredShelters.length === 0 && (
        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-12 text-center">
          <p className="text-gray-400">
            No shelters found.
          </p>
        </div>
      )}

      {selectedShelter && (
        <div className="fixed inset-0 z-[2000] flex justify-end">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => selectShelter(null)}
          />

          <div className="relative w-full max-w-md h-full bg-[#0B111C] border-l border-white/10 p-6 overflow-y-auto">

            <div className="flex items-center justify-between mb-6">

              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-wider">
                  Shelter Details
                </p>

                <h2 className="text-xl font-bold mt-1">
                  {selectedShelter.name}
                </h2>
              </div>

              <button
                onClick={() => selectShelter(null)}
                className="w-9 h-9 rounded-lg bg-white/5 text-gray-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Readiness Score
                  </p>

                  <p
                    className={`text-4xl font-bold mt-2 ${getReadinessColor(
                      selectedShelter.readiness
                    )}`}
                  >
                    {selectedShelter.readiness}%
                  </p>
                </div>

                <span
                  className={`px-3 py-2 rounded-lg border text-xs font-bold ${getStatusColor(
                    selectedShelter.status
                  )}`}
                >
                  {getStatusLabel(selectedShelter.status)}
                </span>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">

              <div className="bg-[#0D1320] border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Capacity
                </p>

                <p className="text-xl font-bold mt-2">
                  {selectedShelter.capacity.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#0D1320] border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Occupied
                </p>

                <p className="text-xl font-bold mt-2">
                  {selectedShelter.occupied.toLocaleString()}
                </p>
              </div>

            </div>

            <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5 mt-4">

              <h3 className="text-sm font-semibold mb-5">
                Readiness Breakdown
              </h3>

              <div className="space-y-5">

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">
                      Safety
                    </span>

                    <span>
                      {selectedShelter.safety}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-white/5 rounded-full">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{
                        width: `${selectedShelter.safety}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">
                      Accessibility
                    </span>

                    <span>
                      {selectedShelter.accessibility}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-white/5 rounded-full">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{
                        width: `${selectedShelter.accessibility}%`,
                      }}
                    />
                  </div>
                </div>

              </div>

            </div>

            <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

              <p className="text-xs font-semibold text-cyan-400">
                TRUSTLENS DECISION SUPPORT
              </p>

              <p className="text-xs text-gray-400 mt-2 leading-5">
                Shelter readiness is evaluated using safety,
                accessibility, capacity and operational conditions.
                Final deployment decisions should be validated by
                emergency response authorities.
              </p>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Shelters;