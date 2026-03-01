import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Transitions.css';
import '../styles/Store.css';
import '../styles/LandingPage.css';

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
              Studio
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
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 900,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        zIndex: 1
      }}>
        <p style={{
          fontSize: '1.5em',
          margin: 0,
          whiteSpace: 'nowrap'
        }}>
          RESTOCKING JUNE 2026
        </p>
        <a 
          href="https://instagram.com/aml3th"
          target="_blank"
          rel="noopener noreferrer"
          className="landing-button"
          style={{ textDecoration: 'none', padding: '12px 14px' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Store; 