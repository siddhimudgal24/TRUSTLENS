import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Clock3,
  RotateCcw,
  ShieldAlert,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../components/layout/PageHeader";
import { affectedZones } from "../data/mockData";
import {
  useEmergencyAlertStore,
  type AlertSeverity,
  type AlertStatus,
  type EmergencyAlert,
} from "../store/emergencyAlertStore";

type StatusFilter = "all" | AlertStatus;

const severityStyles: Record<AlertSeverity, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  moderate: "border-amber-200 bg-amber-50 text-amber-800",
};

const statusStyles: Record<AlertStatus, string> = {
  active: "bg-red-50 text-red-700",
  acknowledged: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

function EmergencyAlerts() {
  const alerts = useEmergencyAlertStore((state) => state.alerts);
  const createAlert = useEmergencyAlertStore((state) => state.createAlert);
  const updateStatus = useEmergencyAlertStore((state) => state.updateStatus);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertSeverity>("high");
  const [zoneId, setZoneId] = useState(affectedZones[0]?.id ?? "");
  const [formError, setFormError] = useState("");

  const filteredAlerts = useMemo(
    () =>
      statusFilter === "all"
        ? alerts
        : alerts.filter((alert) => alert.status === statusFilter),
    [alerts, statusFilter]
  );

  const activeCount = alerts.filter((alert) => alert.status === "active").length;
  const criticalCount = alerts.filter(
    (alert) => alert.severity === "critical" && alert.status !== "resolved"
  ).length;
  const acknowledgedCount = alerts.filter(
    (alert) => alert.status === "acknowledged"
  ).length;
  const resolvedCount = alerts.filter(
    (alert) => alert.status === "resolved"
  ).length;

  const submitAlert = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();

    if (!trimmedTitle || !trimmedMessage || !zoneId) {
      setFormError("Enter a title and message, and choose an affected zone.");
      return;
    }

    createAlert({
      title: trimmedTitle,
      message: trimmedMessage,
      severity,
      zoneId,
    });
    setTitle("");
    setMessage("");
    setSeverity("high");
    setZoneId(affectedZones[0]?.id ?? "");
    setFormError("");
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 text-slate-900">
      <PageHeader
        eyebrow="Emergency operations"
        title="Emergency Alerts"
        description="Review, acknowledge, and track incident alerts for affected areas."
        status={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            <ShieldAlert size={14} />
            Local tracking only
          </span>
        }
      />

      <div
        role="note"
        className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-900"
      >
        <Bell size={15} className="mt-0.5 shrink-0" />
        <p>
          Sample alerts use demonstration map data. Alerts recorded here are
          saved in this browser only; no message is sent to residents or
          emergency services.
        </p>
      </div>

      <section
        aria-label="Alert summary"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        <AlertMetric label="Active" value={activeCount} tone="red" />
        <AlertMetric label="Critical unresolved" value={criticalCount} tone="orange" />
        <AlertMetric label="Acknowledged" value={acknowledgedCount} tone="blue" />
        <AlertMetric label="Resolved" value={resolvedCount} tone="green" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Alert register</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {alerts.length} locally recorded {alerts.length === 1 ? "alert" : "alerts"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="alert-status-filter">
              Filter alerts by status
            </label>
            <select
              id="alert-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen((open) => !open);
                setFormError("");
              }}
              className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {isFormOpen ? <X size={14} /> : <AlertTriangle size={14} />}
              {isFormOpen ? "Cancel" : "Record alert"}
            </button>
          </div>
        </div>

        {isFormOpen && (
          <form
            onSubmit={submitAlert}
            className="grid gap-3 border-b border-slate-100 bg-slate-50 p-4 sm:grid-cols-2"
          >
            <label className="space-y-1 text-xs font-medium text-slate-700">
              Alert title
              <input
                autoFocus
                maxLength={100}
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Evacuation advisory"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-700">
              Affected zone
              <select
                required
                value={zoneId}
                onChange={(event) => setZoneId(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {affectedZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.id})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-700">
              Severity
              <select
                value={severity}
                onChange={(event) =>
                  setSeverity(event.target.value as AlertSeverity)
                }
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-700 sm:col-span-2">
              Alert details
              <textarea
                maxLength={500}
                required
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe the incident and recommended response."
                className="w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            {formError && (
              <p role="alert" className="text-xs font-medium text-red-700 sm:col-span-2">
                {formError}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
              <p className="text-[11px] text-slate-500">
                Creates a local record only; this does not broadcast an alert.
              </p>
              <button
                type="submit"
                className="rounded-md bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Save local alert
              </button>
            </div>
          </form>
        )}

        {filteredAlerts.length ? (
          <ul className="divide-y divide-slate-100">
            {filteredAlerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onStatusChange={(status) => updateStatus(alert.id, status)}
              />
            ))}
          </ul>
        ) : (
          <div className="p-10 text-center">
            <CheckCheck size={24} className="mx-auto text-emerald-600" />
            <p className="mt-2 text-sm font-semibold text-slate-800">
              No {statusFilter === "all" ? "" : `${statusFilter} `}alerts to show
            </p>
            <p className="mt-1 text-xs text-slate-500">
              New local records will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function AlertRow({
  alert,
  onStatusChange,
}: {
  alert: EmergencyAlert;
  onStatusChange: (status: AlertStatus) => void;
}) {
  const zone = affectedZones.find((item) => item.id === alert.zoneId);
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(alert.updatedAt));

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${severityStyles[alert.severity]}`}
          aria-hidden="true"
        >
          <AlertTriangle size={17} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{alert.title}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[alert.status]}`}
            >
              {alert.status}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${severityStyles[alert.severity]}`}
            >
              {alert.severity}
            </span>
          </div>
          <p className="mt-1 max-w-3xl whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">
            {alert.message}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
            <span>{zone ? `${zone.name} (${zone.id})` : alert.zoneId}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={11} />
              Updated {formattedTime}
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 capitalize">
              {alert.source === "simulation" ? "Sample data" : "Operator record"}
            </span>
          </div>
        </div>
      </div>
      <AlertActions alert={alert} onStatusChange={onStatusChange} />
    </li>
  );
}

function AlertActions({
  alert,
  onStatusChange,
}: {
  alert: EmergencyAlert;
  onStatusChange: (status: AlertStatus) => void;
}) {
  if (alert.status === "resolved") {
    return (
      <button
        type="button"
        onClick={() => onStatusChange("active")}
        aria-label={`Reopen ${alert.title}`}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <RotateCcw size={13} />
        Reopen
      </button>
    );
  }

  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      {alert.status === "active" && (
        <button
          type="button"
          onClick={() => onStatusChange("acknowledged")}
          aria-label={`Acknowledge ${alert.title}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-blue-200 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Check size={13} />
          Acknowledge
        </button>
      )}
      <button
        type="button"
        onClick={() => onStatusChange("resolved")}
        aria-label={`Resolve ${alert.title}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-emerald-200 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        <CheckCheck size={13} />
        Resolve
      </button>
    </div>
  );
}

function AlertMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "red" | "orange" | "blue" | "green";
}) {
  const tones = {
    red: "border-red-100 bg-red-50 text-red-700",
    orange: "border-orange-100 bg-orange-50 text-orange-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };

  return (
    <article className={`rounded-lg border p-3 ${tones[tone]}`}>
      <p className="text-[10px] font-medium opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </article>
  );
}

export default EmergencyAlerts;
