import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/Portfolio.css';
import '../styles/LandingPage.css';

const Portfolio = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        display: 'flex',
        gap: '40px',
        flexDirection: 'row'
      }}>
        <button 
          className="header-button"
          onClick={() => navigate('/resume')}
          style={{ fontSize: '24px' }}
        >
          Resume
        </button>
        <button 
          className="header-button"
          onClick={() => navigate('/graffiti')}
          style={{ fontSize: '24px' }}
        >
          Graffiti
        </button>
      </div>
    </div>
  );
};

export default Portfolio; 