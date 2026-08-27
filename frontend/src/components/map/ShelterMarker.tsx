import { CircleMarker, Popup } from "react-leaflet";
import type { Shelter } from "../../data/mockData";

interface ShelterMarkerProps {
  shelter: Shelter;
  onSelect?: (shelter: Shelter) => void;
}

function ShelterMarker({
  shelter,
  onSelect,
}: ShelterMarkerProps) {
  const getColor = () => {
    switch (shelter.status) {
      case "recommended":
        return "#22c55e";

      case "conditional":
        return "#eab308";

      case "avoid":
        return "#ef4444";

      case "unavailable":
        return "#64748b";

      default:
        return "#64748b";
    }
  };

  return (
    <CircleMarker
      center={[
        shelter.lat,
        shelter.lng,
      ]}
      radius={12}
      pathOptions={{
        color: "#ffffff",
        fillColor: getColor(),
        fillOpacity: 1,
        weight: 3,
      }}
      eventHandlers={{
        click: () => {
          onSelect?.(shelter);
        },
      }}
    >
      <Popup>

        <div className="min-w-55">

          <h3 className="font-bold text-lg">
            {shelter.name}
          </h3>

          <div className="mt-2">

            <span
              style={{
                color: getColor(),
                fontWeight: 700,
              }}
            >
              {shelter.status.toUpperCase()}
            </span>

          </div>

          <div className="mt-3">

            <p>
              Readiness:{" "}
              <strong>
                {shelter.readiness}/100
              </strong>
            </p>

            <p>
              Available capacity:{" "}
              <strong>
                {shelter.capacity -
                  shelter.occupied}
              </strong>
            </p>

          </div>

        </div>

      </Popup>
    </CircleMarker>
  );
}

export default ShelterMarker;