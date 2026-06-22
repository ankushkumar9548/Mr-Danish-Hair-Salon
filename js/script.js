/* ==========================================================================
   MR DANISH HAIR SALON - Core JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Preloader Fadeout ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 600);
        });
        // Fallback in case load event already fired or delayed
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.remove(), 600);
            }
        }, 3000);
    }

    // --- 2. Theme Toggle (Dark / Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }

    // --- 3. Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    }

    // --- 4. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // --- 5. Active Link Highlight based on current path ---
    const path = window.location.pathname;
    const pageName = path.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (pageName === linkPage || (pageName === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- 6. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 7. Stats Counter Animations ---
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const countUp = (element) => {
            const target = parseInt(element.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + (element.getAttribute('data-suffix') || '');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + (element.getAttribute('data-suffix') || '');
                }
            }, stepTime);
        };

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statNumbers.forEach(num => countUp(num));
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            statsObserver.observe(statsSection);
        }
    }

    // --- 8. Testimonials Carousel Slider ---
    const track = document.querySelector('.testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const nextButton = document.querySelector('.slider-btn.next');
    const prevButton = document.querySelector('.slider-btn.prev');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slideWidth = slides[0].getBoundingClientRect().width;
        let autoPlayInterval;

        const updateSliderPosition = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSliderPosition();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSliderPosition();
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        // Auto play slider
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        startAutoPlay();

        // Responsive handling on resize
        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            updateSliderPosition();
        });
    }

    // --- 9. Gallery Filtering and Lightbox ---
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length > 0) {
        // Filtering
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // Trigger simple transition
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 20);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => { item.style.display = 'none'; }, 300);
                    }
                });
            });
        });

        // Lightbox Modal Functional Code
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxZoom = document.getElementById('lightbox-zoom');

        if (lightbox) {
            let activeItems = [];
            let currentLightboxIndex = 0;
            let isZoomed = false;

            const openLightbox = (index) => {
                // Get all currently visible gallery items
                activeItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
                currentLightboxIndex = activeItems.indexOf(galleryItems[index]);
                if (currentLightboxIndex === -1) currentLightboxIndex = 0;

                updateLightboxContent();
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };

            const updateLightboxContent = () => {
                if (activeItems.length === 0) return;
                const currentItem = activeItems[currentLightboxIndex];
                const img = currentItem.querySelector('img');
                const title = currentItem.querySelector('.gallery-item-title').textContent;
                const cat = currentItem.querySelector('.gallery-item-cat').textContent;
                
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = `<strong>${title}</strong> - ${cat}`;
                resetZoom();
            };

            const closeLightbox = () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetZoom();
            };

            const nextLightboxImg = () => {
                currentLightboxIndex = (currentLightboxIndex + 1) % activeItems.length;
                updateLightboxContent();
            };

            const prevLightboxImg = () => {
                currentLightboxIndex = (currentLightboxIndex - 1 + activeItems.length) % activeItems.length;
                updateLightboxContent();
            };

            const toggleZoom = () => {
                if (isZoomed) {
                    resetZoom();
                } else {
                    lightboxImg.style.transform = 'scale(1.5)';
                    lightboxImg.style.cursor = 'zoom-out';
                    isZoomed = true;
                }
            };

            const resetZoom = () => {
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.style.cursor = 'zoom-in';
                isZoomed = false;
            };

            // Attach click handlers to gallery item image or overlay clicks
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    openLightbox(index);
                });
            });

            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
            if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImg);
            if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImg);
            if (lightboxZoom) lightboxZoom.addEventListener('click', toggleZoom);

            // Close lightbox on backdrop click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'ArrowRight') nextLightboxImg();
                    if (e.key === 'ArrowLeft') prevLightboxImg();
                }
            });
        }
    }

    // --- 10. Services Page Tabs Filter ---
    const servicesTabBtns = document.querySelectorAll('.services-tabs .tab-btn');
    const serviceCards = document.querySelectorAll('.services-grid .service-card');

    if (servicesTabBtns.length > 0 && serviceCards.length > 0) {
        servicesTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                servicesTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tabValue = btn.getAttribute('data-tab');
                
                serviceCards.forEach(card => {
                    if (tabValue === 'all' || card.getAttribute('data-category') === tabValue) {
                        card.parentNode.style.display = 'block';
                        setTimeout(() => { card.parentNode.style.opacity = '1'; }, 20);
                    } else {
                        card.parentNode.style.opacity = '0';
                        setTimeout(() => { card.parentNode.style.display = 'none'; }, 200);
                    }
                });
            });
        });
    }

    // --- 11. Appointment Form Validation & WhatsApp Integration ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Elements
            const nameEl = document.getElementById('name');
            const phoneEl = document.getElementById('phone');
            const emailEl = document.getElementById('email');
            const serviceEl = document.getElementById('service');
            const dateEl = document.getElementById('date');
            const timeEl = document.getElementById('time');
            const messageEl = document.getElementById('message');

            let isValid = true;

            // Simple helper validation
            const validateField = (element, condition) => {
                const errorEl = document.getElementById(`${element.id}-error`);
                if (condition) {
                    errorEl.style.display = 'none';
                    element.style.borderColor = 'var(--glass-border)';
                } else {
                    errorEl.style.display = 'block';
                    element.style.borderColor = '#ff3333';
                    isValid = false;
                }
            };

            // Validations
            validateField(nameEl, nameEl.value.trim().length >= 3);
            validateField(phoneEl, /^[6-9]\d{9}$/.test(phoneEl.value.trim())); // Indian standard mobile validation
            validateField(emailEl, emailEl.value.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim()));
            validateField(serviceEl, serviceEl.value !== '');
            validateField(dateEl, dateEl.value !== '');
            validateField(timeEl, timeEl.value !== '');

            if (isValid) {
                // Prepare message for WhatsApp
                const name = nameEl.value.trim();
                const phone = phoneEl.value.trim();
                const email = emailEl.value.trim() || 'Not Provided';
                const serviceName = serviceEl.options[serviceEl.selectedIndex].text;
                const date = dateEl.value;
                const time = timeEl.value;
                const message = messageEl.value.trim() || 'No special requirements';

                const whatsappText = `*Mr Danish Hair Salon - New Appointment Booking*%0A%0A` +
                    `*Name:* ${encodeURIComponent(name)}%0A` +
                    `*Phone:* ${encodeURIComponent(phone)}%0A` +
                    `*Email:* ${encodeURIComponent(email)}%0A` +
                    `*Service:* ${encodeURIComponent(serviceName)}%0A` +
                    `*Date:* ${encodeURIComponent(date)}%0A` +
                    `*Time:* ${encodeURIComponent(time)}%0A` +
                    `*Message:* ${encodeURIComponent(message)}`;

                const whatsappUrl = `https://wa.me/918433208752?text=${whatsappText}`;

                // Show success popup first
                const successModal = document.getElementById('success-modal');
                if (successModal) {
                    successModal.style.display = 'flex';
                    
                    const proceedBtn = document.getElementById('close-success-btn');
                    if (proceedBtn) {
                        proceedBtn.addEventListener('click', () => {
                            successModal.style.display = 'none';
                            // Redirect to WhatsApp
                            window.open(whatsappUrl, '_blank');
                            bookingForm.reset(); // Reset form
                        });
                    }
                } else {
                    // Direct redirect if modal missing
                    window.open(whatsappUrl, '_blank');
                }
            }
        });
    }

    // --- 12. Scroll-to-Top Button ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
