import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import plantsData from '../data/plants.json';
import locationDataFile from '../data/locationData.json';
import sectionsData from '../data/sections.json';
import './PlantDetailPage.css';

const PlantDetailPage = () => {
  const { plantId, tab } = useParams();
  const navigate = useNavigate();
  const [selectedNutrient, setSelectedNutrient] = useState(null);

  const { plants } = plantsData;
  const { entries } = locationDataFile;
  const { sections } = sectionsData;

  const extractedId = plantId.split('-').slice(0, 3).join('-');
  const plant = plants.find(p => p.id === extractedId);

  const plantEntries = useMemo(() => {
    if (!plant) return [];
    return entries
      .filter(e => e.plantId === plant.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, plant]);

  const tabs = ['stats', 'nutrients', 'pest-management', 'images'];

  const getNutrientImage = (imageName) => {
    try {
      return require(`../images/nutrients/${imageName}.png`);
    } catch {
      try {
        return require(`../images/nutrients/default.png`);
      } catch {
        return null;
      }
    }
  };

  const getPestImage = (imageName) => {
    try {
      return require(`../images/pest-management/${imageName}.png`);
    } catch {
      try {
        return require(`../images/pest-management/default.png`);
      } catch {
        return null;
      }
    }
  };

  const getStrainImage = (strain, imgName) => {
    try {
      return require(`../images/strains/${strain}/${imgName}`);
    } catch {
      return null;
    }
  };

  if (!plant) {
    return (
      <div className="plant-detail-page">
        <h1>Plant not found</h1>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const currentSection = sections.find(s => s.id === plant.currentLocation);

  const renderStats = () => {
    return (
      <div className="stats-content">
        <div className="lifecycle-summary">
          <h3>Plant Lifecycle Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Start Date</span>
              <span className="value">{plant.startDate}</span>
            </div>
            <div className="summary-item">
              <span className="label">Current Location</span>
              <span className="value">{currentSection?.name || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Status</span>
              <span className={`value status-${plant.status}`}>{plant.status}</span>
            </div>
          </div>
        </div>

        <div className="timeline-container">
          <h3>Complete Timeline</h3>
          {plantEntries.map(entry => {
            const section = sections.find(s => s.id === entry.locationId);
            return (
              <div key={entry.id} className="timeline-entry">
                <div className="timeline-entry-header">
                  <span className="location-badge">{section?.name}</span>
                  <span className="week-badge">Week {entry.week}</span>
                  <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="timeline-items">
                  {entry.stats?.timeline.map((item, idx) => (
                    <div key={idx} className={`timeline-item ${item.status}`}>
                      <span className="timeline-label">{item.label}</span>
                      <span className="timeline-date">{item.date}</span>
                      {item.notes && <span className="timeline-notes">{item.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNutrients = () => {
    const allNutrients = new Map();
    plantEntries.forEach(entry => {
      entry.nutrients?.forEach(n => {
        if (!allNutrients.has(n.name)) {
          allNutrients.set(n.name, n);
        }
      });
    });

    return (
      <div className="nutrients-content">
        <h3>Nutrients Used Throughout Lifecycle</h3>
        <div className="nutrients-grid">
          {Array.from(allNutrients.values()).map((nutrient, idx) => (
            <div 
              key={idx}
              className={`nutrient-card ${selectedNutrient === nutrient.image ? 'selected' : ''}`}
              onClick={() => setSelectedNutrient(selectedNutrient === nutrient.image ? null : nutrient.image)}
            >
              <span>{nutrient.name}</span>
            </div>
          ))}
        </div>
        {selectedNutrient && (
          <div className="nutrient-detail">
            <img src={getNutrientImage(selectedNutrient)} alt={selectedNutrient} />
          </div>
        )}

        <h3>Nutrients by Stage</h3>
        {plantEntries.map(entry => {
          if (!entry.nutrients || entry.nutrients.length === 0) return null;
          const section = sections.find(s => s.id === entry.locationId);
          return (
            <div key={entry.id} className="stage-nutrients">
              <h4>{section?.name} - Week {entry.week}</h4>
              <div className="nutrients-list">
                {entry.nutrients.map((n, idx) => (
                  <span key={idx} className="nutrient-tag">{n.name}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPestManagement = () => {
    const allPestItems = new Map();
    plantEntries.forEach(entry => {
      entry.pestManagement?.forEach(p => {
        if (!allPestItems.has(p.name)) {
          allPestItems.set(p.name, p);
        }
      });
    });

    return (
      <div className="pest-content">
        <h3>Pest Management Products Used</h3>
        <div className="pest-grid">
          {Array.from(allPestItems.values()).map((item, idx) => (
            <div key={idx} className="pest-card">
              <img src={getPestImage(item.image)} alt={item.name} />
              <span className="pest-name">{item.name}</span>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Product Info
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="pest-link">
          <button onClick={() => navigate('/pesticide-list')}>
            View Full Pesticide List
          </button>
        </div>
      </div>
    );
  };

  const renderImages = () => {
    const allImages = [];
    plantEntries.forEach(entry => {
      entry.images?.forEach(img => {
        allImages.push({
          src: getStrainImage(plant.strain, img),
          location: sections.find(s => s.id === entry.locationId)?.name,
          week: entry.week,
          date: entry.date
        });
      });
    });

    return (
      <div className="images-content">
        <h3>Photo Gallery</h3>
        {allImages.length === 0 ? (
          <p className="no-images">No images available for this plant.</p>
        ) : (
          <div className="gallery-grid">
            {allImages.filter(img => img.src).map((img, idx) => (
              <div key={idx} className="gallery-item">
                <img src={img.src} alt={`${plant.strainDisplay} at ${img.location}`} />
                <div className="image-info">
                  <span>{img.location}</span>
                  <span>Week {img.week}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="plant-detail-page">
      <div className="plant-header">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <div className="plant-info">
          <h1>{plant.strainDisplay}</h1>
          <span className="plant-id">ID: {plant.id}</span>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => navigate(`/plant/${plantId}/${t}`)}
          >
            {t === 'pest-management' ? 'Pest Management' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'stats' && renderStats()}
        {tab === 'nutrients' && renderNutrients()}
        {tab === 'pest-management' && renderPestManagement()}
        {tab === 'images' && renderImages()}
      </div>
    </div>
  );
};

export default PlantDetailPage;
