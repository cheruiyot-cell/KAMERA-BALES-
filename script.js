/* ============================================
   KAMERA BALES — script.js (Production Ready)
   Menu overlay, bale modal, streamlined processes
   ============================================ */

// ---------- Global Error Boundaries ----------
function showErrorToast(message) {
    document.querySelectorAll('.error-toast').forEach(t => t.remove());
    
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

    // ---------- Button Loading State Utility ----------
    const setButtonLoading = (button, isLoading, loadingText = 'Processing...') => {
        if (isLoading) {
            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }
            button.classList.add('btn-loading');
            button.textContent = loadingText;
            button.setAttribute('aria-busy', 'true');
            button.setAttribute('disabled', 'disabled');
        } else {
            button.classList.remove('btn-loading');
            button.textContent = button.dataset.originalText || '';
            button.removeAttribute('aria-busy');
            button.removeAttribute('disabled');
            delete button.dataset.originalText;
        }
    };

    // ---------- Form Validation Enhancements ----------
    const setupFormValidation = (form) => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(input => {
            const errorMsg = document.createElement('p');
            errorMsg.className = 'error-message';
            errorMsg.setAttribute('role', 'alert');
            errorMsg.setAttribute('aria-live', 'assertive');
            errorMsg.id = `error-${input.id || Math.random().toString(36).substr(2, 9)}`;
            input.setAttribute('aria-describedby', errorMsg.id);

            input.parentNode.insertBefore(errorMsg, input.nextSibling);

            input.addEventListener('input', () => {
                input.classList.remove('invalid');
                input.classList.add('valid');
                errorMsg.textContent = '';
                errorMsg.classList.remove('visible');
                input.removeAttribute('aria-invalid');
            });

            input.addEventListener('change', () => {
                input.classList.remove('invalid');
                input.classList.add('valid');
                errorMsg.textContent = '';
                errorMsg.classList.remove('visible');
                input.removeAttribute('aria-invalid');
            });
        });

        form.addEventListener('submit', (event) => {
            let isValid = true;
            inputs.forEach(input => {
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
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    };

    document.querySelectorAll('form').forEach(form => {
        setupFormValidation(form);
    });

    // ---------- 1. Unified WhatsApp Link Handler ----------
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

    // ---------- 2. FAQ Manual Toggle ----------
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
                if (window.scrollY > 20) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
    } catch (error) {
        console.error('Header scroll error:', error);
    }

    // ---------- 4. Menu Overlay Toggle ----------
    try {
        const menuToggle = document.querySelector('.menu-toggle');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuClose = document.querySelector('.menu-close');
        const menuLinks = document.querySelectorAll('.menu-overlay-nav .menu-link');

        if (menuToggle && menuOverlay && menuClose) {
            const openMenu = () => {
                menuOverlay.classList.add('open');
                menuToggle.setAttribute('aria-expanded', 'true');
                menuOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                menuClose.focus();
            };
            const closeMenu = () => {
                menuOverlay.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuOverlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                menuToggle.focus();
            };
            menuToggle.addEventListener('click', openMenu);
            menuClose.addEventListener('click', closeMenu);
            menuLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && menuOverlay.classList.contains('open')) {
                    closeMenu();
                }
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
            const getPreferredTheme = () => {
                const stored = localStorage.getItem('theme');
                if (stored) return stored;
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            };
            const applyTheme = (theme) => {
                root.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                themeToggle.setAttribute('aria-pressed', theme === 'dark');
                themeToggle.classList.toggle('dark', theme === 'dark');
            };
            applyTheme(getPreferredTheme());
            themeToggle.addEventListener('click', () => {
                const current = root.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
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
                            if (searchInput) searchInput.value = '';
                            if (filterCategory) filterCategory.value = 'all';
                            if (filterGrade) filterGrade.value = 'all';
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
            let currentIndex = 0;
            let autoPlayInterval = null;

            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
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
    } catch (error) {
        console.error('Carousel error:', error);
    }

    // ---------- 9. Contact Form (WhatsApp only) ----------
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
                event.preventDefault();
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();
                if (!name || !phone) {
                    alert('Please fill in your name and phone number.');
                    return;
                }

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                setButtonLoading(submitBtn, true, 'Sending...');

                let waText = `Hi Kamera Bales!%0A%0A`;
                waText += `*Name:* ${encodeURIComponent(name)}%0A`;
                waText += `*Phone:* ${encodeURIComponent(phone)}%0A`;
                if (email) waText += `*Email:* ${encodeURIComponent(email)}%0A`;
                if (message) waText += `*Inquiry:* ${encodeURIComponent(message)}%0A`;
                const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
                window.open(waUrl, '_blank', 'noopener,noreferrer');

                if (typeof gtag === 'function') {
                    gtag('event', 'form_submit', { form_id: 'contact_form' });
                }

                contactForm.reset();
                const note = contactForm.querySelector('.form-note');
                if (note) {
                    note.textContent = '✅ Inquiry sent via WhatsApp. We’ll respond within 2 hours.';
                    note.style.color = 'var(--color-success)';
                }

                setTimeout(() => {
                    setButtonLoading(submitBtn, false);
                    if (note) {
                        note.textContent = '🔒 Your information is secure · No spam';
                        note.style.color = '';
                    }
                }, 3000);
            });
        }
    } catch (error) {
        console.error('Contact form error:', error);
    }

    // ---------- 10. Digital Quotation Generator ----------
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
                
                setButtonLoading(generateBtn, true, 'Opening WhatsApp...');
                window.open(waUrl, '_blank', 'noopener,noreferrer');
                
                if (typeof gtag === 'function') {
                    gtag('event', 'quote_generate', { category: category, grade: grade });
                }
                
                setTimeout(() => {
                    setButtonLoading(generateBtn, false);
                }, 2000);
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
    } catch (error) {
        console.error('Quote generator error:', error);
    }

    // ---------- 11. Bale Detail Modal (New) ----------
    try {
        const baleModal = document.getElementById('baleModal');
        const baleModalClose = document.querySelector('.bale-modal-close');
        const baleModalImg = document.getElementById('baleModalImg');
        const baleModalTitle = document.getElementById('baleModalTitle');
        const baleModalGrade = document.querySelector('.bale-modal-grade');
        const baleModalPrice = document.querySelector('.bale-modal-price');
        const baleModalDesc = document.getElementById('baleModalDesc');
        const baleModalWa = document.getElementById('baleModalWa');
        const baleModalQuote = document.getElementById('baleModalQuote');

        if (baleModal) {
            const hasNativeDialog = typeof baleModal.showModal === 'function';
            let lastFocusedElement = null;

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

                if (hasNativeDialog) {
                    baleModal.showModal();
                    baleModalClose.focus();
                } else {
                    baleModal.setAttribute('open', '');
                    document.body.style.overflow = 'hidden';
                    baleModalClose.focus();
                }

                // Lock scroll and hide background from screen readers
                document.body.style.overflow = 'hidden';
                ['header.site-header', 'main', 'footer.site-footer'].forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.setAttribute('aria-hidden', 'true');
                });

                // Focus trap
                baleModal.addEventListener('keydown', trapFocusHandler);
            };

            const closeModal = () => {
                if (hasNativeDialog) {
                    baleModal.close();
                } else {
                    baleModal.removeAttribute('open');
                }
                document.body.style.overflow = '';
                ['header.site-header', 'main', 'footer.site-footer'].forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.removeAttribute('aria-hidden');
                });

                baleModal.removeEventListener('keydown', trapFocusHandler);

                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                }
            };

            const trapFocusHandler = (e) => {
                const focusable = baleModal.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            };

            document.querySelectorAll('.view-details').forEach(btn => {
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
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && baleModal.hasAttribute('open')) closeModal();
            });
        }
    } catch (error) {
        console.error('Bale modal error:', error);
    }

    // ---------- 12. Floating WhatsApp Button ----------
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

    // ---------- 13. Back to Top Button ----------
    try {
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
    } catch (error) {
        console.error('Back to top error:', error);
    }

    // ---------- 14. Scrollspy ----------
    try {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.menu-link');
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
    } catch (error) {
        console.error('Scrollspy error:', error);
    }

    // ---------- 15. Featured Bale Countdown ----------
    try {
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
    } catch (error) {
        console.error('Countdown error:', error);
    }

    // ---------- 16. Lead Magnet Popup ----------
    try {
        const leadForms = document.querySelectorAll('.lead-form');
        const leadPopup = document.getElementById('leadPopup');
        const popupClose = document.querySelector('.popup-close');

        // Handle lead forms
        leadForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                setButtonLoading(submitBtn, true, 'Sending...');

                fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                }).catch(() => {});

                const note = form.querySelector('.form-note');
                if (note) {
                    note.textContent = '✅ Guide sent! Check your email.';
                    note.style.color = 'var(--color-success)';
                }

                setTimeout(() => {
                    setButtonLoading(submitBtn, false);
                    form.reset();
                    if (note) {
                        note.textContent = '🔒 We respect your privacy. Unsubscribe anytime.';
                        note.style.color = '';
                    }
                }, 2000);
            });
        });

        if (leadPopup) {
            let lastFocusedElement = null;

            const trapFocusHandler = (e) => {
                const focusable = leadPopup.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            };

            const openLeadPopup = () => {
                lastFocusedElement = document.activeElement;
                if (typeof leadPopup.showModal === 'function') {
                    leadPopup.showModal();
                } else {
                    leadPopup.setAttribute('open', '');
                }
                document.body.style.overflow = 'hidden';
                ['header.site-header', 'main', 'footer.site-footer'].forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.setAttribute('aria-hidden', 'true');
                });
                leadPopup.addEventListener('keydown', trapFocusHandler);
                if (popupClose) popupClose.focus();
            };

            const closeLeadPopup = () => {
                if (typeof leadPopup.close === 'function') {
                    leadPopup.close();
                } else {
                    leadPopup.removeAttribute('open');
                }
                document.body.style.overflow = '';
                ['header.site-header', 'main', 'footer.site-footer'].forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.removeAttribute('aria-hidden');
                });
                leadPopup.removeEventListener('keydown', trapFocusHandler);
                if (lastFocusedElement) lastFocusedElement.focus();
            };

            const popupSeenKey = 'kameraLeadPopupSeen';
            const popupShownThisSession = sessionStorage.getItem(popupSeenKey);
            if (!popupShownThisSession && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setTimeout(() => {
                    if (!leadPopup.open) {
                        openLeadPopup();
                        sessionStorage.setItem(popupSeenKey, 'true');
                    }
                }, 5000);
            }
            if (popupClose) {
                popupClose.addEventListener('click', closeLeadPopup);
            }
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

    // ---------- 17. Exit-Intent Popup ----------
    try {
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
                    .then((registration) => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error);
                    });
            });
        }
    } catch (error) {
        console.error('Service Worker error:', error);
    }
});