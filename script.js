/* ============================================
   KAMERA BALES — script.js (Production v4)
   ============================================ */

// ---------- Global Error Boundaries ----------
function showErrorToast(message) {
    document.querySelectorAll('.error-toast').forEach((t) => t.remove());

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 5000);
}

window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    showErrorToast('Something went wrong. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorToast('An unexpected error occurred. Please try again.');
});

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const waNumber = '254702555093';
    const backgroundSelectors = [
        'header.site-header',
        'main',
        'footer.site-footer',
        '.mobile-action-bar',
        '.floating-whatsapp'
    ];

    // ---------- Button Loading (preserves inline SVG) ----------
    const setButtonLoading = (button, isLoading, loadingText = 'Processing...') => {
        if (!button) return;
        if (isLoading) {
            if (!button.dataset.originalHtml) {
                button.dataset.originalHtml = button.innerHTML;
            }
            button.classList.add('btn-loading');
            const icon = button.querySelector('svg');
            button.innerHTML = '';
            if (icon) button.appendChild(icon);
            const label = document.createElement('span');
            label.textContent = loadingText;
            button.appendChild(label);
            button.setAttribute('aria-busy', 'true');
            button.setAttribute('disabled', 'disabled');
        } else {
            button.classList.remove('btn-loading');
            button.innerHTML = button.dataset.originalHtml || '';
            button.removeAttribute('aria-busy');
            button.removeAttribute('disabled');
            delete button.dataset.originalHtml;
        }
    };

    // ---------- Inert helpers ----------
    const setBackgroundInert = (inert) => {
        backgroundSelectors.forEach((sel) => {
            const el = document.querySelector(sel);
            if (!el) return;
            if (inert) el.setAttribute('inert', '');
            else el.removeAttribute('inert');
        });
    };

    const buildFocusTrap = (root) => (e) => {
        if (e.key !== 'Tab') return;
        const focusable = root.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    // ---------- Form Validation ----------
    const setupFormValidation = (form) => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach((input) => {
            const errorMsg = document.createElement('p');
            errorMsg.className = 'error-message';
            errorMsg.setAttribute('role', 'alert');
            errorMsg.setAttribute('aria-live', 'assertive');
            errorMsg.id = `error-${input.id || Math.random().toString(36).slice(2, 9)}`;
            input.setAttribute('aria-describedby', errorMsg.id);
            input.parentNode.insertBefore(errorMsg, input.nextSibling);

            const clear = () => {
                input.classList.remove('invalid');
                input.classList.add('valid');
                errorMsg.textContent = '';
                errorMsg.classList.remove('visible');
                input.removeAttribute('aria-invalid');
            };
            input.addEventListener('input', clear);
            input.addEventListener('change', clear);
        });

        form.addEventListener('submit', (event) => {
            let isValid = true;
            inputs.forEach((input) => {
                const errorMsg = document.getElementById(input.getAttribute('aria-describedby'));
                if (!input.value.trim()) {
                    input.classList.remove('valid');
                    input.classList.add('invalid');
                    input.setAttribute('aria-invalid', 'true');
                    errorMsg.textContent = input.dataset.error || 'This field is required.';
                    errorMsg.classList.add('visible');
                    isValid = false;
                } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    input.classList.remove('valid');
                    input.classList.add('invalid');
                    input.setAttribute('aria-invalid', 'true');
                    errorMsg.textContent = 'Please enter a valid email address.';
                    errorMsg.classList.add('visible');
                    isValid = false;
                } else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 10) {
                    input.classList.remove('valid');
                    input.classList.add('invalid');
                    input.setAttribute('aria-invalid', 'true');
                    errorMsg.textContent = 'Please enter a valid phone number.';
                    errorMsg.classList.add('visible');
                    isValid = false;
                }
            });
            if (!isValid) {
                event.preventDefault();
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) firstInvalid.focus();
            }
        });
    };

    document.querySelectorAll('form').forEach(setupFormValidation);

    // ---------- 1. WhatsApp Template Links ----------
    document.addEventListener('click', (e) => {
        const waLink = e.target.closest('a[data-wa-template]');
        if (waLink) {
            e.preventDefault();
            const message = encodeURIComponent(waLink.dataset.waTemplate);
            const url = `https://wa.me/${waNumber}?text=${message}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', { link_url: url });
            }
        }
    });

    // ---------- 2. FAQ Accordion ----------
    try {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item) => {
            const summary = item.querySelector('summary');
            if (summary) {
                summary.addEventListener('click', () => {
                    faqItems.forEach((other) => {
                        if (other !== item && other.open) other.open = false;
                    });
                });
            }
        });
    } catch (error) {
        console.error('FAQ error:', error);
    }

    // ---------- 3. Header Scroll ----------
    try {
        const header = document.querySelector('.site-header');
        if (header) {
            const handleScroll = () => {
                header.classList.toggle('scrolled', window.scrollY > 20);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
    } catch (error) {
        console.error('Header scroll error:', error);
    }

    // ---------- 4. Menu Overlay (focus trap + inert) ----------
    try {
        const menuToggle = document.querySelector('.menu-toggle');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuClose = document.querySelector('.menu-close');
        const menuLinks = document.querySelectorAll('.menu-overlay-nav .menu-link');

        if (menuToggle && menuOverlay && menuClose) {
            const trapFocus = buildFocusTrap(menuOverlay);

            const openMenu = () => {
                menuOverlay.classList.add('open');
                menuToggle.setAttribute('aria-expanded', 'true');
                menuOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                setBackgroundInert(true);
                menuOverlay.addEventListener('keydown', trapFocus);
                menuClose.focus();
            };

            const closeMenu = () => {
                menuOverlay.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuOverlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                setBackgroundInert(false);
                menuOverlay.removeEventListener('keydown', trapFocus);
                menuToggle.focus();
            };

            menuToggle.addEventListener('click', openMenu);
            menuClose.addEventListener('click', closeMenu);
            menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && menuOverlay.classList.contains('open')) closeMenu();
            });
        }
    } catch (error) {
        console.error('Menu overlay error:', error);
    }

    // ---------- 5. Dark Mode ----------
    try {
        const themeToggle = document.querySelector('.theme-toggle');
        const root = document.documentElement;
        if (themeToggle) {
            const applyTheme = (theme) => {
                root.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                themeToggle.setAttribute('aria-pressed', theme === 'dark');
                themeToggle.classList.toggle('dark', theme === 'dark');
            };
            const current = root.getAttribute('data-theme');
            themeToggle.setAttribute('aria-pressed', current === 'dark');
            themeToggle.classList.toggle('dark', current === 'dark');

            themeToggle.addEventListener('click', () => {
                const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(next);
            });
        }
    } catch (error) {
        console.error('Dark mode error:', error);
    }

    // ---------- 6. Bale Search & Filter ----------
    try {
        const baleCards = document.querySelectorAll('.bale-card');
        const searchInput = document.getElementById('searchBales');
        const filterCategory = document.getElementById('filterCategory');
        const filterGrade = document.getElementById('filterGrade');
        const resultsCount = document.querySelector('.results-count');
        const activeFiltersContainer = document.getElementById('active-filters');

        if (baleCards.length > 0) {
            const filterBales = () => {
                const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
                const category = filterCategory ? filterCategory.value : 'all';
                const grade = filterGrade ? filterGrade.value : 'all';
                let visibleCount = 0;

                baleCards.forEach((card) => {
                    const cardCategory = card.dataset.category;
                    const cardGrade = (card.dataset.grade || '').split(' ');
                    const cardSearch = (card.dataset.search || '').toLowerCase();
                    const matchesSearch = searchTerm === '' || cardSearch.includes(searchTerm);
                    const matchesCategory = category === 'all' || cardCategory === category;
                    const matchesGrade = grade === 'all' || cardGrade.includes(grade);

                    const show = matchesSearch && matchesCategory && matchesGrade;
                    card.style.display = show ? '' : 'none';
                    if (show) visibleCount++;
                });

                const grid = document.querySelector('.bale-cards-grid');
                let noResultsMsg = grid && grid.querySelector('.no-results');
                if (visibleCount === 0) {
                    if (!noResultsMsg && grid) {
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

                if (activeFiltersContainer) {
                    const active = [];
                    if (category !== 'all') active.push(`Category: ${category}`);
                    if (grade !== 'all') active.push(`Grade: ${grade}`);
                    if (searchTerm) active.push(`Search: "${searchTerm}"`);

                    activeFiltersContainer.innerHTML = '';
                    if (active.length > 0) {
                        const clearBtn = document.createElement('button');
                        clearBtn.type = 'button';
                        clearBtn.className = 'chip clear-btn';
                        clearBtn.textContent = '✕ Clear All';
                        clearBtn.addEventListener('click', () => {
                            if (searchInput) searchInput.value = '';
                            if (filterCategory) filterCategory.value = 'all';
                            if (filterGrade) filterGrade.value = 'all';
                            filterBales();
                        });
                        activeFiltersContainer.appendChild(clearBtn);
                        active.forEach((f) => {
                            const chip = document.createElement('span');
                            chip.className = 'chip';
                            chip.textContent = f;
                            activeFiltersContainer.appendChild(chip);
                        });
                    }
                }
            };

            if (searchInput) searchInput.addEventListener('input', filterBales);
            if (filterCategory) filterCategory.addEventListener('change', filterBales);
            if (filterGrade) filterGrade.addEventListener('change', filterBales);
            filterBales();
        }
    } catch (error) {
        console.error('Bale filter error:', error);
    }

    // ---------- 7. Stock Urgency ----------
    try {
        const stockElements = document.querySelectorAll('.stock-urgency');
        if (stockElements.length > 0) {
            const updateStockUI = (data) => {
                stockElements.forEach((el) => {
                    const category = el.dataset.category;
                    if (!data[category]) return;
                    const { total, sold } = data[category];
                    const remaining = total - sold;
                    el.classList.remove('low', 'medium', 'high');
                    if (remaining <= 0) {
                        el.textContent = 'Out of stock';
                        el.classList.add('low');
                    } else if (remaining <= 5) {
                        el.textContent = `Only ${remaining} bales left!`;
                        el.classList.add('low');
                    } else if (remaining <= 10) {
                        el.textContent = `Only ${remaining} bales left`;
                        el.classList.add('medium');
                    } else {
                        el.textContent = `${remaining} bales available`;
                        el.classList.add('high');
                    }
                });
            };

            const fallbackData = {
                womens: { total: 24, sold: 12 },
                mens: { total: 18, sold: 7 },
                childrens: { total: 15, sold: 4 },
                premium: { total: 10, sold: 8 },
                shoes: { total: 20, sold: 10 }
            };

            fetch('stock.json')
                .then((res) => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(updateStockUI)
                .catch(() => updateStockUI(fallbackData));
        }
    } catch (error) {
        console.error('Stock urgency error:', error);
    }

    // ---------- 8. Testimonials Carousel ----------
    try {
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            const pauseBtn = carousel.querySelector('.carousel-pause');
            const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
            const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            let currentIndex = 0;
            let autoPlayInterval = null;
            let userPaused = false;

            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Show testimonial ${index + 1} of ${slides.length}`);
                dot.dataset.index = index;
                if (index === 0) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            });
            const dots = Array.from(dotsContainer.children);

            const updateSlide = (index) => {
                currentIndex = index;
                const slideWidth = slides[0].getBoundingClientRect().width;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
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

            const shouldAutoPlay = () => !userPaused && !reduceMotion() && !isMobile();

            const startAutoPlay = () => {
                stopAutoPlay();
                if (!shouldAutoPlay()) {
                    if (pauseBtn) pauseBtn.dataset.state = userPaused ? 'paused' : 'static';
                    return;
                }
                autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 7000);
                if (pauseBtn) {
                    pauseBtn.dataset.state = 'playing';
                    pauseBtn.setAttribute('aria-label', 'Pause auto-rotation');
                }
            };
            const stopAutoPlay = () => {
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    autoPlayInterval = null;
                }
            };

            if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoPlay(); });
            if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoPlay(); });
            dots.forEach((dot) => {
                dot.addEventListener('click', () => {
                    goToSlide(parseInt(dot.dataset.index, 10));
                    startAutoPlay();
                });
            });

            if (pauseBtn) {
                pauseBtn.addEventListener('click', () => {
                    userPaused = !userPaused;
                    if (userPaused) stopAutoPlay();
                    else startAutoPlay();
                    pauseBtn.setAttribute('aria-label', userPaused ? 'Resume auto-rotation' : 'Pause auto-rotation');
                    pauseBtn.dataset.state = userPaused ? 'paused' : 'playing';
                });
            }

            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(currentIndex - 1); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); goToSlide(currentIndex + 1); }
            });
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
            carousel.addEventListener('focusin', stopAutoPlay);
            carousel.addEventListener('focusout', startAutoPlay);

            let touchStartX = 0;
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            }, { passive: true });
            carousel.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].screenX;
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
    } catch (error) {
        console.error('Carousel error:', error);
    }

    // ---------- 9. Contact Form ----------
    try {
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
                if (event.defaultPrevented) return;
                event.preventDefault();

                const name = (document.getElementById('name')?.value || '').trim();
                const phone = (document.getElementById('phone')?.value || '').trim();
                const email = (document.getElementById('email')?.value || '').trim();
                const message = (document.getElementById('message')?.value || '').trim();

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                setButtonLoading(submitBtn, true, 'Sending...');

                let waText = `Hi Kamera Bales!%0A%0A`;
                waText += `*Name:* ${encodeURIComponent(name)}%0A`;
                waText += `*Phone:* ${encodeURIComponent(phone)}%0A`;
                if (email) waText += `*Email:* ${encodeURIComponent(email)}%0A`;
                if (message) waText += `*Inquiry:* ${encodeURIComponent(message)}%0A`;

                const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
                const opened = window.open(waUrl, '_blank', 'noopener,noreferrer');

                if (typeof gtag === 'function') {
                    gtag('event', 'form_submit', { form_id: 'contact_form' });
                }

                const note = contactForm.querySelector('.form-note');
                if (opened) {
                    contactForm.reset();
                    if (note) {
                        note.textContent = '✅ Inquiry handed off to WhatsApp. We respond within 2 hours.';
                        note.style.color = 'var(--color-success)';
                    }
                    setTimeout(() => {
                        setButtonLoading(submitBtn, false);
                        if (note) {
                            note.textContent = '🔒 Your information is secure · No spam';
                            note.style.color = '';
                        }
                    }, 3500);
                } else {
                    if (note) {
                        note.textContent = '⚠️ Pop-up blocked. Please allow pop-ups or WhatsApp us directly.';
                        note.style.color = 'var(--color-error)';
                    }
                    setButtonLoading(submitBtn, false);
                }
            });
        }
    } catch (error) {
        console.error('Contact form error:', error);
    }

    // ---------- 10. Quote Generator ----------
    try {
        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            const categorySelect = document.getElementById('category');
            const gradeSelect = document.getElementById('grade');
            const quantityInput = document.getElementById('quantity');
            const quoteTotal = document.getElementById('quoteTotal');
            const generateBtn = document.getElementById('generateQuoteBtn');
            const printBtn = document.getElementById('printQuoteBtn');

            const priceMatrix = {
                womens:    { A: 18000, B: 14000, Premium: 25000 },
                mens:      { A: 18000, B: 14000, Premium: 25000 },
                childrens: { A: 15000, B: 12000, Premium: 22000 },
                premium:   { A: 28000, B: 24000, Premium: 35000 },
                shoes:     { A: 20000, B: 16000, Premium: 30000 }
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
                const unitPrice = (priceMatrix[category] && priceMatrix[category][grade]) || 0;
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
                const message =
                    `Hi Kamera Bales!%0A%0A` +
                    `*Quote Request*%0A` +
                    `Category: ${encodeURIComponent(categoryLabel)}%0A` +
                    `Grade: ${grade}%0A` +
                    `Quantity: ${quantity} bale(s)%0A` +
                    `Unit Price: KSh ${unitPrice.toLocaleString('en-KE')}%0A` +
                    `Total Estimate: KSh ${total.toLocaleString('en-KE')}%0A%0A` +
                    `Please confirm availability and delivery. Thank you!`;
                const waUrl = `https://wa.me/${waNumber}?text=${message}`;

                setButtonLoading(generateBtn, true, 'Opening WhatsApp...');
                window.open(waUrl, '_blank', 'noopener,noreferrer');

                if (typeof gtag === 'function') {
                    gtag('event', 'quote_generate', { category, grade });
                }

                setTimeout(() => setButtonLoading(generateBtn, false), 2000);
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
                    <!DOCTYPE html>
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
                                <p>Contact: 0702 555 093 | WhatsApp: 0702 555 093</p>
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
    } catch (error) {
        console.error('Quote generator error:', error);
    }

    // ---------- 11. Bale Detail Modal ----------
    try {
        const baleModal = document.getElementById('baleModal');
        const baleModalClose = document.querySelector('.bale-modal-close');
        const baleModalImg = document.getElementById('baleModalImg');
        const baleModalTitle = document.getElementById('baleModalTitle');
        const baleModalGrade = document.querySelector('.bale-modal-grade');
        const baleModalPrice = document.querySelector('.bale-modal-price');
        const baleModalDesc = document.getElementById('baleModalDesc');
        const baleModalWa = document.getElementById('baleModalWa');

        if (baleModal) {
            const hasNativeDialog = typeof baleModal.showModal === 'function';
            let lastFocusedElement = null;
            const trapFocus = buildFocusTrap(baleModal);

            const cleanupModal = () => {
                document.body.style.overflow = '';
                setBackgroundInert(false);
                baleModal.removeEventListener('keydown', trapFocus);
                if (lastFocusedElement) lastFocusedElement.focus();
            };

            const openModal = (card) => {
                baleModalTitle.textContent = card.dataset.title;
                baleModalDesc.textContent = card.dataset.description;
                baleModalGrade.textContent = `Grade: ${card.dataset.grade}`;
                baleModalPrice.textContent = `From KSh ${Number(card.dataset.price).toLocaleString('en-KE')} / bale`;
                baleModalImg.src = card.dataset.fullImage;
                baleModalImg.alt = card.dataset.title;

                const waMessage = `Hi Kamera Bales! I'm interested in ${card.dataset.title} (${card.dataset.grade}). Please share current stock.`;
                baleModalWa.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

                lastFocusedElement = document.activeElement;

                if (hasNativeDialog) baleModal.showModal();
                else baleModal.setAttribute('open', '');
                document.body.style.overflow = 'hidden';
                setBackgroundInert(true);
                baleModal.addEventListener('keydown', trapFocus);
                baleModalClose.focus();
            };

            const closeModal = () => {
                if (hasNativeDialog) {
                    baleModal.close();
                } else {
                    baleModal.removeAttribute('open');
                    cleanupModal();
                }
            };

            if (hasNativeDialog) {
                baleModal.addEventListener('close', cleanupModal);
                baleModal.addEventListener('cancel', cleanupModal);
            }

            document.querySelectorAll('.view-details').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = btn.closest('.bale-card');
                    if (card) openModal(card);
                });
            });

            baleModalClose.addEventListener('click', closeModal);
            baleModal.addEventListener('click', (event) => {
                if (event.target === baleModal) closeModal();
            });
        }
    } catch (error) {
        console.error('Bale modal error:', error);
    }

    // ---------- 12. Floating WhatsApp Visibility ----------
    try {
        const floatingBtn = document.querySelector('.floating-whatsapp');
        if (floatingBtn) {
            const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
            const showFloatingBtn = () => {
                if (isMobile() || window.scrollY > 300) {
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
            window.addEventListener('resize', showFloatingBtn, { passive: true });
            showFloatingBtn();
        }
    } catch (error) {
        console.error('Floating button error:', error);
    }

    // ---------- 13. Back to Top ----------
    try {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                backToTopBtn.classList.toggle('visible', window.scrollY > 500);
            }, { passive: true });
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    } catch (error) {
        console.error('Back to top error:', error);
    }

    // ---------- 14. Scrollspy ----------
    try {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.menu-link');
        if (sections.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                        });
                    }
                });
            }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 });
            sections.forEach((section) => observer.observe(section));
        }
    } catch (error) {
        console.error('Scrollspy error:', error);
    }

    // ---------- 15. Featured Bale Countdown ----------
    try {
        const countdownElements = document.querySelectorAll('.countdown');
        countdownElements.forEach((el) => {
            const deadline = new Date(el.dataset.deadline).getTime();
            const daysEl = el.querySelector('.days');
            const hoursEl = el.querySelector('.hours');
            const minutesEl = el.querySelector('.minutes');
            const secondsEl = el.querySelector('.seconds');
            const updateCountdown = () => {
                const diff = deadline - Date.now();
                if (diff <= 0) {
                    el.innerHTML = '<strong>Offer expired</strong>';
                    return;
                }
                daysEl.textContent = Math.floor(diff / 86400000);
                hoursEl.textContent = Math.floor((diff % 86400000) / 3600000);
                minutesEl.textContent = Math.floor((diff % 3600000) / 60000);
                secondsEl.textContent = Math.floor((diff % 60000) / 1000);
            };
            updateCountdown();
            setInterval(updateCountdown, 1000);
        });
    } catch (error) {
        console.error('Countdown error:', error);
    }

    // ---------- 16. Lead Magnet Popup (desktop only) ----------
    try {
        const leadForms = document.querySelectorAll('.lead-form');
        const leadPopup = document.getElementById('leadPopup');
        const popupClose = document.querySelector('.popup-close');

        leadForms.forEach((form) => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                const note = form.querySelector('.form-note');
                setButtonLoading(submitBtn, true, 'Sending...');

                try {
                    const res = await fetch(form.action, {
                        method: 'POST',
                        body: new FormData(form),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    form.reset();
                    if (note) {
                        note.textContent = '✅ Guide sent. Check your inbox.';
                        note.style.color = 'var(--color-success)';
                    }
                } catch (err) {
                    console.error('Lead form error:', err);
                    if (note) {
                        note.textContent = '⚠️ We could not send the guide. Please try again or WhatsApp us.';
                        note.style.color = 'var(--color-error)';
                    }
                } finally {
                    setButtonLoading(submitBtn, false);
                }
            });
        });

        if (leadPopup) {
            let lastFocusedElement = null;
            const trapFocus = buildFocusTrap(leadPopup);

            const cleanupPopup = () => {
                document.body.style.overflow = '';
                setBackgroundInert(false);
                leadPopup.removeEventListener('keydown', trapFocus);
                if (lastFocusedElement) lastFocusedElement.focus();
            };

            const closeLeadPopup = () => {
                if (typeof leadPopup.close === 'function') leadPopup.close();
                else {
                    leadPopup.removeAttribute('open');
                    cleanupPopup();
                }
            };

            if (typeof leadPopup.showModal === 'function') {
                leadPopup.addEventListener('close', cleanupPopup);
                leadPopup.addEventListener('cancel', cleanupPopup);
            }

            const canPromptPopup = () =>
                window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            const popupSeenKey = 'kameraLeadPopupSeen';
            const seen = sessionStorage.getItem(popupSeenKey);

            if (!seen && canPromptPopup()) {
                setTimeout(() => {
                    if (!leadPopup.open && canPromptPopup()) {
                        lastFocusedElement = document.activeElement;
                        if (typeof leadPopup.showModal === 'function') leadPopup.showModal();
                        else leadPopup.setAttribute('open', '');
                        document.body.style.overflow = 'hidden';
                        setBackgroundInert(true);
                        leadPopup.addEventListener('keydown', trapFocus);
                        if (popupClose) popupClose.focus();
                        sessionStorage.setItem(popupSeenKey, 'true');
                    }
                }, 12000);
            }

            if (popupClose) popupClose.addEventListener('click', closeLeadPopup);
            leadPopup.addEventListener('click', (event) => {
                if (event.target === leadPopup) closeLeadPopup();
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && leadPopup.hasAttribute('open')) closeLeadPopup();
            });
        }
    } catch (error) {
        console.error('Lead magnet error:', error);
    }

    // ---------- 17. Exit-Intent Popup (desktop only) ----------
    try {
        let exitShown = sessionStorage.getItem('exitShown');
        const isDesktop = () => window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;

        document.addEventListener('mouseout', (e) => {
            if (!isDesktop() || exitShown) return;
            if (!e.relatedTarget && !e.toElement) {
                const popup = document.getElementById('leadPopup');
                if (popup && !popup.open) {
                    popup.showModal();
                    sessionStorage.setItem('exitShown', 'true');
                    exitShown = 'true';
                }
            }
        });
    } catch (error) {
        console.error('Exit intent error:', error);
    }

    // ---------- 18. PWA Install Prompt ----------
    try {
        let deferredPrompt;
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.className = 'install-prompt-btn';
        document.body.appendChild(installBtn);

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.classList.add('visible');
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                installBtn.classList.remove('visible');
            }
        });
    } catch (error) {
        console.error('PWA prompt error:', error);
    }

    // ---------- 19. Service Worker Registration ----------
    try {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then((reg) => console.log('Service Worker registered:', reg.scope))
                    .catch((err) => console.error('Service Worker registration failed:', err));
            });
        }
    } catch (error) {
        console.error('Service Worker error:', error);
    }
});