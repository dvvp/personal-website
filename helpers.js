// Reusable modal function
export function showModal(options = {}) {
    const {
        title = 'Modal Title',
        message = 'Modal message',
        buttonText = 'OK',
        onClose = null,
        allowOverlayClose = true,
        allowEscapeClose = true,
        maxWidth = '400px'
    } = options;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: var(--glass-bg);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 24px;
        padding: 40px;
        max-width: ${maxWidth};
        width: 90%;
        box-shadow: 0 8px 32px var(--shadow);
        text-align: center;
        transform: scale(0.8) translateY(20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    // Create modal content with customizable title and message
    modal.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: var(--text-primary); font-size: 20px; font-weight: 600;">
            ${title}
        </h3>
        <p style="margin: 0 0 24px 0; color: var(--text-secondary); font-size: 16px; line-height: 1.5;">
            ${message}
        </p>
        <button id="closeModal" style="
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">${buttonText}</button>
    `;
    
    // Add modal to page
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Trigger animation after DOM update
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1) translateY(0)';
    });
    
    // Close modal functionality
    const closeModal = () => {
        // Animate out
        overlay.style.opacity = '0';
        overlay.style.background = 'rgba(0, 0, 0, 0)';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8) translateY(20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            // Call onClose callback if provided
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        }, 300);
    };
    
    // Close on button click
    modal.querySelector('#closeModal').addEventListener('click', closeModal);
    
    // Close on overlay click (if enabled)
    if (allowOverlayClose) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
    
    // Close on escape key (if enabled)
    if (allowEscapeClose) {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    // Return close function for external control
    return closeModal;
}