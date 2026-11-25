/* ═══════════════════════════════════════════════
   SIVA BHARATH — PORTFOLIO 2026
   main.js · Apple-Style Dynamic Engine & Interactions
   Palette: #060606 | #1e293d | #005b3f | #008270
═══════════════════════════════════════════════ */

/* ── Detect Touch Device ── */
const isTouchDevice = () =>
  window.matchMedia('(pointer: coarse)').matches ||
  'ontouchstart' in window;

/* ══════════════════════════════════
   1. APPLE-STYLE MINIMAL CURSOR
══════════════════════════════════ */
(function initCursor() {
  if (isTouchDevice()) return;

  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow) return;

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let glowX = -100, glowY = -100;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function renderCursor() {
    // Sharp dot follows quickly
    dotX = lerp(dotX, mouseX, 0.35);
    dotY = lerp(dotY, mouseY, 0.35);
    dot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;

    // Ambient glow ring follows with soft spring
    glowX = lerp(glowX, mouseX, 0.14);
    glowY = lerp(glowY, mouseY, 0.14);
    glow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Interactive Click Ripple
  document.addEventListener('click', e => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // Hover Magnetics for Interactive Elements
  function registerHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        glow.classList.add('hovered');
        dot.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        glow.classList.remove('hovered');
        dot.classList.remove('hovered');
      });
    });
  }

  registerHover('a, button, .polaroid, .video-card, .social-pill, .platform-btn, .profile-card, .about-card, .edu-box, .skills-box');
})();

/* ══════════════════════════════════
   2. SCROLL PROGRESS INDICATOR
══════════════════════════════════ */
(function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════
   3. NAVIGATION: GLASS & ACTIVE STATE
══════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('topNav');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ══════════════════════════════════
   4. HAMBURGER MENU (MOBILE)
══════════════════════════════════ */
(function initHamburger() {
  const btn = document.getElementById('navHamburger');
  const menu = document.getElementById('navLinks');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* ══════════════════════════════════
   5. SMOOTH SCROLL WITH OFFSET
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navHeight = 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════
   6. SCROLL REVEAL OBSERVER
══════════════════════════════════ */
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── Hero Entrance Sequence ── */
(function heroEntrance() {
  const elements = [
    '.hero-title',
    '.hero-tagline',
    '.hero-actions',
    '.hero-stats'
  ];

  requestAnimationFrame(() => {
    setTimeout(() => {
      elements.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('visible');
      });

      const card = document.getElementById('profileCard');
      if (card) card.classList.add('visible');
    }, 100);
  });
})();

/* ══════════════════════════════════
   7. DYNAMIC ROTATING MANIFESTO
══════════════════════════════════ */
(function initManifesto() {
  const manifestos = [
    "Some ideas make sense with data.<br>Others come alive through visuals.<br>I'm curious about what happens when<br>Both meet and how people interact with them.",
    "Code is functional, design is emotional.<br>I strive to build experiences that<br>Bridge the gap between logic<br>And human intuition.",
    "Simplicity is the ultimate sophistication.<br>I focus on removing the unnecessary<br>So that the essential may speak.",
    "Every detail matters.<br>From the database schema down<br>To the micro-interactions on<br>A user interface.",
    "Exploring the intersection of art and tech.<br>Where algorithms paint pictures<br>And interfaces tell stories."
  ];

  const el = document.getElementById('heroManifesto');
  const btn = document.getElementById('manifestoCycleBtn');
  if (!el) return;

  let currentIndex = 0;

  function displayManifesto(index) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      el.innerHTML = manifestos[index];
      el.style.opacity = '0.92';
      el.style.transform = 'translateY(0)';
    }, 250);
  }

  function cycle() {
    currentIndex = (currentIndex + 1) % manifestos.length;
    displayManifesto(currentIndex);
  }

  if (btn) {
    btn.addEventListener('click', cycle);
  }

  // Auto-cycle gently every 9 seconds
  setInterval(cycle, 9000);
})();

/* ══════════════════════════════════
   8. TIME-AWARE GREETING
══════════════════════════════════ */
(function initTimeGreeting() {
  const el = document.getElementById('timeGreeting');
  if (!el) return;

  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good Evening";
  } else {
    greeting = "Late Night Building?";
  }

  el.textContent = greeting;
})();

/* ══════════════════════════════════
   9. GENERATIVE AMBIENT CANVAS
   Palette: #060606 | #1e293d | #005b3f | #008270
══════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  const numParticles = 24;
  const colors = [
    { r: 0, g: 130, b: 112 },   // #008270 teal
    { r: 0, g: 91, b: 63 },    // #005b3f emerald forest
    { r: 30, g: 41, b: 61 },   // #1e293d slate navy
    { r: 0, g: 168, b: 146 }   // #00a892 vibrant jewel teal
  ];

  for (let i = 0; i < numParticles; i++) {
    const c = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 90 + 30,
      r: c.r,
      g: c.g,
      b: c.b,
      alpha: Math.random() * 0.25 + 0.08
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -p.radius) p.x = width + p.radius;
      if (p.x > width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = height + p.radius;
      if (p.y > height + p.radius) p.y = -p.radius;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`);
      grad.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════
   10. 3D CARD TILT & SPOTLIGHT GLARE
══════════════════════════════════ */
(function initCardTilt() {
  if (isTouchDevice()) return;

  const cards = document.querySelectorAll('.polaroid, .profile-card, .video-card, .about-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      if (card.classList.contains('profile-card')) {
        card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      } else {
        card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      // Dynamic Glare Spotlight Effect
      card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 168, 146, 0.12) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.backgroundImage = '';
    });
  });
})();

/* ══════════════════════════════════
   11. INTERACTIVE CONFETTI (PROFILE PHOTO)
   Palette: #008270 | #00a892 | #005b3f | #1e293d | #f5f5f7
══════════════════════════════════ */
(function initConfetti() {
  const profileImg = document.getElementById('profileImg');
  if (!profileImg) return;

  profileImg.addEventListener('click', () => {
    const numConfetti = 32;
    const colors = ['#008270', '#00a892', '#005b3f', '#2ce2c7', '#f5f5f7', '#1e293d'];
    const rect = profileImg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < numConfetti; i++) {
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.pointerEvents = 'none';
      p.style.zIndex = '99999';

      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = color;

      const size = Math.random() * 7 + 4;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';

      document.body.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 90 + 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 45;

      p.animate([
        { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 700 + 400,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      });

      setTimeout(() => p.remove(), 1200);
    }
  });

  profileImg.style.cursor = 'pointer';
})();

/* ══════════════════════════════════
   12. YOUTUBE VIDEO EMBED ON CLICK
══════════════════════════════════ */
document.querySelectorAll('.video-thumb[data-video-id]').forEach(thumb => {
  thumb.addEventListener('click', function () {
    const vid = this.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1`;
    iframe.title = "YouTube Video Player";
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    this.innerHTML = '';
    this.appendChild(iframe);
  });
});

/* ══════════════════════════════════
   13. CONTACT FORM ENGINE
══════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields before sending.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please provide a valid email address.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Message from ${name} via Portfolio`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:sivabharath2024@gmail.com?subject=${subject}&body=${body}`;

    showFeedback('Opening your email client to dispatch message...', 'success');
  });

  function showFeedback(msg, type) {
    note.textContent = msg;
    note.style.color = type === 'error' ? '#f87171' : 'var(--teal-light)';
    note.style.opacity = '1';
    setTimeout(() => {
      note.style.transition = 'opacity 1s';
      note.style.opacity = '0.6';
    }, 4000);
  }
})();
