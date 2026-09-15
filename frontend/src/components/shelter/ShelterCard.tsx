import type { Shelter } from "../../data/mockData";

interface ShelterCardProps {
  shelter: Shelter;
  onSelect: (
    shelter: Shelter
  ) => void;
}

function ShelterCard({
  shelter,
  onSelect,
}: ShelterCardProps) {
  const available =
    shelter.capacity -
    shelter.occupied;

  const occupancy =
    shelter.capacity > 0
      ? Math.round(
          (shelter.occupied /
            shelter.capacity) *
            100
        )
      : 0;

  const statusConfig = {
    recommended: {
      label: "RECOMMENDED",
      className:
        "bg-green-500/10 text-green-400 border-green-500/20",
    },

    conditional: {
      label: "CONDITIONAL",
      className:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },

    avoid: {
      label: "AVOID",
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },

    unavailable: {
      label: "UNAVAILABLE",
      className:
        "bg-gray-500/10 text-gray-400 border-gray-500/20",
    },
  };

  const status =
    statusConfig[shelter.status] ??
    statusConfig.unavailable;

  return (
    <div
      onClick={() =>
        onSelect(shelter)
      }
      className="bg-[#111827] border border-white/10 rounded-xl p-5 cursor-pointer hover:border-white/20 hover:bg-[#151e2d] transition"
    >

      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg">
            {shelter.name}
          </h3>

          <p className="text-gray-500 text-xs mt-1">
            ID: {shelter.id}
          </p>
        </div>

        <span
          className={`text-[10px] px-2 py-1 rounded-full border ${status.className}`}
        >
          {status.label}
        </span>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-xs">
            Readiness
          </p>

          <p className="text-3xl font-bold mt-1">
            {shelter.readiness}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-xs">
            Available
          </p>

          <p className="text-xl font-semibold mt-1">
            {available}
          </p>
        </div>

      </div>

      <div className="mt-5">

        <div className="flex justify-between text-xs mb-2">

          <span className="text-gray-400">
            Occupancy
          </span>

          <span>
            {occupancy}%
          </span>

        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-green-500 transition-all"
            style={{
              width: `${occupancy}%`,
            }}
          />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-5 text-xs">

        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-gray-500">
            Safety
          </p>

          <p className="font-semibold mt-1">
            {shelter.safety}/100
          </p>
        </div>

        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-gray-500">
            Accessibility
          </p>

          <p className="font-semibold mt-1">
            {shelter.accessibility}/100
          </p>
        </div>

      </div>

    </div>
  );
}

export default ShelterCard;