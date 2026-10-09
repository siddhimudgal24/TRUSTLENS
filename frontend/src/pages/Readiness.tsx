import { ShieldCheck } from "lucide-react";
import { useShelterStore } from "../store/shelterStore";
import PageHeader from "../components/layout/PageHeader";

function Readiness() {
  const shelters = useShelterStore((state) => state.shelters);
  const averageReadiness = shelters.length
    ? Math.round(
        shelters.reduce((total, shelter) => total + shelter.readiness, 0) /
          shelters.length
      )
    : 0;

  return (
    <div className="space-y-4 text-slate-900">
      <PageHeader
        eyebrow="Shelter readiness"
        title="Readiness Overview"
        description="Review shelter preparedness and the factors behind current readiness scores."
        status={
          <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
            {shelters.length} facilities assessed
          </div>
        }
      />

      {shelters.length ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {shelters.map((shelter) => {
            const factors = [
              { name: "Safety", value: shelter.safety, weight: 30 },
              { name: "Accessibility", value: shelter.accessibility, weight: 20 },
              {
                name: "Capacity",
                value: shelter.capacity
                  ? Math.round(
                      ((shelter.capacity - shelter.occupied) /
                        shelter.capacity) *
                        100
                    )
                  : 0,
                weight: 15,
              },
              { name: "Hazard Exposure", value: shelter.hazardExposure, weight: 15 },
              { name: "Essential Services", value: shelter.essentialServices, weight: 10 },
              { name: "Road Access", value: shelter.roadAccess, weight: 10 },
            ];
            const status = shelter.status.replace("-", " ");

            return (
              <article
                key={shelter.id}
                className="readiness-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                      {shelter.id}
                    </p>
                    <h2 className="mt-0.5 text-base font-bold text-slate-900">
                      {shelter.name}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                      shelter.status === "recommended"
                        ? "bg-emerald-50 text-emerald-700"
                        : shelter.status === "conditional"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="my-3 flex items-center gap-3 rounded-md bg-slate-50 p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <ShieldCheck size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[10px] text-slate-500">Readiness score</span>
                      <strong className="text-lg text-slate-900">
                        {shelter.readiness}
                        <span className="ml-1 text-[10px] font-medium text-slate-500">/100</span>
                      </strong>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${Math.max(0, Math.min(100, shelter.readiness))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                  {factors.map((factor) => (
                    <div key={factor.name}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                        <span className="text-slate-600">{factor.name}</span>
                        <span className="font-semibold text-slate-800">
                          {factor.value}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            factor.value >= 80
                              ? "bg-emerald-500"
                              : factor.value >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.max(0, Math.min(100, factor.value))}%`,
                          }}
                        />
                      </div>
                      <p className="mt-0.5 text-right text-[9px] text-slate-400">
                        Weight {factor.weight}%
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No shelter readiness data is available.
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        Portfolio average readiness: <strong>{averageReadiness}/100</strong>
      </p>
    </div>
  );
}

export default Readiness;
