// ---- Video Morphing Background on Scroll ----
const videos = [
    document.getElementById('bg-vid-1'),
    document.getElementById('bg-vid-2'),
    document.getElementById('bg-vid-3'),
    document.getElementById('bg-vid-4'),
    document.getElementById('bg-vid-5')
];
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'mohit_waykole_resume_1.pdf';  // ← make sure this path is correct
    link.download = 'Mohit_Waykole_CV.pdf';
    link.click();
}

function updateVideoBackground() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    // Safety check if body isn't tall enough to scroll
    if (maxScroll <= 0) {
        if (videos[0]) videos[0].style.opacity = 1;
        return;
    }

    let scrollFraction = scrollY / maxScroll;
    if (scrollFraction < 0) scrollFraction = 0;
    if (scrollFraction > 1) scrollFraction = 1;

    // 4 videos -> 3 intervals
    const numIntervals = videos.length - 1;
    const intervalSize = 1 / numIntervals;

    videos.forEach((vid, index) => {
        if (!vid) return;
        const center = index * intervalSize;
        const distance = Math.abs(scrollFraction - center);

        let opacity = 1 - (distance / intervalSize);
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        vid.style.opacity = opacity;
    });
}

window.addEventListener('scroll', updateVideoBackground, { passive: true });
window.addEventListener('resize', updateVideoBackground);

// Ensure videos play
document.addEventListener('DOMContentLoaded', () => {
    videos.forEach(vid => {
        if (vid) vid.play().catch(e => console.log("Video autoplay blocked", e));
    });
    updateVideoBackground();
});

// ---- Scroll Reveal Animations ----
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observe
document.querySelectorAll('.about-card, .timeline-item, .skill-category, .project-card, .lang-tag, .contact-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ---- CV Download ----

