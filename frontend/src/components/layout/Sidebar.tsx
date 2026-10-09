import {
  Activity,
  BellRing,
  BarChart3,
  Building2,
  LayoutDashboard,
  Map,
  Route,
  ScanSearch,
  Settings,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Live Map", icon: Map, path: "/map" },
  { name: "Shelters", icon: Building2, path: "/shelters" },
  { name: "Inspection", icon: ScanSearch, path: "/inspection" },
  { name: "Readiness", icon: ShieldCheck, path: "/readiness" },
  { name: "Allocation", icon: Route, path: "/allocation" },
  { name: "Emergency Alerts", icon: BellRing, path: "/alerts" },
  { name: "Scenarios", icon: Waves, path: "/scenarios" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
];

function Sidebar() {
  return (
    <aside className="app-sidebar flex w-full shrink-0 flex-col text-white lg:sticky lg:top-0 lg:h-screen lg:w-[154px] xl:w-48">
      <div className="sidebar-brand flex items-center gap-2 px-4 py-4">
        <Activity className="shrink-0 text-blue-300" size={27} strokeWidth={2.7} />
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-5 tracking-wide">TRUSTLENS</h1>
          <p className="mt-0.5 max-w-[118px] text-[7px] leading-[9px] text-slate-300">
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
              `flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white lg:w-full ${
                isActive ? "bg-blue-600 text-white shadow-sm" : ""
              }`
            }
          >
            <Icon size={17} strokeWidth={2.4} />
            <span className="text-xs font-medium">{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-settings mt-auto hidden px-2 pb-4 pt-5 lg:block">
        <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-slate-300">
          <Settings size={17} />
          <span className="text-xs font-medium">Settings</span>
        </div>
        <p className="mt-4 px-3 text-[10px] text-slate-400">System operational</p>
      </div>
    </aside>
  );
}

export default Sidebar;
