import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Connect from "./Connect";
import "./Header.css";

function Header() {
  const location = useLocation();
  const pathname = location?.pathname || '/';
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <nav className="main-nav">
          <Link to="/" className="logo">Bella Toka</Link>
          <ul className="nav-links">
            <li>
              <Link to="/" className={pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/admin" className={pathname === '/admin' ? 'active' : ''}>
                Admin
              </Link>
            </li>
            <li>
              <button className="connect-btn" onClick={() => setIsConnectOpen(true)}>
                Connect
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <Connect isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
    </>
  );
}

export default Header;
