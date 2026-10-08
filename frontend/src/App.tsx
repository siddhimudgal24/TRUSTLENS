import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import Shelters from "./pages/Shelters";
import Inspection from "./pages/Inspection";
import Allocation from "./pages/Allocation";
import Scenarios from "./pages/Scenarios";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard & Workspace Pages wrapped in MainLayout */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<LiveMap />} />
                <Route path="/shelters" element={<Shelters />} />
                <Route path="/inspection" element={<Inspection />} />
                <Route path="/allocation" element={<Allocation />} />
                <Route path="/scenarios" element={<Scenarios />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;