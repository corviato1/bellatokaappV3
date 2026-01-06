import React, { useState } from "react";
import "../styles/Connect.css";

const Connect = ({ isOpen, onClose }) => {
  const [view, setView] = useState("main");
  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [ensOptions, setEnsOptions] = useState([]);
  const [selectedEns, setSelectedEns] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", loginData);
    alert("Login functionality coming soon!");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Signup attempt:", signupData);
    alert("Signup functionality coming soon!");
  };

  const handleMetamask = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Metamask is not installed. Please install Metamask to continue.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);

      const mockEnsNames = ["bellatoka.eth", "grower.eth"];
      if (mockEnsNames.length > 0) {
        setEnsOptions(mockEnsNames);
        setView("ens");
      } else {
        alert("Wallet connected successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Metamask connection error:", error);
      alert("Failed to connect to Metamask");
    }
  };

  const handleEnsSelect = () => {
    if (selectedEns) {
      console.log("Selected ENS:", selectedEns);
      alert(`Connected with ${selectedEns}!`);
      onClose();
    }
  };

  const renderMainView = () => (
    <div className="modal-content">
      <div className="modal-header">
        <h2>Connect</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <div className="connect-options">
          <button className="connect-option" onClick={() => setView("login")}>
            <span className="option-icon">📧</span>
            <span>Login with Email or Phone</span>
          </button>
          <button className="connect-option" onClick={() => setView("signup")}>
            <span className="option-icon">📝</span>
            <span>Sign Up</span>
          </button>
          <button className="connect-option metamask" onClick={handleMetamask}>
            <span className="option-icon">🦊</span>
            <span>Connect with Metamask</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoginView = () => (
    <div className="modal-content">
      <div className="modal-header">
        <button className="back-btn" onClick={() => setView("main")}>
          &larr;
        </button>
        <h2>Login</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              placeholder="Enter email or phone number"
              value={loginData.emailOrPhone}
              onChange={(e) =>
                setLoginData({ ...loginData, emailOrPhone: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
        <p className="switch-link">
          Don't have an account?{" "}
          <button onClick={() => setView("signup")}>Sign Up</button>
        </p>
      </div>
    </div>
  );

  const renderSignupView = () => (
    <div className="modal-content">
      <div className="modal-header">
        <button className="back-btn" onClick={() => setView("main")}>
          &larr;
        </button>
        <h2>Sign Up</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={signupData.phone}
              onChange={(e) =>
                setSignupData({ ...signupData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>
        <p className="switch-link">
          Already have an account?{" "}
          <button onClick={() => setView("login")}>Login</button>
        </p>
      </div>
    </div>
  );

  const renderEnsView = () => (
    <div className="modal-content">
      <div className="modal-header">
        <button className="back-btn" onClick={() => setView("main")}>
          &larr;
        </button>
        <h2>Select ENS Name</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <p className="ens-description">
          We found the following ENS names in your wallet. Would you like to
          connect one to your account?
        </p>
        <div className="ens-options">
          {ensOptions.map((ens, idx) => (
            <label
              key={idx}
              className={`ens-option ${selectedEns === ens ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="ens"
                value={ens}
                checked={selectedEns === ens}
                onChange={(e) => setSelectedEns(e.target.value)}
              />
              <span>{ens}</span>
            </label>
          ))}
        </div>
        <div className="ens-actions">
          <button
            className="submit-btn"
            onClick={handleEnsSelect}
            disabled={!selectedEns}
          >
            Connect with ENS
          </button>
          <button className="skip-btn" onClick={onClose}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {view === "main" && renderMainView()}
        {view === "login" && renderLoginView()}
        {view === "signup" && renderSignupView()}
        {view === "ens" && renderEnsView()}
      </div>
    </div>
  );
};

export default Connect;
