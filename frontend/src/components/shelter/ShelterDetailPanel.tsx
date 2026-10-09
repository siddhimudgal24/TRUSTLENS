import type { Shelter } from "../../data/mockData";

interface ShelterDetailPanelProps {
  shelter: Shelter | null;
  onClose: () => void;
}

function ShelterDetailPanel({
  shelter,
  onClose,
}: ShelterDetailPanelProps) {
  if (!shelter) {
    return null;
  }

  const available =
    shelter.capacity -
    shelter.occupied;

  return (
    <div className="fixed right-0 top-0 z-[2000] h-dvh w-full max-w-[380px] overflow-y-auto border-l border-white/10 bg-[#0B1220] p-5 shadow-2xl sm:p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-gray-500">
            SHELTER DETAILS
          </p>

          <h2 className="text-xl font-bold mt-1">
            {shelter.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
        >
          ×
        </button>

      </div>

      <div className="mt-6 bg-black/20 rounded-xl p-5 text-center">

        <p className="text-gray-500 text-xs">
          READINESS SCORE
        </p>

        <p className="text-5xl font-bold mt-2">
          {shelter.readiness}
        </p>

        <p className="text-gray-500 text-xs mt-1">
          out of 100
        </p>

      </div>

      <div className="mt-6">

        <h3 className="font-semibold">
          Capacity
        </h3>

        <div className="grid grid-cols-2 gap-3 mt-3">

          <div className="bg-black/20 rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Total
            </p>

            <p className="text-xl font-semibold mt-1">
              {shelter.capacity}
            </p>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Available
            </p>

            <p className="text-xl font-semibold mt-1">
              {available}
            </p>
          </div>

        </div>

      </div>

      <div className="mt-6">

        <h3 className="font-semibold">
          Readiness Breakdown
        </h3>

        <div className="mt-3 space-y-3">

          <ScoreRow
            label="Safety"
            value={shelter.safety}
          />

          <ScoreRow
            label="Accessibility"
            value={
              shelter.accessibility
            }
          />

          <ScoreRow
            label="Capacity"
            value={shelter.capacity > 0
              ? Math.round(
                  available /
                    shelter.capacity *
                    100
                )
              : 0}
          />

          <ScoreRow
            label="Hazard Exposure"
            value={
              shelter.hazardExposure
            }
          />

          <ScoreRow
            label="Essential Services"
            value={
              shelter.essentialServices
            }
          />

          <ScoreRow
            label="Road Access"
            value={
              shelter.roadAccess
            }
          />

        </div>

      </div>

      <div className="mt-6">

        <h3 className="font-semibold">
          Recommendation
        </h3>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm text-gray-300">

          {shelter.status ===
          "recommended"
            ? "This shelter is suitable for allocation under current conditions."
            : shelter.status ===
              "conditional"
            ? "This shelter can be used with caution. Monitor its readiness and accessibility."
            : shelter.status ===
              "avoid"
            ? "Avoid allocating new demand to this shelter."
            : "This shelter is currently unavailable."}

        </div>

      </div>

    </div>
  );
}

function ScoreRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <div className="flex justify-between text-xs mb-1">

        <span className="text-gray-400">
          {label}
        </span>

        <span>
          {value}/100
        </span>

      </div>

      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">

        <div
          className="h-full bg-green-500"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, value)
            )}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ShelterDetailPanel;