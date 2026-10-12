import {
  AlertTriangle,
  Building2,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import LiveShelterMap from "../components/map/LiveShelterMap";
import { useShelterStore } from "../store/shelterStore";
import type { Shelter } from "../data/mockData";

const populationAffected = 8420;

function Dashboard() {
  const shelters = useShelterStore((state) => state.shelters);
  const selectedShelter = useShelterStore((state) => state.selectedShelter);
  const selectShelter = useShelterStore((state) => state.selectShelter);
 type ShelterFilter = "all" | "operational" | "at-risk" | "unavailable";

const [statusFilter, setStatusFilter] = useState<ShelterFilter>("all");

const filteredShelters = shelters.filter((shelter) => {
  switch (statusFilter) {
    case "operational":
      return shelter.status === "recommended";
    case "at-risk":
      return (
        shelter.status === "conditional" ||
        shelter.status === "avoid"
      );
    case "unavailable":
      return shelter.status === "unavailable";
    default:
      return true;
  }
});

const displayedShelter =
  filteredShelters.find(
    (shelter) => shelter.id === selectedShelter?.id
  ) ?? filteredShelters[0];

 const operational = filteredShelters.filter(
  (shelter) => shelter.status === "recommended"
).length;

const atRisk = filteredShelters.filter(
  (shelter) =>
    shelter.status === "conditional" ||
    shelter.status === "avoid"
).length;

const unavailable = filteredShelters.filter(
  (shelter) => shelter.status === "unavailable"
).length;

const averageReadiness = filteredShelters.length
  ? Math.round(
      filteredShelters.reduce(
        (total, shelter) => total + shelter.readiness,
        0
      ) / filteredShelters.length
    )
  : 0;

  const metrics = [
    {
      label: "Affected Population",
      value: populationAffected.toLocaleString(),
      note: "Population estimate",
      icon: Users,
      color: "blue",
    },
    {
      label: "Total Shelters",
     value: filteredShelters.length.toString(),
      note: "Registered facilities",
      icon: Building2,
      color: "blue",
    },
    {
      label: "Operational",
      value: operational.toString(),
      note: "Recommended",
      icon: Check,
      color: "green",
     percent: filteredShelters.length
  ? Math.round((operational / filteredShelters.length) * 100)
  : 0,
    },
    {
      label: "At Risk",
      value: atRisk.toString(),
      note: "Review readiness",
      icon: AlertTriangle,
      color: "red",
     percent: filteredShelters.length
  ? Math.round((atRisk / filteredShelters.length) * 100)
  : 0,
    },
    {
      label: "Unavailable",
      value: unavailable.toString(),
      note: "Not available",
      icon: Clock3,
      color: "slate",
     percent: filteredShelters.length
  ? Math.round((unavailable / filteredShelters.length) * 100)
  : 0,
    },
  ];

  const readinessData = [
    { name: "Operational", value: operational, color: "#20a763" },
    { name: "At Risk", value: atRisk, color: "#f05c5c" },
    { name: "Unavailable", value: unavailable, color: "#f2aa26" },
  ];

  return (
    <div className="dashboard-page space-y-2.5 text-slate-900">
      <section
  aria-label="Filter shelters by status"
  className="flex flex-wrap items-center gap-2"
>
  <span className="text-xs font-semibold text-slate-600">
    Shelter Status:
  </span>

  {[
    { label: "All", value: "all" },
    { label: "Operational", value: "operational" },
    { label: "At Risk", value: "at-risk" },
    { label: "Unavailable", value: "unavailable" },
  ].map((option) => (
    <button
      key={option.value}
      type="button"
      aria-pressed={statusFilter === option.value}
      onClick={() => setStatusFilter(option.value as ShelterFilter)}
      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
        statusFilter === option.value
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {option.label}
    </button>
  ))}
</section>
      <h1 className="sr-only">Emergency Response Dashboard</h1>
      <section
        aria-label="Emergency response metrics"
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
      >
        {metrics.map(({ label, value, note, icon: Icon, color, percent }) => (
          <article
            key={label}
            className={`dashboard-kpi kpi-${color} flex min-h-[88px] items-center gap-2 rounded-lg border p-3`}
          >
            <span className="kpi-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <Icon size={18} strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] text-slate-500">{label}</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl font-bold leading-6 text-slate-900">{value}</p>
                {percent !== undefined && (
                  <span className="text-[9px] font-semibold">{percent}%</span>
                )}
              </div>
              <p className="truncate text-[9px] text-slate-500">{note}</p>
              {percent !== undefined && (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_270px]">
        <article className="dashboard-panel min-w-0 rounded-lg border p-2">
          <div className="flex items-center justify-between gap-2 px-1 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Live Situational Map
              </h2>
              <p className="text-[10px] text-slate-500">
                Sample shelter, affected-zone and hazard map data
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
              SAMPLE DATA
            </span>
          </div>
          <div className="dashboard-map overflow-hidden rounded-md border">
            <LiveShelterMap />
          </div>
        </article>

        <ShelterSummary
          shelter={displayedShelter}
          onViewDetails={selectShelter}
        />
      </section>

      <section className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <article className="dashboard-panel min-h-[150px] rounded-lg border p-3">
          <h2 className="text-xs font-bold text-slate-900">
            Shelter Readiness Overview
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <div className="relative h-[104px] w-[124px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={readinessData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={34}
                    outerRadius={49}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {readinessData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-slate-900">
                 {filteredShelters.length}
                </span>
                <span className="text-[8px] text-slate-500">Total shelters</span>
              </div>
            </div>
            <div className="space-y-2">
              {readinessData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600">{item.value}</span>
                  <span className="text-slate-500">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-slate-500">
            Average readiness: <strong>{averageReadiness}/100</strong>
          </p>
        </article>

      
<article className="dashboard-panel min-h-[150px] rounded-lg border p-3">
  <div className="flex items-center justify-between">
    <h2 className="text-xs font-bold text-slate-900">
      Recent Activities
    </h2>
    <span className="text-[9px] text-slate-400">
      Activity feed
    </span>
  </div>

  <div className="mt-3 space-y-3">
    <div className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
      <div>
        <p className="text-[10px] font-semibold text-slate-800">
          Shelter readiness overview updated
        </p>
        <p className="text-[9px] text-slate-500">
          Review operational and at-risk shelters.
        </p>
      </div>
    </div>

    <div className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
      <div>
        <p className="text-[10px] font-semibold text-slate-800">
          Shelter capacity monitoring
        </p>
        <p className="text-[9px] text-slate-500">
          Check occupancy and available capacity.
        </p>
      </div>
    </div>

    <div className="flex items-start gap-2">
      <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
      <div>
        <p className="text-[10px] font-semibold text-slate-800">
          Risk review reminder
        </p>
        <p className="text-[9px] text-slate-500">
          Review shelters marked at risk.
        </p>
      </div>
    </div>
  </div>
</article>


        <article className="dashboard-panel min-h-[150px] rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900">
              Flood Risk Forecast
            </h2>
            <span className="text-[9px] text-slate-400">Forecast</span>
          </div>
          <div className="flex h-[112px] items-center justify-center rounded-md bg-slate-50 px-5 text-center">
            <p className="max-w-[220px] text-[10px] leading-4 text-slate-500">
              No forecast series is available. Review mapped risk areas for current context.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}

function ShelterSummary({
  shelter,
  onViewDetails,
}: {
  shelter: Shelter | undefined;
  onViewDetails: (shelter: Shelter | null) => void;
}) {
  if (!shelter) {
    return (
      <article className="dashboard-panel rounded-lg border p-4">
        <h2 className="text-sm font-bold">Selected Shelter</h2>
        <p className="mt-3 text-xs text-slate-500">No shelter data available.</p>
      </article>
    );
  }

  const available = shelter.capacity - shelter.occupied;
  const occupancy = shelter.capacity
    ? Math.round((shelter.occupied / shelter.capacity) * 100)
    : 0;
  const isOperational = shelter.status === "recommended";

  return (
    <article className="dashboard-panel flex flex-col rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Selected Shelter</h2>
        <span
          className={`rounded px-2 py-1 text-[9px] font-semibold ${
            isOperational
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isOperational ? "Operational" : "At Risk"}
        </span>
      </div>

      <div className="shelter-illustration flex h-[76px] items-center justify-center rounded-md">
        <Building2 size={34} strokeWidth={1.4} />
      </div>
      <h3 className="mt-2 text-xs font-bold text-slate-900">{shelter.name}</h3>
      <p className="mt-0.5 text-[10px] text-slate-500">
        {shelter.id} <span aria-hidden="true">|</span> Jaipur response area
      </p>

      <div className="mt-2 grid grid-cols-3 gap-1 border-b border-slate-100 pb-2">
        <MiniStat icon={<Users size={14} />} label="Capacity" value={shelter.capacity} tone="blue" />
        <MiniStat icon={<Users size={14} />} label="Occupancy" value={`${occupancy}%`} tone="orange" />
        <MiniStat icon={<Building2 size={14} />} label="Available" value={available} tone="green" />
      </div>
      {occupancy >= 80 && (
  <div
    role="status"
    className="mt-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-800"
  >
    <AlertTriangle size={14} className="mt-0.5 shrink-0" />

    <div>
      <p className="text-[10px] font-bold">
        High Occupancy Warning
      </p>
      <p className="text-[9px]">
        Shelter is {occupancy}% occupied.
        Only {available} spaces remain.
      </p>
    </div>
  </div>
)}

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <ReadinessTile label="Readiness" value={`${shelter.readiness}/100`} tone="green" />
        <ReadinessTile label="Accessibility" value={`${shelter.accessibility}/100`} tone="blue" />
        <ReadinessTile label="Safety" value={`${shelter.safety}/100`} tone="green" />
        <ReadinessTile label="Essential services" value={`${shelter.essentialServices}/100`} tone="purple" />
      </div>

      <button
        onClick={() => onViewDetails(shelter)}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-blue-50 py-2 text-[10px] font-semibold text-blue-700 hover:bg-blue-100"
      >
        View Full Details <MapPin size={12} />
      </button>
    </article>
  );
}

function MiniStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className={`dashboard-mini-stat mini-${tone} min-w-0 rounded px-1.5 py-1`}>
      <div className="flex items-center gap-1">
        {icon}
        <span className="truncate text-[8px]">{label}</span>
      </div>
      <p className="mt-0.5 text-[11px] font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ReadinessTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`dashboard-readiness-tile tile-${tone} flex min-w-0 items-center gap-1.5 rounded px-2 py-1.5`}>
      <ShieldCheck size={13} className="shrink-0" />
      <div className="min-w-0">
        <p className="truncate text-[8px] text-slate-500">{label}</p>
        <p className="truncate text-[9px] font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default Dashboard;
