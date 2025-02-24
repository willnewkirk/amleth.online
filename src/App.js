import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Portfolio from './components/Portfolio';
import Store from './components/Store';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App; 