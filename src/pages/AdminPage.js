import React, { useState, useEffect } from 'react';
import adminTasksData from '../data/admin/adminTasks.json';
import sectionsData from '../data/location/sections.json';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const { locationTasks } = adminTasksData;
  const { sections } = sectionsData;

  const [formData, setFormData] = useState({
    locationId: 'v1',
    date: new Date().toISOString().split('T')[0],
    completedTasks: [],
    notes: '',
    photos: []
  });

  const [reports, setReports] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adminReports');
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }, []);

  const handleTaskToggle = (taskId) => {
    setFormData(prev => {
      const exists = prev.completedTasks.includes(taskId);
      if (exists) {
        return { ...prev, completedTasks: prev.completedTasks.filter(id => id !== taskId) };
      }
      return { ...prev, completedTasks: [...prev.completedTasks, taskId] };
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, {
            name: file.name,
            data: event.target.result,
            timestamp: new Date().toISOString()
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.completedTasks.length === 0 && !formData.notes.trim()) {
      alert('Please select at least one task or add notes before submitting.');
      return;
    }

    const report = {
      id: `report-${Date.now()}`,
      ...formData,
      submittedAt: new Date().toISOString()
    };

    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    localStorage.setItem('adminReports', JSON.stringify(updatedReports));

    setFormData({
      locationId: formData.locationId,
      date: new Date().toISOString().split('T')[0],
      completedTasks: [],
      notes: '',
      photos: []
    });

    alert('Report submitted successfully!');
  };

  const getTaskLabel = (taskId) => {
    const task = locationTasks.find(t => t.id === taskId);
    return task ? task.label : taskId;
  };

  const deleteReport = (reportId) => {
    const updatedReports = reports.filter(r => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('adminReports', JSON.stringify(updatedReports));
  };

  const groupedTasks = {
    'Equipment': locationTasks.filter(t => t.category === 'equipment'),
    'Plant Care': locationTasks.filter(t => t.category === 'plant-care'),
    'Pest Checks': locationTasks.filter(t => t.category === 'pest-check'),
    'Plant Health': locationTasks.filter(t => t.category === 'plant-health')
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Staff Daily Report</h1>
        <button 
          className={`history-toggle ${showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'New Report' : 'View History'}
        </button>
      </div>

      {!showHistory ? (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h2>Location & Date</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Location</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                >
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.name} ({section.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Tasks Completed</h2>
            {Object.entries(groupedTasks).map(([category, tasks]) => (
              <div key={category} className="task-category">
                <h3>{category}</h3>
                <div className="tasks-grid">
                  {tasks.map(task => (
                    <label 
                      key={task.id} 
                      className={`task-item ${formData.completedTasks.includes(task.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.completedTasks.includes(task.id)}
                        onChange={() => handleTaskToggle(task.id)}
                      />
                      <span className="task-label">{task.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-section">
            <h2>Photos</h2>
            <div className="photo-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                id="photo-input"
                className="photo-input"
              />
              <label htmlFor="photo-input" className="photo-upload-btn">
                + Add Photos
              </label>
            </div>
            {formData.photos.length > 0 && (
              <div className="photo-previews">
                {formData.photos.map((photo, idx) => (
                  <div key={idx} className="photo-preview">
                    <img src={photo.data} alt={photo.name} />
                    <button type="button" onClick={() => removePhoto(idx)} className="remove-photo">
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Notes</h2>
            <textarea
              placeholder="Additional observations, issues, or notes..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          <button type="submit" className="submit-btn">Submit Report</button>
        </form>
      ) : (
        <div className="report-history">
          <h2>Report History</h2>
          {reports.length === 0 ? (
            <p className="no-reports">No reports submitted yet.</p>
          ) : (
            <div className="reports-list">
              {reports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <span className="report-location">{report.locationId.toUpperCase()}</span>
                    <span className="report-date">{new Date(report.date).toLocaleDateString()}</span>
                    <button 
                      className="delete-report" 
                      onClick={() => deleteReport(report.id)}
                    >
                      Delete
                    </button>
                  </div>
                  {report.completedTasks.length > 0 && (
                    <div className="report-tasks">
                      <strong>Tasks:</strong>
                      <ul>
                        {report.completedTasks.map(taskId => (
                          <li key={taskId}>{getTaskLabel(taskId)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.notes && (
                    <div className="report-notes">
                      <strong>Notes:</strong> {report.notes}
                    </div>
                  )}
                  {report.photos && report.photos.length > 0 && (
                    <div className="report-photos">
                      <strong>Photos:</strong> {report.photos.length} attached
                    </div>
                  )}
                  <div className="report-submitted">
                    Submitted: {new Date(report.submittedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
