/* ============================================
   KAMERA BALES — script.js
   Premium Mitumba Wholesale Platform
   ============================================ */

(() => {
    'use strict';

    // ---------- DOM References ----------
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.querySelector('.contact-form');
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;

    // ---------- Sticky Header Scroll Detection ----------
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---------- Mobile Menu Toggle ----------
    const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
        navMenu.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    navToggle.addEventListener('click', () => toggleMenu());

    navMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            toggleMenu(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu(false);
            navToggle.focus();
        }
    });

    // ---------- Dark Mode Toggle ----------
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
    };

    applyTheme(getPreferredTheme());

    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    // ---------- Contact Form → WhatsApp + Formspree ----------
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone) {
                alert('Please fill in your name and phone number.');
                return;
            }

            // Send data to Formspree (fire-and-forget)
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            }).catch(() => { /* silently ignore network errors */ });

            // Build WhatsApp message
            let waText = `Hi Kamera Bales!%0A%0A`;
            waText += `*Name:* ${encodeURIComponent(name)}%0A`;
            waText += `*Phone:* ${encodeURIComponent(phone)}%0A`;
            if (email) waText += `*Email:* ${encodeURIComponent(email)}%0A`;
            if (message) waText += `*Inquiry:* ${encodeURIComponent(message)}%0A`;

            const waNumber = '254702555093';
            const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

            window.open(waUrl, '_blank', 'noopener,noreferrer');

            contactForm.reset();
            const note = contactForm.querySelector('.form-note');
            if (note) {
                note.textContent = '✅ Inquiry sent via WhatsApp. We’ll respond within 2 hours.';
                note.style.color = 'var(--color-success)';
            }

            setTimeout(() => {
                if (note) {
                    note.textContent = '🔒 Your information is secure · No spam';
                    note.style.color = '';
                }
            }, 5000);
        });
    }

    // ---------- Lead Magnet (Footer & Popup) ----------
    const leadForms = document.querySelectorAll('.lead-form');
    const leadPopup = document.getElementById('leadPopup');
    const popupClose = document.querySelector('.popup-close');

    leadForms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            const originalText = submitBtn.textContent;

            if (!emailInput.value || !emailInput.checkValidity()) {
                emailInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showLeadSuccess(form, submitBtn, originalText);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                submitBtn.textContent = 'Error — try again';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });

    function showLeadSuccess(form, submitBtn, originalText) {
        submitBtn.textContent = '✅ Guide Sent!';
        submitBtn.disabled = true;
        form.reset();
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 4000);
        if (leadPopup && form.closest('.lead-popup')) {
            leadPopup.close();
        }
    }

    if (leadPopup) {
        const popupSeenKey = 'kameraLeadPopupSeen';
        const popupShownThisSession = sessionStorage.getItem(popupSeenKey);

        if (!popupShownThisSession && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTimeout(() => {
                if (!leadPopup.open) {
                    leadPopup.showModal();
                    sessionStorage.setItem(popupSeenKey, 'true');
                }
            }, 5000);
        }

        popupClose.addEventListener('click', () => leadPopup.close());

        leadPopup.addEventListener('click', (event) => {
            if (event.target === leadPopup) {
                leadPopup.close();
            }
        });
    }

    // ---------- Bale Search & Filter ----------
    const baleCards = document.querySelectorAll('.bale-card');
    if (baleCards.length > 0) {
        const searchInput = document.getElementById('searchBales');
        const filterCategory = document.getElementById('filterCategory');
        const filterGrade = document.getElementById('filterGrade');
        const resultsCount = document.querySelector('.results-count');

        const filterBales = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const category = filterCategory.value;
            const grade = filterGrade.value;

            let visibleCount = 0;

            baleCards.forEach((card) => {
                const cardCategory = card.dataset.category;
                const cardGrade = card.dataset.grade.split(' ');
                const cardSearch = card.dataset.search.toLowerCase();

                const matchesSearch = cardSearch.includes(searchTerm) || searchTerm === '';
                const matchesCategory = category === 'all' || cardCategory === category;
                const matchesGrade = grade === 'all' || cardGrade.includes(grade);

                if (matchesSearch && matchesCategory && matchesGrade) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const grid = document.querySelector('.bale-cards-grid');
            let noResultsMsg = grid.querySelector('.no-results');
            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('p');
                    noResultsMsg.className = 'no-results';
                    noResultsMsg.textContent = 'No bales match your filters. Please try different criteria.';
                    grid.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }

            if (resultsCount) {
                const total = baleCards.length;
                resultsCount.textContent = `${visibleCount} of ${total} bales shown`;
            }
        };

        searchInput.addEventListener('input', filterBales);
        filterCategory.addEventListener('change', filterBales);
        filterGrade.addEventListener('change', filterBales);

        filterBales();
    }

    // ---------- Stock Urgency (real data) ----------
    const stockElements = document.querySelectorAll('.stock-urgency');
    if (stockElements.length > 0) {
        const fetchStock = async () => {
            try {
                const response = await fetch('stock.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                updateStockUI(data);
            } catch (error) {
                console.warn('Could not load stock.json, using fallback data.', error);
                const fallbackData = {
                    womens: { total: 24, sold: 12 },
                    mens: { total: 18, sold: 7 },
                    childrens: { total: 15, sold: 4 },
                    premium: { total: 10, sold: 8 }
                };
                updateStockUI(fallbackData);
            }
        };

        const updateStockUI = (data) => {
            stockElements.forEach((el) => {
                const category = el.dataset.category;
                if (data[category]) {
                    const { total, sold } = data[category];
                    const remaining = total - sold;
                    if (remaining <= 0) {
                        el.textContent = 'Out of stock — next batch arriving soon';
                        el.classList.add('low');
                    } else if (remaining <= 5) {
                        el.textContent = `Only ${remaining} bales left — order soon`;
                        el.classList.add('low');
                    } else if (remaining <= 10) {
                        el.textContent = `Only ${remaining} bales left`;
                        el.classList.add('medium');
                    } else {
                        el.textContent = `${remaining} bales available`;
                        el.classList.add('high');
                    }
                }
            });
        };

        fetchStock();
    }

    // ---------- Testimonials Carousel ----------
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        let currentIndex = 0;
        let autoPlayInterval = null;

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            dot.setAttribute('role', 'tab');
            dot.dataset.index = index;
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateSlide = (index) => {
            currentIndex = index;
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
                dot.setAttribute('aria-selected', i === currentIndex);
            });

            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== currentIndex);
                slide.setAttribute('tabindex', i === currentIndex ? '0' : '-1');
            });
        };

        const goToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            updateSlide(index);
        };

        const startAutoPlay = () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };

        prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoPlay(); });
        nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoPlay(); });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index, 10);
                goToSlide(index);
                startAutoPlay();
            });
        });

        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(currentIndex - 1); startAutoPlay(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); goToSlide(currentIndex + 1); startAutoPlay(); }
        });

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        carousel.addEventListener('focusin', stopAutoPlay);
        carousel.addEventListener('focusout', startAutoPlay);

        let touchStartX = 0;
        let touchEndX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToSlide(currentIndex + 1);
                else goToSlide(currentIndex - 1);
            }
            startAutoPlay();
        }, { passive: true });

        window.addEventListener('resize', () => updateSlide(currentIndex));

        updateSlide(0);
        startAutoPlay();
    }

    // ---------- Digital Quotation Generator ----------
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        const categorySelect = document.getElementById('category');
        const gradeSelect = document.getElementById('grade');
        const quantityInput = document.getElementById('quantity');
        const quoteTotal = document.getElementById('quoteTotal');
        const generateBtn = document.getElementById('generateQuoteBtn');
        const printBtn = document.getElementById('printQuoteBtn');

        const priceMatrix = {
            womens: { A: 18000, B: 14000, Premium: 25000 },
            mens:   { A: 18000, B: 14000, Premium: 25000 },
            childrens: { A: 15000, B: 12000, Premium: 22000 },
            premium: { A: 28000, B: 24000, Premium: 35000 }
        };

        const categoryLabels = {
            womens: "Women's Bales",
            mens: "Men's Bales",
            childrens: "Children's Bales",
            premium: "Premium / Luxury Bales"
        };

        const calculateTotal = () => {
            const category = categorySelect.value;
            const grade = gradeSelect.value;
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const unitPrice = priceMatrix[category]?.[grade] || 0;
            const total = unitPrice * quantity;
            quoteTotal.textContent = `KSh ${total.toLocaleString('en-KE')}`;
            return { total, category, grade, quantity, unitPrice };
        };

        categorySelect.addEventListener('change', calculateTotal);
        gradeSelect.addEventListener('change', calculateTotal);
        quantityInput.addEventListener('input', calculateTotal);

        generateBtn.addEventListener('click', () => {
            const { total, category, grade, quantity, unitPrice } = calculateTotal();
            const categoryLabel = categoryLabels[category] || category;
            const message = `Hi Kamera Bales!%0A%0A` +
                `*Quote Request*%0A` +
                `Category: ${encodeURIComponent(categoryLabel)}%0A` +
                `Grade: ${grade}%0A` +
                `Quantity: ${quantity} bale(s)%0A` +
                `Unit Price: KSh ${unitPrice.toLocaleString('en-KE')}%0A` +
                `Total Estimate: KSh ${total.toLocaleString('en-KE')}%0A%0A` +
                `Please confirm availability and delivery. Thank you!`;

            const waNumber = '254702555093';
            const waUrl = `https://wa.me/${waNumber}?text=${message}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });

        printBtn.addEventListener('click', () => {
            const { total, category, grade, quantity, unitPrice } = calculateTotal();
            const categoryLabel = categoryLabels[category] || category;
            const printWindow = window.open('', '_blank', 'width=600,height=400');
            printWindow.document.write(`
                <html>
                    <head><title>Kamera Bales Quote</title><style>body{font-family:Arial,sans-serif;padding:2rem;color:#1A1A1A}h1{font-size:1.5rem;margin-bottom:1rem}table{width:100%;border-collapse:collapse;margin-bottom:1rem}td,th{padding:0.5rem;border-bottom:1px solid #ddd;text-align:left}th{background:#f5f5f5}</style></head>
                    <body>
                        <h1>Kamera Bales — Quotation</h1>
                        <table>
                            <tr><th>Category</th><td>${categoryLabel}</td></tr>
                            <tr><th>Grade</th><td>${grade}</td></tr>
                            <tr><th>Quantity</th><td>${quantity} bale(s)</td></tr>
                            <tr><th>Unit Price</th><td>KSh ${unitPrice.toLocaleString('en-KE')}</td></tr>
                            <tr><th>Total Estimate</th><td><strong>KSh ${total.toLocaleString('en-KE')}</strong></td></tr>
                        </table>
                        <p><em>Final price may vary based on stock and delivery. Contact: 0702 555 093</em></p>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });

        calculateTotal();
    }

    // ---------- Image Lightbox ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxTriggers.length > 0) {
        const openLightbox = (src, alt) => {
            lightboxImage.src = src;
            lightboxImage.alt = alt || '';
            if (typeof lightbox.showModal === 'function') {
                lightbox.showModal();
            } else {
                lightbox.setAttribute('open', '');
            }
            lightboxClose.focus();
        };

        const closeLightbox = () => {
            if (typeof lightbox.close === 'function') {
                lightbox.close();
            } else {
                lightbox.removeAttribute('open');
            }
        };

        lightboxTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const img = trigger.querySelector('img');
                const fullSrc = trigger.dataset.full || img.src;
                const alt = img.alt || '';
                openLightbox(fullSrc, alt);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.hasAttribute('open')) {
                closeLightbox();
            }
        });
    }

    // ---------- Floating WhatsApp Button (appear after scroll) ----------
    const floatingBtn = document.querySelector('.floating-whatsapp');
    if (floatingBtn) {
        const showFloatingBtn = () => {
            if (window.scrollY > 300) {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.pointerEvents = 'auto';
            } else {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.pointerEvents = 'none';
            }
        };

        floatingBtn.style.opacity = '0';
        floatingBtn.style.pointerEvents = 'none';
        floatingBtn.style.transition = 'opacity 0.3s ease';

        window.addEventListener('scroll', showFloatingBtn, { passive: true });
        showFloatingBtn();
    }

    // ---------- Micro-interactions: button success feedback ----------
    const allSubmitButtons = document.querySelectorAll('button[type="submit"], .btn-primary');
    allSubmitButtons.forEach((btn) => {
        btn.addEventListener('click', function (event) {
            if (this.closest('form')) {
                this.classList.add('btn-success');
                setTimeout(() => {
                    this.classList.remove('btn-success');
                }, 2000);
            }
        });
    });

    document.querySelectorAll('.btn').forEach((btn) => {
        btn.addEventListener('mousedown', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                btn.style.transform = 'scale(0.96)';
            }
        });
        btn.addEventListener('mouseup', () => { btn.style.transform = ''; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });

    // ---------- Reduced Motion Handling ----------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }

    // ---------- PWA: Register Service Worker ----------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
})();