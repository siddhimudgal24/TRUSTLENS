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
    <div className="absolute top-4 left-4 z-[1000] w-60 bg-[#0B1220]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl text-white">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold">
          MAP LAYERS
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          Control map visibility
        </p>
      </div>

      <div className="p-3 space-y-1">
        {layerItems.map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition"
          >
            <span className="text-sm text-gray-300">
              {item.label}
            </span>

            <input
              type="checkbox"
              checked={layers[item.key]}
              onChange={() =>
                onToggle(item.key)
              }
              className="w-4 h-4 accent-green-500 cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default MapLayersPanel;