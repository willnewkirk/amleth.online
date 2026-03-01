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
        const planets = [];
        
        const driftSpeed = 0.6;
        const pixelSize = 3;
        
        // Create planets with spacing to prevent overlap
        const createPlanets = () => {
            // Moon visible on left, Saturn visible on right, Earth off-screen
            // Planets move slightly slower than stars (speedMultiplier: 0.7)
            // rotation: current rotation angle, rotationSpeed: very slow spin
            planets.push({
                x: canvas.width * 0.15,
                y: canvas.height * 0.25,
                type: 'moon',
                size: 25,
                speedMultiplier: 0.7,
                baseTilt: 0.05,
                rotation: 0,
                rotationSpeed: 0.00008,
                effectiveSize: 30
            });
            
            planets.push({
                x: canvas.width * 1.5, // Off-screen, will appear later
                y: canvas.height * 0.4,
                type: 'earth',
                size: 40,
                speedMultiplier: 0.7,
                baseTilt: 0.4, // Earth's axial tilt
                rotation: 0,
                rotationSpeed: 0.0001,
                effectiveSize: 50
            });
            
            planets.push({
                x: canvas.width * 0.75,
                y: canvas.height * 0.55,
                type: 'saturn',
                size: 35,
                speedMultiplier: 0.7,
                baseTilt: 0.47, // Saturn's ring tilt
                rotation: 0,
                rotationSpeed: 0.00006,
                effectiveSize: 80
            });
        };
        
        createPlanets();
        
        // Check if planets would overlap and adjust Y position
        const adjustPlanetPositions = () => {
            for (let i = 0; i < planets.length; i++) {
                for (let j = i + 1; j < planets.length; j++) {
                    const p1 = planets[i];
                    const p2 = planets[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = (p1.effectiveSize + p2.effectiveSize) * pixelSize;
                    
                    if (dist < minDist) {
                        // Push apart vertically
                        const overlap = minDist - dist;
                        if (p1.y < p2.y) {
                            p1.y -= overlap / 2;
                            p2.y += overlap / 2;
                        } else {
                            p1.y += overlap / 2;
                            p2.y -= overlap / 2;
                        }
                        // Keep in bounds
                        p1.y = Math.max(canvas.height * 0.1, Math.min(canvas.height * 0.7, p1.y));
                        p2.y = Math.max(canvas.height * 0.1, Math.min(canvas.height * 0.7, p2.y));
                    }
                }
            }
        };
        
        // Calculate dynamic light direction based on planet screen position
        // Light comes from camera (viewer), creating front-facing illumination
        const getLightDirection = (planetX, planetY) => {
            // Normalize planet position relative to screen center
            const screenCenterX = canvas.width / 2;
            const screenCenterY = canvas.height / 2;
            
            // Light points from camera toward planet (so reversed for shading)
            // Planets on left get light from right, planets on right get light from left
            const offsetX = (planetX - screenCenterX) / canvas.width;
            const offsetY = (planetY - screenCenterY) / canvas.height;
            
            // Light direction - primarily from front (Z), with X/Y based on position
            const lightX = -offsetX * 0.6;
            const lightY = -offsetY * 0.4;
            const lightZ = 0.9; // Strong front light
            
            const mag = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
            return { x: lightX / mag, y: lightY / mag, z: lightZ / mag };
        };
        
        // Draw pixelated Moon with dynamic 3D shading
        const drawMoon = (x, y, size, tilt) => {
            const px = Math.floor(x / pixelSize) * pixelSize;
            const py = Math.floor(y / pixelSize) * pixelSize;
            const s = pixelSize;
            
            // Get dynamic light direction based on moon's screen position
            const light = getLightDirection(x, y);
            
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(tilt);
            
            // Draw base moon sphere with dynamic 3D spherical shading
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= size) {
                        // Surface normal
                        const nx = dx / size;
                        const ny = dy / size;
                        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
                        
                        // Dot product for diffuse lighting with dynamic light
                        const dot = nx * light.x + ny * light.y + nz * light.z;
                        const brightness = Math.max(0.1, Math.min(1, dot * 0.8 + 0.4));
                        
                        const grey = Math.floor(180 * brightness + 40);
                        ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, 0.95)`;
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            // Generate craters with varying depths and shades
            // depth: 0.3-1.0 (shallow to deep), shade: base darkness modifier
            const allCraters = [];
            
            // Large prominent craters (reduced from 9 to 5)
            const largeCraters = [
                { cx: -8, cy: -10, r: 6, depth: 0.9, shade: 0.8 },
                { cx: 10, cy: -6, r: 5, depth: 0.7, shade: 0.9 },
                { cx: -4, cy: 8, r: 5, depth: 0.8, shade: 0.85 },
                { cx: 8, cy: 10, r: 4, depth: 0.6, shade: 0.95 },
                { cx: -14, cy: 2, r: 4, depth: 0.5, shade: 0.9 },
            ];
            allCraters.push(...largeCraters);
            
            // Medium craters (reduced from 15 to 8)
            const mediumCraters = [
                { cx: 2, cy: -14, r: 3, depth: 0.7, shade: 0.85 },
                { cx: -10, cy: -4, r: 3, depth: 0.5, shade: 0.9 },
                { cx: 14, cy: 4, r: 3, depth: 0.8, shade: 0.8 },
                { cx: -2, cy: 14, r: 3, depth: 0.4, shade: 0.95 },
                { cx: 6, cy: 2, r: 3, depth: 0.6, shade: 0.88 },
                { cx: -6, cy: -14, r: 3, depth: 0.55, shade: 0.92 },
                { cx: 0, cy: 6, r: 3, depth: 0.45, shade: 0.9 },
                { cx: -12, cy: 10, r: 3, depth: 0.65, shade: 0.85 },
            ];
            allCraters.push(...mediumCraters);
            
            // Edge craters - visible on the limb of the moon
            const edgeCraters = [
                { cx: -20, cy: -8, r: 3, depth: 0.35, shade: 0.85 },
                { cx: -18, cy: 12, r: 3, depth: 0.4, shade: 0.88 },
                { cx: 20, cy: -4, r: 3, depth: 0.3, shade: 0.9 },
                { cx: 18, cy: 10, r: 2, depth: 0.35, shade: 0.87 },
                { cx: -8, cy: -20, r: 2, depth: 0.3, shade: 0.9 },
                { cx: 10, cy: -18, r: 2, depth: 0.35, shade: 0.88 },
                { cx: -6, cy: 20, r: 2, depth: 0.3, shade: 0.9 },
                { cx: 8, cy: 18, r: 2, depth: 0.35, shade: 0.87 },
            ];
            allCraters.push(...edgeCraters);
            
            // Small craters (reduced from 24 to 12)
            const smallCraters = [
                { cx: -2, cy: -4, r: 2, depth: 0.6, shade: 0.85 },
                { cx: 4, cy: -8, r: 2, depth: 0.5, shade: 0.9 },
                { cx: -6, cy: 2, r: 2, depth: 0.7, shade: 0.82 },
                { cx: 10, cy: 6, r: 2, depth: 0.45, shade: 0.92 },
                { cx: -8, cy: 12, r: 2, depth: 0.55, shade: 0.88 },
                { cx: 2, cy: 10, r: 2, depth: 0.4, shade: 0.95 },
                { cx: 12, cy: -2, r: 2, depth: 0.65, shade: 0.85 },
                { cx: -10, cy: -12, r: 2, depth: 0.5, shade: 0.9 },
                { cx: 6, cy: -12, r: 2, depth: 0.35, shade: 0.93 },
                { cx: -4, cy: 16, r: 2, depth: 0.45, shade: 0.9 },
                { cx: 14, cy: 12, r: 2, depth: 0.3, shade: 0.95 },
                { cx: -16, cy: -6, r: 2, depth: 0.55, shade: 0.87 },
            ];
            allCraters.push(...smallCraters);
            
            // Tiny craters for texture (reduced from 60+ to 15)
            const tinyCraters = [
                { cx: 0, cy: -2, r: 1, depth: 0.5, shade: 0.9 },
                { cx: -4, cy: -6, r: 1, depth: 0.4, shade: 0.92 },
                { cx: 8, cy: 0, r: 1, depth: 0.6, shade: 0.85 },
                { cx: -8, cy: 6, r: 1, depth: 0.45, shade: 0.9 },
                { cx: 4, cy: 8, r: 1, depth: 0.55, shade: 0.88 },
                { cx: -2, cy: 10, r: 1, depth: 0.35, shade: 0.93 },
                { cx: 10, cy: -8, r: 1, depth: 0.5, shade: 0.9 },
                { cx: -10, cy: 0, r: 1, depth: 0.4, shade: 0.92 },
                { cx: 6, cy: 12, r: 1, depth: 0.6, shade: 0.85 },
                { cx: -6, cy: -10, r: 1, depth: 0.45, shade: 0.9 },
                { cx: 12, cy: 4, r: 1, depth: 0.3, shade: 0.95 },
                { cx: -12, cy: 6, r: 1, depth: 0.5, shade: 0.88 },
                { cx: 2, cy: -10, r: 1, depth: 0.55, shade: 0.87 },
                { cx: -14, cy: -2, r: 1, depth: 0.4, shade: 0.92 },
                { cx: 0, cy: 14, r: 1, depth: 0.35, shade: 0.94 },
            ];
            allCraters.push(...tinyCraters);
            
            // Draw all craters with spherical projection for globe effect
            allCraters.forEach(crater => {
                const craterDepth = crater.depth || 0.5;
                const craterShade = crater.shade || 0.9;
                
                // Project crater center onto sphere
                const lonCenter = (crater.cx / size) * (Math.PI / 2);
                const latCenter = (crater.cy / size) * (Math.PI / 2);
                
                // Check if crater center is on visible hemisphere
                const centerZ = Math.cos(latCenter) * Math.cos(lonCenter);
                if (centerZ < -0.1) return; // Skip craters on far side
                
                // Calculate how much the crater should be compressed based on its position
                const edgeFactor = Math.max(0.2, centerZ);
                
                for (let dy = -crater.r; dy <= crater.r; dy++) {
                    for (let dx = -crater.r; dx <= crater.r; dx++) {
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > crater.r) continue;
                        
                        // Project each crater pixel onto the sphere
                        const pixelLon = ((crater.cx + dx) / size) * (Math.PI / 2);
                        const pixelLat = ((crater.cy + dy) / size) * (Math.PI / 2);
                        
                        const projZ = Math.cos(pixelLat) * Math.cos(pixelLon);
                        if (projZ < 0.05) continue; // Skip pixels on far side
                        
                        const projX = Math.cos(pixelLat) * Math.sin(pixelLon) * size;
                        const projY = Math.sin(pixelLat) * size;
                        
                        const totalDist = Math.sqrt(projX ** 2 + projY ** 2);
                        if (totalDist > size) continue;
                        
                        const rimDist = crater.r - dist;
                        if (crater.r >= 3 && rimDist < 1.2 * edgeFactor) {
                            // Rim - highlight based on light direction
                            const rimLit = (dx * light.x + dy * light.y) < 0;
                            const baseHighlight = rimLit ? 200 : 140;
                            const highlight = Math.floor(baseHighlight * craterShade * edgeFactor);
                            ctx.fillStyle = `rgba(${highlight}, ${highlight}, ${highlight}, 0.95)`;
                        } else {
                            // Interior - depth and shade affect darkness
                            const baseDepth = 40 + (1 - craterDepth) * 30;
                            const depthGradient = (dist / crater.r) * (60 * craterDepth);
                            const finalDepth = Math.floor((baseDepth + depthGradient) * craterShade * (0.7 + edgeFactor * 0.3));
                            ctx.fillStyle = `rgba(${finalDepth}, ${finalDepth}, ${finalDepth}, 0.95)`;
                        }
                        ctx.fillRect(Math.round(projX) * s, Math.round(projY) * s, s, s);
                    }
                }
            });
            
            // Add dynamic shadow on the side away from light
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= size && dist > size * 0.3) {
                        // Shadow on side opposite to light
                        const awayFromLight = dx * light.x + dy * light.y;
                        if (awayFromLight > 0) {
                            const shadowStrength = (awayFromLight / size) * 0.4;
                            ctx.fillStyle = `rgba(0, 0, 0, ${shadowStrength})`;
                            ctx.fillRect(dx * s, dy * s, s, s);
                        }
                    }
                }
            }
            
            // Add highlight/specular toward light direction
            const highlightCenterX = -light.x * size * 0.45;
            const highlightCenterY = -light.y * size * 0.45;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const distFromHighlight = Math.sqrt((dx - highlightCenterX) ** 2 + (dy - highlightCenterY) ** 2);
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                    if (distFromHighlight <= size * 0.25 && distFromCenter <= size) {
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            ctx.restore();
        };
        
        // Draw pixelated Earth with dynamic 3D shading
        const drawEarth = (x, y, size, tilt) => {
            const px = Math.floor(x / pixelSize) * pixelSize;
            const py = Math.floor(y / pixelSize) * pixelSize;
            const s = pixelSize;
            
            // Get dynamic light direction based on Earth's screen position
            const light = getLightDirection(x, y);
            
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(tilt);
            
            // Store land positions for later shading
            const landPositions = new Set();
            
            // Draw base ocean sphere with dynamic 3D shading
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= size) {
                        // Surface normal
                        const nx = dx / size;
                        const ny = dy / size;
                        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
                        
                        // Dynamic lighting
                        const dot = nx * light.x + ny * light.y + nz * light.z;
                        const brightness = Math.max(0.1, Math.min(1, dot * 0.7 + 0.4));
                        
                        // Ocean (darker base)
                        const oceanGrey = Math.floor(60 * brightness + 20);
                        ctx.fillStyle = `rgba(${oceanGrey}, ${oceanGrey}, ${Math.floor(oceanGrey * 1.1)}, 0.95)`;
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            // Continents with spherical projection for globe effect
            const drawContinent = (points, baseBrightness) => {
                points.forEach(p => {
                    // Treat input as longitude/latitude coordinates
                    // Convert to spherical coordinates and project onto visible hemisphere
                    const lon = (p[0] / size) * (Math.PI / 2); // longitude angle
                    const lat = (p[1] / size) * (Math.PI / 2); // latitude angle
                    
                    // Spherical to Cartesian projection (orthographic)
                    // x = cos(lat) * sin(lon)
                    // y = sin(lat)
                    // z = cos(lat) * cos(lon)
                    const projX = Math.cos(lat) * Math.sin(lon) * size;
                    const projY = Math.sin(lat) * size;
                    const projZ = Math.cos(lat) * Math.cos(lon);
                    
                    // Only draw if on the visible hemisphere (facing us)
                    if (projZ < 0.1) return;
                    
                    const totalDist = Math.sqrt(projX ** 2 + projY ** 2);
                    if (totalDist <= size) {
                        landPositions.add(`${Math.round(projX)},${Math.round(projY)}`);
                        
                        // Surface normal based on projected position
                        const nx = projX / size;
                        const ny = projY / size;
                        const nz = projZ;
                        
                        // Dynamic lighting
                        const dot = nx * light.x + ny * light.y + nz * light.z;
                        const brightness = Math.max(0.15, Math.min(1, dot * 0.8 + 0.4));
                        
                        const grey = Math.floor(baseBrightness * brightness);
                        ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, 0.95)`;
                        ctx.fillRect(Math.round(projX) * s, Math.round(projY) * s, s, s);
                    }
                });
            };
            
            // North America - larger and more detailed
            const northAmerica = [];
            for (let dy = -28; dy <= 0; dy++) {
                for (let dx = -32; dx <= -6; dx++) {
                    // Alaska
                    if (dy < -20 && dx < -20) {
                        if (dy > -26 || dx > -28) northAmerica.push([dx, dy]);
                    }
                    // Canada
                    else if (dy < -12) {
                        if (dx > -28 && dx < -8) northAmerica.push([dx, dy]);
                    }
                    // USA
                    else if (dy < -2) {
                        if (dx > -26 && dx < -8 && !(dy > -6 && dx < -22)) northAmerica.push([dx, dy]);
                    }
                    // Mexico/Central America
                    else if (dy <= 0 && dx > -18 && dx < -10) {
                        northAmerica.push([dx, dy]);
                    }
                }
            }
            drawContinent(northAmerica, 160);
            
            // South America - larger
            const southAmerica = [];
            for (let dy = 2; dy <= 28; dy++) {
                const centerX = -12;
                let width;
                if (dy < 8) width = 10 + dy;
                else if (dy < 18) width = 16 - (dy - 8) * 0.5;
                else width = Math.max(4, 12 - (dy - 18));
                
                for (let dx = centerX - width / 2; dx <= centerX + width / 2; dx++) {
                    southAmerica.push([Math.floor(dx), dy]);
                }
            }
            drawContinent(southAmerica, 145);
            
            // Europe - larger
            const europe = [];
            for (let dy = -24; dy <= -6; dy++) {
                for (let dx = 0; dx <= 18; dx++) {
                    if (dy < -18 && dx > 14) continue; // Scandinavia shape
                    if (dy > -10 && dx > 12) continue; // Mediterranean
                    if (dy > -8 && dx < 4) continue; // Spain gap
                    europe.push([dx, dy]);
                }
            }
            drawContinent(europe, 165);
            
            // Africa - larger
            const africa = [];
            for (let dy = -8; dy <= 24; dy++) {
                const centerX = 10;
                let width;
                if (dy < 0) width = 14 + dy;
                else if (dy < 10) width = 18;
                else width = Math.max(6, 18 - (dy - 10) * 1.2);
                
                for (let dx = centerX - width / 2; dx <= centerX + width / 2; dx++) {
                    africa.push([Math.floor(dx), dy]);
                }
            }
            drawContinent(africa, 150);
            
            // Asia - larger and more detailed
            const asia = [];
            for (let dy = -28; dy <= 12; dy++) {
                for (let dx = 16; dx <= 38; dx++) {
                    // Siberia/Russia
                    if (dy < -16 && dx < 36) asia.push([dx, dy]);
                    // Central Asia
                    else if (dy >= -16 && dy < -4 && dx < 34) asia.push([dx, dy]);
                    // Middle East
                    else if (dy >= -4 && dy < 6 && dx < 28) asia.push([dx, dy]);
                    // India
                    else if (dy >= 0 && dy < 12 && dx >= 22 && dx < 32) {
                        if (dy < 8 || dx < 28) asia.push([dx, dy]);
                    }
                    // Southeast Asia
                    else if (dy >= 4 && dy < 10 && dx >= 32 && dx < 38) asia.push([dx, dy]);
                }
            }
            drawContinent(asia, 140);
            
            // Australia - new!
            const australia = [];
            for (let dy = 14; dy <= 26; dy++) {
                const centerX = 34;
                let width;
                if (dy < 18) width = 8 + (dy - 14) * 2;
                else if (dy < 24) width = 16;
                else width = Math.max(6, 16 - (dy - 24) * 3);
                
                for (let dx = centerX - width / 2; dx <= centerX + width / 2; dx++) {
                    australia.push([Math.floor(dx), dy]);
                }
            }
            drawContinent(australia, 155);
            
            // Ice caps with dynamic 3D shading
            for (let dx = -size + 5; dx <= size - 5; dx++) {
                for (let dy = 0; dy <= 3; dy++) {
                    const topY = -size + dy;
                    const botY = size - dy;
                    const totalDistTop = Math.sqrt(dx ** 2 + topY ** 2);
                    const totalDistBot = Math.sqrt(dx ** 2 + botY ** 2);
                    
                    // Dynamic shading for ice
                    const nxTop = dx / size;
                    const nyTop = topY / size;
                    const nxBot = dx / size;
                    const nyBot = botY / size;
                    
                    if (totalDistTop <= size) {
                        const dotTop = nxTop * light.x + nyTop * light.y + 0.8 * light.z;
                        const brightnessTop = Math.max(0.6, Math.min(1, dotTop * 0.5 + 0.7));
                        const iceGreyTop = Math.floor(240 * brightnessTop);
                        ctx.fillStyle = `rgba(${iceGreyTop}, ${iceGreyTop}, ${iceGreyTop}, 0.95)`;
                        ctx.fillRect(dx * s, topY * s, s, s);
                    }
                    if (totalDistBot <= size) {
                        const dotBot = nxBot * light.x + nyBot * light.y + 0.8 * light.z;
                        const brightnessBot = Math.max(0.6, Math.min(1, dotBot * 0.5 + 0.7));
                        const iceGreyBot = Math.floor(240 * brightnessBot);
                        ctx.fillStyle = `rgba(${iceGreyBot}, ${iceGreyBot}, ${iceGreyBot}, 0.95)`;
                        ctx.fillRect(dx * s, botY * s, s, s);
                    }
                }
            }
            
            // Clouds - with dynamic 3D shading
            const clouds = [
                [-15, -10], [-14, -10], [-13, -10], [-14, -9],
                [0, -5], [1, -5], [2, -5], [1, -4], [0, -4],
                [-8, 5], [-7, 5], [-6, 5], [-7, 6],
                [15, -8], [16, -8], [15, -7],
                [5, 8], [6, 8], [7, 8], [6, 9],
                [-18, -3], [-17, -3], [-17, -2],
            ];
            clouds.forEach(c => {
                const totalDist = Math.sqrt(c[0] ** 2 + c[1] ** 2);
                if (totalDist <= size - 1) {
                    const nx = c[0] / size;
                    const ny = c[1] / size;
                    const dotCloud = nx * light.x + ny * light.y + 0.9 * light.z;
                    const brightness = Math.max(0.6, Math.min(1, dotCloud * 0.4 + 0.7));
                    const cloudGrey = Math.floor(220 * brightness);
                    ctx.fillStyle = `rgba(${cloudGrey}, ${cloudGrey}, ${cloudGrey}, 0.75)`;
                    ctx.fillRect(c[0] * s, c[1] * s, s, s);
                }
            });
            
            // Add dynamic highlight/specular toward light direction
            const earthHighlightX = -light.x * size * 0.5;
            const earthHighlightY = -light.y * size * 0.5;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const distFromHighlight = Math.sqrt((dx - earthHighlightX) ** 2 + (dy - earthHighlightY) ** 2);
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                    if (distFromHighlight <= size * 0.2 && distFromCenter <= size) {
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            ctx.restore();
        };
        
        // Draw pixelated Saturn with dynamic 3D shading
        const drawSaturn = (x, y, size, tilt) => {
            const px = Math.floor(x / pixelSize) * pixelSize;
            const py = Math.floor(y / pixelSize) * pixelSize;
            const s = pixelSize;
            
            // Get dynamic light direction based on Saturn's screen position
            const light = getLightDirection(x, y);
            
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(tilt);
            
            // Draw complete ring system that wraps around planet
            const ringInner = size + 5;
            const ringOuter = size + 25;
            const ringTilt = 0.25; // How tilted the ring appears (ellipse ratio)
            
            // Helper to draw ring segment
            const drawRingSegment = (isBehind) => {
                for (let dx = -ringOuter; dx <= ringOuter; dx++) {
                    for (let dy = -12; dy <= 12; dy++) {
                        // Create elliptical ring shape
                        const ellipseY = dy / ringTilt;
                        const ringDist = Math.sqrt(dx * dx + ellipseY * ellipseY);
                        
                        if (ringDist >= ringInner && ringDist <= ringOuter) {
                            // Check if this pixel is behind or in front of the planet
                            const behindPlanet = dy > 0 && Math.abs(dx) < size;
                            
                            if (isBehind && !behindPlanet) continue;
                            if (!isBehind && behindPlanet) continue;
                            
                            // Skip pixels that would be inside the planet body
                            const planetDist = Math.sqrt(dx * dx + dy * dy);
                            if (planetDist < size && Math.abs(dy) < size * 0.3) continue;
                            
                            const bandPos = (ringDist - ringInner) / (ringOuter - ringInner);
                            // Ring gaps
                            if (bandPos < 0.12 || (bandPos > 0.38 && bandPos < 0.44) || (bandPos > 0.7 && bandPos < 0.74)) {
                                continue;
                            }
                            
                            // Dynamic shading
                            const ringLit = dx * light.x < 0 ? 1.1 : 0.85;
                            const sideFade = 1 - Math.abs(dx) / ringOuter * 0.25;
                            const depthFade = isBehind ? 0.7 : 1.0; // Back rings are dimmer
                            
                            let baseBrightness;
                            if (bandPos < 0.25) baseBrightness = 185;
                            else if (bandPos < 0.5) baseBrightness = 160;
                            else if (bandPos < 0.8) baseBrightness = 140;
                            else baseBrightness = 120;
                            
                            const grey = Math.floor(baseBrightness * sideFade * ringLit * depthFade);
                            ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, ${isBehind ? 0.6 : 0.85})`;
                            ctx.fillRect(dx * s, dy * s, s, s);
                        }
                    }
                }
            };
            
            // Draw back rings first (behind planet)
            drawRingSegment(true);
            
            // Draw planet body with curved bands following sphere surface
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= size) {
                        // Surface normal
                        const nx = dx / size;
                        const ny = dy / size;
                        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
                        
                        // Dynamic lighting
                        const dot = nx * light.x + ny * light.y + nz * light.z;
                        const brightness = Math.max(0.1, Math.min(1, dot * 0.7 + 0.5));
                        
                        // Curved bands - use latitude on sphere surface
                        // Calculate the "latitude" based on y position adjusted for sphere curvature
                        const sphereY = dy / Math.max(0.1, Math.sqrt(size * size - dx * dx));
                        const latitude = Math.asin(Math.max(-1, Math.min(1, sphereY)));
                        
                        // Create curved bands based on latitude
                        const bandValue = (latitude + Math.PI / 2) / Math.PI; // 0 to 1 from pole to pole
                        const bandIndex = Math.floor(bandValue * 8) % 3;
                        
                        let baseGrey;
                        if (bandIndex === 0) baseGrey = 200;
                        else if (bandIndex === 1) baseGrey = 165;
                        else baseGrey = 140;
                        
                        const grey = Math.floor(baseGrey * brightness);
                        ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, 0.95)`;
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            // Add storm detail (bright spot) - position based on light
            const stormX = Math.floor(-light.x * 3);
            const stormY = Math.floor(-light.y * 2);
            for (let dy = stormY - 1; dy <= stormY + 2; dy++) {
                for (let dx = stormX - 2; dx <= stormX + 1; dx++) {
                    if (Math.sqrt(dx * dx + dy * dy) <= size - 2) {
                        ctx.fillStyle = 'rgba(210, 210, 210, 0.95)';
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            // Add dynamic highlight/specular toward light direction
            const saturnHighlightX = -light.x * size * 0.45;
            const saturnHighlightY = -light.y * size * 0.45;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            for (let dy = -size; dy <= size; dy++) {
                for (let dx = -size; dx <= size; dx++) {
                    const distFromHighlight = Math.sqrt((dx - saturnHighlightX) ** 2 + (dy - saturnHighlightY) ** 2);
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                    if (distFromHighlight <= size * 0.22 && distFromCenter <= size) {
                        ctx.fillRect(dx * s, dy * s, s, s);
                    }
                }
            }
            
            // Draw front rings (in front of planet)
            drawRingSegment(false);
            
            ctx.restore();
        };
        
        // Draw planet based on type with combined tilt and rotation
        const drawPlanet = (planet) => {
            // Combine base tilt with current rotation for orbiting effect
            const currentTilt = planet.baseTilt + planet.rotation;
            
            switch (planet.type) {
                case 'moon':
                    drawMoon(planet.x, planet.y, planet.size, currentTilt);
                    break;
                case 'earth':
                    drawEarth(planet.x, planet.y, planet.size, currentTilt);
                    break;
                case 'saturn':
                    drawSaturn(planet.x, planet.y, planet.size, currentTilt);
                    break;
                default:
                    break;
            }
        };
        
        // Regular stars
        for (let i = 0; i < 50; i++) {
            const isBright = Math.random() < 0.4;
            const fullFade = Math.random() < 0.4;
            // 70% of stars are behind planets, 30% are in front
            const layer = Math.random() < 0.7 ? 0 : 1;
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
                nextRandomTwinkle: Math.random() * 300 + 100,
                layer: layer
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
                const layer = Math.random() < 0.7 ? 0 : 1;
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
                    nextRandomTwinkle: Math.random() * 300 + 100,
                    layer: layer
                });
            }
            clusters.push(clusterStars);
        }

        const drawStar = (x, y, size, brightness) => {
            if (brightness <= 0) return;
            
            const px = Math.floor(x / pixelSize) * pixelSize;
            const py = Math.floor(y / pixelSize) * pixelSize;
            const alpha = Math.min(brightness, 1);
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            
            if (size >= 2) {
                ctx.fillRect(px, py, pixelSize, pixelSize);
                ctx.fillRect(px - pixelSize, py, pixelSize, pixelSize);
                ctx.fillRect(px + pixelSize, py, pixelSize, pixelSize);
                ctx.fillRect(px, py - pixelSize, pixelSize, pixelSize);
                ctx.fillRect(px, py + pixelSize, pixelSize, pixelSize);
                
                if (size >= 3 && brightness > 0.7) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
                    ctx.fillRect(px - pixelSize * 2, py, pixelSize, pixelSize);
                    ctx.fillRect(px + pixelSize * 2, py, pixelSize, pixelSize);
                    ctx.fillRect(px, py - pixelSize * 2, pixelSize, pixelSize);
                    ctx.fillRect(px, py + pixelSize * 2, pixelSize, pixelSize);
                }
            } else {
                ctx.fillRect(px, py, pixelSize, pixelSize);
            }
        };

        const createShootingStar = () => {
            const angle = Math.random() * Math.PI / 4 - Math.PI / 8;
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

        const drawShootingStar = (star) => {
            const px = Math.floor(star.x / pixelSize) * pixelSize;
            const py = Math.floor(star.y / pixelSize) * pixelSize;
            
            for (let i = 0; i < star.length; i++) {
                const trailX = px - i * pixelSize * 2;
                const trailY = py - Math.floor(i * Math.sin(star.angle) * pixelSize);
                const fadeRatio = 1 - (i / star.length);
                const alpha = star.opacity * fadeRatio;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fillRect(trailX, trailY, pixelSize, pixelSize);
            }
            
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fillRect(px, py, pixelSize, pixelSize);
            ctx.fillRect(px + pixelSize, py, pixelSize, pixelSize);
        };

        const updateStarBrightness = (star, time, frameCount) => {
            if (!star.isRandomTwinkling && frameCount >= star.nextRandomTwinkle) {
                star.isRandomTwinkling = true;
                star.randomTwinkleTime = 0;
                star.randomTwinkleDuration = Math.random() * 40 + 20;
            }

            if (star.isRandomTwinkling) {
                star.randomTwinkleTime++;
                const twinkleProgress = star.randomTwinkleTime / star.randomTwinkleDuration;
                
                if (twinkleProgress < 0.5) {
                    star.brightness = star.maxBrightness * (1 + twinkleProgress * 1.5);
                } else if (twinkleProgress < 1) {
                    const fadeProgress = (twinkleProgress - 0.5) / 0.5;
                    star.brightness = star.maxBrightness * (1.75 - fadeProgress * 0.75);
                } else {
                    star.isRandomTwinkling = false;
                    star.nextRandomTwinkle = frameCount + Math.random() * 400 + 150;
                }
            } else {
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
            
            // Update planet positions and rotations
            planets.forEach(planet => {
                planet.x += driftSpeed * planet.speedMultiplier;
                // Slowly rotate planets to simulate orbiting around camera
                planet.rotation += planet.rotationSpeed;
                
                if (planet.x > canvas.width + 300) {
                    planet.x = -300 - Math.random() * 200;
                    planet.y = Math.random() * canvas.height * 0.5 + canvas.height * 0.15;
                }
            });
            
            // Check for overlap and adjust
            adjustPlanetPositions();
            
            // Update all star positions and brightness
            stars.forEach(star => {
                star.x += driftSpeed;
                if (star.x > canvas.width) {
                    star.x = 0;
                    star.y = Math.floor(Math.random() * canvas.height / pixelSize) * pixelSize;
                }
                updateStarBrightness(star, time, frameCount);
            });
            
            clusters.forEach(cluster => {
                cluster.forEach(star => {
                    star.x += driftSpeed;
                    if (star.x > canvas.width) {
                        star.x = 0;
                        star.y = Math.floor(Math.random() * canvas.height / pixelSize) * pixelSize;
                    }
                    updateStarBrightness(star, time, frameCount);
                });
            });
            
            // Draw background stars (layer 0) - behind planets
            stars.forEach(star => {
                if (star.layer === 0) {
                    drawStar(star.x, star.y, star.size, star.brightness);
                }
            });
            clusters.forEach(cluster => {
                cluster.forEach(star => {
                    if (star.layer === 0) {
                        drawStar(star.x, star.y, star.size, star.brightness);
                    }
                });
            });
            
            // Draw planets
            planets.forEach(planet => {
                drawPlanet(planet);
            });
            
            // Draw foreground stars (layer 1) - in front of planets
            stars.forEach(star => {
                if (star.layer === 1) {
                    drawStar(star.x, star.y, star.size, star.brightness);
                }
            });
            clusters.forEach(cluster => {
                cluster.forEach(star => {
                    if (star.layer === 1) {
                        drawStar(star.x, star.y, star.size, star.brightness);
                    }
                });
            });
            
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
