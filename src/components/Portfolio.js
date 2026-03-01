import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Portfolio.css';
import '../styles/LandingPage.css';

const Portfolio = () => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const previewImages = [
        '/graffiti/1.JPG',
        '/clothing/clothing1.jpg',
        '/graffiti/2.jpg',
        '/clothing/clothing2.jpg',
        '/graffiti/3.jpg',
        '/clothing/clothing3.PNG',
        '/graffiti/4.jpg',
        '/clothing/clothing4.JPG',
        '/graffiti/5.jpg',
        '/clothing/clothing5.JPG',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % previewImages.length);
                setIsTransitioning(false);
            }, 200);
        }, 1000);

        return () => clearInterval(interval);
    }, [previewImages.length]);

    const handleTouch = (event) => {
        const element = event.currentTarget;
        element.classList.add('touched');
        setTimeout(() => {
            element.classList.remove('touched');
        }, 300);
    };

    return (
        <div className="portfolio-container">
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
            
            {/* Menu Cluster */}
            <div className="studio-menu-container">
                {/* Rotating Preview Image */}
                <div className="preview-image-container">
                    <img 
                        src={previewImages[currentImageIndex]}
                        alt="Preview"
                        className={`preview-image ${isTransitioning ? 'fade-out' : 'fade-in'}`}
                    />
                </div>
                
                <div className="studio-menu-row">
                    <button 
                        className="landing-button"
                        onClick={() => navigate('/graffiti')}
                        onTouchStart={handleTouch}
                    >
                        Graffiti
                    </button>
                    <button 
                        className="landing-button"
                        onClick={() => navigate('/clothing')}
                        onTouchStart={handleTouch}
                    >
                        Clothing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Portfolio; 