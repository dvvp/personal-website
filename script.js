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
