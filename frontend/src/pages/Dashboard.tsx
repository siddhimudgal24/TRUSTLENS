import {
  Building2,
  Users,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import LiveShelterMap from "../components/map/LiveShelterMap";

const stats = [
  {
    title: "Active Shelters",
    value: "24",
    subtitle: "of 31 registered",
    icon: Building2,
  },
  {
    title: "People Affected",
    value: "8,420",
    subtitle: "+12% in last hour",
    icon: Users,
  },
  {
    title: "Recommended",
    value: "17",
    subtitle: "Ready for allocation",
    icon: ShieldCheck,
  },
  {
    title: "Critical",
    value: "3",
    subtitle: "Immediate attention",
    icon: AlertTriangle,
  },
];

function Dashboard() {
  return (
    <div className="space-y-6 text-white">

      {/* PAGE HEADER */}

      <div>
        <p className="text-sm text-gray-400">
          Thursday, August 27
        </p>

        <h1 className="text-2xl font-bold mt-1">
          Emergency Command Center
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Real-time shelter readiness and allocation overview
        </p>
      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-4 gap-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-[#111827] border border-white/10 rounded-xl p-5"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    {stat.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {stat.value}
                  </h2>

                  <p className="text-xs text-gray-500 mt-2">
                    {stat.subtitle}
                  </p>

                </div>

                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">

                  <Icon size={20} />

                </div>

              </div>

            </div>
          );

        })}

      </div>


      {/* MAP SECTION */}

      <div>

        <div className="flex items-center justify-between mb-3">

          <div>

            <h2 className="text-lg font-semibold">
              Live Disaster Map
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Flood exposure, shelters, affected zones and road access
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs text-green-400">

            <span className="w-2 h-2 bg-green-500 rounded-full" />

            LIVE

          </div>

        </div>


        <div className="h-[520px] rounded-xl overflow-hidden border border-white/10">

          <LiveShelterMap />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;