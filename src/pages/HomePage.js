import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sectionsData from '../data/sections.json';
import plantsData from '../data/plants.json';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { sections } = sectionsData;
  const { plants } = plantsData;

  const vegetativeSections = sections.filter(s => s.type === 'vegetative');
  const floweringSections = sections.filter(s => s.type === 'flowering');
  const hangingSections = sections.filter(s => s.type === 'hanging');
  const deconSections = sections.filter(s => s.type === 'decontamination');
  const curingSections = sections.filter(s => s.type === 'curing');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const plant = plants.find(p => 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.strainDisplay.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (plant) {
        navigate(`/plant/${plant.id}-${plant.strain}/stats`);
      }
    }
  };

  const getPlantInSection = (sectionId) => {
    return plants.find(p => p.currentLocation === sectionId && p.status === 'active');
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
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="sections-grid">
        <div className="section-group">
          <h2>Vegetative Areas</h2>
          <div className="location-cards">
            {vegetativeSections.map(section => {
              const plant = getPlantInSection(section.id);
              return (
                <div 
                  key={section.id} 
                  className={`location-card ${plant ? 'occupied' : 'empty'}`}
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
            })}
          </div>
        </div>

        <div className="section-group">
          <h2>Flowering Areas</h2>
          <div className="location-cards flowering">
            {floweringSections.map(section => {
              const plant = getPlantInSection(section.id);
              return (
                <div 
                  key={section.id} 
                  className={`location-card ${plant ? 'occupied' : 'empty'}`}
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
            })}
          </div>
        </div>

        <div className="section-group">
          <h2>Hanging Areas</h2>
          <div className="location-cards hanging">
            {hangingSections.map(section => {
              const plant = getPlantInSection(section.id);
              return (
                <div 
                  key={section.id} 
                  className={`location-card ${plant ? 'occupied' : 'empty'}`}
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
            })}
          </div>
        </div>

        <div className="section-group">
          <h2>Decontamination</h2>
          <div className="location-cards decon">
            {deconSections.map(section => {
              const plant = getPlantInSection(section.id);
              return (
                <div 
                  key={section.id} 
                  className={`location-card ${plant ? 'occupied' : 'empty'}`}
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
            })}
          </div>
        </div>

        <div className="section-group">
          <h2>Curing Areas</h2>
          <div className="location-cards curing">
            {curingSections.map(section => {
              const plant = getPlantInSection(section.id);
              return (
                <div 
                  key={section.id} 
                  className={`location-card ${plant ? 'occupied' : 'empty'}`}
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
            })}
          </div>
        </div>
      </div>

      <div className="quick-links">
        <button onClick={() => navigate('/about')} className="quick-link-btn">
          About
        </button>
        <button onClick={() => navigate('/admin')} className="quick-link-btn">
          Admin
        </button>
      </div>
    </div>
  );
};

export default HomePage;
