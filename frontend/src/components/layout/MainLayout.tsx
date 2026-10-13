import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell flex min-h-screen flex-col bg-[#eef3f9] lg:flex-row">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:text-xs focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main id="main-content" tabIndex={-1} className="app-main min-w-0 p-3 sm:p-4 lg:p-2.5 outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;