import {
  LayoutDashboard,
  Map,
  Building2,
  ScanSearch,
  Route,
  Waves,
  BarChart3,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    name: "Command Center",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Live Map",
    icon: Map,
    path: "/map",
  },
  {
    name: "Shelters",
    icon: Building2,
    path: "/shelters",
  },
  {
    name: "AI Inspection",
    icon: ScanSearch,
    path: "/inspection",
  },
  {
    name: "Allocation",
    icon: Route,
    path: "/allocation",
  },
  {
    name: "Scenarios",
    icon: Waves,
    path: "/scenarios",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    name: "Change Password",
    icon: ShieldCheck,
    path: "/change-password",
  },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-[#0B1220] text-white p-5 flex flex-col justify-between border-r border-gray-800">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-wide text-blue-500 flex items-center gap-2">
            TRUSTLENS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Emergency Intelligence Platform
          </p>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-gray-800 space-y-4">
        <Link
          to="/login"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </Link>

        <div>
          <p className="text-[11px] text-gray-500">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-300">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;