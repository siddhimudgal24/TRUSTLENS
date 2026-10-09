import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AlertSeverity = "critical" | "high" | "moderate";
export type AlertStatus = "active" | "acknowledged" | "resolved";
export type AlertSource = "simulation" | "operator";

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  zoneId: string;
  createdAt: string;
  updatedAt: string;
  source: AlertSource;
}

interface EmergencyAlertStore {
  alerts: EmergencyAlert[];
  createAlert: (
    alert: Pick<EmergencyAlert, "title" | "message" | "severity" | "zoneId">
  ) => void;
  updateStatus: (id: string, status: AlertStatus) => void;
}

const initialAlerts: EmergencyAlert[] = [
  {
    id: "demo-alert-zone-a",
    title: "Flood risk advisory",
    message:
      "Elevated flood exposure is shown in the sample map data. Verify local conditions before taking action.",
    severity: "high",
    status: "active",
    zoneId: "Z001",
    createdAt: "2026-10-09T05:00:00.000Z",
    updatedAt: "2026-10-09T05:00:00.000Z",
    source: "simulation",
  },
  {
    id: "demo-alert-zone-b",
    title: "Road access review",
    message:
      "A sample road segment is marked blocked. Confirm route safety with field teams.",
    severity: "moderate",
    status: "acknowledged",
    zoneId: "Z002",
    createdAt: "2026-10-09T04:30:00.000Z",
    updatedAt: "2026-10-09T05:10:00.000Z",
    source: "simulation",
  },
];

export const useEmergencyAlertStore = create<EmergencyAlertStore>()(
  persist(
    (set) => ({
      alerts: initialAlerts,
      createAlert: (details) => {
        const now = new Date().toISOString();
        set((state) => ({
          alerts: [
            {
              ...details,
              id: `alert-${crypto.randomUUID()}`,
              status: "active",
              createdAt: now,
              updatedAt: now,
              source: "operator",
            },
            ...state.alerts,
          ],
        }));
      },
      updateStatus: (id, status) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id
              ? { ...alert, status, updatedAt: new Date().toISOString() }
              : alert
          ),
        }));
      },
    }),
    { name: "trustlens-emergency-alerts" }
  )
);
