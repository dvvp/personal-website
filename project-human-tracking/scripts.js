/**
 * ============================================================
scripts.js for projects
 * ============================================================
 */

// Import showModal function from helpers
import { showModal } from '../helpers.js';

// GitHub repository mapping
const GITHUB_REPOSITORIES = {
  // 'project-human-tracking.html': 'https://github.com/dvvp/human-tracking-robot',
  // 'project-fleet-monitoring.html': 'https://github.com/dvvp/fleet-monitoring-system',
  // Add more project mappings here as needed
  // 'project-example.html': 'https://github.com/dvvp/example-repo',
};

// View Code button functionality
document.addEventListener('DOMContentLoaded', () => {
  const viewCodeBtn = document.getElementById('viewCodeBtn');
  if (viewCodeBtn) {
      viewCodeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Get the current page filename
          const currentPage = window.location.pathname.split('/').pop();
          
          // Check if there's a GitHub repository mapped for this project
          if (GITHUB_REPOSITORIES[currentPage]) {
              // Open the GitHub repository in a new tab
              window.open(GITHUB_REPOSITORIES[currentPage], '_blank', 'noopener,noreferrer');
          } else {
              // Show custom modal for projects without repositories
              showModal({
                  title: 'Code is <strong>private</strong>',
                  message: 'Reach out if you need access.',
                  buttonText: 'Got it'
              });
          }
      });
  }
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

// Scroll to top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopButton = document.getElementById('scrollToTop');
    const scrollIcon = scrollToTopButton?.querySelector('.scroll-icon');
    const html = document.documentElement;
    
    if (!scrollToTopButton || !scrollIcon) return;
    
    // Function to update scroll icon based on theme
    function updateScrollIcon() {
        const theme = html.getAttribute('data-theme');
        if (theme === 'dark') {
            scrollIcon.src = '/pictures/chevron-up-white.svg';
        } else {
            scrollIcon.src = '/pictures/chevron-up-black.svg';
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
        scrollIcon.src = '/pictures/chevron-up-white.svg';
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
    document.addEventListener('themeChanged', () => {
        setTimeout(updateScrollIcon, 100); // Small delay to ensure theme has changed
    });
    
    // Set initial scroll icon
    updateScrollIcon();
});