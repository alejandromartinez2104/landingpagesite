/**
 * Interactive Water Background
 * Creates animated water effects with bubbles and interactive ripples
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize water backgrounds
    initWaterCanvas('waterCanvas', {
        height: '60%',
        color: '#2699CA',
        bubbleColor: '#ffffff',
        waveColor: '#ffffff',
        bubbleDensity: 'low',
        interactionStrength: 1
    });
    
    initWaterCanvas('waterCanvas2', {
        height: '60%',
        color: '#2699CA',
        bubbleColor: '#ffffff',
        waveColor: '#ffffff',
        bubbleDensity: 'low',
        interactionStrength: 0.7,
        opacity: 0.3
    });
    
    // Initialize bubble animations
    initBubbleCanvas('bubbleCanvas', {
        bubbleColor: '#ffffff',
        bubbleDensity: 'medium',
        opacity: 0.3
    });
    
    initBubbleCanvas('bubbleCanvas2', {
        bubbleColor: '#ffffff',
        bubbleDensity: 'low',
        opacity: 0.2
    });
});

/**
 * Initialize Water Canvas
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} options - Configuration options
 */
function initWaterCanvas(canvasId, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Default options
    const settings = {
        height: options.height || '60%',
        color: options.color || '#2699CA',
        bubbleColor: options.bubbleColor || '#ffffff',
        waveColor: options.waveColor || '#ffffff',
        bubbleDensity: options.bubbleDensity || 'low',
        interactionStrength: options.interactionStrength || 1,
        opacity: options.opacity || 1
    };
    
    // Set canvas dimensions
    function resizeCanvas() {
        const parent = canvas.parentElement;
        if (!parent) return;
        
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create bubbles
    const bubbleCount = settings.bubbleDensity === 'low' ? 15 : 
                        settings.bubbleDensity === 'medium' ? 30 : 45;
    
    const bubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            radius: Math.random() * 4 + 2,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            xOffset: 0
        });
    }
    
    // Wave parameters
    const waveCount = 3;
    const waves = [];
    
    for (let i = 0; i < waveCount; i++) {
        waves.push({
            amplitude: 5 + Math.random() * 10,
            frequency: 0.005 + Math.random() * 0.01,
            speed: 0.05 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2,
            interactivePoints: []
        });
    }
    
    // Ripple effects
    let ripples = [];
    let mousePosition = null;
    let isHovering = false;
    let lastInteractionTime = 0;
    
    // Handle mouse/touch movement
    function handlePointerMove(e) {
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        
        // Get coordinates based on event type
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        mousePosition = { x, y };
        isHovering = true;
        
        // Only create a new ripple if enough time has passed (throttle)
        const now = Date.now();
        if (now - lastInteractionTime > 100) {
            createRipple(x, y);
            lastInteractionTime = now;
        }
    }
    
    function handlePointerLeave() {
        isHovering = false;
        mousePosition = null;
    }
    
    // Create a new ripple effect
    function createRipple(x, y) {
        const newRipple = {
            x,
            y,
            radius: 0,
            maxRadius: 50 + Math.random() * 30,
            opacity: 0.7,
            speed: 1 + Math.random() * 0.5 * settings.interactionStrength
        };
        
        ripples.push(newRipple);
    }
    
    // Add event listeners for interaction
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove);
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('touchend', handlePointerLeave);
    
    // Animation
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply global opacity
        ctx.globalAlpha = settings.opacity;
        
        // Calculate water height
        const waterHeight = typeof settings.height === 'string' && settings.height.includes('%') 
            ? (parseInt(settings.height) / 100) * canvas.height 
            : parseInt(settings.height);
        
        const waterTop = canvas.height - waterHeight;
        
        // Draw water body
        ctx.fillStyle = settings.color;
        ctx.beginPath();
        ctx.rect(0, waterTop, canvas.width, waterHeight);
        ctx.fill();
        
        // Update interactive points for waves
        if (mousePosition && isHovering) {
            const { x, y } = mousePosition;
            
            // Only add interactive points if mouse is near the water surface
            if (Math.abs(y - waterTop) < 100) {
                for (const wave of waves) {
                    // Add a new interactive point with decay
                    wave.interactivePoints.push({
                        x,
                        strength: 15 * settings.interactionStrength,
                        decay: 0.05
                    });
                }
            }
        }
        
        // Draw waves with interactive distortion
        ctx.fillStyle = settings.waveColor;
        ctx.globalAlpha = settings.opacity * 0.3;
        
        for (const wave of waves) {
            wave.phase += wave.speed;
            
            // Update and filter interactive points
            wave.interactivePoints = wave.interactivePoints
                .map(point => ({
                    ...point,
                    strength: point.strength * (1 - point.decay)
                }))
                .filter(point => point.strength > 0.5);
            
            ctx.beginPath();
            ctx.moveTo(0, waterTop);
            
            for (let x = 0; x < canvas.width; x += 5) {
                // Base wave
                let y = Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
                
                // Add interactive distortion
                for (const point of wave.interactivePoints) {
                    const distance = Math.abs(x - point.x);
                    if (distance < 200) {
                        const influence = (1 - distance / 200) * point.strength;
                        y += Math.sin((x - point.x) * 0.05) * influence;
                    }
                }
                
                ctx.lineTo(x, waterTop + y);
            }
            
            ctx.lineTo(canvas.width, waterTop);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.globalAlpha = settings.opacity;
        
        // Draw ripples
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        
        ripples = ripples
            .map(ripple => {
                // Draw ripple
                ctx.beginPath();
                ctx.globalAlpha = ripple.opacity * settings.opacity;
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Update ripple
                return {
                    ...ripple,
                    radius: ripple.radius + ripple.speed,
                    opacity: ripple.opacity * 0.95
                };
            })
            .filter(ripple => ripple.opacity > 0.05 && ripple.radius < ripple.maxRadius);
        
        ctx.globalAlpha = settings.opacity;
        
        // Draw bubbles with interactive movement
        ctx.fillStyle = settings.bubbleColor;
        
        for (const bubble of bubbles) {
            // Add slight horizontal movement based on mouse position
            if (mousePosition && isHovering) {
                const distX = mousePosition.x - bubble.x;
                const distY = mousePosition.y - bubble.y;
                const dist = Math.sqrt(distX * distX + distY * distY);
                
                if (dist < 150) {
                    // Gentle push effect
                    const pushFactor = (1 - dist / 150) * 0.5 * settings.interactionStrength;
                    bubble.xOffset += (distX / dist) * pushFactor;
                }
            }
            
            // Apply damping to xOffset
            bubble.xOffset *= 0.95;
            
            // Draw bubble
            ctx.beginPath();
            ctx.globalAlpha = bubble.opacity * settings.opacity;
            ctx.arc(bubble.x + bubble.xOffset, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move bubble up
            bubble.y -= bubble.speed;
            
            // Reset bubble if it goes off screen
            if (bubble.y < waterTop - 20) {
                bubble.y = canvas.height + Math.random() * 20;
                bubble.x = Math.random() * canvas.width;
                bubble.xOffset = 0;
            }
        }
        
        ctx.globalAlpha = 1;
        
        requestAnimationFrame(render);
    }
    
    render();
}

/**
 * Initialize Bubble Canvas
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} options - Configuration options
 */
function initBubbleCanvas(canvasId, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Default options
    const settings = {
        bubbleColor: options.bubbleColor || '#ffffff',
        bubbleDensity: options.bubbleDensity || 'low',
        opacity: options.opacity || 0.3
    };
    
    // Set canvas dimensions
    function resizeCanvas() {
        const parent = canvas.parentElement;
        if (!parent) return;
        
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create bubbles
    const bubbleCount = settings.bubbleDensity === 'low' ? 20 : 
                        settings.bubbleDensity === 'medium' ? 40 : 60;
    
    const bubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * canvas.height,
            radius: Math.random() * 5 + 2,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    
    // Animation
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bubbles
        ctx.fillStyle = settings.bubbleColor;
        
        for (const bubble of bubbles) {
            ctx.beginPath();
            ctx.globalAlpha = bubble.opacity * settings.opacity;
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move bubble up
            bubble.y -= bubble.speed;
            
            // Add slight horizontal movement
            bubble.x += Math.sin(bubble.y * 0.01) * 0.5;
            
            // Reset bubble if it goes off screen
            if (bubble.y < -20) {
                bubble.y = canvas.height + Math.random() * 20;
                bubble.x = Math.random() * canvas.width;
            }
        }
        
        ctx.globalAlpha = 1;
        
        requestAnimationFrame(render);
    }
    
    render();
}