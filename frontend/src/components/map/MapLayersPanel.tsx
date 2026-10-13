interface MapLayers {
  shelters: boolean;
  flood: boolean;
  affected: boolean;
  roads: boolean;
  blockedRoads: boolean;
}

interface MapLayersPanelProps {
  layers: MapLayers;
  onToggle: (
    layer: keyof MapLayers
  ) => void;
}

function MapLayersPanel({
  layers,
  onToggle,
}: MapLayersPanelProps) {
  const layerItems = [
    {
      key: "shelters" as const,
      label: "Shelters",
    },
    {
      key: "flood" as const,
      label: "Flood Zones",
    },
    {
      key: "affected" as const,
      label: "Affected Population",
    },
    {
      key: "roads" as const,
      label: "Roads",
    },
    {
      key: "blockedRoads" as const,
      label: "Blocked Roads",
    },
  ];

  return (
    <div className="map-layers-panel absolute right-3 top-3 z-[1000] w-[min(10.5rem,calc(100%-1.5rem))] rounded-2xl border border-slate-200/90 bg-white/95 text-slate-800 shadow-xl backdrop-blur-md sm:right-4 sm:top-4">
      <div className="border-b border-slate-100 px-3 py-2">
        <h3 className="text-[10px] font-bold text-slate-900">
          MAP LAYERS
        </h3>

        <p className="mt-0.5 text-[9px] text-slate-500">
          Control map visibility
        </p>
      </div>

      <div className="space-y-0.5 p-1.5">
        {layerItems.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 transition hover:bg-white/5"
          >
            <span className="text-[9px] text-gray-300">
              {item.label}
            </span>

            <input
              type="checkbox"
              checked={layers[item.key]}
              onChange={() =>
                onToggle(item.key)
              }
              className="h-3 w-3 cursor-pointer accent-blue-600"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default MapLayersPanel;