import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Portfolio.css';
import '../styles/GraffitiGallery.css';

const GraffitiGallery = () => {
    const navigate = useNavigate();
    const imageWidth = 300;
    const currentImageWidth = 350;
    
    const pieces = [
        { src: '/graffiti/1.JPG', title: 'PAPER MILL (2025)' },
        { src: '/graffiti/2.jpg', title: 'DRAIN (2023)' },
        { src: '/graffiti/4.jpg', title: "HAMM'S BREWERY (2022)" },
        { src: '/graffiti/5.jpg', title: "HAMM'S BREWERY (2021)" },
        { src: '/graffiti/6.jpg', title: "HAMM'S BREWERY (2022)" },
        { src: '/graffiti/7.jpg', title: "HAMM'S BREWERY (2021)" }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isModalOpen) return;
            if (e.key === 'ArrowLeft') {
                setCurrentIndex(prev => (prev - 1 + pieces.length) % pieces.length);
            } else if (e.key === 'ArrowRight') {
                setCurrentIndex(prev => (prev + 1) % pieces.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, pieces.length]);

    const centerPos = 2;

    const getPositionForIndex = (displayIndex) => {
        const isMobile = window.innerWidth <= 768;
        const staggerX = isMobile ? 60 : 120;
        const centerX = window.innerWidth / 2;
        const baseY = window.innerHeight * 0.22;
        
        const arcHeight = isMobile ? -30 : -60;
        const offsetFromCenter = displayIndex - centerPos;
        const x = centerX + (offsetFromCenter * staggerX) - (currentImageWidth / 2);
        const y = baseY + (Math.sin((displayIndex / (pieces.length - 1)) * Math.PI) * arcHeight);
        
        return { x, y };
    };

    const getImageState = (imageIndex) => {
        const displayIndex = (imageIndex - currentIndex + centerPos + pieces.length) % pieces.length;
        const isCurrent = displayIndex === centerPos;
        const position = getPositionForIndex(displayIndex);
        
        return {
            ...position,
            width: isCurrent ? currentImageWidth : imageWidth,
            height: isCurrent ? currentImageWidth : imageWidth,
            zIndex: isCurrent ? 100 : 10 - Math.abs(displayIndex - centerPos),
            rotation: (displayIndex - centerPos) * 2.5,
            opacity: Math.abs(displayIndex - centerPos) <= 3 ? 1 : 0
        };
    };

    const handleSwipe = (direction) => {
        setCurrentIndex(prev => {
            if (direction === 'next') {
                return (prev + 1) % pieces.length;
            } else {
                return (prev - 1 + pieces.length) % pieces.length;
            }
        });
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!touchStart) return;
        
        const currentTouch = e.touches[0].clientX;
        const diff = touchStart - currentTouch;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleSwipe('next');
            } else {
                handleSwipe('prev');
            }
            setTouchStart(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStart(null);
    };

    const handleMouseDown = (e) => {
        setTouchStart(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!touchStart) return;
        const diff = touchStart - e.clientX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleSwipe('next');
            } else {
                handleSwipe('prev');
            }
            setTouchStart(null);
        }
    };

    const handleMouseUp = () => {
        setTouchStart(null);
    };

    return (
        <div className="graffiti-page">
            <StarryBackground />
            <div className="header-container" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 200
            }}>
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
            
            <div 
                className="graffiti-carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="carousel-images">
                    {pieces.map((piece, index) => {
                        const state = getImageState(index);
                        return (
                            <div 
                                key={index}
                                className="graffiti-image-wrapper"
                                style={{
                                    position: 'absolute',
                                    left: `${state.x}px`,
                                    top: `${state.y}px`,
                                    width: `${state.width}px`,
                                    height: `${state.height}px`,
                                    zIndex: state.zIndex,
                                    transform: `rotate(${state.rotation}deg)`,
                                    opacity: state.opacity,
                                    transition: 'all 0.4s ease-out'
                                }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <img 
                                    src={piece.src}
                                    srcSet={piece.src.endsWith('.jpg') ? `${piece.src.replace('/graffiti/', '/graffiti/mobile/')} 800w, ${piece.src} 1600w` : undefined}
                                    sizes="(max-width: 768px) 300px, 500px"
                                    alt={piece.title}
                                    className="graffiti-stack-image"
                                    draggable={false}
                                />
                            </div>
                        );
                    })}
                </div>
                
                <div className="graffiti-info">
                    <h2 className="graffiti-title">{pieces[currentIndex].title}</h2>
                </div>

                <div className="graffiti-dots">
                    {pieces.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>

                <p className="swipe-hint">Swipe to browse</p>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <img 
                        src={pieces[currentIndex].src} 
                        alt={pieces[currentIndex].title}
                        className="modal-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default GraffitiGallery;
