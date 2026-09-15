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

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/inspection" element={<Inspection />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;