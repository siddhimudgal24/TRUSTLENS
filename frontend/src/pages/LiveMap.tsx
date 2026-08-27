import LiveShelterMap from "../components/map/LiveShelterMap";

function LiveMap() {
  return (
    <div className="h-[calc(100vh-112px)] text-white">

      <div className="mb-4">

        <h1 className="text-2xl font-bold">
          Live Disaster Map
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Real-time shelter readiness,
          flood exposure and road access
        </p>

      </div>

      <div className="h-[calc(100%-72px)] rounded-xl overflow-hidden border border-white/10">

        <LiveShelterMap />

      </div>

    </div>
  );
}

export default LiveMap;