import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sectionsData from "../data/location/sections.json";
import plantsData from "../data/location/plants.json";
import locationDataFile from "../data/location/locationData.json";
import "../styles/LocationPage.css";

const LocationPage = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    stats: false,
    nutrients: false,
    pestManagement: false,
    images: false,
  });
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const { sections } = sectionsData;
  const { plants } = plantsData;
  const { entries } = locationDataFile;

  const section = sections.find((s) => s.id === locationId);
  const sectionIndex = sections.findIndex((s) => s.id === locationId);

  const locationEntries = useMemo(() => {
    return entries
      .filter((e) => e.locationId === locationId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, locationId]);

  const currentPlant = plants.find(
    (p) => p.currentLocation === locationId && p.status === "active"
  );

  const handleNavigation = (direction) => {
    if (direction === "prev" && sectionIndex > 0) {
      navigate(`/location/${sections[sectionIndex - 1].id}`);
    } else if (direction === "next" && sectionIndex < sections.length - 1) {
      navigate(`/location/${sections[sectionIndex + 1].id}`);
    }
  };

  const toggleFilter = (filterKey) => {
    const exclusiveFilters = ["nutrients", "pestManagement", "images"];

    if (exclusiveFilters.includes(filterKey)) {
      setFilters((prev) => ({
        stats: false,
        nutrients: false,
        pestManagement: false,
        images: false,
        [filterKey]: !prev[filterKey],
      }));
    } else {
      setFilters((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }));
    }
  };

  const hideSchedule =
    filters.stats ||
    filters.nutrients ||
    filters.pestManagement ||
    filters.images;

  const getStatsMetrics = () => {
    if (locationEntries.length === 0) return null;

    const latestEntry = locationEntries[0];
    const previousEntry =
      locationEntries.length > 1 ? locationEntries[1] : null;

    const currentMetrics = latestEntry?.stats?.metrics || {};
    const previousMetrics = previousEntry?.stats?.metrics || {};

    return {
      current: currentMetrics,
      previous: previousMetrics,
      week: latestEntry?.week || "--",
      previousWeek: previousEntry?.week || null,
      timeline: latestEntry?.stats?.timeline || [],
      notes: latestEntry?.stats?.notes || "",
    };
  };

  const getTrend = (current, previous) => {
    if (
      current === undefined ||
      current === null ||
      previous === undefined ||
      previous === null
    )
      return null;
    const curr = parseFloat(current);
    const prev = parseFloat(previous);
    if (isNaN(curr) || isNaN(prev)) return null;
    if (curr > prev) return "up";
    if (curr < prev) return "down";
    return "same";
  };

  const metricsTemplate = [
    {
      key: "temperature",
      label: "Temperature",
      unit: "°F",
      isComplex: true,
      dayNight: true,
    },
    {
      key: "humidity",
      label: "Humidity",
      unit: "%",
      isComplex: true,
      dayNight: true,
    },
    { key: "vpd", label: "VPD", unit: "kPa", isComplex: false },
    { key: "co2", label: "CO2", unit: "ppm", isComplex: false },
    { key: "ph", label: "pH", unit: "", isComplex: false },
    { key: "ec", label: "EC", unit: "mS/cm", isComplex: false },
    { key: "lightHours", label: "Light Hours", unit: "hrs", isComplex: false },
    {
      key: "lightIntensity",
      label: "Light Intensity",
      unit: "PPFD",
      isComplex: false,
    },
    { key: "waterAmount", label: "Water", unit: "gal", isComplex: false },
    { key: "runoff", label: "Runoff", unit: "%", isComplex: false },
  ];

  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);

    const days = [];
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      days.push({
        name: dayNames[i],
        date: date,
        dateStr: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getEntriesForDay = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return locationEntries.filter((entry) => entry.date === dateStr);
  };

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

  if (!section) {
    return (
      <div className="location-page">
        <h1>Location not found</h1>
      </div>
    );
  }

  return (
    <div className="location-page">
      <div className="location-header">
        <button
          className="nav-button prev"
          onClick={() => handleNavigation("prev")}
          disabled={sectionIndex === 0}
        >
          LAST
        </button>
        <div className="header-center">
          <h1>{section.name}</h1>
          <span className={`section-type ${section.type}`}>{section.type}</span>
        </div>
        <button
          className="nav-button next"
          onClick={() => handleNavigation("next")}
          disabled={sectionIndex === sections.length - 1}
        >
          NEXT
        </button>
      </div>

      {currentPlant && (
        <div
          className="current-plant-banner"
          onClick={() =>
            navigate(`/plant/${currentPlant.id}-${currentPlant.strain}/stats`)
          }
        >
          <span className="plant-strain">{currentPlant.strainDisplay}</span>
          <span className="plant-id">ID: {currentPlant.id}</span>
          <span className="view-lifecycle">View Full Lifecycle</span>
        </div>
      )}

      <div className="filter-bar">
        <span>Show:</span>
        <button
          className={`filter-btn ${filters.stats ? "active" : ""}`}
          onClick={() => toggleFilter("stats")}
        >
          Stats
        </button>
        <button
          className={`filter-btn ${filters.nutrients ? "active" : ""}`}
          onClick={() => toggleFilter("nutrients")}
        >
          Nutrients
        </button>
        <button
          className={`filter-btn ${filters.pestManagement ? "active" : ""}`}
          onClick={() => toggleFilter("pestManagement")}
        >
          Pest Management
        </button>
        <button
          className={`filter-btn ${filters.images ? "active" : ""}`}
          onClick={() => toggleFilter("images")}
        >
          Images
        </button>
      </div>

      <div className={`content-layout ${hideSchedule ? "full-width" : ""}`}>
        {!hideSchedule && (
          <div className="week-schedule">
            <h3>Weekly Schedule</h3>
            <div className="schedule-list">
              {weekDays.map((day, idx) => {
                const dayEntries = getEntriesForDay(day.date);
                const isSelected = selectedDay === idx;
                return (
                  <div key={idx}>
                    <div
                      className={`schedule-day ${isSelected ? "active" : ""} ${
                        dayEntries.length > 0 ? "has-entries" : ""
                      }`}
                      onClick={() => setSelectedDay(isSelected ? null : idx)}
                    >
                      <span className="day-name">{day.name}</span>
                      <span className="day-date">{day.dateStr}</span>
                    </div>
                    {isSelected && (
                      <div className="day-details">
                        <h4>Notes & Tasks</h4>
                        {dayEntries.length === 0 ? (
                          <p className="no-entries">No entries for this day</p>
                        ) : (
                          <div className="day-tasks">
                            {dayEntries.map((entry, entryIdx) => (
                              <div key={entryIdx}>
                                {entry.stats?.timeline?.map((task, taskIdx) => (
                                  <div key={taskIdx} className="day-task">
                                    <div className="task-label">
                                      {task.label}
                                    </div>
                                    {task.notes && (
                                      <div className="task-notes">
                                        {task.notes}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {entry.stats?.notes && (
                                  <div className="day-task">
                                    <div className="task-label">Notes</div>
                                    <div className="task-notes">
                                      {entry.stats.notes}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hideSchedule && (
          <div className="full-content">
            {filters.stats && (
              <div className="static-section stats-panel">
                {(() => {
                  const statsData = getStatsMetrics();
                  if (
                    !statsData ||
                    Object.keys(statsData.current).length === 0
                  ) {
                    return <p className="no-data">No stats data available</p>;
                  }
                  return (
                    <>
                      <div className="stats-header">
                        <h3>Week {statsData.week} Metrics</h3>
                        {statsData.previousWeek && (
                          <span className="compare-label">
                            vs Week {statsData.previousWeek}
                          </span>
                        )}
                      </div>

                      <div className="metrics-grid">
                        {metricsTemplate.map((metric) => {
                          const currentVal = statsData.current[metric.key];
                          const previousVal = statsData.previous[metric.key];

                          if (currentVal === undefined) return null;

                          if (
                            metric.dayNight &&
                            typeof currentVal === "object"
                          ) {
                            const dayTrend = getTrend(
                              currentVal.day,
                              previousVal?.day
                            );
                            const nightTrend = getTrend(
                              currentVal.night,
                              previousVal?.night
                            );
                            return (
                              <div
                                key={metric.key}
                                className="metric-card complex"
                              >
                                <div className="metric-label">
                                  {metric.label}
                                </div>
                                <div className="metric-row">
                                  <span className="period">Day:</span>
                                  <span className="metric-value">
                                    {currentVal.day}
                                    {metric.unit}
                                    {dayTrend && (
                                      <span className={`trend ${dayTrend}`}>
                                        {dayTrend === "up"
                                          ? "↑"
                                          : dayTrend === "down"
                                          ? "↓"
                                          : "→"}
                                      </span>
                                    )}
                                  </span>
                                  {previousVal?.day !== undefined && (
                                    <span className="metric-previous">
                                      was {previousVal.day}
                                      {metric.unit}
                                    </span>
                                  )}
                                </div>
                                <div className="metric-row">
                                  <span className="period">Night:</span>
                                  <span className="metric-value">
                                    {currentVal.night}
                                    {metric.unit}
                                    {nightTrend && (
                                      <span className={`trend ${nightTrend}`}>
                                        {nightTrend === "up"
                                          ? "↑"
                                          : nightTrend === "down"
                                          ? "↓"
                                          : "→"}
                                      </span>
                                    )}
                                  </span>
                                  {previousVal?.night !== undefined && (
                                    <span className="metric-previous">
                                      was {previousVal.night}
                                      {metric.unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          const trend = getTrend(currentVal, previousVal);
                          return (
                            <div key={metric.key} className="metric-card">
                              <div className="metric-label">{metric.label}</div>
                              <div className="metric-value">
                                {currentVal}
                                {metric.unit}
                                {trend && (
                                  <span className={`trend ${trend}`}>
                                    {trend === "up"
                                      ? " ↑"
                                      : trend === "down"
                                      ? " ↓"
                                      : " →"}
                                  </span>
                                )}
                              </div>
                              {previousVal !== undefined && (
                                <div className="metric-previous">
                                  was {previousVal}
                                  {metric.unit}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {statsData.timeline.length > 0 && (
                        <div className="timeline-section">
                          <h4>Activity Timeline</h4>
                          <div className="timeline-list">
                            {statsData.timeline.map((item, idx) => (
                              <div
                                key={idx}
                                className={`timeline-item ${item.status}`}
                              >
                                <span className="timeline-label">
                                  {item.label}
                                </span>
                                <span className="timeline-date">
                                  {item.date}
                                </span>
                                {item.notes && (
                                  <span className="timeline-notes">
                                    {item.notes}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {statsData.notes && (
                        <div className="stats-notes-section">
                          <h4>Notes</h4>
                          <p>{statsData.notes}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {filters.nutrients && (
              <div className="static-section">
                <h3>Nutrients</h3>
                <div className="nutrients-grid">
                  {(() => {
                    const allNutrients = [];
                    const seen = new Set();
                    locationEntries.forEach((entry) => {
                      (entry.nutrients || []).forEach((n) => {
                        if (!seen.has(n.name)) {
                          seen.add(n.name);
                          allNutrients.push(n);
                        }
                      });
                    });
                    if (allNutrients.length === 0) {
                      return <p className="no-data">No nutrients recorded</p>;
                    }
                    return allNutrients.map((nutrient, idx) => (
                      <div
                        key={idx}
                        className={`nutrient-item ${
                          selectedNutrient === nutrient.image ? "selected" : ""
                        }`}
                        onClick={() =>
                          setSelectedNutrient(
                            selectedNutrient === nutrient.image
                              ? null
                              : nutrient.image
                          )
                        }
                      >
                        {nutrient.name}
                      </div>
                    ));
                  })()}
                </div>
                {selectedNutrient && (
                  <div className="nutrient-image-container">
                    <img
                      src={getNutrientImage(selectedNutrient)}
                      alt={selectedNutrient}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            )}

            {filters.pestManagement && (
              <div className="static-section">
                <h3>Pest Management</h3>
                <div className="pest-grid">
                  {(() => {
                    const allPest = [];
                    const seen = new Set();
                    locationEntries.forEach((entry) => {
                      (entry.pestManagement || []).forEach((p) => {
                        if (!seen.has(p.name)) {
                          seen.add(p.name);
                          allPest.push(p);
                        }
                      });
                    });
                    if (allPest.length === 0) {
                      return (
                        <p className="no-data">No pest management recorded</p>
                      );
                    }
                    return allPest.map((item, idx) => (
                      <div key={idx} className="pest-item">
                        <img src={getPestImage(item.image)} alt={item.name} />
                        <span>{item.name}</span>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Info
                          </a>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {filters.images && (
              <div className="static-section">
                <h3>Images</h3>
                <div className="images-grid">
                  {(() => {
                    const locationFolder = locationId.toUpperCase();
                    const imageFiles = [];

                    for (let i = 1; i <= 13; i++) {
                      const imgName = String(i).padStart(3, "0") + ".png";
                      try {
                        const imgSrc = require(`../images/location/${locationFolder}/${imgName}`);
                        imageFiles.push({ src: imgSrc, name: imgName });
                      } catch {}
                    }

                    if (imageFiles.length === 0) {
                      return (
                        <p className="no-data">
                          No images available for this location
                        </p>
                      );
                    }

                    return imageFiles.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.src}
                        alt={`${section.name} ${idx + 1}`}
                      />
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
