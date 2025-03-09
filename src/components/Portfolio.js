import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Portfolio.css';

const Portfolio = () => {
    const navigate = useNavigate();

    return (
        <div className="portfolio-container">
            <StarryBackground />
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