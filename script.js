// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Get current theme (already set in head)
const currentTheme = html.getAttribute('data-theme');

// Set initial toggle state
if (currentTheme === 'dark') {
    themeToggle.classList.add('active');
}

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle the active class for animation
    themeToggle.classList.toggle('active');
});

// Rise animation functionality
function initRiseAnimations() {
    // Elements to animate
    const animatedElements = [
        '.about-section',
        '.social-links', 
        '.hero',
        '.project-category',
        '.project-card',
        '.cv-section',
        '.cv-item',
        '.project-section',
        '.back-button',
        '.project-hero-image'
    ];

    // Function to add animation classes
    function addAnimationClasses() {
        animatedElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Add staggered delays for multiple elements of the same type
                if (elements.length > 1) {
                    element.classList.add(`delay-${Math.min(index + 1, 6)}`);
                }
            });
        });
    }

    // Function to trigger animations
    function triggerAnimations() {
        animatedElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('animate');
            });
        });
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    });

    // Initial setup
    addAnimationClasses();
    
    // Trigger initial animations after a short delay
    setTimeout(() => {
        triggerAnimations();
    }, 100);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initRiseAnimations);

// Re-initialize animations for dynamically loaded content
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRiseAnimations);
} else {
    initRiseAnimations();
}

// Scroll to top button functionality
const scrollToTopButton = document.getElementById('scrollToTop');
const scrollIcon = scrollToTopButton.querySelector('.scroll-icon');

// Function to update scroll icon based on theme
function updateScrollIcon() {
    const theme = html.getAttribute('data-theme');
    if (theme === 'dark') {
        scrollIcon.src = 'pictures/chevron-up-white.svg';
    } else {
        scrollIcon.src = 'pictures/chevron-up-black.svg';
    }
}

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

// Scroll to top when button is clicked
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Update scroll icon when theme changes
themeToggle.addEventListener('click', () => {
    setTimeout(updateScrollIcon, 100); // Small delay to ensure theme has changed
});

// Set initial scroll icon
updateScrollIcon();

// Typing animation functionality
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-animation');
    if (!typingElement) return;

    const texts = ['Robotics Engineer', 'Prospective Graduate Student'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // milliseconds
    let deletingSpeed = 50; // milliseconds
    let pauseTime = 2000; // milliseconds

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Delete characters
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = deletingSpeed;
        } else {
            // Type characters
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Check if we've finished typing the current text
        if (!isDeleting && charIndex === currentText.length) {
            // Pause before starting to delete
            setTimeout(() => {
                isDeleting = true;
                typeText();
            }, pauseTime);
            return;
        }

        // Check if we've finished deleting
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length; // Move to next text, loop back to first
            setTimeout(typeText, 500); // Pause before starting to type next text
            return;
        }

        // Continue typing/deleting
        setTimeout(typeText, typingSpeed);
    }

    // Start the animation
    typeText();
}

// Initialize typing animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initTypingAnimation);
