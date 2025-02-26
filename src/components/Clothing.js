import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const enlargedWidth = 500;
    const gap = 20;
    
    const pieces = [
        { src: '/graffiti/1.JPG', title: 'Piece One', year: '2023' },
        { src: '/graffiti/2.jpg', title: 'Piece Two', year: '2023' },
        { src: '/graffiti/3.jpg', title: 'Piece Three', year: '2023' },
        { src: '/graffiti/4.jpg', title: 'Piece Four', year: '2023' },
        { src: '/graffiti/5.jpg', title: 'Piece Five', year: '2023' },
        { src: '/graffiti/6.jpg', title: 'Piece Six', year: '2023' },
        { src: '/graffiti/7.jpg', title: 'Piece Seven', year: '2023' }
    ];

    const [enlargedId, setEnlargedId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const getInitialPosition = (index) => {
        const staggerX = 250;
        const centerX = (window.innerWidth - (imageWidth + (staggerX * 6))) / 2;
        const baseY = (window.innerHeight / 4);
        
        const arcHeight = -120;
        const x = centerX + (index * staggerX);
        const y = baseY + (Math.sin(index / (pieces.length - 1) * Math.PI) * arcHeight);
        
        return { x, y };
    };

    const [images, setImages] = useState(
        pieces.map((piece, i) => ({
            id: i,
            ...piece,
            width: imageWidth,
            height: imageWidth,
            ...getInitialPosition(i),
            zIndex: 7 - i
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

    const handleImageClick = (id) => {
        if (enlargedId === id) {
            setEnlargedId(null);
        } else {
            setEnlargedId(id);
            bringToFront(id);
        }
    };

    const handleArrowClick = (direction) => {
        setCurrentIndex(prev => {
            const newIndex = direction === 'next' 
                ? (prev + 1) % images.length 
                : (prev - 1 + images.length) % images.length;
            
            setImages(prevImages => prevImages.map((img, i) => ({
                ...img,
                ...getInitialPosition((i - newIndex + images.length) % images.length)
            })));
            
            return newIndex;
        });
        setEnlargedId(null);
    };

    return (
        <div className="clothing-container">
            <div className="header-container">
                <div className="header-nav">
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
            <div className="carousel-container">
                <div className="carousel-section">
                    <div 
                        className="carousel-arrow left"
                        onClick={() => handleArrowClick('prev')}
                    >
                        <ArrowLeft />
                    </div>
                    <div 
                        className="carousel-arrow right"
                        onClick={() => handleArrowClick('next')}
                    >
                        <ArrowRight />
                    </div>
                    {images.map((image) => (
                        <div 
                            key={image.id}
                            className={`draggable-image-container ${enlargedId === image.id ? 'enlarged' : ''}`}
                            style={{
                                position: 'absolute',
                                left: `${enlargedId === image.id ? (window.innerWidth - enlargedWidth) / 2 : image.x}px`,
                                top: `${enlargedId === image.id ? (window.innerHeight - enlargedWidth) / 2 : image.y}px`,
                                width: `${enlargedId === image.id ? enlargedWidth : image.width}px`,
                                height: `${enlargedId === image.id ? enlargedWidth : image.height}px`,
                                zIndex: enlargedId === image.id ? 2000 : image.zIndex,
                                transform: `rotate(${enlargedId === image.id ? 0 : image.id * 2 - 7}deg)`,
                            }}
                            onMouseEnter={() => bringToFront(image.id)}
                            onClick={() => handleImageClick(image.id)}
                        >
                            <div className="image-wrapper">
                                <img 
                                    src={image.src}
                                    alt={`Clothing piece ${image.id + 1}`}
                                    className="gallery-image"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="content-wrapper piece-info">
                    <div className="typewriter piece-title">
                        <span className="nav-button">{images[currentIndex].title}</span>
                    </div>
                    <div className="typewriter piece-year">
                        <span className="nav-button">{images[currentIndex].year}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clothing; 