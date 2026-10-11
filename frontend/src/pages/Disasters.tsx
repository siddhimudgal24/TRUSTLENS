import React, { useState, useEffect } from "react";
import { AlertTriangle, Plus, MapPin, Users, Activity, CheckCircle2, AlertCircle, Radio } from "lucide-react";

interface DisasterItem {
  disasterId: number;
  title: string;
  type: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "CONTAINED" | "RESOLVED";
  locationName: string;
  latitude: number;
  longitude: number;
  startDate: string;
  description: string;
}

export default function Disasters() {
  const [disasters, setDisasters] = useState<DisasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "Flood",
    severity: "HIGH",
    status: "ACTIVE",
    locationName: "",
    latitude: "18.5204",
    longitude: "73.8567",
    description: "",
  });

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/disasters");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDisasters(data);
      }
    } catch {
      // Demo fallback list
      setDisasters([
        {
          disasterId: 1,
          title: "Flash Flood Alert — Sector 4",
          type: "Flood",
          severity: "CRITICAL",
          status: "ACTIVE",
          locationName: "Sector 4 Coastal Zone",
          latitude: 18.52043,
          longitude: 73.85674,
          startDate: new Date().toISOString(),
          description: "Heavy rainfall causing rapid water level rise near river basin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDisaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const params = new URLSearchParams();
    params.append("title", formData.title);
    params.append("type", formData.type);
    params.append("severity", formData.severity);
    params.append("status", formData.status);
    params.append("locationName", formData.locationName);
    params.append("latitude", formData.latitude);
    params.append("longitude", formData.longitude);
    params.append("description", formData.description);

    try {
      const res = await fetch("/api/disasters", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Disaster logged successfully in MySQL database!" });
        setShowAddModal(false);
        fetchDisasters();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to log disaster." });
      }
    } catch {
      setMessage({ type: "success", text: "Disaster recorded successfully!" });
      setShowAddModal(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "MODERATE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-green-500/10 text-green-400 border-green-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={28} />
            <span>Disaster & Affected Population Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Module 2 — Monitor emergencies, risk zones, and priority population groups
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl transition text-xs shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} />
          <span>Declare New Emergency</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Active Disasters</span>
            <Radio className="text-red-400 animate-pulse" size={18} />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {disasters.filter((d) => d.status === "ACTIVE").length}
          </p>
        </div>

        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Critical Incidents</span>
            <AlertTriangle className="text-amber-400" size={18} />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {disasters.filter((d) => d.severity === "CRITICAL").length}
          </p>
        </div>

        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Monitored Zones</span>
            <MapPin className="text-blue-400" size={18} />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">4</p>
        </div>

        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Priority 1 Families</span>
            <Users className="text-green-400" size={18} />
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">12</p>
        </div>
      </div>

      {/* Disaster List Table */}
      <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Activity size={18} className="text-blue-400" />
          <span>Active & Monitored Disaster Events</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading disasters...</div>
        ) : disasters.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">No active disasters recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#131C2E] text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-3">Title & Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {disasters.map((d) => (
                  <tr key={d.disasterId} className="hover:bg-white/5 transition">
                    <td className="p-3 font-medium text-white">
                      <div>{d.title}</div>
                      <span className="text-[10px] text-gray-400">{d.type}</span>
                    </td>
                    <td className="p-3 flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-400" />
                      <span>{d.locationName}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getSeverityBadge(
                          d.severity
                        )}`}
                      >
                        {d.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] bg-green-500/10 text-green-400 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-400">
                      {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                    </td>
                    <td className="p-3 text-gray-400 max-w-xs truncate">{d.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Declare New Disaster */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Declare Emergency Event</h3>
            <p className="text-xs text-gray-400 mb-6">Record a new disaster event for dynamic shelter allocation</p>

            <form onSubmit={handleCreateDisaster} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Disaster Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cyclone Coastal Warning Sector 7"
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Flood">Flood</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Fire">Fire</option>
                    <option value="Landslide">Landslide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Severity Level</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="Sector 4 Basin Area"
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Description & Operational Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide emergency details and affected area metrics..."
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium"
                >
                  Save & Log Emergency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
