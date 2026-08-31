/* ============================================
   KAMERA BALES — script.js (Production Ready)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ---------- Global WhatsApp Link Generation ----------
    const waNumber = '254702555093';
    
    // Automatically fill all data-wa-template links
    document.querySelectorAll('a[data-wa-template]').forEach(link => {
        const message = encodeURIComponent(link.dataset.waTemplate);
        link.href = `https://wa.me/${waNumber}?text=${message}`;
    });

    // ---------- FAQ Manual Toggle (Permanent Fix) ----------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const summary = item.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', (e) => {
                // Prevent default to avoid double-toggle on some browsers
                e.preventDefault();
                
                // If already open, close it
                if (item.open) {
                    item.open = false;
                } else {
                    // Close all other items
                    faqItems.forEach((other) => { if (other !== item) other.open = false; });
                    // Open this one
                    item.open = true;
                }
            });
        }
    });

    // ---------- Header Scroll ----------
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 20) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ---------- Mobile Menu Toggle with Focus Trap ----------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
            navMenu.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        };
        
        navToggle.addEventListener('click', () => toggleMenu());

        document.addEventListener('click', (event) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                toggleMenu(false);
            }
        });
        
        navMenu.addEventListener('click', (event) => {
            if (event.target.closest('a')) toggleMenu(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('open')) {
                toggleMenu(false);
                navToggle.focus();
            }
            if (navMenu.classList.contains('open') && event.key === 'Tab') {
                const focusable = navMenu.querySelectorAll('a[href], button:not([disabled])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // ---------- Dark Mode ----------
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    if (themeToggle) {
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
    }

    // ---------- Bale Search & Filter (Robust Fix) ----------
    const baleCards = document.querySelectorAll('.bale-card');
    const searchInput = document.getElementById('searchBales');
    const filterCategory = document.getElementById('filterCategory');
    const filterGrade = document.getElementById('filterGrade');
    const resultsCount = document.querySelector('.results-count');
    const activeFiltersContainer = document.getElementById('active-filters');

    if (baleCards.length > 0) {
        const filterBales = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const category = filterCategory.value;
            const grade = filterGrade.value;
            let visibleCount = 0;

            baleCards.forEach(card => {
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

            // Update active filter chips
            if (activeFiltersContainer) {
                const activeFilters = [];
                if (category !== 'all') activeFilters.push(`Category: ${category}`);
                if (grade !== 'all') activeFilters.push(`Grade: ${grade}`);
                if (searchTerm) activeFilters.push(`Search: "${searchTerm}"`);

                activeFiltersContainer.innerHTML = '';
                if (activeFilters.length > 0) {
                    const clearBtn = document.createElement('button');
                    clearBtn.className = 'chip clear-btn';
                    clearBtn.textContent = '✕ Clear All';
                    clearBtn.addEventListener('click', () => {
                        searchInput.value = '';
                        filterCategory.value = 'all';
                        filterGrade.value = 'all';
                        filterBales();
                    });
                    activeFiltersContainer.appendChild(clearBtn);

                    activeFilters.forEach(filter => {
                        const chip = document.createElement('span');
                        chip.className = 'chip';
                        chip.textContent = filter;
                        activeFiltersContainer.appendChild(chip);
                    });
                }
            }
        };

        // Attach Event Listeners
        searchInput.addEventListener('input', filterBales);
        filterCategory.addEventListener('change', filterBales);
        filterGrade.addEventListener('change', filterBales);
        
        // Initial Call
        filterBales();
    }

    // ---------- Stock Urgency ----------
    const stockElements = document.querySelectorAll('.stock-urgency');
    if (stockElements.length > 0) {
        const fetchStock = async () => {
            try {
                const response = await fetch('stock.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                updateStockUI(data);
            } catch (error) {
                const fallbackData = {
                    womens: { total: 24, sold: 12 },
                    mens: { total: 18, sold: 7 },
                    childrens: { total: 15, sold: 4 },
                    premium: { total: 10, sold: 8 },
                    shoes: { total: 20, sold: 10 }
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
                    if (remaining <= 0) { el.textContent = 'Out of stock'; el.classList.add('low'); }
                    else if (remaining <= 5) { el.textContent = `Only ${remaining} bales left!`; el.classList.add('low'); }
                    else if (remaining <= 10) { el.textContent = `Only ${remaining} bales left`; el.classList.add('medium'); }
                    else { el.textContent = `${remaining} bales available`; el.classList.add('high'); }
                }
            });
        };
        fetchStock();
    }

    // ---------- Testimonials Carousel (with inert) ----------
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
            dot.setAttribute('role', 'button');
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
                if (i !== currentIndex) {
                    slide.setAttribute('aria-hidden', 'true');
                    slide.setAttribute('tabindex', '-1');
                    slide.setAttribute('inert', '');
                } else {
                    slide.removeAttribute('aria-hidden');
                    slide.removeAttribute('inert');
                    slide.setAttribute('tabindex', '0');
                }
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
            autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
        };
        const stopAutoPlay = () => {
            if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
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
        let touchStartX = 0, touchEndX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; stopAutoPlay(); }, { passive: true });
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

    // ---------- Contact Form (Auto-Format Phone & WhatsApp) ----------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('0')) value = value.slice(1);
                if (value.length > 9) value = value.slice(0, 9);
                const formatted = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                e.target.value = formatted ? `0${formatted}` : '';
            });
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            if (!name || !phone) { alert('Please fill in your name and phone number.'); return; }

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            }).catch(() => {});

            let waText = `Hi Kamera Bales!%0A%0A`;
            waText += `*Name:* ${encodeURIComponent(name)}%0A`;
            waText += `*Phone:* ${encodeURIComponent(phone)}%0A`;
            if (email) waText += `*Email:* ${encodeURIComponent(email)}%0A`;
            if (message) waText += `*Inquiry:* ${encodeURIComponent(message)}%0A`;
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
            premium: { A: 28000, B: 24000, Premium: 35000 },
            shoes: { A: 20000, B: 16000, Premium: 30000 }
        };
        const categoryLabels = {
            womens: "Women's Bales",
            mens: "Men's Bales",
            childrens: "Children's Bales",
            premium: "Premium / Luxury Bales",
            shoes: "Shoes & Accessories"
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
            const waUrl = `https://wa.me/${waNumber}?text=${message}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });

        printBtn.addEventListener('click', () => {
            const { total, category, grade, quantity, unitPrice } = calculateTotal();
            const categoryLabel = categoryLabels[category] || category;
            const printWindow = window.open('', '_blank', 'width=700,height=500');

            if (!printWindow) {
                alert('Please allow pop-ups to print the quote.');
                return;
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Kamera Bales Quote</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 2rem; color: #1A1A1A; }
                            h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
                            h2 { font-size: 1.2rem; color: #1A5C3A; }
                            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
                            td, th { padding: 0.6rem; border-bottom: 1px solid #ddd; text-align: left; }
                            th { background: #f5f5f5; font-weight: bold; }
                            .contact { margin-top: 2rem; font-size: 0.9rem; color: #555; }
                            .logo { font-weight: bold; font-size: 1.5rem; color: #1A5C3A; }
                        </style>
                    </head>
                    <body>
                        <div class="logo">KAMERA BALES</div>
                        <h2>Quotation</h2>
                        <table>
                            <tr><th>Category</th><td>${categoryLabel}</td></tr>
                            <tr><th>Grade</th><td>${grade}</td></tr>
                            <tr><th>Quantity</th><td>${quantity} bale(s)</td></tr>
                            <tr><th>Unit Price</th><td>KSh ${unitPrice.toLocaleString('en-KE')}</td></tr>
                            <tr><th>Total Estimate</th><td><strong>KSh ${total.toLocaleString('en-KE')}</strong></td></tr>
                        </table>
                        <p><em>Final price may vary based on current stock and delivery location.</em></p>
                        <div class="contact">
                            <p>Contact: 0702 555 093 | WhatsApp: <a href="https://wa.me/254702555093">Chat</a></p>
                            <p>Email: info@kamerabales.co.ke | Nairobi, Kenya</p>
                        </div>
                        <p style="margin-top: 2rem; font-size: 0.8rem; color: #888;">Generated by Kamera Bales – ${new Date().toLocaleDateString()}</p>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });
        calculateTotal();
    }

    // ---------- Image Lightbox (with fallback focus trap) ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    const hasNativeDialog = typeof lightbox.showModal === 'function';
    let lastFocusedElement = null;

    const openLightbox = (src, alt) => {
        lightboxImage.src = src;
        lightboxImage.alt = alt || '';
        lastFocusedElement = document.activeElement;
        if (hasNativeDialog) {
            lightbox.showModal();
            lightboxClose.focus();
        } else {
            lightbox.setAttribute('open', '');
            document.body.style.overflow = 'hidden';
            const focusable = lightbox.querySelectorAll('button, [href], [tabindex]');
            if (focusable.length > 0) focusable[0].focus();
        }
    };
    const closeLightbox = () => {
        if (hasNativeDialog) {
            lightbox.close();
        } else {
            lightbox.removeAttribute('open');
            document.body.style.overflow = '';
            if (lastFocusedElement) lastFocusedElement.focus();
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
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.hasAttribute('open')) closeLightbox();
    });

    // ---------- Floating WhatsApp Button ----------
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

    // ---------- Back to Top Button ----------
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Scrollspy ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));

    // ---------- Featured Bale Countdown ----------
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(el => {
        const deadline = new Date(el.dataset.deadline).getTime();
        const daysEl = el.querySelector('.days');
        const hoursEl = el.querySelector('.hours');
        const minutesEl = el.querySelector('.minutes');
        const secondsEl = el.querySelector('.seconds');
        const updateCountdown = () => {
            const now = new Date().getTime();
            const diff = deadline - now;
            if (diff <= 0) {
                el.innerHTML = '<strong>Offer expired</strong>';
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            daysEl.textContent = days;
            hoursEl.textContent = hours;
            minutesEl.textContent = minutes;
            secondsEl.textContent = seconds;
        };
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });

    // ---------- Analytics Event Tracking ----------
    if (typeof gtag === 'function') {
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            link.addEventListener('click', () => {
                gtag('event', 'whatsapp_click', { 'link_url': link.href });
            });
        });
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                gtag('event', 'form_submit', { 'form_id': form.id || 'unknown' });
            });
        });
    }

    // ---------- Lead Magnet (Footer & Popup) with Generated Download ----------
    const leadForms = document.querySelectorAll('.lead-form');
    const leadPopup = document.getElementById('leadPopup');
    const popupClose = document.querySelector('.popup-close');

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
        if (popupClose) {
            popupClose.addEventListener('click', () => leadPopup.close());
        }
        leadPopup.addEventListener('click', (event) => {
            if (event.target === leadPopup) leadPopup.close();
        });
    }

    // ---------- Exit-Intent Popup (CRO) ----------
    let exitShown = sessionStorage.getItem('exitShown');
    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && !e.toElement && !exitShown) {
            const popup = document.getElementById('leadPopup');
            if (popup && !popup.open) {
                popup.showModal();
                sessionStorage.setItem('exitShown', 'true');
            }
        }
    });

    // ---------- PWA Install Prompt ----------
    let deferredPrompt;
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install App';
    installBtn.className = 'btn btn-primary btn-sm install-prompt-btn';
    installBtn.style.display = 'none';
    document.body.appendChild(installBtn);

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'block';
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });

    // ---------- PWA Service Worker ----------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
                .catch((error) => console.error('Service Worker registration failed:', error));
        });
    }
});