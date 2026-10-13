import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import AppErrorBoundary from "./components/layout/AppErrorBoundary";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TitleManager from "./components/common/TitleManager";
import CookieConsent from "./components/common/CookieConsent";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

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
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        {/* Dynamic unique document title manager */}
        <TitleManager />

        {/* Global Transparent Cookie Consent Banner (No dark patterns) */}
        <CookieConsent />

        <Routes>
          {/* Public Legal Compliance & Policy Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/404" element={<NotFound />} />

          {/* Public Authentication Pages */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Workspace Pages wrapped in MainLayout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense
                    fallback={
                      <div
                        role="status"
                        aria-live="polite"
                        className="flex min-h-48 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 shadow-sm p-8"
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
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/change-password" element={<Profile />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/cookies" element={<CookiePolicy />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;