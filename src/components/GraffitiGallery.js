import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import '../styles/Header.css';
import '../styles/Portfolio.css';
import '../styles/GraffitiGallery.css';

const GraffitiGallery = () => {
    const navigate = useNavigate();
    const imageWidth = 300;
    const gap = 20;
    
    // Calculate positions for two rows: 4 on top, 3 on bottom
    const getInitialPosition = (index) => {
        const isTopRow = index < 4;
        
        if (isTopRow) {
            // Top row with 4 images
            const topRowWidth = (imageWidth * 4) + (gap * 3);
            const startX = Math.max(20, (window.innerWidth - topRowWidth) / 2 - 50);
            return {
                x: startX + (index * (imageWidth + gap)),
                y: 80
            };
        } else {
            // Bottom row with 3 images
            const bottomRowWidth = (imageWidth * 3) + (gap * 2);
            const startX = Math.max(20, (window.innerWidth - bottomRowWidth) / 2 - 50);
            const bottomIndex = index - 4;
            return {
                x: startX + (bottomIndex * (imageWidth + gap)),
                y: 80 + imageWidth + gap
            };
        }
    };
    
    const imageUrls = [
        '/graffiti/1.png',
        '/graffiti/2.png',
        '/graffiti/3.png',
        '/graffiti/4.png',
        '/graffiti/5.png',
        '/graffiti/6.png',
        '/graffiti/7.png'
    ];
    
    const [images, setImages] = useState(
        Array.from({length: 7}, (_, i) => ({
            id: i,
            src: imageUrls[i],
            width: imageWidth,
            height: imageWidth,
            ...getInitialPosition(i),
            zIndex: 1
        }))
    );

    const bringToFront = (id) => {
        setImages(prevImages => prevImages.map(img => ({
            ...img,
            zIndex: img.id === id ? 1000 : 1
        })));
    };

    const handleMouseEnter = (id) => {
        bringToFront(id);
    };

    const handleResize = (id, startEvent) => {
        startEvent.stopPropagation();
        
        const image = images.find(img => img.id === id);
        if (!image) return;

        const container = startEvent.target.closest('.draggable-image-container');
        const startRect = container.getBoundingClientRect();
        const startWidth = startRect.width;
        const startHeight = startRect.height;
        const startX = startEvent.clientX;
        const startY = startEvent.clientY;

        const mouseMoveHandler = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            const newWidth = Math.max(100, startWidth + deltaX);
            const newHeight = Math.max(100, startHeight + deltaY);
            
            const aspectRatio = startWidth / startHeight;
            const finalWidth = newWidth;
            const finalHeight = newWidth / aspectRatio;

            setImages(prevImages => prevImages.map(img =>
                img.id === id
                    ? { ...img, width: finalWidth, height: finalHeight }
                    : img
            ));
        };

        const mouseUpHandler = () => {
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
        };

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
    };

    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white', overflow: 'hidden' }}>
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
            <div style={{ 
                position: 'relative', 
                height: 'calc(100vh - 80px)',
                padding: '20px'
            }}>
                {images.map((image) => (
                    <Draggable
                        key={image.id}
                        defaultPosition={{x: image.x, y: image.y}}
                        bounds="parent"
                        onStart={() => bringToFront(image.id)}
                    >
                        <div 
                            className="draggable-image-container"
                            style={{
                                position: 'absolute',
                                width: `${image.width}px`,
                                height: `${image.height}px`,
                                zIndex: image.zIndex
                            }}
                            onClick={() => bringToFront(image.id)}
                            onMouseEnter={() => handleMouseEnter(image.id)}
                        >
                            <div className="image-wrapper">
                                <img 
                                    src={image.src}
                                    alt={`Graffiti artwork ${image.id + 1}`}
                                    className="gallery-image"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div 
                                    className="resize-handle"
                                    onMouseDown={handleResize.bind(null, image.id)}
                                >
                                    <div className="resize-arrow" />
                                </div>
                            </div>
                        </div>
                    </Draggable>
                ))}
            </div>
        </div>
    );
};

export default GraffitiGallery; 