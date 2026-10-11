import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import AppErrorBoundary from "./components/layout/AppErrorBoundary";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LiveMap = lazy(() => import("./pages/LiveMap"));
const Shelters = lazy(() => import("./pages/Shelters"));
const Inspection = lazy(() => import("./pages/Inspection"));
const Allocation = lazy(() => import("./pages/Allocation"));
const Scenarios = lazy(() => import("./pages/Scenarios"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Disasters = lazy(() => import("./pages/Disasters"));
const Readiness = lazy(() => import("./pages/Readiness"));
const EmergencyAlerts = lazy(() => import("./pages/EmergencyAlerts"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Full-screen Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Workspace Pages wrapped in MainLayout */}
          <Route
            path="/*"
            element={
              <MainLayout>
                <Suspense
                  fallback={
                    <div
                      role="status"
                      aria-live="polite"
                      className="flex min-h-48 items-center justify-center gap-3 rounded-lg border border-slate-700 bg-[#0B1220] text-sm text-slate-300 p-8"
                    >
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                      Loading operations module...
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/disasters" element={<Disasters />} />
                    <Route path="/map" element={<LiveMap />} />
                    <Route path="/shelters" element={<Shelters />} />
                    <Route path="/inspection" element={<Inspection />} />
                    <Route path="/readiness" element={<Readiness />} />
                    <Route path="/alerts" element={<EmergencyAlerts />} />
                    <Route path="/allocation" element={<Allocation />} />
                    <Route path="/scenarios" element={<Scenarios />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;