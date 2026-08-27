import type { ReactNode } from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#080E1A]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;