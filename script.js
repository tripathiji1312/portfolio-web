document.addEventListener('DOMContentLoaded', function() {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let cursorVisible = true;
    let cursorEnlarged = false;

    document.addEventListener('mousemove', function(e) {
        if (cursorVisible) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .orb, .site-logo, .skill-tag');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursorEnlarged = true;
            cursorDot.style.width = '15px';
            cursorDot.style.height = '15px';
            cursorOutline.style.backgroundColor = 'rgba(0, 255, 153, 0.25)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
        });
        el.addEventListener('mouseout', () => {
            cursorEnlarged = false;
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
     document.addEventListener('mousedown', () => {
        if (cursorVisible && !cursorEnlarged) {
             cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.7)';
        }
    });
    document.addEventListener('mouseup', () => {
        if (cursorVisible && !cursorEnlarged) {
             cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });

    // --- Active Orb Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const orbs = document.querySelectorAll('.orb-menu .orb');
    const scrollDownIndicators = document.querySelectorAll('.scroll-down-indicator');

    function navHighlighter() {
        let scrollY = window.pageYOffset;
        let currentSectionId = null;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (window.innerHeight * 0.4); // Trigger ~40% from top

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = current.getAttribute('id');
            }
        });

        orbs.forEach(orb => {
            orb.classList.remove('active');
            if (orb.getAttribute('href') === `#${currentSectionId}`) {
                orb.classList.add('active');
            }
        });

        if (!currentSectionId && window.scrollY < sections[0].offsetTop + sections[0].offsetHeight * 0.6) {
            const heroOrb = document.querySelector('.orb-menu a[href="#hero"]');
            if(heroOrb) heroOrb.classList.add('active');
        }
    }

    // Scroll down indicator visibility and behavior
    function handleScrollIndicators() {
        const scrollPositionBottom = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        scrollDownIndicators.forEach(indicator => {
            const section = indicator.closest('section');
            if (section) {
                const sectionBottom = section.offsetTop + section.offsetHeight;
                // Hide if close to the bottom of its section, or at the very end of the page
                if (window.scrollY > sectionBottom - window.innerHeight * 0.3 || scrollPositionBottom >= documentHeight - 20 ) {
                    indicator.style.opacity = '0';
                    indicator.style.pointerEvents = 'none';
                } else {
                    indicator.style.opacity = '1';
                    indicator.style.pointerEvents = 'auto';
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        navHighlighter();
        handleScrollIndicators();
    });
    navHighlighter(); // Initial call
    handleScrollIndicators(); // Initial call


    // --- Scroll Reveal Animation for Sections ---
    const sr_sections = document.querySelectorAll('.fullscreen-section');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Uncomment to animate only once
            } else {
                // entry.target.classList.remove('visible'); // Uncomment to animate every time it enters/leaves
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1, // How much of the section should be visible to trigger
        rootMargin: '0px 0px -10% 0px' // Adjusts the bounding box, triggers a bit earlier/later
    });

    sr_sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Contact Form Submission (Basic Example) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.elements['name'].value;
            const email = this.elements['email'].value;
            const message = this.elements['message'].value;

            // ---- PRODUCTION NOTE ----
            // In a real production environment, you would replace the alert below
            // with an AJAX request to send the form data to your backend (e.g., a Python/Django endpoint)
            // or to a third-party form handling service (like Formspree, Netlify Forms, etc.).
            // Example:
            // fetch('/your-contact-endpoint', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, message })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     alert('Message sent successfully!');
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     alert('Error sending message. Please try again.');
            // });
            // ---- END PRODUCTION NOTE ----

            alert(`Thank you, ${name}! Your message has been "received" (this is a demo).\nEmail: ${email}\nMessage: ${message}`);
            this.reset();
        });
    }

    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});