import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Home, Map, ShieldAlert, Building2 } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Compass size={14} className="animate-spin" style={{ animationDuration: "12s" }} />
          <span>Error 404 · Coordinate Not Found</span>
        </div>

        {/* 404 Number Accent */}
        <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-3">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Operational Resource Unavailable
        </h1>

        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
          The requested coordinate, shelter record, or operations route could not be located.
          It may have been relocated, archived, or you may have followed an outdated link.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 border border-slate-200 inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition active:scale-95 shadow-md shadow-blue-500/20 inline-flex items-center gap-2"
          >
            <Home size={16} />
            <span>Operational Dashboard</span>
          </Link>
        </div>

        {/* Quick Recovery Navigation */}
        <div className="border-t border-slate-100 pt-8 text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
            Or Jump Directly To Critical Modules
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/map"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Map size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Live Map
                </p>
                <p className="text-[11px] text-slate-500">Real-time awareness</p>
              </div>
            </Link>

            <Link
              to="/shelters"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Shelters
                </p>
                <p className="text-[11px] text-slate-500">Facility status</p>
              </div>
            </Link>

            <Link
              to="/alerts"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                  Alerts
                </p>
                <p className="text-[11px] text-slate-500">Emergency broadcasts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
