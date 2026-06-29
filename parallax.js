// ============================================
//  PARALLAX SCROLLING ENGINE
//  Silent Hill dark/red theme — Mohit Waykole
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Inject DOM elements ----

    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);

    // Fog overlay
    const fog = document.createElement('div');
    fog.className = 'parallax-fog';
    document.body.appendChild(fog);

    // Glowing red orbs
    [1, 2, 3].forEach(n => {
        const orb = document.createElement('div');
        orb.className = `parallax-orb parallax-orb-${n}`;
        document.body.appendChild(orb);
        // Fade in after a short delay
        setTimeout(() => orb.classList.add('visible'), 300 * n);
    });

    // Scroll indicator on hero
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.position = 'relative';
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = `<span>Scroll</span><div class="arrow"></div>`;
        hero.appendChild(indicator);

        // Hide indicator once user scrolls
        window.addEventListener('scroll', () => {
            indicator.style.opacity = window.scrollY > 80 ? '0' : '';
        }, { passive: true });
    }

    // ---- Add parallax classes to existing elements ----

    // Hero content & visual
    const heroContent = document.querySelector('.hero-content');
    const heroVisual  = document.querySelector('.hero-visual');
    if (heroContent) heroContent.classList.add('parallax-hero');
    if (heroVisual)  heroVisual.classList.add('parallax-visual');

    // Section titles
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('parallax-title');
    });

    // Cards: add depth-card for 3D tilt
    document.querySelectorAll(
        '.about-card, .cert-card, .project-card, .skill-category, .timeline-item, .contact-box, .objective-box'
    ).forEach(el => el.classList.add('depth-card'));

    // Alternate drift direction on skill/cert cards
    document.querySelectorAll('.skill-category:nth-child(odd), .cert-card:nth-child(odd)').forEach(el => {
        el.classList.add('drift-left');
    });
    document.querySelectorAll('.skill-category:nth-child(even), .cert-card:nth-child(even)').forEach(el => {
        el.classList.add('drift-right');
    });

    // ---- Scroll progress bar ----
    function updateProgressBar() {
        const scrollTop  = window.scrollY;
        const maxScroll  = document.body.scrollHeight - window.innerHeight;
        const pct        = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        progressBar.style.width = pct + '%';
    }

    // ---- Nav glow on scroll ----
    const nav = document.querySelector('nav');
    function updateNav() {
        if (!nav) return;
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ---- Section title line reveal (IntersectionObserver) ----
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('line-revealed');
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.section-title').forEach(el => titleObserver.observe(el));

    // ---- Core parallax on scroll ----
    function onScroll() {
        const scrollY = window.scrollY;

        updateProgressBar();
        updateNav();

        // Hero content moves up slightly (depth effect)
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
            heroContent.style.opacity   = Math.max(0, 1 - scrollY / 500);
        }

        // Hero visual moves at a different speed
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
        }

        // Fog moves opposite (slow)
        fog.style.transform = `translateY(${scrollY * -0.08}px)`;

        // Orbs drift at different depths
        const orbs = document.querySelectorAll('.parallax-orb');
        const speeds = [0.18, -0.12, 0.09];
        orbs.forEach((orb, i) => {
            orb.style.transform = `translateY(${scrollY * speeds[i]}px)`;
        });

        // Drift cards left/right as they scroll past
        document.querySelectorAll('.drift-left').forEach(el => {
            const rect  = el.getBoundingClientRect();
            const vh    = window.innerHeight;
            const ratio = (vh - rect.top) / (vh + rect.height);
            const drift = (ratio - 0.5) * -18;
            el.style.transform = `translateX(${drift}px)`;
        });

        document.querySelectorAll('.drift-right').forEach(el => {
            const rect  = el.getBoundingClientRect();
            const vh    = window.innerHeight;
            const ratio = (vh - rect.top) / (vh + rect.height);
            const drift = (ratio - 0.5) * 18;
            el.style.transform = `translateX(${drift}px)`;
        });

        // Section titles slight upward parallax
        document.querySelectorAll('.parallax-title').forEach(el => {
            const rect   = el.getBoundingClientRect();
            const center = rect.top + rect.height / 2 - window.innerHeight / 2;
            el.style.transform = `translateY(${center * -0.04}px)`;
        });
    }

    // ---- 3D Card tilt on mouse move ----
    function initTilt() {
        document.querySelectorAll('.depth-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect    = card.getBoundingClientRect();
                const centerX = rect.left + rect.width  / 2;
                const centerY = rect.top  + rect.height / 2;
                const rotateX = ((e.clientY - centerY) / rect.height) * -8;
                const rotateY = ((e.clientX - centerX) / rect.width)  *  8;
                card.style.transform =
                    `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ---- rAF loop for smooth parallax ----
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Init on load
    onScroll();
    initTilt();

    // Re-init tilt when new cards may appear
    window.addEventListener('resize', initTilt);
});
