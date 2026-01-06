import React, { useState, useEffect } from "react";
import PasswordProtection from "../components/PasswordProtection";
import adminTasksData from "../data/admin/adminTasks.json";
import sectionsData from "../data/location/sections.json";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem("adminAuthenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    localStorage.setItem("adminAuthenticated", "true");
    setIsAuthenticated(true);
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  return <AdminContent />;
};

const AdminContent = () => {
  const { locationTasks, scheduledTasks } = adminTasksData;
  const { sections } = sectionsData;

  const [dayOffset, setDayOffset] = useState(0);
  const [formData, setFormData] = useState({
    locationId: "v1",
    completedTasks: [],
    notes: "",
    photos: [],
  });

  const [reports, setReports] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adminReports");
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }, []);

  const getDayInfo = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    const dayOfWeek = date.getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[dayOfWeek];

    const dayOfMonth = date.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);
    const weekName = `Week ${Math.min(weekNumber, 4)}`;

    return {
      date,
      dayName,
      weekName,
      dayOfWeek,
      isWeekday: dayOfWeek >= 1 && dayOfWeek <= 5,
    };
  };

  const getDateLabel = (offset) => {
    const info = getDayInfo(offset);
    if (offset === 0) {
      return `Today ${info.dayName} ${info.weekName}`;
    } else if (offset === -1) {
      return `Yesterday ${info.dayName} ${info.weekName}`;
    } else if (offset === 1) {
      return `Tomorrow ${info.dayName} ${info.weekName}`;
    } else if (offset < -1) {
      return `${Math.abs(offset)} Days Ago`;
    } else {
      return `${offset} Days From Now`;
    }
  };

  const getCurrentTasks = () => {
    const info = getDayInfo(dayOffset);

    if (!info.isWeekday || !scheduledTasks[info.dayName]) {
      return [];
    }

    const dayTasks = scheduledTasks[info.dayName];
    return dayTasks[info.weekName] || [];
  };

  const handleTaskToggle = (taskId) => {
    setFormData((prev) => {
      const exists = prev.completedTasks.includes(taskId);
      if (exists) {
        return {
          ...prev,
          completedTasks: prev.completedTasks.filter((id) => id !== taskId),
        };
      }
      return { ...prev, completedTasks: [...prev.completedTasks, taskId] };
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              name: file.name,
              data: event.target.result,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.completedTasks.length === 0 && !formData.notes.trim()) {
      alert("Please select at least one task or add notes before submitting.");
      return;
    }

    const info = getDayInfo(dayOffset);
    const report = {
      id: `report-${Date.now()}`,
      ...formData,
      date: info.date.toISOString().split("T")[0],
      dayName: info.dayName,
      weekName: info.weekName,
      submittedAt: new Date().toISOString(),
    };

    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    localStorage.setItem("adminReports", JSON.stringify(updatedReports));

    setFormData({
      locationId: formData.locationId,
      completedTasks: [],
      notes: "",
      photos: [],
    });

    alert("Report submitted successfully!");
  };

  const getTaskLabel = (taskId) => {
    const allTasks = [...locationTasks];
    Object.values(scheduledTasks).forEach((dayTasks) => {
      Object.values(dayTasks).forEach((weekTasks) => {
        allTasks.push(...weekTasks);
      });
    });
    const task = allTasks.find((t) => t.id === taskId);
    return task ? task.label : taskId;
  };

  const deleteReport = (reportId) => {
    const updatedReports = reports.filter((r) => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem("adminReports", JSON.stringify(updatedReports));
  };

  const currentTasks = getCurrentTasks();
  const dayInfo = getDayInfo(dayOffset);

  const groupedScheduledTasks = currentTasks.reduce((acc, task) => {
    const cat = task.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

  const groupedLocationTasks = {
    Equipment: locationTasks.filter((t) => t.category === "equipment"),
    "Plant Care": locationTasks.filter((t) => t.category === "plant-care"),
    "Pest Checks": locationTasks.filter((t) => t.category === "pest-check"),
    "Plant Health": locationTasks.filter((t) => t.category === "plant-health"),
  };

  return (
    <div className="admin-page landscape">
      <div className="admin-header">
        <h1>Staff Daily Report</h1>
        <button
          className={`history-toggle ${showHistory ? "active" : ""}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "New Report" : "View History"}
        </button>
      </div>

      {!showHistory ? (
        <div className="admin-content-landscape">
          <div className="day-navigation">
            <button
              className="nav-btn prev"
              onClick={() => setDayOffset((prev) => prev - 1)}
            >
              Previous Day
            </button>
            <div className="current-day-display">
              <h2>{getDateLabel(dayOffset)}</h2>
              {!dayInfo.isWeekday && (
                <span className="weekend-notice">
                  Weekend - No scheduled tasks
                </span>
              )}
            </div>
            <button
              className="nav-btn next"
              onClick={() => setDayOffset((prev) => prev + 1)}
            >
              Next Day
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form landscape-form">
            <div className="form-columns">
              <div className="form-column left-column">
                <div className="form-section">
                  <h2>Location</h2>
                  <div className="form-group">
                    <select
                      value={formData.locationId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          locationId: e.target.value,
                        }))
                      }
                    >
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name} ({section.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {currentTasks.length > 0 && (
                  <div className="form-section scheduled-tasks-section">
                    <h2>
                      Scheduled Tasks for {dayInfo.dayName} {dayInfo.weekName}
                    </h2>
                    {Object.entries(groupedScheduledTasks).map(
                      ([category, tasks]) => (
                        <div key={category} className="task-category">
                          <h3>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1).replace("-", " ")}
                          </h3>
                          <div className="tasks-grid">
                            {tasks.map((task) => (
                              <label
                                key={task.id}
                                className={`task-item scheduled ${
                                  formData.completedTasks.includes(task.id)
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.completedTasks.includes(
                                    task.id
                                  )}
                                  onChange={() => handleTaskToggle(task.id)}
                                />
                                <span className="task-label">{task.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="form-column right-column">
                <div className="form-section">
                  <h2>Daily Checklist</h2>
                  {Object.entries(groupedLocationTasks).map(
                    ([category, tasks]) => (
                      <div key={category} className="task-category">
                        <h3>{category}</h3>
                        <div className="tasks-grid">
                          {tasks.map((task) => (
                            <label
                              key={task.id}
                              className={`task-item ${
                                formData.completedTasks.includes(task.id)
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.completedTasks.includes(
                                  task.id
                                )}
                                onChange={() => handleTaskToggle(task.id)}
                              />
                              <span className="task-label">{task.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
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
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="remove-photo"
                          >
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Report
            </button>
          </form>
        </div>
      ) : (
        <div className="report-history">
          <h2>Report History</h2>
          {reports.length === 0 ? (
            <p className="no-reports">No reports submitted yet.</p>
          ) : (
            <div className="reports-list landscape-reports">
              {reports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <span className="report-location">
                      {report.locationId.toUpperCase()}
                    </span>
                    <span className="report-date">
                      {new Date(report.date).toLocaleDateString()}
                      {report.dayName && ` - ${report.dayName}`}
                      {report.weekName && ` (${report.weekName})`}
                    </span>
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
                        {report.completedTasks.map((taskId) => (
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
