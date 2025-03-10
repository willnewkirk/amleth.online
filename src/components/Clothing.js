import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import '../styles/Header.css';
import '../styles/Portfolio.css';
import '../styles/Clothing.css';
import '../styles/LandingPage.css';

const ArrowLeft = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M45 10L15 30L45 50" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
);

const ArrowRight = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M15 10L45 30L15 50" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
);

const Clothing = () => {
    const navigate = useNavigate();
    const imageWidth = 300;
    const enlargedWidth = window.innerWidth <= 768 ? window.innerWidth * 0.9 : 500; // Responsive enlarged width
    const currentImageWidth = 350;
    const gap = 20;
    
    const pieces = [
        { src: '/clothing/clothing1.jpg', title: 'THE SKY IS FALLING', year: '2022' },
        { src: '/clothing/clothing2.jpg', title: 'YA NO LLORES', year: '2022' },
        { src: '/clothing/clothing3.PNG', title: 'Nightmare Hoodie', year: '2021' },
        { src: '/clothing/clothing4.JPG', title: 'Unstoppable Chaos (Brown)', year: '2022' },
        { src: '/clothing/clothing5.JPG', title: 'Unstoppable Chaos (Black)', year: '2022' }
    ];

    const [enlargedId, setEnlargedId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(2);
    const [touchStart, setTouchStart] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getInitialPosition = (index) => {
        const staggerX = 250;
        const centerX = (window.innerWidth - (imageWidth + (staggerX * 4))) / 2 + 450;
        const baseY = (window.innerHeight / 4);
        
        const arcHeight = -120;
        const adjustedIndex = index - 2;
        const x = centerX + (adjustedIndex * staggerX);
        const y = baseY + (Math.sin((index / (pieces.length - 1)) * Math.PI) * arcHeight);
        
        return { x, y };
    };

    const [images, setImages] = useState(
        pieces.map((piece, i) => ({
            id: i,
            ...piece,
            width: i === 2 ? currentImageWidth : imageWidth,
            height: i === 2 ? currentImageWidth : imageWidth,
            ...getInitialPosition(i),
            zIndex: i === 2 ? 8 : 7 - Math.abs(i - 2)
        }))
    );

    const bringToFront = (id) => {
        if (!enlargedId) {
            setImages(prevImages => prevImages.map(img => ({
                ...img,
                zIndex: img.id === id ? 1000 : img.zIndex
            })));
        }
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleArrowClick = (direction) => {
        setCurrentIndex(prev => {
            const newIndex = direction === 'next' 
                ? (prev + 1) % images.length 
                : (prev - 1 + images.length) % images.length;
            
            setImages(prevImages => prevImages.map((img, i) => {
                const newPosition = (i - newIndex + 2 + images.length) % images.length;
                const isCenterImage = newPosition === 2;
                
                return {
                    ...img,
                    ...getInitialPosition(newPosition),
                    width: isCenterImage ? currentImageWidth : imageWidth,
                    height: isCenterImage ? currentImageWidth : imageWidth,
                    zIndex: isCenterImage ? 8 : 7 - Math.abs(newPosition - 2)
                };
            }));
            
            return newIndex;
        });
        setEnlargedId(null);
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
                handleArrowClick('next');
            } else {
                handleArrowClick('prev');
            }
            setTouchStart(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStart(null);
    };

    return (
        <div>
            <div className="header-container" style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000
            }}>
                <div className="header-nav">
                    <button 
                        className="header-button"
                        onClick={() => navigate('/store')}
                    >
                        Store
                    </button>
                    <button 
                        className="header-button"
                        onClick={() => navigate('/portfolio')}
                    >
                        Portfolio
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
                className="clothing-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    paddingTop: '60px' // Add space for nav and logo
                }}
            >
                <StarryBackground />
                <div className="carousel-container">
                    <div className="carousel-section">
                        <button className="arrow-button left desktop-only" onClick={() => handleArrowClick('prev')}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="arrow-button right desktop-only" onClick={() => handleArrowClick('next')}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {images.map((image) => (
                            <div 
                                key={image.id}
                                className={`draggable-image-container ${enlargedId === image.id ? 'enlarged' : ''}`}
                                style={{
                                    position: enlargedId === image.id ? 'fixed' : 'absolute',
                                    width: `${enlargedId === image.id ? enlargedWidth : image.width}px`,
                                    height: `${enlargedId === image.id ? enlargedWidth : image.height}px`,
                                    ...(enlargedId !== image.id && {
                                        left: `${image.x}px`,
                                        top: `${image.y}px`,
                                        transform: `rotate(${image.id * 2 - 7}deg)`
                                    })
                                }}
                                onMouseEnter={() => bringToFront(image.id)}
                                onClick={() => handleImageClick(image)}
                            >
                                <div className="image-wrapper">
                                    <img 
                                        src={image.src}
                                        alt={`Clothing piece ${image.id + 1}`}
                                        className={`gallery-image ${selectedImage === image.src ? 'enlarged-image' : ''}`}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="content-wrapper piece-info">
                        <div className="piece-title">
                            <span className="nav-button">{images[currentIndex].title}</span>
                        </div>
                        <div className="piece-year">
                            <span className="nav-button">{images[currentIndex].year}</span>
                        </div>
                    </div>
                </div>
                
                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <img 
                            src={images[currentIndex].src} 
                            alt="Clothing" 
                            className="modal-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clothing; 