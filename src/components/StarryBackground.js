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
        
        // Reduced number of regular stars to 40
        for (let i = 0; i < 40; i++) {
            const isBright = Math.random() < 0.4;
            const fullFade = Math.random() < 0.4;
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: isBright ? Math.random() * 0.6 + 0.3 : Math.random() * 0.4, // Slightly larger
                brightness: Math.random(), // Random initial brightness
                maxBrightness: isBright ? 1 : 0.7, // Increased minimum brightness
                glowSize: isBright ? Math.random() * 5 + 3 : Math.random() * 4 + 2, // Larger glow
                twinkleSpeed: Math.random() * 0.006 + 0.004,
                offset: Math.random() * Math.PI * 2,
                fullFade: fullFade
            });
        }

        // Reduced number of clusters to 4
        for (let i = 0; i < 4; i++) {
            // Ensure clusters are well-distributed
            const section = i % 4; // Split screen into quadrants
            const centerX = (Math.random() * 0.4 + (section % 2) * 0.5) * canvas.width;
            const centerY = (Math.random() * 0.4 + Math.floor(section / 2) * 0.5) * canvas.height;
            const clusterStars = [];
            const clusterOffset = Math.random() * Math.PI * 2;
            
            // Reduced stars per cluster to 4
            for (let j = 0; j < 4; j++) {
                const isBright = Math.random() < 0.4;
                const fullFade = Math.random() < 0.4;
                clusterStars.push({
                    x: centerX + (Math.random() - 0.5) * 100, // Wider spread
                    y: centerY + (Math.random() - 0.5) * 100,
                    size: isBright ? Math.random() * 0.6 + 0.3 : Math.random() * 0.4,
                    brightness: Math.random(),
                    maxBrightness: isBright ? 1 : 0.7,
                    glowSize: isBright ? Math.random() * 5 + 3 : Math.random() * 4 + 2,
                    twinkleSpeed: Math.random() * 0.006 + 0.004,
                    offset: clusterOffset + Math.random() * 0.5,
                    fullFade: fullFade
                });
            }
            clusters.push(clusterStars);
        }

        const drawStar = (x, y, size, brightness, glowSize) => {
            if (brightness <= 0) return;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4);
            
            const gradient = ctx.createRadialGradient(0, 0, size, 0, 0, glowSize);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${brightness * 0.6})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 1.3})`; // Brighter core
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.moveTo(0, 0);
                ctx.lineTo(size * 2, 0);
            }
            ctx.fill();
            ctx.restore();
        };

        const createShootingStar = () => {
            const angle = Math.random() * Math.PI / 3 - Math.PI / 6;
            const speed = Math.random() * 15 + 10;
            const startX = Math.random() * canvas.width;
            
            return {
                x: startX,
                y: -50,
                speed: speed,
                length: Math.random() * 40 + 20,
                angle: angle,
                opacity: Math.random() * 0.3 + 0.2 // Increased visibility
            };
        };

        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                star.x += driftSpeed;
                if (star.x > canvas.width) {
                    star.x = 0;
                    star.y = Math.random() * canvas.height; // Randomize vertical position on reset
                }
                
                const sineWave = Math.sin(time * star.twinkleSpeed + star.offset);
                star.brightness = star.fullFade 
                    ? Math.max(0, sineWave) * star.maxBrightness
                    : (0.3 + sineWave * 0.7) * star.maxBrightness; // Higher minimum brightness
                
                drawStar(star.x, star.y, star.size, star.brightness, star.glowSize);
            });
            
            clusters.forEach(cluster => {
                cluster.forEach(star => {
                    star.x += driftSpeed;
                    if (star.x > canvas.width) {
                        star.x = 0;
                        star.y = Math.random() * canvas.height;
                    }
                    
                    const sineWave = Math.sin(time * star.twinkleSpeed + star.offset);
                    star.brightness = star.fullFade 
                        ? Math.max(0, sineWave) * star.maxBrightness
                        : (0.3 + sineWave * 0.7) * star.maxBrightness;
                    
                    drawStar(star.x, star.y, star.size, star.brightness, star.glowSize);
                });
            });
            
            if (Math.random() < 0.05) { // Increased shooting star frequency
                shootingStars.push(createShootingStar());
            }
            
            shootingStars.forEach((star, index) => {
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );
                ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                
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