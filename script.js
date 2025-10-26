// Gradient Descent Loading Screen
async function showGradientDescentLoader() {
    return new Promise((resolve) => {
        // Array of different loading phrases
        const loadingPhrases = [
            "Optimizing page weights...",
            "Descending gradients to render UI...",        
            "Computing optimal layout...",
            "Converging to stable page state...",
            "Minimizing page loss function...",
            "Training interface parameters...", 
            "Performing gradient updates on page elements..."
        ];
        
        // Randomly select a phrase
        const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
        
        // Create loader overlay
        const loader = document.createElement('div');
        loader.id = 'gradient-descent-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-title">${randomPhrase}</div>
                <div class="loader-logs" id="loaderLogs"></div>
                <div class="loader-progress">
                    <div class="loader-progress-bar" id="loaderProgressBar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);

        const logsContainer = document.getElementById('loaderLogs');
        const progressBar = document.getElementById('loaderProgressBar');
        
        // Generate gradient descent logs
        const iterations = 10;
        let currentIter = 0;
        
        // Initial values
        let loss = 12.345678;
        let gradNorm = 4.567890;
        const lr = 0.010000;
        
        function addLog() {
            if (currentIter <= iterations) {
                const iter = currentIter * 100;
                const logLine = document.createElement('div');
                logLine.className = 'log-line';
                logLine.textContent = `Iter ${String(iter).padStart(4, '0')} | Loss: ${loss.toFixed(6)} | Grad Norm: ${gradNorm.toFixed(6)} | LR: ${lr.toFixed(6)}`;
                logsContainer.appendChild(logLine);
                
                // Scroll to bottom after DOM update
                setTimeout(() => {
                    logsContainer.scrollTop = logsContainer.scrollHeight;
                }, 10);
                
                // Update progress bar
                const progress = (currentIter / iterations) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Decay loss and grad norm (simulating convergence)
                loss = loss * 0.7 + Math.random() * 0.1;
                gradNorm = gradNorm * 0.65 + Math.random() * 0.05;
                
                currentIter++;
                
                if (currentIter <= iterations) {
                    setTimeout(addLog, 80 + Math.random() * 40); // Random delay between 80-120ms
                } else {
                    // Add final message
                    setTimeout(() => {
                        const finalLine = document.createElement('div');
                        finalLine.className = 'log-line success';
                        finalLine.textContent = '✓ Training complete! Loading page...';
                        logsContainer.appendChild(finalLine);
                        
                        // Scroll to bottom after DOM update
                        setTimeout(() => {
                            logsContainer.scrollTop = logsContainer.scrollHeight;
                        }, 10);
                        
                        // Fade out and remove loader
                        setTimeout(() => {
                            loader.style.opacity = '0';
                            setTimeout(() => {
                                loader.remove();
                                resolve(); // Resolve the promise when loader is completely removed
                            }, 300);
                        }, 400);
                    }, 200);
                }
            }
        }
        
        // Start logging after a short delay
        setTimeout(addLog, 300);
    });
}

// Add gradient descent loader to project links
document.addEventListener('DOMContentLoaded', function() {
    // Find all project card links
    const projectLinks = document.querySelectorAll('.project-card');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault(); // Prevent immediate navigation
            const href = this.getAttribute('href');
            
            // Show loader
            await showGradientDescentLoader();
            
            // Navigate after loader completes
            window.location.href = href;
        });
    });
});

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
    
    // Dispatch custom event for theme change
    const themeChangeEvent = new CustomEvent('themeChanged', {
        detail: { theme: newTheme }
    });
    document.dispatchEvent(themeChangeEvent);
});

function initRiseAnimations() {

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

// Change icon to white when button is hovered
scrollToTopButton.addEventListener('mouseenter', () => {
    scrollIcon.src = 'pictures/chevron-up-white.svg';
});

scrollToTopButton.addEventListener('mouseleave', () => {
    updateScrollIcon(); // Revert to theme-based icon
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

    const texts = ['Robotics Engineer 🤖', 'Data Scientist 📊', 'AI/ML Researcher 🧠', 'Full Stack Developer 👨‍💻'];
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

function initSinglePageNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    // Function to show/hide sections based on active nav
    function toggleSectionsVisibility() {
        let activeLink = null;
        
        // Find which nav link is active
        navLinks.forEach(link => {
            if (link.classList.contains('active')) {
                activeLink = link;
            }
        });

        // Show active section, hide others
        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionHash = `#${sectionId}`;
            
            if (activeLink && activeLink.getAttribute('href') === sectionHash) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    }

    // Function to update active navigation link and URL hash
    function updateActiveNavLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Account for fixed nav
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Toggle section visibility based on active nav
        toggleSectionsVisibility();

        // Update the URL hash without scrolling
        if (currentSection && window.location.hash !== `#${currentSection}`) {
            history.replaceState(null, '', `#${currentSection}`);
        }
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Update on page load
    // First, set initial active state based on URL hash
    const hash = window.location.hash;
    if (hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    } else {
        // If no hash, set "About" as active by default
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#about') {
                link.classList.add('active');
            }
        });
    }
    updateActiveNavLink();

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href.startsWith('#')) return; // Skip cross-page links

            e.preventDefault();
            
            // Update active nav link immediately
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Update section visibility immediately
            toggleSectionsVisibility();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL hash immediately on click
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initSinglePageNavigation);
