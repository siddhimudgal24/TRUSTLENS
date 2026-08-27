import {
  LayoutDashboard,
  Map,
  Building2,
  ScanSearch,
  Route,
  Waves,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";


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
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0B1220] text-white p-5">
      
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-wide">
          SHELTERX
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Emergency Intelligence
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
  key={item.name}
  to={item.path}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition"
>
  <Icon size={19} />

  <span className="text-sm">
    {item.name}
  </span>
</Link>
          );
        })}
      </nav>

      <div className="absolute bottom-5">
        <p className="text-xs text-gray-500">
          System Status
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />

          <span className="text-xs text-gray-300">
            All systems operational
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;