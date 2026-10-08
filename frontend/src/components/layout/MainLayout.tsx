import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell flex min-h-screen flex-col bg-[#eef3f9] lg:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="app-main min-w-0 p-3 sm:p-4 lg:p-2.5">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;