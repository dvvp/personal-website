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

// Image Gallery functionality
function initGallery() {
    const galleries = document.querySelectorAll('.project-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-image');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');
        const indicators = gallery.querySelectorAll('.gallery-indicator');
        const counter = gallery.querySelector('.gallery-counter');
        const caption = gallery.querySelector('.gallery-caption');
        const infoBtn = gallery.querySelector('.gallery-info-btn');
        
        // Build captions array from data attributes or alt text
        const captions = Array.from(images).map(img => 
            img.getAttribute('data-caption') || img.getAttribute('alt') || ''
        );
        
        // Check if any captions exist
        const hasCaptions = captions.some(cap => cap.trim() !== '');
        
        // Initialize caption visibility state
        let captionVisible = false;
        
        // Info button click handler
        if (infoBtn && caption) {
            infoBtn.addEventListener('click', () => {
                captionVisible = !captionVisible;
                
                if (captionVisible) {
                    caption.classList.remove('hidden');
                    caption.classList.add('visible');
                    infoBtn.classList.add('active');
                } else {
                    caption.classList.remove('visible');
                    caption.classList.add('hidden');
                    infoBtn.classList.remove('active');
                }
            });
        }
        
        if (images.length <= 1) {
            // Hide navigation if only one image
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (counter) counter.style.display = 'none';
            gallery.querySelectorAll('.gallery-indicators').forEach(ind => ind.style.display = 'none');
            
            // Initialize caption for single image
            if (caption && hasCaptions && captions[0].trim() !== '') {
                caption.textContent = captions[0];
                caption.classList.add('hidden');
            } else if (caption) {
                caption.classList.add('hidden');
            }
            
            // Hide info button if no captions
            if (infoBtn && !hasCaptions) {
                infoBtn.style.display = 'none';
            }
            
            return;
        }
        
        let currentIndex = 0;
        
        function updateGallery(newIndex) {
            // Remove active class from current image and indicator
            images[currentIndex].classList.remove('active');
            if (indicators[currentIndex]) {
                indicators[currentIndex].classList.remove('active');
            }
            
            // Update index
            currentIndex = newIndex;
            
            // Add active class to new image and indicator
            images[currentIndex].classList.add('active');
            if (indicators[currentIndex]) {
                indicators[currentIndex].classList.add('active');
            }
            
            // Update counter
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${images.length}`;
            }
            
            // Update caption
            if (caption && hasCaptions) {
                const currentCaption = captions[currentIndex].trim();
                if (currentCaption !== '') {
                    caption.textContent = currentCaption;
                    // Only show caption if it was previously visible
                    if (captionVisible) {
                        caption.classList.remove('hidden');
                        caption.classList.add('visible');
                    } else {
                        caption.classList.remove('visible');
                        caption.classList.add('hidden');
                    }
                } else {
                    caption.classList.remove('visible');
                    caption.classList.add('hidden');
                }
            }
        }
        
        function nextImage() {
            const newIndex = (currentIndex + 1) % images.length;
            updateGallery(newIndex);
        }
        
        function prevImage() {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery(newIndex);
        }
        
        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', prevImage);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextImage);
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                updateGallery(index);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });
        
        // Initialize first image, counter, and caption
        images[0].classList.add('active');
        if (indicators[0]) {
            indicators[0].classList.add('active');
        }
        if (counter) {
            counter.textContent = `1 / ${images.length}`;
        }
        if (caption && hasCaptions && captions[0].trim() !== '') {
            caption.textContent = captions[0];
            caption.classList.add('hidden');
        } else if (caption) {
            caption.classList.add('hidden');
        }
        
        // Hide info button if no captions
        if (infoBtn && !hasCaptions) {
            infoBtn.style.display = 'none';
        }
    });
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);
