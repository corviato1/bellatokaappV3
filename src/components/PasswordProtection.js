import React, { useState } from 'react';
import '../styles/PasswordProtection.css';

const PasswordProtection = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setError('Password verification requires Netlify deployment');
    }, 1500);
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
          
          <button type="submit" className="password-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Submit'}
          </button>
          
          <div className="animated-circle-container">
            <div className="animated-circle"></div>
          </div>
          
          {error && <div className="password-error">{error}</div>}
        </form>
        
        <div className="password-footer">
          <p>Powered by Netlify Identity</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
