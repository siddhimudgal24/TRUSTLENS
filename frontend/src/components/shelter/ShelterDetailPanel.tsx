import {
  X,
  ShieldCheck,
  Accessibility,
  Users,
  Waves,
  Zap,
  Route,
} from "lucide-react";

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

  return (
    <div className="absolute right-4 top-4 z-1000 w-85 bg-[#0B1220]/95 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-2xl">

      <div className="p-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs text-gray-400">
              SHELTER
            </p>

            <h2 className="text-xl font-bold mt-1">
              {shelter.name}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>

        </div>


        <div className="mt-5 flex items-center gap-4">

          <div className="relative w-24 h-24">

            <div className="w-24 h-24 rounded-full border-8 border-green-500/20 flex items-center justify-center">

              <span className="text-2xl font-bold">
                {shelter.readiness}
              </span>

            </div>

          </div>

          <div>

            <p className="text-sm text-gray-400">
              Readiness Score
            </p>

            <p className="text-green-400 font-semibold mt-1">
              {shelter.status.toUpperCase()}
            </p>

          </div>

        </div>


        <div className="mt-6 space-y-4">

          <ScoreRow
            icon={<ShieldCheck size={17} />}
            label="Safety"
            value={shelter.safety}
          />

          <ScoreRow
            icon={<Accessibility size={17} />}
            label="Accessibility"
            value={shelter.accessibility}
          />

          <ScoreRow
            icon={<Users size={17} />}
            label="Capacity"
            value={
              Math.round(
                ((shelter.capacity -
                  shelter.occupied) /
                  shelter.capacity) *
                  100
              )
            }
          />

          <ScoreRow
            icon={<Waves size={17} />}
            label="Hazard Exposure"
            value={shelter.hazardExposure}
          />

          <ScoreRow
            icon={<Zap size={17} />}
            label="Essential Services"
            value={shelter.essentialServices}
          />

          <ScoreRow
            icon={<Route size={17} />}
            label="Road Access"
            value={shelter.roadAccess}
          />

        </div>


        <div className="mt-6 p-4 rounded-lg bg-white/5">

          <p className="text-xs text-gray-400">
            AVAILABLE CAPACITY
          </p>

          <p className="text-2xl font-bold mt-1">
            {shelter.capacity -
              shelter.occupied}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            of {shelter.capacity} total spaces
          </p>

        </div>


        <button className="w-full mt-5 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
          View Full Shelter Details
        </button>

      </div>

    </div>
  );
}

interface ScoreRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function ScoreRow({
  icon,
  label,
  value,
}: ScoreRowProps) {
  return (
    <div>

      <div className="flex justify-between items-center text-sm">

        <div className="flex items-center gap-2 text-gray-300">
          {icon}
          {label}
        </div>

        <span className="font-semibold">
          {value}
        </span>

      </div>

      <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">

        <div
          className="h-full bg-green-500 rounded-full"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ShelterDetailPanel;