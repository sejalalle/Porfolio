/* =============================================
   SEJAL ALLE — PORTFOLIO SCRIPT (GSAP Edition)
   ============================================= */

/* ─── SHAKE KEYFRAME (injected early) ─── */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(styleEl);


document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     GSAP PLUGINS REGISTRATION
  ───────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.defaults({ ease: 'power3.out' });


  /* ─────────────────────────────────────────────
     LOADER
  ───────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';

  const loaderTl = gsap.timeline();
  loaderTl
    .from('.loader-name', { opacity: 0, y: 40, duration: 0.6, ease: 'back.out(1.5)' })
    .from('.loader-fill', { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'power2.inOut' }, 0.2)
    .to(loader, {
      opacity: 0, duration: 0.6, delay: 0.2,
      onComplete: () => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initHeroAnimation();
        initTyping();
      }
    });


  /* ─────────────────────────────────────────────
     CUSTOM CURSOR (GSAP-powered)
  ───────────────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (window.innerWidth > 768 && cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor,   { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none' });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.25, ease: 'power2.out' });
    });

    document.querySelectorAll('a, button, .skill-card, .project-card, .contact-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 2, opacity: 0.5, duration: 0.3 });
        gsap.to(cursor,   { scale: 0.5, duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(cursor,   { scale: 1, duration: 0.2 });
      });
    });
  }


  /* ─────────────────────────────────────────────
     NAVBAR
  ───────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const menuToggle  = document.getElementById('menuToggle');
  const navLinks    = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  gsap.from('.navbar', { y: -80, opacity: 0, duration: 0.8, delay: 2.2 });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
    updateActiveNav();
  });

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      gsap.from('.nav-links li', {
        x: 40, opacity: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out'
      });
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
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }


  /* ─────────────────────────────────────────────
     HERO ANIMATION
  ───────────────────────────────────────────── */
  function initHeroAnimation() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-badge',          { y: 24, opacity: 0, duration: 0.6 })
      .from('.hero h1',             { y: 50, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.hero-desc',           { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('.hero-buttons .btn',   { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.4')
      .from('.hero-stats .stat',    { y: 20, opacity: 0, duration: 0.5, stagger: 0.1  }, '-=0.3')
      .from('.stat-divider',        { scaleY: 0, opacity: 0, duration: 0.4            }, '-=0.5')
      .from('.image-frame img',     { scale: 0.8, opacity: 0, duration: 0.9, ease: 'back.out(1.3)' }, '-=0.8')
      .from('.deco-ring',           { scale: 0, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .from('.deco-dots',           { opacity: 0, x: 20, duration: 0.5 }, '-=0.4')
      .from('.floating-card',       { y: 30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.4)' }, '-=0.3')
      .from('.scroll-down',         { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');

    // Parallax blobs
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    if (blob1 && blob2) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        gsap.to(blob1, { x,      y,      duration: 1.2, ease: 'power1.out' });
        gsap.to(blob2, { x: -x,  y: -y,  duration: 1.4, ease: 'power1.out' });
      });
    }

    // Hero image magnetic
    const imgFrame = document.querySelector('.image-frame');
    if (imgFrame && window.innerWidth > 768) {
      imgFrame.addEventListener('mousemove', (e) => {
        const rect = imgFrame.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.08;
        const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.08;
        gsap.to(imgFrame, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
      });
      imgFrame.addEventListener('mouseleave', () => {
        gsap.to(imgFrame, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    }
  }


  /* ─────────────────────────────────────────────
     TYPING EFFECT
  ───────────────────────────────────────────── */
  function initTyping() {
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (!subtitleEl) return;
    const texts = ['Full-Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'B.Tech IT Student'];
    let idx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
      const current = texts[idx];
      subtitleEl.textContent = deleting
        ? current.slice(0, --charIdx)
        : current.slice(0, ++charIdx);
      let speed = deleting ? 45 : 75;
      if (!deleting && charIdx === current.length) { deleting = true; speed = 1800; }
      else if (deleting && charIdx === 0) { deleting = false; idx = (idx + 1) % texts.length; speed = 300; }
      setTimeout(typeLoop, speed);
    }
    typeLoop();
  }


  /* ─────────────────────────────────────────────
     SECTION LABELS (global)
  ───────────────────────────────────────────── */
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      x: -30, opacity: 0, duration: 0.6
    });
  });


  /* ─────────────────────────────────────────────
     ABOUT SECTION
  ───────────────────────────────────────────── */
  gsap.from('.about-img-container', {
    scrollTrigger: { trigger: '.about', start: 'top 75%' },
    clipPath: 'inset(100% 0% 0% 0%)',
    y: 40, duration: 1.1, ease: 'power4.out'
  });

  gsap.from('.about-badge', {
    scrollTrigger: { trigger: '.about', start: 'top 70%' },
    scale: 0, opacity: 0, duration: 0.6, delay: 0.5, ease: 'back.out(1.5)'
  });

  gsap.from('.about-text .section-title', {
    scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.8
  });

  gsap.from('.about-text p', {
    scrollTrigger: { trigger: '.about-text', start: 'top 75%' },
    y: 24, opacity: 0, duration: 0.6, stagger: 0.15
  });

  gsap.from('.highlight-item', {
    scrollTrigger: { trigger: '.about-highlights', start: 'top 85%' },
    x: -30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)'
  });

  gsap.from('.about-text .btn', {
    scrollTrigger: { trigger: '.about-text .btn', start: 'top 92%' },
    y: 20, opacity: 0, duration: 0.5
  });

  // Hover interactions
  document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', () => gsap.to(item, { x: 8, duration: 0.3, ease: 'power2.out' }));
    item.addEventListener('mouseleave', () => gsap.to(item, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.5)' }));
  });


  /* ─────────────────────────────────────────────
     SKILLS SECTION
  ───────────────────────────────────────────── */
  gsap.from('.skills-section .section-title', {
    scrollTrigger: { trigger: '.skills-section', start: 'top 78%' },
    y: 40, opacity: 0, duration: 0.8
  });

  gsap.from('.skills-section .section-desc', {
    scrollTrigger: { trigger: '.skills-section', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.6, delay: 0.15
  });

  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      y: 60, opacity: 0, duration: 0.7, delay: i * 0.13, ease: 'power3.out'
    });

    gsap.from(card.querySelectorAll('.skill-tags span'), {
      scrollTrigger: { trigger: card, start: 'top 80%' },
      y: 16, opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.35 + i * 0.1, ease: 'power2.out'
    });

    card.addEventListener('mouseenter', () => gsap.to(card, { y: -10, duration: 0.35, ease: 'power2.out' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y: 0,   duration: 0.5,  ease: 'elastic.out(1,0.5)' }));
  });


  /* ─────────────────────────────────────────────
     PROJECTS SECTION
  ───────────────────────────────────────────── */
  gsap.from('.projects .section-title', {
    scrollTrigger: { trigger: '.projects', start: 'top 78%' },
    y: 40, opacity: 0, duration: 0.8
  });

  gsap.from('.projects .section-desc', {
    scrollTrigger: { trigger: '.projects', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.6, delay: 0.15
  });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    const isReverse = card.classList.contains('project-card--reverse');

    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 82%' },
      y: 80, opacity: 0, duration: 0.9, ease: 'power3.out'
    });

    gsap.from(card.querySelector('.project-text'), {
      scrollTrigger: { trigger: card, start: 'top 78%' },
      x: isReverse ? 50 : -50, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out'
    });

    gsap.from(card.querySelector('.project-image'), {
      scrollTrigger: { trigger: card, start: 'top 78%' },
      clipPath: isReverse ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
      duration: 1.0, delay: 0.15, ease: 'power4.inOut'
    });

    gsap.from(card.querySelectorAll('.tech-stack span'), {
      scrollTrigger: { trigger: card, start: 'top 80%' },
      scale: 0.8, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.5, ease: 'back.out(1.4)'
    });

    const numEl = card.querySelector('.project-number');
    if (numEl) {
      gsap.from(numEl, {
        scrollTrigger: { trigger: card, start: 'top 84%' },
        rotationX: 90, opacity: 0, duration: 0.6, ease: 'back.out(1.5)'
      });
    }

    // 3D tilt with GSAP
    if (window.innerWidth > 768) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        gsap.to(card, { rotationY: x, rotationX: -y, transformPerspective: 1000, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    }
  });


  /* ─────────────────────────────────────────────
     CONTACT SECTION
  ───────────────────────────────────────────── */
  gsap.from('.contact .section-title', {
    scrollTrigger: { trigger: '.contact', start: 'top 78%' },
    y: 40, opacity: 0, duration: 0.8
  });

  gsap.from('.contact .section-desc', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.6, delay: 0.15
  });

  gsap.from('.contact-info h3, .contact-info > p', {
    scrollTrigger: { trigger: '.contact-info', start: 'top 82%' },
    y: 24, opacity: 0, duration: 0.6, stagger: 0.15
  });

  gsap.utils.toArray('.contact-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%' },
      x: -40, opacity: 0, duration: 0.55, delay: i * 0.1, ease: 'power2.out'
    });
  });

  gsap.from('.social-links a', {
    scrollTrigger: { trigger: '.social-links', start: 'top 92%' },
    y: 20, opacity: 0, scale: 0.8, duration: 0.45, stagger: 0.08, ease: 'back.out(1.5)'
  });

  gsap.from('.contact-form-wrap', {
    scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 78%' },
    x: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
  });

  gsap.from('.form-group', {
    scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 76%' },
    y: 20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.2
  });

  document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link, { y: -4, scale: 1.15, duration: 0.25, ease: 'power2.out' }));
    link.addEventListener('mouseleave', () => gsap.to(link, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' }));
  });


  /* ─────────────────────────────────────────────
     FOOTER
  ───────────────────────────────────────────── */
  gsap.from('.footer-logo, .footer-links, .footer-copy', {
    scrollTrigger: { trigger: 'footer', start: 'top 92%' },
    y: 20, opacity: 0, duration: 0.6, stagger: 0.12
  });


  /* ─────────────────────────────────────────────
     BUTTON MICRO-INTERACTIONS
  ───────────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.2, ease: 'power2.out' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1,    duration: 0.3, ease: 'elastic.out(1,0.5)' }));
    btn.addEventListener('mousedown',  () => gsap.to(btn, { scale: 0.96, duration: 0.1 }));
    btn.addEventListener('mouseup',    () => gsap.to(btn, { scale: 1.04, duration: 0.15, ease: 'back.out(2)' }));
  });


  /* ─────────────────────────────────────────────
     SMOOTH SCROLL (GSAP ScrollTo)
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 70 }, duration: 1.1, ease: 'power3.inOut' });
    });
  });

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' });
    });
  }


  /* ─────────────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
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
        gsap.to(contactForm, { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'none', onComplete: () => gsap.set(contactForm, { x: 0 }) });
        return;
      }

      const btnText    = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      const btnIcon    = submitBtn.querySelector('.btn-icon');

      gsap.to(submitBtn, { scale: 0.97, duration: 0.1 });
      btnText.style.display = btnIcon.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
      submitBtn.disabled = true;

      await new Promise(r => setTimeout(r, 1800));

      btnLoading.style.display = 'none';
      btnText.style.display = btnIcon.style.display = '';
      submitBtn.disabled = false;
      gsap.to(submitBtn, { scale: 1, duration: 0.3, ease: 'back.out(2)' });

      formSuccess.classList.add('visible');
      gsap.from(formSuccess, { y: 16, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
      contactForm.reset();

      setTimeout(() => {
        gsap.to(formSuccess, { opacity: 0, y: -10, duration: 0.4, onComplete: () => formSuccess.classList.remove('visible') });
      }, 5000);
    });

    contactForm.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const err = document.getElementById(el.id + 'Error');
        if (err) err.textContent = '';
      });
      el.addEventListener('focus', () => gsap.to(el, { scale: 1.01, duration: 0.2, ease: 'power2.out' }));
      el.addEventListener('blur',  () => gsap.to(el, { scale: 1,    duration: 0.2 }));
    });
  }

  function shakeInput(el) {
    gsap.to(el, { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'none', onComplete: () => gsap.set(el, { x: 0 }) });
  }

}); // end DOMContentLoaded