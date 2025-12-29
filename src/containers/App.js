import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
// import Footer from '../components/Footer';
import Harvest2025 from './2025Harvest';
import Contact from './Contact';
import PesticideList from '../components/PesticideList';
import '../styles/global.css';
import '../styles/responsive.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/2025-harvest/applescotti/stats" />} />
          <Route path="/2025-harvest" element={<Navigate to="/2025-harvest/applescotti/stats" />} />
          <Route path="/2025-harvest/:strainName/:section" element={<Harvest2025 />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pesticide-list" element={<PesticideList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;