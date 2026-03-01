import React, { useEffect, useRef } from 'react';
import '../styles/StarryBackground.css';

const StarryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const stars = [];
        const clusters = [];
        const shootingStars = [];
        
        const driftSpeed = 0.1;
        
        // Regular stars with random twinkle capability
        for (let i = 0; i < 40; i++) {
            const isBright = Math.random() < 0.4;
            const fullFade = Math.random() < 0.4;
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: isBright ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 1,
                brightness: Math.random(),
                maxBrightness: isBright ? 1 : 0.7,
                glowSize: isBright ? Math.random() * 6 + 4 : Math.random() * 5 + 3,
                twinkleSpeed: Math.random() * 0.0015 + 0.0008, // Much slower twinkle
                offset: Math.random() * Math.PI * 2,
                fullFade: fullFade,
                // Random twinkle properties
                isRandomTwinkling: false,
                randomTwinkleTime: 0,
                randomTwinkleDuration: 0,
                nextRandomTwinkle: Math.random() * 600 + 200 // Longer interval for random twinkle
            });
        }

        // Clusters with random twinkle capability
        for (let i = 0; i < 4; i++) {
            const section = i % 4;
            const centerX = (Math.random() * 0.4 + (section % 2) * 0.5) * canvas.width;
            const centerY = (Math.random() * 0.4 + Math.floor(section / 2) * 0.5) * canvas.height;
            const clusterStars = [];
            const clusterOffset = Math.random() * Math.PI * 2;
            
            for (let j = 0; j < 4; j++) {
                const isBright = Math.random() < 0.4;
                const fullFade = Math.random() < 0.4;
                clusterStars.push({
                    x: centerX + (Math.random() - 0.5) * 100,
                    y: centerY + (Math.random() - 0.5) * 100,
                    size: isBright ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 1,
                    brightness: Math.random(),
                    maxBrightness: isBright ? 1 : 0.7,
                    glowSize: isBright ? Math.random() * 6 + 4 : Math.random() * 5 + 3,
                    twinkleSpeed: Math.random() * 0.0015 + 0.0008, // Much slower twinkle
                    offset: clusterOffset + Math.random() * 0.5,
                    fullFade: fullFade,
                    // Random twinkle properties
                    isRandomTwinkling: false,
                    randomTwinkleTime: 0,
                    randomTwinkleDuration: 0,
                    nextRandomTwinkle: Math.random() * 600 + 200
                });
            }
            clusters.push(clusterStars);
        }

        const drawStar = (x, y, size, brightness, glowSize) => {
            if (brightness <= 0) return;
            
            ctx.save();
            ctx.translate(x, y);
            
            // Draw soft glow behind the star
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize * 0.6);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.5})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${brightness * 0.15})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize * 0.6, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw 4-pointed star shape with very sharp points
            const outerRadius = size * 1.5; // Longer points
            const innerRadius = size * 0.12; // Much smaller inner radius for sharper points
            const points = 4;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(brightness * 1.3, 1)})`;
            ctx.beginPath();
            
            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Draw tiny bright center core
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(brightness * 1.5, 1)})`;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        };

        const createShootingStar = () => {
            // Angle going from left to right, slightly downward (between -30 and +30 degrees from horizontal)
            const angle = Math.random() * Math.PI / 3 - Math.PI / 6;
            const speed = Math.random() * 12 + 8;
            // Start from the left side of the screen, at a random vertical position
            const startY = Math.random() * canvas.height * 0.7; // Upper 70% of screen
            
            return {
                x: -50, // Start off the left edge
                y: startY,
                speed: speed,
                length: Math.random() * 80 + 60, // Longer tail
                angle: angle,
                opacity: Math.random() * 0.5 + 0.5, // Much brighter (0.5 to 1.0)
                width: Math.random() * 2 + 1.5, // Thicker line
                // Glow properties
                glowOpacity: Math.random() * 0.3 + 0.2
            };
        };

        // Draw shooting star with glow effect
        const drawShootingStar = (star) => {
            // Draw outer glow
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(
                star.x - Math.cos(star.angle) * star.length * 0.7,
                star.y - Math.sin(star.angle) * star.length * 0.7
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.glowOpacity})`;
            ctx.lineWidth = star.width * 3;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Draw main streak
            const gradient = ctx.createLinearGradient(
                star.x, star.y,
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.3, `rgba(255, 255, 255, ${star.opacity * 0.8})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            ctx.strokeStyle = gradient;
            ctx.lineWidth = star.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Draw bright head
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.width * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        };

        // Update star brightness with random twinkle effect
        const updateStarBrightness = (star, time, frameCount) => {
            // Check if it's time to start a random twinkle
            if (!star.isRandomTwinkling && frameCount >= star.nextRandomTwinkle) {
                star.isRandomTwinkling = true;
                star.randomTwinkleTime = 0;
                star.randomTwinkleDuration = Math.random() * 60 + 40; // Slower twinkle duration
            }

            // Handle random twinkling
            if (star.isRandomTwinkling) {
                star.randomTwinkleTime++;
                const twinkleProgress = star.randomTwinkleTime / star.randomTwinkleDuration;
                
                // Quick bright flash then fade
                if (twinkleProgress < 0.3) {
                    // Rapid brightening
                    star.brightness = star.maxBrightness * (1 + twinkleProgress * 2);
                } else if (twinkleProgress < 1) {
                    // Gradual dimming back to normal
                    const fadeProgress = (twinkleProgress - 0.3) / 0.7;
                    const normalBrightness = star.fullFade 
                        ? Math.max(0, Math.sin(time * star.twinkleSpeed + star.offset)) * star.maxBrightness
                        : (0.3 + Math.sin(time * star.twinkleSpeed + star.offset) * 0.7) * star.maxBrightness;
                    star.brightness = star.maxBrightness * (1 + (1 - fadeProgress) * 0.6) * (1 - fadeProgress) + normalBrightness * fadeProgress;
                } else {
                    // End twinkle, set next random twinkle time
                    star.isRandomTwinkling = false;
                    star.nextRandomTwinkle = frameCount + Math.random() * 800 + 300;
                }
            } else {
                // Normal sine wave brightness
                const sineWave = Math.sin(time * star.twinkleSpeed + star.offset);
                star.brightness = star.fullFade 
                    ? Math.max(0, sineWave) * star.maxBrightness
                    : (0.3 + sineWave * 0.7) * star.maxBrightness;
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
                    star.y = Math.random() * canvas.height;
                }
                
                updateStarBrightness(star, time, frameCount);
                drawStar(star.x, star.y, star.size, star.brightness, star.glowSize);
            });
            
            clusters.forEach(cluster => {
                cluster.forEach(star => {
                    star.x += driftSpeed;
                    if (star.x > canvas.width) {
                        star.x = 0;
                        star.y = Math.random() * canvas.height;
                    }
                    
                    updateStarBrightness(star, time, frameCount);
                    drawStar(star.x, star.y, star.size, star.brightness, star.glowSize);
                });
            });
            
            // Shooting stars - rare occurrence
            if (Math.random() < 0.002) {
                shootingStars.push(createShootingStar());
            }
            
            shootingStars.forEach((star, index) => {
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                
                drawShootingStar(star);
                
                if (star.y > canvas.height + 100 || star.x < -100 || star.x > canvas.width + 100) {
                    shootingStars.splice(index, 1);
                }
            });
            
            time += 0.03;
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