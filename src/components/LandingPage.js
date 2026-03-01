import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [onlineText, setOnlineText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const typeText = (text, setText, delay) => {
      return new Promise((resolve) => {
        let index = 0;
        setTimeout(() => {
          const interval = setInterval(() => {
            if (index < text.length) {
              setText(text.slice(0, index + 1));
              index++;
            } else {
              clearInterval(interval);
              resolve();
            }
          }, 150);
        }, delay);
      });
    };

    const animateText = async () => {
      await typeText('Online', setOnlineText, 500);
    };

    animateText();

    return () => {
      setOnlineText('');
    };
  }, []);

  const handleTouch = (event) => {
    const element = event.currentTarget;
    element.classList.add('touched');
    setTimeout(() => {
      element.classList.remove('touched');
    }, 300);
  };

  const handleHover = (hovering) => {
    setIsHovered(hovering);
  };

  return (
    <div className="landing-container">
      <StarryBackground showPlanets={true} />
      <div className="content-wrapper">
        <div 
          className="logo-online-container"
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          onClick={() => navigate('/')}
          onTouchStart={handleTouch}
        >
          <div className={`image-container ${isHovered ? 'hovered' : ''}`}>
            <img src="/am.png" alt="AM Logo" className="logo" />
          </div>
          <div className={`online-text ${isHovered ? 'hovered' : ''}`}>
            <span className="nav-button online-label">
              {onlineText || '\u00A0'}
            </span>
          </div>
        </div>
        <div className="button-container">
          <button 
            className="landing-button" 
            onClick={() => navigate('/portfolio')}
            onTouchStart={handleTouch}
          >
            Studio
          </button>
          <button 
            className="landing-button"
            onClick={() => navigate('/store')} 
            onTouchStart={handleTouch}
          >
            Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 