import {
  AlertTriangle,
  BarChart3,
  Building2,
  LayoutDashboard,
  Map,
  Route,
  ScanSearch,
  ShieldCheck,
  Waves,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearStoredUser } from "../../utils/auth";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Disasters", icon: AlertTriangle, path: "/disasters" },
  { name: "Live Map", icon: Map, path: "/map" },
  { name: "Shelters", icon: Building2, path: "/shelters" },
  { name: "Inspection", icon: ScanSearch, path: "/inspection" },
  { name: "Readiness", icon: ShieldCheck, path: "/readiness" },
  { name: "Allocation", icon: Route, path: "/allocation" },
  { name: "Scenarios", icon: Waves, path: "/scenarios" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearStoredUser();
    navigate("/register");
  };

  return (
    <aside className="app-sidebar flex w-full shrink-0 flex-col text-slate-700 lg:sticky lg:top-0 lg:h-screen lg:w-[154px] xl:w-48 bg-white border-r border-slate-200">
      <div className="sidebar-brand flex items-center gap-2.5 px-3 py-3.5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-white p-0.5 shrink-0 shadow-sm border border-slate-200 overflow-hidden">
          <img src="/logo.jpeg" alt="TrustLens Logo" className="w-full h-full object-contain rounded-md" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold leading-4 tracking-wide text-slate-900">TRUSTLENS</h1>
          <p className="mt-0.5 max-w-[118px] text-[7px] leading-[9px] text-slate-500">
            Safer communities. Stronger tomorrow.
          </p>
        </div>
      </div>

      <nav className="sidebar-nav flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:overflow-visible">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 transition lg:w-full ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              }`
            }
          >
            <Icon size={17} strokeWidth={2.4} />
            <span className="text-xs">{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-settings mt-auto hidden px-2 pb-4 pt-4 lg:block border-t border-slate-100">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-rose-600 hover:bg-rose-50 transition text-left"
        >
          <LogOut size={16} />
          <span className="text-xs font-semibold">Sign Out</span>
        </button>
        <div className="flex items-center gap-1.5 mt-3 px-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] text-slate-500 font-medium">System operational</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
