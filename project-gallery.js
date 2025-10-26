// GitHub repository mapping
const GITHUB_REPOSITORIES = {
    // 'project-human-tracking.html': 'https://github.com/dvvp/human-tracking-robot',
    // 'project-fleet-monitoring.html': 'https://github.com/dvvp/fleet-monitoring-system',
    // Add more project mappings here as needed
    // 'project-example.html': 'https://github.com/dvvp/example-repo',
};

// Gallery functionality
class ProjectGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = document.querySelectorAll('.gallery-image');
        this.totalImages = this.images.length;
        this.captionVisible = true;
        this.isFullscreen = false;
        
        // Touch/swipe properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50; // Minimum distance for a swipe
        
        // Swipe hint element
        this.swipeHint = document.getElementById('swipeHint');
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updatePageCounter();
        this.updateDots();
        this.bindEvents();
        this.bindTouchEvents();
        this.updateThemeIcons();
    }
    
    createDots() {
        const dotsContainer = document.getElementById('galleryDots');
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalImages; i++) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to image ${i + 1}`);
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.showImage(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousImage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextImage());
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        fullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
        
        // Fullscreen icon hover events
        const fullscreenIcon = document.getElementById('fullscreenIcon');
        fullscreenToggle.addEventListener('mouseenter', () => this.setFullscreenIconHover(true));
        fullscreenToggle.addEventListener('mouseleave', () => this.setFullscreenIconHover(false));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isFullscreen || document.activeElement.tagName === 'BODY') {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousImage();
                        this.showControlsBriefly();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextImage();
                        this.showControlsBriefly();
                        break;
                    case 'Escape':
                        if (this.isFullscreen) {
                            this.exitFullscreen();
                        }
                        break;
                }
            }
        });
        
        // Theme change listener
        document.addEventListener('themeChanged', () => this.updateThemeIcons());
        
        // Listen for browser fullscreen changes to sync internal state
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }
    
    bindTouchEvents() {
        const galleryContainer = document.querySelector('.gallery-container');
        
        if (galleryContainer) {
            // Touch start
            galleryContainer.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            // Touch move - prevent default browser gestures when swiping
            galleryContainer.addEventListener('touchmove', (e) => {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = currentX - this.touchStartX;
                const deltaY = currentY - this.touchStartY;
                
                // If horizontal swipe detected, prevent default to stop browser gestures
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Touch end
            galleryContainer.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.touchEndY = e.changedTouches[0].clientY;
                this.handleSwipe();
            }, { passive: true });
        }
    }
    
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Check if it's a horizontal swipe (more horizontal than vertical movement)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous image
                this.previousImage();
            } else {
                // Swipe left - go to next image
                this.nextImage();
            }
            
            // Hide swipe hint after first swipe
            this.hideSwipeHint();
        }
    }
    
    hideSwipeHint() {
        if (this.swipeHint && !this.swipeHint.classList.contains('hidden')) {
            // Add hidden class to trigger fade-out animation
            this.swipeHint.classList.add('hidden');
        }
    }
    
    showImage(index) {
        // Hide all images
        this.images.forEach(img => img.classList.remove('active'));
        
        // Show current image
        this.images[index].classList.add('active');
        
        // Update caption
        const caption = this.images[index].dataset.caption;
        document.getElementById('galleryCaption').querySelector('p').textContent = caption;
        
        this.updatePageCounter();
        this.updateDots();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages;
        this.showImage(this.currentIndex);
    }
    
    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
        this.showImage(this.currentIndex);
    }
    
    updatePageCounter() {
        document.getElementById('currentPage').textContent = this.currentIndex + 1;
        document.getElementById('totalPages').textContent = this.totalImages;
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const gallery = document.getElementById('projectGallery');
        gallery.classList.add('fullscreen');
        this.isFullscreen = true;
        this.updateFullscreenIcon();
        
        // Request fullscreen
        if (gallery.requestFullscreen) {
            gallery.requestFullscreen();
        } else if (gallery.webkitRequestFullscreen) {
            gallery.webkitRequestFullscreen();
        } else if (gallery.msRequestFullscreen) {
            gallery.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        const gallery = document.getElementById('projectGallery');
        gallery.classList.remove('fullscreen');
        this.isFullscreen = false;
        this.updateFullscreenIcon();
        
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    updateFullscreenIcon() {
        const icon = document.getElementById('fullscreenIcon');
        const theme = document.documentElement.getAttribute('data-theme');
        
        // Store current state
        this.currentIconTheme = theme;
        this.currentIconIsFullscreen = this.isFullscreen;
        
        this.applyFullscreenIcon(this.currentIconIsFullscreen, this.currentIconTheme);
    }
    
    applyFullscreenIcon(isFullscreen, theme) {
        const icon = document.getElementById('fullscreenIcon');
        
        if (isFullscreen) {
            icon.src = theme === 'dark' ? 'pictures/minimize-white.svg' : 'pictures/minimize-black.svg';
        } else {
            icon.src = theme === 'dark' ? 'pictures/maximize-white.svg' : 'pictures/maximize-black.svg';
        }
    }
    
    setFullscreenIconHover(isHovered) {
        if (isHovered) {
            // Use white icon on hover regardless of theme
            const icon = document.getElementById('fullscreenIcon');
            if (this.isFullscreen) {
                icon.src = 'pictures/minimize-white.svg';
            } else {
                icon.src = 'pictures/maximize-white.svg';
            }
        } else {
            // Revert to theme-based icon
            this.applyFullscreenIcon(this.isFullscreen, document.documentElement.getAttribute('data-theme'));
        }
    }
    
    updateThemeIcons() {
        this.updateFullscreenIcon();
    }
    
    showControlsBriefly() {
        // Temporarily show controls when navigating via keyboard
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            galleryContainer.classList.add('show-controls');
            setTimeout(() => {
                galleryContainer.classList.remove('show-controls');
            }, 2000); // Show for 2 seconds
        }
    }
    
    handleFullscreenChange() {
        // Check if the document is actually in fullscreen mode
        const isCurrentlyFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        // If browser exited fullscreen but gallery thinks it's still fullscreen
        if (!isCurrentlyFullscreen && this.isFullscreen) {
            this.exitFullscreen();
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectGallery();
});

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

// Import showModal function from helpers
import { showModal } from './helpers.js';