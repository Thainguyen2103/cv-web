// ===================================
// Nguyễn Hữu Thái — Interactive CV
// ===================================

(function () {
    'use strict';

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function onScroll() {
        // Navbar shadow on scroll
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });

        // Close mobile nav when link clicked
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
            });
        });
    }

    // --- Scroll reveal animation ---
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.card, .section-header, .hero-badge, .hero-name, .hero-title, .hero-info, .hero-socials, .contact-card'
        );

        revealElements.forEach((el) => {
            el.classList.add('reveal');
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Staggered animation for grid items
                        const parent = entry.target.parentElement;
                        if (parent) {
                            const siblings = Array.from(parent.children).filter((c) =>
                                c.classList.contains('reveal')
                            );
                            const index = siblings.indexOf(entry.target);
                            entry.target.style.transitionDelay = index * 80 + 'ms';
                        }

                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    }

    // --- Animate language bars on scroll ---
    function initLanguageBars() {
        const bars = document.querySelectorAll('.lang-fill');
        bars.forEach((bar) => {
            const target = bar.style.width;
            bar.style.width = '0%';

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                bar.style.width = target;
                            }, 300);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(bar.parentElement);
        });
    }

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // --- Interactive skill tags hover glow ---
    document.querySelectorAll('.skill-tag').forEach((tag) => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-2px)';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0)';
        });
    });

    // --- Achievement cards tilt effect ---
    document.querySelectorAll('.achievement-item').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- Language Switcher ---
    let currentLang = localStorage.getItem('cv-lang') || 'vi';
    const langSwitcher = document.getElementById('langSwitcher');
    const langSwitcherBtn = document.getElementById('langSwitcherBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langFlagEl = document.getElementById('langFlag');
    const langCodeEl = document.getElementById('langCode');

    function applyLanguage(lang) {
        const t = translations[lang];
        if (!t) return;

        currentLang = lang;
        localStorage.setItem('cv-lang', lang);

        // Update all data-i18n text elements
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });

        // Update all data-i18n-html elements (innerHTML)
        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const key = el.getAttribute('data-i18n-html');
            if (t[key]) el.innerHTML = t[key];
        });

        // Update switcher button
        const info = langLabels[lang];
        if (info) {
            // langFlag element now shows a static globe SVG — no emoji update needed
            langCodeEl.textContent = lang.toUpperCase();
        }

        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach((opt) => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // Update html lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    }

    // Toggle dropdown
    langSwitcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher.classList.toggle('open');
    });

    // Language option click
    document.querySelectorAll('.lang-option').forEach((opt) => {
        opt.addEventListener('click', () => {
            const lang = opt.getAttribute('data-lang');
            applyLanguage(lang);
            langSwitcher.classList.remove('open');
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
        }
    });

    // --- Initialize ---
    initScrollReveal();
    initLanguageBars();

    // Apply language on load (always, to ensure content matches)
    applyLanguage(currentLang);
})();
