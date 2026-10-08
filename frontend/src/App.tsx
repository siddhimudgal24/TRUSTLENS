import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import AppErrorBoundary from "./components/layout/AppErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LiveMap = lazy(() => import("./pages/LiveMap"));
const Shelters = lazy(() => import("./pages/Shelters"));
const Inspection = lazy(() => import("./pages/Inspection"));
const Allocation = lazy(() => import("./pages/Allocation"));
const Scenarios = lazy(() => import("./pages/Scenarios"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Readiness = lazy(() => import("./pages/Readiness"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <MainLayout>
          <Suspense
            fallback={
              <div
                role="status"
                aria-live="polite"
                className="flex min-h-48 items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-600"
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                Loading operations module...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<LiveMap />} />
              <Route path="/shelters" element={<Shelters />} />
              <Route path="/inspection" element={<Inspection />} />
              <Route path="/readiness" element={<Readiness />} />
              <Route path="/allocation" element={<Allocation />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;