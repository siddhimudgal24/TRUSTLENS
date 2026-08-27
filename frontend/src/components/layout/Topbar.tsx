import { Bell, Radio } from "lucide-react";

function Topbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0B1220] px-6 flex items-center justify-between text-white">
      
      <div>
        <h2 className="font-semibold">
          Flood Response
        </h2>

        <p className="text-xs text-gray-400">
          Jaipur District
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2 text-green-400">
          <Radio size={16} />

          <span className="text-sm">
            LIVE
          </span>
        </div>

        <button className="relative">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
          OP
        </div>

      </div>
    </header>
  );
}

export default Topbar;