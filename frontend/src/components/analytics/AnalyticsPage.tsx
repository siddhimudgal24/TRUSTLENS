import { useMemo } from "react";

import { useShelterStore } from "../../store/shelterStore";

function AnalyticsPage() {
  const shelters = useShelterStore(
    (state) => state.shelters
  );

  const metrics = useMemo(() => {
    const totalCapacity =
      shelters.reduce(
        (sum, shelter) =>
          sum + shelter.capacity,
        0
      );

    const occupied =
      shelters.reduce(
        (sum, shelter) =>
          sum + shelter.occupied,
        0
      );

    const readiness =
      shelters.length > 0
        ? Math.round(
            shelters.reduce(
              (sum, shelter) =>
                sum + shelter.readiness,
              0
            ) / shelters.length
          )
        : 0;

    const recommended =
      shelters.filter(
        (shelter) =>
          shelter.status ===
          "recommended"
      ).length;

    const conditional =
      shelters.filter(
        (shelter) =>
          shelter.status ===
          "conditional"
      ).length;

    const avoid =
      shelters.filter(
        (shelter) =>
          shelter.status ===
          "avoid"
      ).length;

    return {
      totalCapacity,
      occupied,
      readiness,
      recommended,
      conditional,
      avoid,
    };
  }, [shelters]);

  const occupancy =
    metrics.totalCapacity > 0
      ? Math.round(
          (metrics.occupied /
            metrics.totalCapacity) *
            100
        )
      : 0;

  return (
    <div className="min-h-full bg-[#070B14] text-white p-6">

      <div>
        <h1 className="text-2xl font-bold">
          Analytics
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Disaster response intelligence
          and operational performance
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">

        <MetricCard
          label="Average Readiness"
          value={`${metrics.readiness}/100`}
        />

        <MetricCard
          label="Demand Coverage"
          value="94%"
        />

        <MetricCard
          label="Capacity Utilization"
          value={`${occupancy}%`}
        />

        <MetricCard
          label="Active Shelters"
          value={`${shelters.length}`}
        />

      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">

          <h2 className="font-semibold">
            Shelter Readiness Distribution
          </h2>

          <div className="mt-6 space-y-5">

            <Distribution
              label="Recommended"
              value={
                metrics.recommended
              }
              total={shelters.length}
            />

            <Distribution
              label="Conditional"
              value={
                metrics.conditional
              }
              total={shelters.length}
            />

            <Distribution
              label="Avoid"
              value={metrics.avoid}
              total={shelters.length}
            />

          </div>

        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">

          <h2 className="font-semibold">
            Capacity Utilization
          </h2>

          <div className="mt-8">

            <div className="flex items-end gap-2">

              <span className="text-5xl font-bold">
                {occupancy}%
              </span>

              <span className="text-gray-500 mb-2">
                occupied
              </span>

            </div>

            <div className="mt-6 h-4 bg-gray-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-green-500"
                style={{
                  width: `${occupancy}%`,
                }}
              />

            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-3">

              <span>
                {metrics.occupied.toLocaleString()}
                {" "}occupied
              </span>

              <span>
                {metrics.totalCapacity.toLocaleString()}
                {" "}total
              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="bg-[#111827] border border-white/10 rounded-xl p-5 mt-6">

        <h2 className="font-semibold">
          Operational Overview
        </h2>

        <div className="grid grid-cols-4 gap-4 mt-5">

          <OverviewCard
            label="Shelter Capacity"
            value={metrics.totalCapacity}
          />

          <OverviewCard
            label="Occupied"
            value={metrics.occupied}
          />

          <OverviewCard
            label="Available"
            value={
              metrics.totalCapacity -
              metrics.occupied
            }
          />

          <OverviewCard
            label="Readiness"
            value={metrics.readiness}
          />

        </div>

      </div>

    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-5">

      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}

function Distribution({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;

  return (
    <div>

      <div className="flex justify-between text-sm mb-2">

        <span className="text-gray-400">
          {label}
        </span>

        <span>
          {value}
        </span>

      </div>

      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">

        <div
          className="h-full bg-green-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

function OverviewCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-black/20 rounded-xl p-4">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-2xl font-semibold mt-2">
        {value.toLocaleString()}
      </p>

    </div>
  );
}

export default AnalyticsPage;