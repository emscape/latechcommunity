/* ===========================
   MAIN.JS
   Entry point and event delegation
   =========================== */

/**
 * LA Tech Community Website
 * Main JavaScript module - minimal vanilla JS for progressive enhancement
 */

// DOM Elements
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');

/**
 * Initialize mobile navigation toggle
 */
function initMobileNav() {
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            closeMenu();
        }
    });
}

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isExpanded);
}

/**
 * Set menu open/closed state
 * @param {boolean} isOpen - Whether menu should be open
 */
function setMenuState(isOpen) {
    navToggle.setAttribute('aria-expanded', isOpen);
    navMenu.classList.toggle('active', isOpen);
}

/**
 * Close mobile menu
 */
function closeMenu() {
    setMenuState(false);
}

/**
 * Smooth scroll to sections (accessible)
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Close mobile menu if open
        closeMenu();
        
        // Scroll to element with smooth behavior
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Optional: Focus the section for keyboard users
        element.focus({ preventScroll: true });
    }
}

/**
 * Make scrollTo globally available for onclick handlers
 */
window.scrollTo = scrollTo;

/**
 * Handle keyboard accessibility for buttons
 */
function initKeyboardAccessibility() {
    // Find all interactive elements that might be divs styled as buttons
    const clickableElements = document.querySelectorAll('a, button, [role=\"button\"]');
    
    clickableElements.forEach(element => {
        // Ensure focus is visible
        element.addEventListener('focus', (e) => {
            e.target.style.outline = '2px solid #00BFFF';
            e.target.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', (e) => {
            e.target.style.outline = 'none';
        });
    });
}

/**
 * Detect if user prefers reduced motion
 */
function respectReducedMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
}

/**
 * Initialize analytics placeholder (optional)
 * Replace with actual analytics service if needed
 */
function initAnalytics() {
    // Placeholder for future analytics implementation
    // Could integrate with Google Analytics, Plausible, or similar
    console.log('LA Tech Community: Analytics module loaded');
}

/**
 * Performance: Lazy load images if supported
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Form validation helper (optional)
 * @param {HTMLFormElement} form - The form to validate
 */
function validateForm(form) {
    if (!form) return true;
    
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.setAttribute('aria-invalid', 'true');
            input.classList.add('error');
        } else {
            input.setAttribute('aria-invalid', 'false');
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * Expose form validation globally if needed
 */
window.validateForm = validateForm;

/**
 * Main initialization function
 * Called when DOM is ready
 */
function init() {
    // Run initialization modules
    initMobileNav();
    initKeyboardAccessibility();
    respectReducedMotion();
    initLazyLoading();
    initAnalytics();
    
    console.log('✓ LA Tech Community website initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready (e.g., script loaded async)
    init();
}

/**
 * Export for testing or modular usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMenu,
        closeMenu,
        scrollTo,
        validateForm,
        setMenuState
    };
}
