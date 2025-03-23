/**
 * Main JavaScript
 * Handles general site functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', false);
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const formData = new FormData(contactForm);
            let isValid = true;
            
            for (const [key, value] of formData.entries()) {
                const input = contactForm.querySelector(`[name="${key}"]`);
                
                if (input.hasAttribute('required') && !value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                // For this example, we'll just show a success message
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p>Thank you! Your request has been submitted successfully. We'll get back to you shortly.</p>
                `;
                
                // Replace form with success message
                contactForm.style.display = 'none';
                contactForm.parentNode.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
            }
        });
    }
    
    // Add current year to footer copyright
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Lazy load images as they come into view
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add animation classes as elements come into view
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Add slide-up animation to children
                    const animateElements = entry.target.querySelectorAll('.section-header, .service-details, .review-card');
                    animateElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('slide-up');
                        }, index * 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
});