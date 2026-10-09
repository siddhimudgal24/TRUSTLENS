import { Bell, CloudRain, Search, TriangleAlert } from "lucide-react";

import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { affectedZones, type Shelter } from "../../data/mockData";
import { useShelterStore } from "../../store/shelterStore";
import { useEmergencyAlertStore } from "../../store/emergencyAlertStore";

interface SearchResult {
  label: string;
  detail: string;
  shelter: Shelter | null;
  path: string;
}

function Topbar() {
  const shelters = useShelterStore((state) => state.shelters);
  const selectShelter = useShelterStore((state) => state.selectShelter);
  const activeAlertCount = useEmergencyAlertStore(
    (state) => state.alerts.filter((alert) => alert.status === "active").length
  );
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const matchingShelters: SearchResult[] = shelters
      .filter((shelter) =>
        `${shelter.name} ${shelter.id}`.toLowerCase().includes(normalizedQuery)
      )
      .map((shelter) => ({
        label: shelter.name,
        detail: `${shelter.id} · Shelter`,
        shelter,
        path: "/shelters",
      }));
    const matchingZones: SearchResult[] = affectedZones
      .filter((zone) =>
        `${zone.name} ${zone.id}`.toLowerCase().includes(normalizedQuery)
      )
      .map((zone) => ({
        label: zone.name,
        detail: `${zone.id} · Affected area`,
        shelter: null,
        path: `/map?zone=${encodeURIComponent(zone.id)}`,
      }));

    return [
      ...matchingShelters,
      ...matchingZones,
    ];
  }, [query, shelters]);

  const goToResult = (result: SearchResult) => {
    selectShelter(result.shelter);
    navigate(result.path);
    setQuery("");
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (results[0]) goToResult(results[0]);
  };

  return (
    <header className="app-topbar flex min-h-[60px] items-center gap-2 border-b px-3 py-2 sm:gap-3 sm:px-4 lg:px-2.5">
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="topbar-search relative flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 py-2"
      >
        <Search size={15} className="shrink-0 text-slate-400" />
        <input
          type="search"
          aria-label="Search shelters, zones, or locations"
          aria-expanded={isSearchOpen && query.trim().length > 0}
          aria-controls="topbar-search-results"
          placeholder="Search shelters, zones, or locations..."
          autoComplete="off"
          value={query}
          onFocus={() => setIsSearchOpen(true)}
          onBlur={() => window.setTimeout(() => setIsSearchOpen(false), 120)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsSearchOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsSearchOpen(false);
          }}
          className="min-w-0 flex-1 border-0 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
        />
        {isSearchOpen && query.trim() && (
          <div
            id="topbar-search-results"
            className="search-results absolute left-0 right-0 top-[calc(100%+6px)] z-[1500] max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
          >
            {results.length ? (
              results.map((result) => (
                <button
                  key={`${result.detail}-${result.label}`}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => goToResult(result)}
                  className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-blue-50"
                >
                  <span className="text-xs font-semibold text-slate-800">
                    {result.label}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {result.detail}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-3 text-xs text-slate-500">
                No shelters or affected areas match this search.
              </p>
            )}
          </div>
        )}
      </form>

      <div className="hidden items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-red-700 sm:flex">
        <TriangleAlert size={16} />
        <div className="leading-tight">
          <p className="text-[11px] font-semibold">Flood risk areas</p>
          <p className="text-[9px] text-red-600">Mapped high-risk zones</p>
        </div>
      </div>

      <div className="hidden items-center gap-2 px-1 text-slate-700 md:flex">
        <CloudRain size={19} className="text-blue-500" />
        <div className="leading-tight">
          <p className="text-xs font-semibold">Weather</p>
          <p className="text-[9px] text-slate-500">Not connected</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/alerts")}
        aria-label={`Emergency alerts, ${activeAlertCount} active`}
        title="Open emergency alerts"
        className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <Bell size={18} />
        {activeAlertCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold leading-none text-white"
          >
            {activeAlertCount > 99 ? "99+" : activeAlertCount}
          </span>
        )}
      </button>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#29486f] text-xs font-semibold text-white">
        S
      </div>
    </header>
  );
}

export default Topbar;
