import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Portfolio.css';

const Portfolio = () => {
    const navigate = useNavigate();

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
            
            {/* Original Menu Cluster */}
            <div className="menu-container">
                <div className="top-menu-row">
                    <button 
                        className="menu-item"
                        onClick={() => navigate('/resume')}
                    >
                        Resume
                    </button>
                    <button 
                        className="menu-item"
                        onClick={() => navigate('/clothing')}
                    >
                        Clothing
                    </button>
                </div>
                <button 
                    className="menu-item"
                    onClick={() => navigate('/graffiti')}
                >
                    Graffiti
                </button>
            </div>
        </div>
    );
};

export default Portfolio; 