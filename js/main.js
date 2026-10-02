/* ============================================
   Ifeskon Enterprice ENGINEERING — INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. HEADER SCROLL EFFECT ---------- */
    const header = document.getElementById('siteHeader');
    const onScroll = () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- 2. MOBILE NAV TOGGLE ---------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- 3. SCROLL REVEAL ANIMATIONS ---------- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the reveal for siblings
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ---------- 4. ANIMATED COUNTERS (Hero Stats) ---------- */
    const counters = document.querySelectorAll('.stat-num');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1800;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ---------- 5. REVIEWS CAROUSEL ---------- */
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('reviewDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.review-card');
        let currentIndex = 0;
        let cardsPerView = 3;
        let autoPlayInterval;

        const updateCardsPerView = () => {
            const width = window.innerWidth;
            if (width <= 768) cardsPerView = 1;
            else if (width <= 1024) cardsPerView = 2;
            else cardsPerView = 3;
        };

        const maxIndex = () => Math.max(0, cards.length - cardsPerView);

        const buildDots = () => {
            dotsContainer.innerHTML = '';
            const totalDots = maxIndex() + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.className = 'review-dot' + (i === currentIndex ? ' active' : '');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        };

        const updateDots = () => {
            dotsContainer.querySelectorAll('.review-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goTo = (index) => {
            currentIndex = Math.max(0, Math.min(index, maxIndex()));
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 24; // matches 1.5rem
            track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            updateDots();
        };

        const next = () => goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
        const prev = () => goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1);

        prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
        nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(next, 5500);
        };
        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        // Init
        updateCardsPerView();
        buildDots();
        goTo(0);
        startAutoPlay();

        // Rebuild on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateCardsPerView();
                buildDots();
                goTo(Math.min(currentIndex, maxIndex()));
            }, 200);
        });

        // Pause autoplay on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', startAutoPlay);
    }

    /* ---------- 6. FOOTER YEAR ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 7. SUBTLE PARALLAX ON HERO VISUAL ---------- */
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.matchMedia('(min-width: 1024px)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroVisual.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

});


    /* ============================================
       ABOUT PAGE — SPECIFIC INTERACTIONS
       ============================================ */

    /* ---------- 8. ABOUT PAGE STAT COUNTERS ---------- */
    const aboutCounters = document.querySelectorAll('.stat-number');
    if (aboutCounters.length > 0) {
        const animateAboutCounter = (el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };
            requestAnimationFrame(step);
        };

        const aboutCounterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateAboutCounter(entry.target);
                    aboutCounterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        aboutCounters.forEach(c => aboutCounterObserver.observe(c));
    }

    /* ---------- 9. TIMELINE STAGGER REVEAL ---------- */
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    /* ---------- 10. VALUE CARDS KEYBOARD FOCUS ---------- */
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('focused');
            }
        });
    });


    /* ============================================
       CONTACT PAGE — SPECIFIC INTERACTIONS
       ============================================ */

    /* ---------- 11. BUSINESS HOURS STATUS ---------- */
    const statusIndicator = document.getElementById('statusIndicator');
    if (statusIndicator) {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = now.getHours();
        const isOpen = day >= 1 && day <= 5 && hour >= 8 && hour < 18;

        statusIndicator.classList.add(isOpen ? 'open' : 'closed');
        statusIndicator.querySelector('.status-text').textContent =
            isOpen ? 'Currently Open' : 'Currently Closed';
    }

    /* ---------- 12. CONTACT FORM VALIDATION & SUBMISSION ---------- */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    if (contactForm) {
        // Character counter
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                const count = messageField.value.length;
                charCount.textContent = count;
                if (count > 1000) {
                    messageField.value = messageField.value.slice(0, 1000);
                    charCount.textContent = 1000;
                }
            });
        }

        // Validation helpers
        const validators = {
            name: (val) => val.trim().length >= 2,
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
            service: (val) => val !== '',
            message: (val) => val.trim().length >= 20,
            consent: (el) => el.checked
        };

        const validateField = (field) => {
            const name = field.name || field.id;
            const value = field.type === 'checkbox' ? field.checked : field.value;
            const validator = validators[name];
            const group = field.closest('.form-group') || field.closest('.form-checkbox');
            const errorMsg = group ? group.querySelector('.error-message') : document.querySelector(`[data-error="${name}"]`);

            if (!validator) return true;

            const isValid = validator(value);
            if (group) {
                group.classList.toggle('error', !isValid);
            }
            if (errorMsg && name === 'consent') {
                errorMsg.classList.toggle('show', !isValid);
            }
            return isValid;
        };

        // Live validation on blur
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                const group = field.closest('.form-group');
                if (group && group.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fields = contactForm.querySelectorAll('input, select, textarea');
            let isValid = true;

            fields.forEach(field => {
                if (!validateField(field)) isValid = false;
            });

            if (!isValid) {
                const firstError = contactForm.querySelector('.form-group.error, .form-checkbox.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Simulate submission
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
                formSuccess.setAttribute('aria-hidden', 'false');
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1800);
        });

        // Reset form
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                contactForm.reset();
                contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
                contactForm.style.display = 'flex';
                formSuccess.classList.remove('show');
                formSuccess.setAttribute('aria-hidden', 'true');
                if (charCount) charCount.textContent = '0';
            });
        }
    }

    /* ---------- 13. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });