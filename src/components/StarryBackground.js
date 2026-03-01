import React, { useEffect, useRef } from 'react';
import '../styles/StarryBackground.css';

const StarryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.imageSmoothingEnabled = false;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const stars = [];
        const clusters = [];
        const shootingStars = [];
        
        const driftSpeed = 1.4;
        const pixelSize = 3;
        
        // Regular stars with random twinkle capability
        for (let i = 0; i < 50; i++) {
            const isBright = Math.random() < 0.4;
            const fullFade = Math.random() < 0.4;
            stars.push({
                x: Math.floor(Math.random() * canvas.width / pixelSize) * pixelSize,
                y: Math.floor(Math.random() * canvas.height / pixelSize) * pixelSize,
                size: isBright ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 1) + 1,
                brightness: Math.random(),
                maxBrightness: isBright ? 1 : 0.7,
                twinkleSpeed: Math.random() * 0.002 + 0.001,
                offset: Math.random() * Math.PI * 2,
                fullFade: fullFade,
                isRandomTwinkling: false,
                randomTwinkleTime: 0,
                randomTwinkleDuration: 0,
                nextRandomTwinkle: Math.random() * 300 + 100
            });
        }

        // Clusters
        for (let i = 0; i < 4; i++) {
            const section = i % 4;
            const centerX = Math.floor((Math.random() * 0.4 + (section % 2) * 0.5) * canvas.width / pixelSize) * pixelSize;
            const centerY = Math.floor((Math.random() * 0.4 + Math.floor(section / 2) * 0.5) * canvas.height / pixelSize) * pixelSize;
            const clusterStars = [];
            const clusterOffset = Math.random() * Math.PI * 2;
            
            for (let j = 0; j < 4; j++) {
                const isBright = Math.random() < 0.4;
                const fullFade = Math.random() < 0.4;
                clusterStars.push({
                    x: Math.floor((centerX + (Math.random() - 0.5) * 100) / pixelSize) * pixelSize,
                    y: Math.floor((centerY + (Math.random() - 0.5) * 100) / pixelSize) * pixelSize,
                    size: isBright ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 1) + 1,
                    brightness: Math.random(),
                    maxBrightness: isBright ? 1 : 0.7,
                    twinkleSpeed: Math.random() * 0.002 + 0.001,
                    offset: clusterOffset + Math.random() * 0.5,
                    fullFade: fullFade,
                    isRandomTwinkling: false,
                    randomTwinkleTime: 0,
                    randomTwinkleDuration: 0,
                    nextRandomTwinkle: Math.random() * 300 + 100
                });
            }
            clusters.push(clusterStars);
        }

        // Draw pixelated diamond-shaped star
        const drawStar = (x, y, size, brightness) => {
            if (brightness <= 0) return;
            
            const px = Math.floor(x / pixelSize) * pixelSize;
            const py = Math.floor(y / pixelSize) * pixelSize;
            const alpha = Math.min(brightness, 1);
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            
            if (size >= 2) {
                // Diamond pattern:
                //     X
                //   X X X
                //     X
                ctx.fillRect(px, py, pixelSize, pixelSize); // Center
                ctx.fillRect(px - pixelSize, py, pixelSize, pixelSize); // Left
                ctx.fillRect(px + pixelSize, py, pixelSize, pixelSize); // Right
                ctx.fillRect(px, py - pixelSize, pixelSize, pixelSize); // Top
                ctx.fillRect(px, py + pixelSize, pixelSize, pixelSize); // Bottom
                
                if (size >= 3 && brightness > 0.7) {
                    // Larger diamond - extend the points
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
                    ctx.fillRect(px - pixelSize * 2, py, pixelSize, pixelSize); // Far left
                    ctx.fillRect(px + pixelSize * 2, py, pixelSize, pixelSize); // Far right
                    ctx.fillRect(px, py - pixelSize * 2, pixelSize, pixelSize); // Far top
                    ctx.fillRect(px, py + pixelSize * 2, pixelSize, pixelSize); // Far bottom
                }
            } else {
                // Small star - single pixel
                ctx.fillRect(px, py, pixelSize, pixelSize);
            }
        };

        const createShootingStar = () => {
            const angle = Math.random() * Math.PI / 4 - Math.PI / 8; // Slight downward angle
            const speed = Math.random() * 10 + 8;
            const startY = Math.floor(Math.random() * canvas.height * 0.6 / pixelSize) * pixelSize;
            
            return {
                x: -20,
                y: startY,
                speed: speed,
                length: Math.floor(Math.random() * 12 + 8),
                angle: angle,
                opacity: Math.random() * 0.4 + 0.6
            };
        };

        // Draw pixelated shooting star - simple diagonal line
        const drawShootingStar = (star) => {
            const px = Math.floor(star.x / pixelSize) * pixelSize;
            const py = Math.floor(star.y / pixelSize) * pixelSize;
            
            // Draw a simple pixel trail behind the star
            for (let i = 0; i < star.length; i++) {
                const trailX = px - i * pixelSize * 2;
                const trailY = py - Math.floor(i * Math.sin(star.angle) * pixelSize);
                const fadeRatio = 1 - (i / star.length);
                const alpha = star.opacity * fadeRatio;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fillRect(trailX, trailY, pixelSize, pixelSize);
            }
            
            // Bright head pixel
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fillRect(px, py, pixelSize, pixelSize);
            ctx.fillRect(px + pixelSize, py, pixelSize, pixelSize);
        };

        // Update star brightness with random twinkle effect
        const updateStarBrightness = (star, time, frameCount) => {
            // Check if it's time to start a random twinkle
            if (!star.isRandomTwinkling && frameCount >= star.nextRandomTwinkle) {
                star.isRandomTwinkling = true;
                star.randomTwinkleTime = 0;
                star.randomTwinkleDuration = Math.random() * 40 + 20;
            }

            // Handle random twinkling - bright flash
            if (star.isRandomTwinkling) {
                star.randomTwinkleTime++;
                const twinkleProgress = star.randomTwinkleTime / star.randomTwinkleDuration;
                
                if (twinkleProgress < 0.5) {
                    // Brighten up
                    star.brightness = star.maxBrightness * (1 + twinkleProgress * 1.5);
                } else if (twinkleProgress < 1) {
                    // Fade back
                    const fadeProgress = (twinkleProgress - 0.5) / 0.5;
                    star.brightness = star.maxBrightness * (1.75 - fadeProgress * 0.75);
                } else {
                    // End twinkle
                    star.isRandomTwinkling = false;
                    star.nextRandomTwinkle = frameCount + Math.random() * 400 + 150;
                }
            } else {
                // Normal gentle brightness variation
                const sineWave = Math.sin(time * star.twinkleSpeed + star.offset);
                star.brightness = star.fullFade 
                    ? Math.max(0.2, (0.5 + sineWave * 0.5)) * star.maxBrightness
                    : (0.5 + sineWave * 0.5) * star.maxBrightness;
            }
        };

        let time = 0;
        let frameCount = 0;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frameCount++;
            
            stars.forEach(star => {
                star.x += driftSpeed;
                if (star.x > canvas.width) {
                    star.x = 0;
                    star.y = Math.floor(Math.random() * canvas.height / pixelSize) * pixelSize;
                }
                
                updateStarBrightness(star, time, frameCount);
                drawStar(star.x, star.y, star.size, star.brightness);
            });
            
            clusters.forEach(cluster => {
                cluster.forEach(star => {
                    star.x += driftSpeed;
                    if (star.x > canvas.width) {
                        star.x = 0;
                        star.y = Math.floor(Math.random() * canvas.height / pixelSize) * pixelSize;
                    }
                    
                    updateStarBrightness(star, time, frameCount);
                    drawStar(star.x, star.y, star.size, star.brightness);
                });
            });
            
            // Shooting stars
            if (Math.random() < 0.003) {
                shootingStars.push(createShootingStar());
            }
            
            shootingStars.forEach((star, index) => {
                star.x += star.speed;
                star.y += Math.sin(star.angle) * star.speed * 0.3;
                
                drawShootingStar(star);
                
                if (star.x > canvas.width + 100) {
                    shootingStars.splice(index, 1);
                }
            });
            
            time += 0.05;
            requestAnimationFrame(animate);
        };
        
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="starry-background" />;
};

export default StarryBackground;
