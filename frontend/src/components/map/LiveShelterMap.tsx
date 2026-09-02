import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Circle,
  Popup,
} from "react-leaflet";

import ShelterMarker from "./ShelterMarker";
import MapLayersPanel from "./MapLayersPanel";
import ShelterDetailPanel from "../shelter/ShelterDetailPanel";

import {
  floodZone,
  affectedZones,
  roads,
  blockedRoads,
} from "../../data/mockData";

import { useShelterStore } from "../../store/shelterStore";

function LiveShelterMap() {
  const shelters = useShelterStore(
    (state) => state.shelters
  );

  const selectedShelter = useShelterStore(
    (state) => state.selectedShelter
  );

  const selectShelter = useShelterStore(
    (state) => state.selectShelter
  );

  const [layers, setLayers] = useState({
    shelters: true,
    flood: true,
    affected: true,
    roads: true,
    blockedRoads: true,
  });

  const toggleLayer = (
    layer: keyof typeof layers
  ) => {
    setLayers((previous) => ({
      ...previous,
      [layer]: !previous[layer],
    }));
  };

  const center: [number, number] = [
    26.9124,
    75.7873,
  ];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {layers.flood && (
          <Polygon
            positions={floodZone}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.35,
              weight: 4,
            }}
          >
            <Popup>
              <strong>Flood Zone</strong>
              <br />
              Simulated high-risk flood area
            </Popup>
          </Polygon>
        )}

        {layers.roads &&
          roads.map((road, index) => (
            <Polyline
              key={`road-${index}`}
              positions={road}
              pathOptions={{
                color: "blue",
                weight: 6,
                opacity: 0.8,
              }}
            />
          ))}

        {layers.blockedRoads &&
          blockedRoads.map((road, index) => (
            <Polyline
              key={`blocked-road-${index}`}
              positions={road}
              pathOptions={{
                color: "red",
                weight: 10,
                dashArray: "10 10",
              }}
            />
          ))}

        {layers.affected &&
          affectedZones.map((zone) => (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={500}
              pathOptions={{
                color: "orange",
                fillColor: "orange",
                fillOpacity: 0.35,
                weight: 3,
              }}
            >
              <Popup>
                <strong>{zone.name}</strong>
                <br />
                Affected population:{" "}
                <strong>
                  {zone.population.toLocaleString()}
                </strong>
              </Popup>
            </Circle>
          ))}

        {layers.shelters &&
          shelters.map((shelter) => (
            <ShelterMarker
              key={shelter.id}
              shelter={shelter}
              onSelect={selectShelter}
            />
          ))}
      </MapContainer>

      <MapLayersPanel
        layers={layers}
        onToggle={toggleLayer}
      />

      <ShelterDetailPanel
        shelter={selectedShelter}
        onClose={() => selectShelter(null)}
      />
    </div>
  );
}

export default LiveShelterMap;