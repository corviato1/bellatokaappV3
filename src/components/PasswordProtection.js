import React, { useState } from "react";
import "../styles/PasswordProtection.css";

const PasswordProtection = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/auth", {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("authenticated", "true");
        onAuthenticated();
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="password-protection">
      <div className="password-container">
        <div className="password-header">
          <h1>Bella Toka</h1>
          <p>This site is password protected</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="password-input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="password-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Submit"}
          </button>

          <div className="animated-circle-container">
            <div className="animated-circle"></div>
          </div>

          {error && <div className="password-error">{error}</div>}
        </form>

        <div className="password-footer">
          <p>Cannabis Cultivation Tracking System</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
