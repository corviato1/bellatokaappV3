import React, { useState } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    locationId: 'v1',
    plantId: '',
    date: new Date().toISOString().split('T')[0],
    week: 1,
    timelineEvents: [],
    nutrients: [],
    pestManagement: [],
    notes: ''
  });

  const [newEvent, setNewEvent] = useState({ label: '', date: '', status: 'completed', notes: '' });

  const locations = [
    'v1', 'v2', 'v3', 'v4',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10',
    'h1', 'h2',
    'decon',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'
  ];

  const nutrientOptions = [
    { name: 'Power SI Potassium Silicate', image: 'power-si' },
    { name: 'House and Garden Cocos A', image: 'cocos-a' },
    { name: 'House and Garden Cocos B', image: 'cocos-b' },
    { name: 'Botanicare Cal-Mag Plus', image: 'cal-mag' },
    { name: 'General Hydroponics Diamond Nectar', image: 'diamond-nectar' },
    { name: 'House and Garden Roots Excelurator Gold', image: 'roots-gold' },
    { name: 'Botanicare Hydroguard', image: 'hydroguard' },
    { name: 'Primordial Solutions Sea Green', image: 'sea-green' },
    { name: 'Botanicare Liquid Karma', image: 'liquid-karma' },
    { name: 'Botanicare Vitamino', image: 'vitamino' },
    { name: 'House and Garden Nitrogen Boost', image: 'nitrogen-boost' },
    { name: 'Primordial Solutions PaleoBloom', image: 'paleo-bloom' },
    { name: 'Primordial Solutions True Blooms', image: 'true-blooms' },
    { name: 'Botanicare Hydroplex', image: 'hydroplex' },
    { name: 'House and Garden Bud-XL', image: 'bud-xl' },
    { name: 'Botanicare Sweet Raw', image: 'sweet-raw' },
    { name: 'Botanicare Sweet Berry', image: 'sweet' },
    { name: 'House and Garden Top Shooter', image: 'top-shooter' }
  ];

  const pestOptions = [
    { name: 'Neem Oil', image: 'neem-oil', link: '' },
    { name: 'Regalia CG Biofungicide', image: 'regalia', link: 'https://profarmgroup.com/products/regalia-cg' },
    { name: 'Molt-X', image: 'molt-x', link: 'https://bioworksinc.com/products/moltx/' },
    { name: 'The Amazing Doctor Zymes', image: 'dr-zymes', link: 'https://www.doctorzymes.com/pesticide-free-insecticide.php' }
  ];

  const addTimelineEvent = () => {
    if (newEvent.label && newEvent.date) {
      setFormData(prev => ({
        ...prev,
        timelineEvents: [...prev.timelineEvents, { ...newEvent }]
      }));
      setNewEvent({ label: '', date: '', status: 'completed', notes: '' });
    }
  };

  const removeTimelineEvent = (index) => {
    setFormData(prev => ({
      ...prev,
      timelineEvents: prev.timelineEvents.filter((_, i) => i !== index)
    }));
  };

  const toggleNutrient = (nutrient) => {
    setFormData(prev => {
      const exists = prev.nutrients.find(n => n.name === nutrient.name);
      if (exists) {
        return { ...prev, nutrients: prev.nutrients.filter(n => n.name !== nutrient.name) };
      }
      return { ...prev, nutrients: [...prev.nutrients, nutrient] };
    });
  };

  const togglePest = (pest) => {
    setFormData(prev => {
      const exists = prev.pestManagement.find(p => p.name === pest.name);
      if (exists) {
        return { ...prev, pestManagement: prev.pestManagement.filter(p => p.name !== pest.name) };
      }
      return { ...prev, pestManagement: [...prev.pestManagement, pest] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entryData = {
      id: `entry-${Date.now()}`,
      locationId: formData.locationId,
      plantId: formData.plantId,
      date: formData.date,
      week: parseInt(formData.week),
      stats: {
        timeline: formData.timelineEvents,
        notes: formData.notes
      },
      nutrients: formData.nutrients,
      pestManagement: formData.pestManagement,
      images: []
    };

    console.log('Entry data to save:', JSON.stringify(entryData, null, 2));
    alert('Entry data logged to console. In production, this would be saved to the database.\n\nCopy the JSON from the console and add it to src/data/locationData.json');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-section">
          <h2>Basic Info</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Location</label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Plant ID</label>
              <input
                type="text"
                placeholder="e.g., BT-2025-001"
                value={formData.plantId}
                onChange={(e) => setFormData(prev => ({ ...prev, plantId: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Week</label>
              <input
                type="number"
                min="1"
                value={formData.week}
                onChange={(e) => setFormData(prev => ({ ...prev, week: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Timeline Events</h2>
          <div className="add-event-form">
            <input
              type="text"
              placeholder="Event label"
              value={newEvent.label}
              onChange={(e) => setNewEvent(prev => ({ ...prev, label: e.target.value }))}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
            />
            <select
              value={newEvent.status}
              onChange={(e) => setNewEvent(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="issue">Issue</option>
            </select>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newEvent.notes}
              onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
            />
            <button type="button" onClick={addTimelineEvent}>Add Event</button>
          </div>
          <div className="events-list">
            {formData.timelineEvents.map((event, idx) => (
              <div key={idx} className={`event-item ${event.status}`}>
                <span>{event.label} - {event.date}</span>
                <button type="button" onClick={() => removeTimelineEvent(idx)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Nutrients</h2>
          <div className="options-grid">
            {nutrientOptions.map((nutrient, idx) => (
              <label key={idx} className={`option-item ${formData.nutrients.find(n => n.name === nutrient.name) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!formData.nutrients.find(n => n.name === nutrient.name)}
                  onChange={() => toggleNutrient(nutrient)}
                />
                {nutrient.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Pest Management</h2>
          <div className="options-grid">
            {pestOptions.map((pest, idx) => (
              <label key={idx} className={`option-item ${formData.pestManagement.find(p => p.name === pest.name) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!formData.pestManagement.find(p => p.name === pest.name)}
                  onChange={() => togglePest(pest)}
                />
                {pest.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Notes</h2>
          <textarea
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <button type="submit" className="submit-btn">Generate Entry Data</button>
      </form>
    </div>
  );
};

export default AdminPage;
