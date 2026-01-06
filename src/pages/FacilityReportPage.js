import React, { useState, useEffect } from "react";
import facilityTasksData from "../data/facility/facilityTasks.json";
import "../styles/FacilityReportPage.css";

const FacilityReportPage = () => {
  const { facilityTasks } = facilityTasksData;

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const [completions, setCompletions] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const savedCompletions = localStorage.getItem("facilityCompletions");
    const savedNotes = localStorage.getItem("facilityNotes");
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const getMonthKey = (taskId) => `${selectedMonth}-${taskId}`;

  const isTaskCompleted = (taskId) => {
    return !!completions[getMonthKey(taskId)];
  };

  const getCompletionDate = (taskId) => {
    const completion = completions[getMonthKey(taskId)];
    return completion ? new Date(completion.date).toLocaleDateString() : null;
  };

  const toggleTaskCompletion = (taskId) => {
    const key = getMonthKey(taskId);
    const newCompletions = { ...completions };

    if (newCompletions[key]) {
      delete newCompletions[key];
    } else {
      newCompletions[key] = {
        date: new Date().toISOString(),
        completedBy: "Staff",
      };
    }

    setCompletions(newCompletions);
    localStorage.setItem("facilityCompletions", JSON.stringify(newCompletions));
  };

  const updateTaskNotes = (taskId, noteText) => {
    const key = getMonthKey(taskId);
    const newNotes = { ...notes, [key]: noteText };
    setNotes(newNotes);
    localStorage.setItem("facilityNotes", JSON.stringify(newNotes));
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      options.push({ value, label });
    }
    return options;
  };

  const getCompletionStats = () => {
    const completed = facilityTasks.filter((task) =>
      isTaskCompleted(task.id)
    ).length;
    return { completed, total: facilityTasks.length };
  };

  const stats = getCompletionStats();

  const groupedTasks = {
    "HVAC & Climate Control": facilityTasks.filter(
      (t) => t.category === "hvac"
    ),
    Cleaning: facilityTasks.filter((t) => t.category === "cleaning"),
    "Pest Prevention": facilityTasks.filter(
      (t) => t.category === "pest-prevention"
    ),
    Equipment: facilityTasks.filter((t) => t.category === "equipment"),
    Safety: facilityTasks.filter((t) => t.category === "safety"),
    Maintenance: facilityTasks.filter((t) => t.category === "maintenance"),
  };

  const getMonthDisplayName = () => {
    const [year, month] = selectedMonth.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="facility-page">
      <div className="facility-header">
        <h1>Facility Maintenance</h1>
        <div className="month-selector">
          <label>Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {getMonthOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Month:</span>
          <span className="stat-value">{getMonthDisplayName()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">
            {stats.completed} / {stats.total}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Progress:</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="tasks-container">
        {Object.entries(groupedTasks).map(([category, tasks]) => {
          if (tasks.length === 0) return null;
          return (
            <div key={category} className="task-category">
              <h2>{category}</h2>
              <div className="task-list">
                {tasks.map((task) => {
                  const completed = isTaskCompleted(task.id);
                  const completionDate = getCompletionDate(task.id);
                  const taskNotes = notes[getMonthKey(task.id)] || "";

                  return (
                    <div
                      key={task.id}
                      className={`task-row ${completed ? "completed" : ""}`}
                    >
                      <div className="task-main">
                        <label className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <div className="task-info">
                          <span className="task-label">{task.label}</span>
                          {completed && completionDate && (
                            <span className="completion-date">
                              Completed: {completionDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-notes">
                        <input
                          type="text"
                          placeholder="Add notes..."
                          value={taskNotes}
                          onChange={(e) =>
                            updateTaskNotes(task.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilityReportPage;
