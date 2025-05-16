document.addEventListener('DOMContentLoaded', function() {

    // --- Custom Cursor - Restored Original Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let cursorVisible = true; // Assuming visible by default if not on mobile
    let cursorEnlarged = false;

    document.addEventListener('mousemove', function(e) {
        if (cursorVisible) { // cursorVisible check already present in original
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .orb, .site-logo, .skill-tag, input[type="text"], input[type="email"], textarea'); // Added form fields to interactive

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            if (!cursorVisible) return; // Don't enlarge if not visible (e.g. on touch)
            cursorEnlarged = true;
            cursorDot.style.width = '15px'; // Original enlarged size
            cursorDot.style.height = '15px';
            cursorOutline.style.backgroundColor = 'rgba(0, 255, 153, 0.25)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)'; // Original enlarged scale
        });
        el.addEventListener('mouseout', () => {
            if (!cursorVisible) return;
            cursorEnlarged = false;
            cursorDot.style.width = '8px'; // Original dot size
            cursorDot.style.height = '8px';
            cursorOutline.style.backgroundColor = 'transparent'; // Original outline bg
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)'; // Original outline scale
        });
    });
     document.addEventListener('mousedown', () => {
        if (cursorVisible && !cursorEnlarged) { // Original condition
             cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.7)';
        }
    });
    document.addEventListener('mouseup', () => {
        if (cursorVisible && !cursorEnlarged) { // Original condition
             cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
    
    // Hide cursor on touch devices for better UX, check if cursor style is 'none'
    // This can be tricky as 'cursor: none' in CSS hides it but JS still might think it's there.
    // The media query in CSS that sets `display:none` for cursor is the primary way it's handled.
    // Here, we check if the CSS made them 'none'. If so, set cursorVisible to false.
    if (window.getComputedStyle(cursorDot).display === 'none') {
        cursorVisible = false;
    }


    // --- Hero Section Abstract Shapes Parallax (Kept from previous enhancement) ---
    const heroSection = document.getElementById('hero');
    const abstractShapes = heroSection.querySelectorAll('.abstract-shape');
    if (heroSection && abstractShapes.length > 0 && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            if (!cursorVisible) return; // Don't do parallax if cursor isn't active
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = heroSection;
            
            const xPercent = (clientX / offsetWidth - 0.5) * 2;
            const yPercent = (clientY / offsetHeight - 0.5) * 2;

            abstractShapes.forEach((shape, index) => {
                const maxOffset = 10 + index * 3; // Slightly reduced maxOffset for subtlety
                const offsetX = xPercent * maxOffset * (index % 2 === 0 ? 1 : -0.7);
                const offsetY = yPercent * maxOffset * (index % 2 === 0 ? 0.7 : -1);
                
                // This method of applying transform directly still contends with CSS animation transform.
                // Ideally, use CSS variables within the animation, or separate animated properties.
                // Given constraints, we're "nudging" it.
                shape.style.transform = `translate(${offsetX}px, ${offsetY}px) ${getComputedStyle(shape).transform.replace(/translate\([^)]+\)/g, '').trim()}`;

            });
        });
        // Reset on mouse leave from hero section to avoid shapes getting stuck if mouse exits fast
        heroSection.addEventListener('mouseleave', () => {
             abstractShapes.forEach((shape) => {
                // This simply removes the JS applied transform, letting CSS take over fully again.
                // The 'morphFloat' animation's transform values will be what is seen.
                // This assumes 'morphFloat' defines its own base transforms (scale/rotate)
                let currentTransform = getComputedStyle(shape).transform;
                if (currentTransform !== "none") {
                     // Attempt to strip out only the translate() part added by JS if possible
                     // This is complex. Simpler is to let CSS animations just "win" when not actively mousing over.
                     // For simplicity now: on mouseleave, we let CSS animation define its course.
                     // The slight jump might be acceptable. The ideal is separating concerns more.
                }
             });
        });
    }


    // --- Active Orb Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const orbs = document.querySelectorAll('.orb-menu .orb');
    const scrollDownIndicators = document.querySelectorAll('.scroll-down-indicator');

    function navHighlighter() {
        let scrollY = window.pageYOffset;
        let currentSectionId = null;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Trigger a bit earlier, e.g. when 30-40% of section is visible from its top
            const sectionTop = current.offsetTop - (window.innerHeight * 0.4); 

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = current.getAttribute('id');
            }
        });
        
        if (!currentSectionId && sections.length > 0) {
            if (scrollY < sections[0].offsetTop + sections[0].offsetHeight * 0.5 ) {
                 currentSectionId = sections[0].getAttribute('id');
            }
            else if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 20) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        orbs.forEach(orb => {
            orb.classList.remove('active');
            const orbLink = orb.getAttribute('href'); //Direct href attribute
            if (orbLink && currentSectionId && orbLink.endsWith(currentSectionId)) { //Check endsWith for safety
                orb.classList.add('active');
            }
        });
         // Ensure hero is active if at top or no section determined yet (initial load at top)
        if (!currentSectionId && window.scrollY < sections[0].offsetTop * 0.8) { // Check if very close to top
            const heroOrb = document.querySelector('.orb-menu a[href="#hero"]');
            if (heroOrb) heroOrb.classList.add('active');
        }
    }

    function handleScrollIndicators() {
        const scrollPositionBottom = Math.round(window.scrollY + window.innerHeight);
        const documentHeight = Math.round(document.documentElement.scrollHeight);

        scrollDownIndicators.forEach(indicator => {
            const section = indicator.closest('section');
            if (section) {
                const sectionBottom = section.offsetTop + section.offsetHeight;
                if (window.scrollY > sectionBottom - window.innerHeight * 0.2 || scrollPositionBottom >= documentHeight - 10 ) {
                    indicator.style.opacity = '0';
                    indicator.style.pointerEvents = 'none';
                } else {
                     // Restore original opacity logic for indicators
                    indicator.style.opacity = indicator.classList.contains('section-scroll') ? 
                                               (indicator.matches(':hover') ? '1' : '0.3') : // For .section-scroll indicators
                                               (indicator.matches(':hover') ? '1' : '0.4');  // For hero indicator (original .4)
                    if (indicator.matches(':hover')) { // Keep user's hover opacity consistent
                        indicator.style.color = '#00ff99';
                    } else {
                         indicator.style.color = indicator.classList.contains('section-scroll') ? 'rgba(0, 255, 153, 0.3)' : 'rgba(255, 255, 255, 0.4)';
                    }
                    indicator.style.pointerEvents = 'auto';
                }
            }
        });
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            navHighlighter();
            handleScrollIndicators();
        }, 50); 
    });
    navHighlighter(); 
    handleScrollIndicators();

    // --- Scroll Reveal Animation for Sections & Staggered Elements ---
    const sr_sections = document.querySelectorAll('.fullscreen-section');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const timelineItems = entry.target.querySelectorAll('.timeline-item');
                timelineItems.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 0.15 + 0.2}s`; // Base delay + stagger
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                });

                const skillTags = entry.target.querySelectorAll('.skill-tag:not(.visible)');
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.classList.add('visible');
                    }, index * 100 + 400); 
                });

                const projectCards = entry.target.querySelectorAll('.project-card:not(.visible)');
                projectCards.forEach((card, index) => {
                     setTimeout(() => {
                        card.classList.add('visible');
                        // Animate project description P tag after card is visible
                        const cardDesc = card.querySelector('.project-description');
                        if(cardDesc) {
                            cardDesc.style.opacity = '1';
                            cardDesc.style.transform = 'translateY(0)';
                        }
                    }, index * 150 + 300); 
                });

                const contactLinks = entry.target.querySelectorAll('.contact-link:not(.visible)');
                contactLinks.forEach((link, index) => {
                    setTimeout(() => {
                        link.classList.add('visible');
                    }, index * 150 + (entry.target.querySelector('.contact-header p') ? 600 : 300) );
                });

                // observer.unobserve(entry.target); 
            } else {
                // entry.target.classList.remove('visible');
                const timelineItems = entry.target.querySelectorAll('.timeline-item');
                timelineItems.forEach((item) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-30px)';
                });
                // To re-animate cards and skill tags on scroll back into view, also reset them here.
                // entry.target.querySelectorAll('.skill-tag.visible').forEach(t => t.classList.remove('visible'));
                // entry.target.querySelectorAll('.project-card.visible').forEach(c => {
                //     c.classList.remove('visible');
                //     const desc = c.querySelector('.project-description');
                //     if(desc) { desc.style.opacity = '0'; desc.style.transform = 'translateY(20px)';}
                // });
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15, 
        rootMargin: '0px 0px -10% 0px' 
    });

    sr_sections.forEach(section => {
        section.querySelectorAll('.timeline-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
        });
         // Initialize project description to be animated by JS
        section.querySelectorAll('.project-card .project-description').forEach(desc => {
            desc.style.opacity = '0';
            desc.style.transform = 'translateY(20px)'; // Match p animation start
        });
        sectionObserver.observe(section);
    });


    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.elements['name'].value;
            const email = this.elements['email'].value;
            const message = this.elements['message'].value;
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                alert(`Thank you, ${name}! Your message has been "received" (this is a demo).\nEmail: ${email}\nMessage: ${message}`);
                this.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    navHighlighter();
    handleScrollIndicators();

});