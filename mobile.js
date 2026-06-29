// ---- Mobile Responsiveness Logic ----
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        // Toggle mobile menu
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between hamburger bars and close cross
            if (navLinks.classList.contains('active')) {
                menuToggle.classList.remove('fa-bars');
                menuToggle.classList.add('fa-xmark');
            } else {
                menuToggle.classList.remove('fa-xmark');
                menuToggle.classList.add('fa-bars');
            }
        });

        // Close menu when a navigation link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('fa-xmark');
                menuToggle.classList.add('fa-bars');
            });
        });
    }
});
