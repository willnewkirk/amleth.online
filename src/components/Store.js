import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Transitions.css';
import '../styles/Store.css';

function Store() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <StarryBackground />
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'monospace'
      }}>
        <p style={{
          fontSize: '2em',
          margin: 0
        }}>
          Coming Soon
        </p>
        <div className="loading-dots" style={{
          fontSize: '2em',
          margin: 0
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