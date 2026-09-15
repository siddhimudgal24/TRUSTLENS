import { useMemo, useState } from "react";

import { useShelterStore } from "../../store/shelterStore";

import ShelterCard from "./ShelterCard";
import ShelterDetailPanel from "./ShelterDetailPanel";

function ShelterPage() {
  const shelters = useShelterStore(
    (state) => state.shelters
  );

  const selectedShelter = useShelterStore(
    (state) => state.selectedShelter
  );

  const selectShelter = useShelterStore(
    (state) => state.selectShelter
  );

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const filteredShelters = useMemo(() => {
    return shelters.filter((shelter) => {
      const matchesSearch =
        shelter.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all" ||
        shelter.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [shelters, search, filter]);

  const totalCapacity = shelters.reduce(
    (sum, shelter) =>
      sum + shelter.capacity,
    0
  );

  const occupiedCapacity =
    shelters.reduce(
      (sum, shelter) =>
        sum + shelter.occupied,
      0
    );

  const availableCapacity =
    totalCapacity -
    occupiedCapacity;

  const averageReadiness =
    shelters.length > 0
      ? Math.round(
          shelters.reduce(
            (sum, shelter) =>
              sum + shelter.readiness,
            0
          ) / shelters.length
        )
      : 0;

  return (
    <div className="min-h-full bg-[#070B14] text-white p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Shelter Management
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Monitor shelter readiness,
            capacity and operational status
          </p>
        </div>

        <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          System Operational
        </div>

      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Total Shelters
          </p>

          <p className="text-3xl font-bold mt-2">
            {shelters.length}
          </p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Available Capacity
          </p>

          <p className="text-3xl font-bold mt-2">
            {availableCapacity.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Occupancy
          </p>

          <p className="text-3xl font-bold mt-2">
            {totalCapacity > 0
              ? Math.round(
                  (occupiedCapacity /
                    totalCapacity) *
                    100
                )
              : 0}
            %
          </p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Avg Readiness
          </p>

          <p className="text-3xl font-bold mt-2">
            {averageReadiness}
          </p>
        </div>

      </div>

      <div className="bg-[#111827] border border-white/10 rounded-xl p-4 mb-6">

        <div className="flex gap-4">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search shelter..."
            className="flex-1 bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500/50"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none"
          >
            <option value="all">
              All Shelters
            </option>

            <option value="recommended">
              Recommended
            </option>

            <option value="conditional">
              Conditional
            </option>

            <option value="avoid">
              Avoid
            </option>

            <option value="unavailable">
              Unavailable
            </option>
          </select>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-5">

        {filteredShelters.map(
          (shelter) => (
            <ShelterCard
              key={shelter.id}
              shelter={shelter}
              onSelect={selectShelter}
            />
          )
        )}

      </div>

      {filteredShelters.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No shelters found.
        </div>
      )}

      <ShelterDetailPanel
        shelter={selectedShelter}
        onClose={() =>
          selectShelter(null)
        }
      />

    </div>
  );
}

export default ShelterPage;