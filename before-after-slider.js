/**
 * Before-After Image Slider
 * Creates interactive sliders to compare before and after images
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all before-after sliders
    const sliders = document.querySelectorAll('.before-after-slider');
    
    sliders.forEach(slider => {
        initBeforeAfterSlider(slider);
    });
});

/**
 * Initialize Before-After Slider
 * @param {HTMLElement} sliderElement - The slider container element
 */
function initBeforeAfterSlider(sliderElement) {
    const container = sliderElement.querySelector('.before-after-container');
    const beforeContainer = sliderElement.querySelector('.before-image-container');
    const sliderHandle = sliderElement.querySelector('.slider-handle');
    
    if (!container || !beforeContainer || !sliderHandle) return;
    
    let isDragging = false;
    let startPosition = 50; // Default position (50%)
    
    // Set initial position
    updateSliderPosition(startPosition);
    
    // Handle mouse/touch events
    container.addEventListener('mousedown', startDrag);
    container.addEventListener('touchstart', startDrag, { passive: true });
    
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateSliderPosition(startPosition);
    });
    
    /**
     * Start dragging
     * @param {Event} e - Mouse or touch event
     */
    function startDrag(e) {
        isDragging = true;
        container.style.cursor = 'grabbing';
        
        // Prevent default behavior for mouse events (not for touch)
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
        
        // Calculate new position immediately on click/touch
        updatePositionFromEvent(e);
    }
    
    /**
     * Handle dragging
     * @param {Event} e - Mouse or touch event
     */
    function drag(e) {
        if (!isDragging) return;
        
        // Prevent default to stop scrolling on mobile while dragging
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
        
        updatePositionFromEvent(e);
    }
    
    /**
     * End dragging
     */
    function endDrag() {
        isDragging = false;
        container.style.cursor = 'ew-resize';
    }
    
    /**
     * Update slider position based on event
     * @param {Event} e - Mouse or touch event
     */
    function updatePositionFromEvent(e) {
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        
        // Get client X based on event type
        const clientX = e.type.includes('touch') 
            ? e.touches[0].clientX 
            : e.clientX;
        
        // Calculate position percentage
        let position = ((clientX - containerRect.left) / containerWidth) * 100;
        
        // Clamp position between 0 and 100
        position = Math.max(0, Math.min(100, position));
        
        // Update position
        startPosition = position;
        updateSliderPosition(position);
    }
    
    /**
     * Update slider position
     * @param {number} position - Position percentage (0-100)
     */
    function updateSliderPosition(position) {
        beforeContainer.style.width = `${position}%`;
        sliderHandle.style.left = `${position}%`;
    }
}