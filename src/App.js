import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LocationPage from "./pages/LocationPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import FacilityReportPage from "./pages/FacilityReportPage";
import HomePage from "./pages/HomePage";
import "./styles/global.css";
import "./styles/responsive.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/location/:locationId" element={<LocationPage />} />
          <Route path="/plant/:plantId/:tab" element={<PlantDetailPage />} />
          <Route
            path="/plant/:plantId"
            element={<Navigate to="stats" replace />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/facility" element={<FacilityReportPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
