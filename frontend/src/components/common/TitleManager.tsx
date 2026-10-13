import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLE_MAP: Record<string, string> = {
  "/": "Operational Dashboard",
  "/disasters": "Active Disasters",
  "/map": "Live Response Map",
  "/shelters": "Emergency Shelters",
  "/inspection": "Rapid Inspection & AI",
  "/readiness": "Shelter Readiness Overview",
  "/alerts": "Emergency Broadcast Alerts",
  "/allocation": "Resource & Evacuee Allocation",
  "/scenarios": "Disaster Scenario Simulation",
  "/analytics": "Response Analytics",
  "/profile": "Officer Profile & Security",
  "/change-password": "Change Password",
  "/login": "Sign In to Operations",
  "/register": "Officer Registration",
  "/forgot-password": "Reset Password",
  "/privacy": "Privacy Policy & Data Minimization",
  "/terms": "Terms of Service",
  "/cookies": "Cookie & Storage Policy",
  "/404": "Page Not Found",
};

export default function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = TITLE_MAP[location.pathname] || "Emergency Operations";
    document.title = `TrustLens | ${pageTitle}`;
  }, [location.pathname]);

  return null;
}
