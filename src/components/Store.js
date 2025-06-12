import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Transitions.css';
import '../styles/Store.css';

function Store() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'black' }}>
      <StarryBackground />
      {/* Header Navigation */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <div className="header-container">
          <div className="header-nav">
            <button 
              className="header-button"
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button 
              className="header-button"
              onClick={() => navigate('/portfolio')}
            >
              Portfolio
            </button>
            <button 
              className="header-button"
              onClick={() => navigate('/store')}
            >
              Store
            </button>
          </div>
          <img 
            src="/am.png" 
            alt="AM Logo" 
            className="header-logo"
            onClick={() => navigate('/')}
          />
        </div>
      </div>

      {/* Loading Container */}
      <div className="loading-container" style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'Special Elite', monospace",
        whiteSpace: 'nowrap',
        zIndex: 1
      }}>
        <p style={{
          fontSize: '2em',
          margin: 0,
          fontFamily: "'Special Elite', monospace"
        }}>
          Restocking
        </p>
        <div className="loading-dots" style={{
          fontSize: '2em',
          margin: 0,
          fontFamily: "'Special Elite', monospace"
        }}>
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      </div>
    </div>
  );
}

export default Store; 