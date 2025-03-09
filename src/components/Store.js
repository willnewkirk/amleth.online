import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Transitions.css';
import '../styles/Store.css';

function Store() {
  const navigate = useNavigate();

  return (
    <div className="page-transition" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <StarryBackground />
      <div className="header-container">
        <div className="header-nav">
          <button 
            className="header-button"
            onClick={() => navigate('/portfolio')}
          >
            Portfolio
          </button>
          <button className="header-button">Store</button>
        </div>
        <img 
          src="/am.png" 
          alt="AM Logo" 
          className="header-logo"
          onClick={() => navigate('/')}
        />
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        fontFamily: 'Special Elite, monospace'
      }}>
        <div style={{ 
          fontSize: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>Coming Soon</span>
          <div style={{ display: 'inline-flex', marginLeft: '8px' }}>
            <span className="dot-1">.</span>
            <span className="dot-2">.</span>
            <span className="dot-3">.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store; 