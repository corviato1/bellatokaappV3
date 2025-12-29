
import React from 'react';
import './Contact.css';

const Contact = () => {
  const handleInventorySubmit = (e) => {
    e.preventDefault();
    // Handle inventory form submission
  };

  const handleWeb3Submit = (e) => {
    e.preventDefault();
    // Handle web3 form submission
  };

  return (
    <div className="contact-container">
      <div className="form-section inventory-form">
        <h2 className="form-title">Sign up for Inventory and Journal Access</h2>
        <form onSubmit={handleInventorySubmit}>
          <div className="form-group">
            <select className="form-control" required>
              <option value="">Account Type</option>
              <option value="type1">Type 1</option>
              <option value="type2">Type 2</option>
            </select>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="at-symbol">@</span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="User Name *" 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email *" 
              pattern=".*@bellatoka\.com"
              required 
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      <div className="form-section web3-form">
        <h2 className="form-title">Web3 Sign-Up</h2>
        <form onSubmit={handleWeb3Submit}>
          <div className="form-group">
            <select className="form-control" required>
              <option value="">Wallet Choice</option>
              <option value="wallet1">Wallet 1</option>
              <option value="wallet2">Wallet 2</option>
            </select>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="at-symbol">@</span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="User Name *" 
                required 
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
