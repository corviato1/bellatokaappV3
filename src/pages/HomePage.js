import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sectionsData from "../data/location/sections.json";
import plantsData from "../data/location/plants.json";
import QRScanner from "../components/QRScanner";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { sections } = sectionsData;
  const { plants } = plantsData;

  const vegetativeSections = sections.filter((s) => s.type === "vegetative");
  const floweringSections = sections.filter((s) => s.type === "flowering");
  const hangingSections = sections.filter((s) => s.type === "hanging");
  const deconSections = sections.filter((s) => s.type === "decontamination");
  const curingSections = sections.filter((s) => s.type === "curing");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const plant = plants.find(
        (p) =>
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.strainDisplay.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (plant) {
        navigate(`/plant/${plant.id}-${plant.strain}/stats`);
      }
    }
  };

  const handleQRResult = (result) => {
    setSearchQuery(result);
    setShowQRScanner(false);
  };

  const getPlantInSection = (sectionId) => {
    return plants.find(
      (p) => p.currentLocation === sectionId && p.status === "active"
    );
  };

  const renderSectionCard = (section) => {
    const plant = getPlantInSection(section.id);
    return (
      <div
        key={section.id}
        className={`location-card ${plant ? "occupied" : "empty"}`}
        onClick={() => navigate(`/location/${section.id}`)}
      >
        <div className="location-name">{section.name}</div>
        {plant && (
          <div className="plant-info">
            <span className="strain-name">{plant.strainDisplay}</span>
            <span className="plant-id">{plant.id}</span>
          </div>
        )}
        {!plant && <div className="empty-label">Empty</div>}
      </div>
    );
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Bella Toka</h1>
        <p>Cannabis Cultivation Tracking System</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by Plant ID or Strain Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
          <button
            type="button"
            className="scan-btn"
            onClick={() => setShowQRScanner(true)}
          >
            Scan QR to View Your Data
          </button>
        </form>
      </div>

      <div className="sections-landscape">
        <div className="section-group veg-section">
          <h2>Vegetative</h2>
          <div className="location-cards veg-grid">
            {vegetativeSections.map(renderSectionCard)}
          </div>
        </div>

        <div className="section-group flower-section">
          <h2>Flowering</h2>
          <div className="location-cards flower-grid">
            {floweringSections.map(renderSectionCard)}
          </div>
        </div>

        <div className="section-group hang-section">
          <h2>Hanging</h2>
          <div className="location-cards hang-grid">
            {hangingSections.map(renderSectionCard)}
          </div>
        </div>

        <div className="section-group decon-section">
          <h2>Decontamination</h2>
          <div className="location-cards decon-grid">
            {deconSections.map(renderSectionCard)}
          </div>
        </div>

        <div className="section-group curing-section">
          <h2>Curing</h2>
          <div className="location-cards curing-grid">
            {curingSections.map(renderSectionCard)}
          </div>
        </div>
      </div>

      <div className="quick-links">
        <button onClick={() => navigate("/about")} className="quick-link-btn">
          About
        </button>
        <button onClick={() => navigate("/admin")} className="quick-link-btn">
          Admin
        </button>
      </div>

      {showQRScanner && (
        <QRScanner
          onScanResult={handleQRResult}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
