import { useSearchParams } from "react-router-dom";
import { affectedZones } from "../data/mockData";
import LiveShelterMap from "../components/map/LiveShelterMap";
import PageHeader from "../components/layout/PageHeader";

function LiveMap() {
  const [searchParams] = useSearchParams();
  const selectedZone = affectedZones.find(
    (zone) => zone.id === searchParams.get("zone")
  );
  const focus: [number, number] | undefined = selectedZone
    ? [selectedZone.lat, selectedZone.lng]
    : undefined;

  return (
    <div className="space-y-6 text-white">
      <PageHeader
        eyebrow="Operations map"
        title="Live Disaster Map"
        description="Shelter readiness, flood exposure and road access from the available map data"
        status={
          <div className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
            MAP VIEW
          </div>
        }
      />

      <div className="h-[min(68vh,720px)] min-h-[360px] overflow-hidden rounded-xl border border-white/10 shadow-sm shadow-black/20">

        <LiveShelterMap focus={focus} />

      </div>

    </div>
  );
}

export default LiveMap;