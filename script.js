/* =============================================
   SEJAL ALLE — PORTFOLIO SCRIPT (GSAP Fixed)
   ============================================= */

console.log('✅ SCRIPT RUNNING');

/* ─── Inject shake keyframe immediately ─── */
const _styleEl = document.createElement('style');
_styleEl.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(_styleEl);


/* =============================================
   SAFETY: if GSAP never loaded, bail gracefully
   ============================================= */
if (typeof gsap === 'undefined') {
  console.error('❌ GSAP not loaded — check CDN links in index.html');
} else {

  /* ──────────────────────────────────────────
     REGISTER PLUGINS
  ─────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.defaults({ ease: 'power3.out' });
  console.log('✅ GSAP plugins registered');


  /* ──────────────────────────────────────────
     LOADER — with hard 4s safety-net timeout
     so a broken/missing image never locks the page
  ─────────────────────────────────────────── */
  const loader = document.getElementById('loader');

  // Hide scrollbar while loader is visible
  document.body.style.overflow = 'hidden';

  function finishLoader() {
    if (loader._done) return;   // prevent double-fire
    loader._done = true;
    console.log('✅ LOADER FINISHED');

    gsap.to(loader, {
      opacity: 0, duration: 0.55, ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display    = 'none';   // FIX: display:none, not just opacity
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none'; // FIX: never block clicks
        document.body.style.overflow = '';  // FIX: restore scroll
        ScrollTrigger.refresh();            // FIX: recalculate positions post-loader
        initHeroAnimation();
        initTyping();
        console.log('✅ ScrollTrigger refreshed, hero animations started');
      }
    });
  }

  // Loader play animation
  const loaderTl = gsap.timeline({
    onComplete: finishLoader  // fires when animation is done
  });
  loaderTl
    .from('.loader-name', { opacity: 0, y: 40, duration: 0.55, ease: 'back.out(1.5)' })
    .from('.loader-fill', { scaleX: 0, transformOrigin: 'left center', duration: 1.5, ease: 'power2.inOut' }, 0.15);

  // FIX: Hard safety-net — if loader somehow hangs (missing images, etc.) bail after 4s
  const loaderSafetyNet = setTimeout(() => {
    console.warn('⚠️ Loader safety-net fired — forcing finish');
    loaderTl.kill();
    finishLoader();
  }, 4000);

  // FIX: Also listen for window.load — fire loader finish once ALL assets are loaded
  window.addEventListener('load', () => {
    clearTimeout(loaderSafetyNet); // assets loaded — clear the hard timeout
    // Give the loader animation a tiny moment to complete gracefully
    setTimeout(finishLoader, 400);
  });

  // FIX: ScrollTrigger refresh on window resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  // FIX: Refresh ScrollTrigger when all assets load too
  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 200);
  });


  /* ──────────────────────────────────────────
     CUSTOM CURSOR (GSAP-powered, desktop only)
  ─────────────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (window.innerWidth > 768 && cursor && follower) {
    // Set initial position off-screen so cursor doesn't flash at 0,0
    gsap.set([cursor, follower], { x: -100, y: -100 });

    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor,   { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none', overwrite: true });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.22, ease: 'power2.out', overwrite: true });
    });

    // Show cursor once mouse moves (avoid flash on page load)
    document.addEventListener('mousemove', () => {
      gsap.set([cursor, follower], { opacity: 1 });
    }, { once: true });

    gsap.set([cursor, follower], { opacity: 0 }); // hidden until first move

    const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-item, .highlight-item');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 2,   opacity: 0.45, duration: 0.25 });
        gsap.to(cursor,   { scale: 0.5, duration: 0.15 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(cursor,   { scale: 1, duration: 0.2 });
      });
    });
  }


  /* ──────────────────────────────────────────
     NAVBAR
  ─────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const menuToggle  = document.getElementById('menuToggle');
  const navLinks    = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (!navbar || !menuToggle || !navLinks) {
    console.error('❌ Navbar elements missing from DOM');
  }

  // Navbar drops in — delayed to let loader finish first
  gsap.from('.navbar', { y: -80, opacity: 0, duration: 0.7, delay: 0.1 });

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
    updateActiveNav();
  }, { passive: true }); // FIX: passive listener for scroll performance

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      gsap.fromTo('.nav-links li',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' }
      );
    }
  });

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], header[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }


  /* ──────────────────────────────────────────
     HERO ANIMATION — called after loader done
  ─────────────────────────────────────────── */
  function initHeroAnimation() {
    // Guard: make sure hero elements exist
    if (!document.querySelector('.hero-badge')) {
      console.warn('⚠️ Hero elements not found');
      return;
    }

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-badge',         { y: 24,  opacity: 0, duration: 0.55 })
      .from('.hero h1',            { y: 50,  opacity: 0, duration: 0.75 }, '-=0.25')
      .from('.hero-desc',          { y: 30,  opacity: 0, duration: 0.65 }, '-=0.35')
      .from('.hero-buttons .btn',  { y: 20,  opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.35')
      .from('.hero-stats .stat',   { y: 20,  opacity: 0, duration: 0.45, stagger: 0.1  }, '-=0.3')
      .from('.stat-divider',       { scaleY: 0, opacity: 0, duration: 0.4 }, '-=0.4')
      .from('.image-frame img',    { scale: 0.8, opacity: 0, duration: 0.85, ease: 'back.out(1.3)' }, '-=0.7')
      .from('.deco-ring',          { scale: 0, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .from('.deco-dots',          { opacity: 0, x: 20, duration: 0.5 }, '-=0.35')
      .from('.floating-card',      { y: 30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.4)' }, '-=0.3')
      .from('.scroll-down',        { opacity: 0, y: 12, duration: 0.45 }, '-=0.2');

    // Parallax blobs on mouse move
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    if (blob1 && blob2) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        gsap.to(blob1, { x,     y,     duration: 1.2, ease: 'power1.out', overwrite: true });
        gsap.to(blob2, { x: -x, y: -y, duration: 1.4, ease: 'power1.out', overwrite: true });
      }, { passive: true });
    }

    // Magnetic hero image (desktop)
    const imgFrame = document.querySelector('.image-frame');
    if (imgFrame && window.innerWidth > 900) {
      imgFrame.addEventListener('mousemove', (e) => {
        const rect = imgFrame.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.08;
        const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.08;
        gsap.to(imgFrame, { x: dx, y: dy, duration: 0.4, ease: 'power2.out', overwrite: true });
      });
      imgFrame.addEventListener('mouseleave', () => {
        gsap.to(imgFrame, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    }
  }


  /* ──────────────────────────────────────────
     TYPING EFFECT — called after loader done
  ─────────────────────────────────────────── */
  function initTyping() {
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (!subtitleEl) return;

    const texts = ['Full-Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'B.Tech IT Student'];
    let idx = 0, charIdx = 0, deleting = false;
    let typingTimer = null;

    function typeLoop() {
      const current = texts[idx];
      subtitleEl.textContent = deleting
        ? current.slice(0, --charIdx)
        : current.slice(0, ++charIdx);

      let speed = deleting ? 45 : 75;
      if (!deleting && charIdx === current.length) { deleting = true;  speed = 1800; }
      else if (deleting && charIdx === 0)          { deleting = false; idx = (idx + 1) % texts.length; speed = 300; }

      typingTimer = setTimeout(typeLoop, speed);
    }
    typeLoop();
  }


  /* ──────────────────────────────────────────
     SCROLL ANIMATIONS
     All wrapped in a single DOMContentLoaded
     to ensure elements exist before animating
  ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
  // Also call directly in case DOMContentLoaded already fired
  if (document.readyState !== 'loading') initScrollAnimations();

  function initScrollAnimations() {

    // ── Section labels (global) ──
    gsap.utils.toArray('.section-label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        x: -30, opacity: 0, duration: 0.6
      });
    });

    // ── ABOUT ──
    const aboutImg = document.querySelector('.about-img-container');
    if (aboutImg) {
      gsap.from(aboutImg, {
        scrollTrigger: { trigger: '.about', start: 'top 78%', once: true },
        clipPath: 'inset(100% 0% 0% 0%)', y: 40, duration: 1.1, ease: 'power4.out'
      });
    }

    const aboutBadge = document.querySelector('.about-badge');
    if (aboutBadge) {
      gsap.from(aboutBadge, {
        scrollTrigger: { trigger: '.about', start: 'top 72%', once: true },
        scale: 0, opacity: 0, duration: 0.6, delay: 0.5, ease: 'back.out(1.5)'
      });
    }

    gsap.from('.about-text .section-title', {
      scrollTrigger: { trigger: '.about-text', start: 'top 82%', once: true },
      y: 40, opacity: 0, duration: 0.8
    });

    gsap.from('.about-text p', {
      scrollTrigger: { trigger: '.about-text', start: 'top 78%', once: true },
      y: 24, opacity: 0, duration: 0.6, stagger: 0.15
    });

    gsap.from('.highlight-item', {
      scrollTrigger: { trigger: '.about-highlights', start: 'top 87%', once: true },
      x: -30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)'
    });

    const aboutBtn = document.querySelector('.about-text .btn');
    if (aboutBtn) {
      gsap.from(aboutBtn, {
        scrollTrigger: { trigger: aboutBtn, start: 'top 92%', once: true },
        y: 20, opacity: 0, duration: 0.5
      });
    }

    // ── SKILLS ──
    gsap.from('.skills-section .section-title', {
      scrollTrigger: { trigger: '.skills-section', start: 'top 80%', once: true },
      y: 40, opacity: 0, duration: 0.8
    });

    gsap.from('.skills-section .section-desc', {
      scrollTrigger: { trigger: '.skills-section', start: 'top 77%', once: true },
      y: 20, opacity: 0, duration: 0.6, delay: 0.15
    });

    gsap.utils.toArray('.skill-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        y: 60, opacity: 0, duration: 0.7, delay: i * 0.13
      });

      gsap.from(card.querySelectorAll('.skill-tags span'), {
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        y: 16, opacity: 0, duration: 0.4, stagger: 0.055, delay: 0.3 + i * 0.1
      });

      // Hover
      card.addEventListener('mouseenter', () => gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { y: 0,   duration: 0.5, ease: 'elastic.out(1,0.5)' }));
    });

    // ── PROJECTS ──
    gsap.from('.projects .section-title', {
      scrollTrigger: { trigger: '.projects', start: 'top 80%', once: true },
      y: 40, opacity: 0, duration: 0.8
    });

    gsap.from('.projects .section-desc', {
      scrollTrigger: { trigger: '.projects', start: 'top 77%', once: true },
      y: 20, opacity: 0, duration: 0.6, delay: 0.15
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
      const isReverse = card.classList.contains('project-card--reverse');
      const textEl    = card.querySelector('.project-text');
      const imgEl     = card.querySelector('.project-image');
      const techTags  = card.querySelectorAll('.tech-stack span');
      const numEl     = card.querySelector('.project-number');

      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 84%', once: true },
        y: 80, opacity: 0, duration: 0.85
      });

      if (textEl) {
        gsap.from(textEl, {
          scrollTrigger: { trigger: card, start: 'top 80%', once: true },
          x: isReverse ? 50 : -50, opacity: 0, duration: 0.85, delay: 0.18
        });
      }

      if (imgEl) {
        gsap.from(imgEl, {
          scrollTrigger: { trigger: card, start: 'top 80%', once: true },
          clipPath: isReverse ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
          duration: 0.95, delay: 0.12, ease: 'power4.inOut'
        });
      }

      if (techTags.length) {
        gsap.from(techTags, {
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
          scale: 0.8, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.45, ease: 'back.out(1.4)'
        });
      }

      if (numEl) {
        gsap.from(numEl, {
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
          rotationX: 90, opacity: 0, duration: 0.55, ease: 'back.out(1.5)'
        });
      }

      // 3D tilt — desktop only
      if (window.innerWidth > 900) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const rx = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
          const ry = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
          gsap.to(card, { rotationY: rx, rotationX: -ry, transformPerspective: 1000, duration: 0.35, ease: 'power2.out', overwrite: true });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
        });
      }
    });

    // ── CONTACT ──
    gsap.from('.contact .section-title', {
      scrollTrigger: { trigger: '.contact', start: 'top 80%', once: true },
      y: 40, opacity: 0, duration: 0.8
    });

    gsap.from('.contact .section-desc', {
      scrollTrigger: { trigger: '.contact', start: 'top 77%', once: true },
      y: 20, opacity: 0, duration: 0.6, delay: 0.15
    });

    const contactInfoHead = document.querySelectorAll('.contact-info h3, .contact-info > p');
    if (contactInfoHead.length) {
      gsap.from(contactInfoHead, {
        scrollTrigger: { trigger: '.contact-info', start: 'top 84%', once: true },
        y: 24, opacity: 0, duration: 0.6, stagger: 0.15
      });
    }

    gsap.utils.toArray('.contact-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 92%', once: true },
        x: -40, opacity: 0, duration: 0.5, delay: i * 0.1
      });
      item.addEventListener('mouseenter', () => gsap.to(item, { x: 8,  duration: 0.28, ease: 'power2.out' }));
      item.addEventListener('mouseleave', () => gsap.to(item, { x: 0,  duration: 0.4,  ease: 'elastic.out(1,0.5)' }));
    });

    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length) {
      gsap.from(socialLinks, {
        scrollTrigger: { trigger: '.social-links', start: 'top 93%', once: true },
        y: 20, opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)'
      });
      socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => gsap.to(link, { y: -4, scale: 1.15, duration: 0.22 }));
        link.addEventListener('mouseleave', () => gsap.to(link, { y: 0,  scale: 1,    duration: 0.35, ease: 'elastic.out(1,0.5)' }));
      });
    }

    const formWrap = document.querySelector('.contact-form-wrap');
    if (formWrap) {
      gsap.from(formWrap, {
        scrollTrigger: { trigger: formWrap, start: 'top 80%', once: true },
        x: 60, opacity: 0, duration: 0.85
      });
    }

    gsap.from('.form-group', {
      scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 78%', once: true },
      y: 20, opacity: 0, duration: 0.45, stagger: 0.1, delay: 0.2
    });

    // ── FOOTER ──
    gsap.from('.footer-logo, .footer-links, .footer-copy', {
      scrollTrigger: { trigger: 'footer', start: 'top 93%', once: true },
      y: 20, opacity: 0, duration: 0.55, stagger: 0.12
    });

  } // end initScrollAnimations


  /* ──────────────────────────────────────────
     BUTTON MICRO-INTERACTIONS
  ─────────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.18, ease: 'power2.out' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1,    duration: 0.28, ease: 'elastic.out(1,0.5)' }));
    btn.addEventListener('mousedown',  () => gsap.to(btn, { scale: 0.96, duration: 0.1  }));
    btn.addEventListener('mouseup',    () => gsap.to(btn, { scale: 1.04, duration: 0.14, ease: 'back.out(2)' }));
  });


  /* ──────────────────────────────────────────
     SMOOTH SCROLL — GSAP ScrollToPlugin
  ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 1.1, ease: 'power3.inOut'
      });
    });
  });

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { scrollTo: 0, duration: 1.15, ease: 'power3.inOut' });
    });
  }


  /* ──────────────────────────────────────────
     CONTACT FORM
  ─────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm && formSuccess && submitBtn) {

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = {
        name:    { el: document.getElementById('name'),    errEl: document.getElementById('nameError'),    min: 2 },
        email:   { el: document.getElementById('email'),   errEl: document.getElementById('emailError'),   isEmail: true },
        subject: { el: document.getElementById('subject'), errEl: document.getElementById('subjectError'), min: 3 },
        message: { el: document.getElementById('message'), errEl: document.getElementById('messageError'), min: 10 },
      };

      let valid = true;
      Object.values(fields).forEach(({ el, errEl, min, isEmail }) => {
        if (!errEl || !el) return;
        errEl.textContent = '';
        const val = el.value.trim();
        if (!val) {
          errEl.textContent = 'This field is required.';
          shakeInput(el); valid = false;
        } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errEl.textContent = 'Please enter a valid email.';
          shakeInput(el); valid = false;
        } else if (min && val.length < min) {
          errEl.textContent = `Must be at least ${min} characters.`;
          shakeInput(el); valid = false;
        }
      });

      if (!valid) {
        gsap.to(contactForm, {
          x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'none',
          onComplete: () => gsap.set(contactForm, { x: 0 })
        });
        return;
      }

      // Loading state
      const btnText    = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      const btnIcon    = submitBtn.querySelector('.btn-icon');

      gsap.to(submitBtn, { scale: 0.97, duration: 0.1 });
      if (btnText)    btnText.style.display    = 'none';
      if (btnIcon)    btnIcon.style.display    = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-flex';
      submitBtn.disabled = true;

      await new Promise(r => setTimeout(r, 1800));

      if (btnLoading) btnLoading.style.display = 'none';
      if (btnText)    btnText.style.display    = '';
      if (btnIcon)    btnIcon.style.display    = '';
      submitBtn.disabled = false;
      gsap.to(submitBtn, { scale: 1, duration: 0.3, ease: 'back.out(2)' });

      // Success message
      formSuccess.style.display = 'flex'; // make visible before animation
      formSuccess.classList.add('visible');
      gsap.fromTo(formSuccess,
        { y: 16, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
      );
      contactForm.reset();

      setTimeout(() => {
        gsap.to(formSuccess, {
          opacity: 0, y: -10, duration: 0.35,
          onComplete: () => {
            formSuccess.classList.remove('visible');
            formSuccess.style.display = '';
          }
        });
      }, 5000);
    });

    // Real-time clear errors + focus micro
    contactForm.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const err = document.getElementById(el.id + 'Error');
        if (err) err.textContent = '';
      });
      el.addEventListener('focus', () => gsap.to(el, { scale: 1.01, duration: 0.18, ease: 'power2.out' }));
      el.addEventListener('blur',  () => gsap.to(el, { scale: 1,    duration: 0.18 }));
    });
  }

  function shakeInput(el) {
    gsap.to(el, {
      x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'none',
      onComplete: () => gsap.set(el, { x: 0 })
    });
  }


} // end gsap safety check