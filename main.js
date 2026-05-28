/* ═══════════════════════════════════════════════
   SIVA BHARATH — PORTFOLIO 2026
   main.js
═══════════════════════════════════════════════ */

/* ── Detect touch / coarse pointer → skip cursor ── */
const isTouchDevice = () =>
  window.matchMedia('(pointer: coarse)').matches ||
  'ontouchstart' in window;

/* ══════════════════════════════════
   WATER DROP CURSOR
══════════════════════════════════ */
(function initCursor() {
  if (isTouchDevice()) return;

  const drop = document.getElementById('cursorDrop');
  if (!drop) return;

  let cx = -100, cy = -100;
  let tx = -100, ty = -100;
  let raf;

  // Smooth lerp follow
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    cx = lerp(cx, tx, 0.18);
    cy = lerp(cy, ty, 0.18);
    drop.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  // Ripple on click
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'cursor-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });

  // Scale on hover
  function addHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => drop.classList.add('hovered'));
      el.addEventListener('mouseleave', () => drop.classList.remove('hovered'));
    });
  }
  addHover('a, button, .polaroid, .video-card, .social-pill, .platform-btn, .profile-card');
})();

/* ══════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 62; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════
   NAV: scroll glass + active links
══════════════════════════════════ */
(function initNav() {
  const nav     = document.getElementById('topNav');
  const links   = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  function onScroll() {
    // Scrolled glass effect
    if (window.scrollY > 70) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Active nav link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════
   HAMBURGER MENU (mobile)
══════════════════════════════════ */
(function initHamburger() {
  const btn   = document.getElementById('navHamburger');
  const menu  = document.getElementById('navLinks');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* ══════════════════════════════════
   INTERSECTION OBSERVER — REVEAL
══════════════════════════════════ */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target); // fire once
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Hero elements staggered entrance on load ── */
(function heroEntrance() {
  const els = [
    '.hero-title',
    '.hero-tagline',
    '.hero-manifesto',
    '.hero-actions',
    '.hero-stats',
  ];
  // They use opacity/transform inline — just add .visible class
  // (already handled by CSS transition-delay on each element)
  // We trigger after a short paint delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      els.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.classList.add('visible');
      });
    }, 80);
  });
})();

/* ── Profile card entrance ── */
(function profileEntrance() {
  setTimeout(() => {
    const pc = document.getElementById('profileCard');
    if (pc) pc.classList.add('visible');
  }, 300);
})();

/* ══════════════════════════════════
   VIDEO EMBED ON CLICK
══════════════════════════════════ */
document.querySelectorAll('.video-thumb[data-video-id]').forEach(thumb => {
  thumb.addEventListener('click', function () {
    const vid = this.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1`;
    iframe.title = "YouTube video player";
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    this.innerHTML = '';
    this.appendChild(iframe);
  });
});

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
(function initForm() {
  const btn  = document.getElementById('formSubmit');
  const note = document.getElementById('formNote');
  if (!btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();
    const name    = document.getElementById('contactName')?.value.trim();
    const email   = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showNote('please fill in all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNote('please enter a valid email address.', 'error');
      return;
    }

    const subject = encodeURIComponent(`hey siva, a message from ${name}`);
    const body    = encodeURIComponent(`${message}\n\nfrom: ${name}\nemail: ${email}`);
    window.location.href = `mailto:sivabharath2024@gmail.com?subject=${subject}&body=${body}`;
    showNote('opening your email client…', 'ok');
  });

  function showNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.style.color = type === 'error' ? '#e07a8c' : 'rgba(221,213,176,0.6)';
  }
})();

/* ══════════════════════════════════
   POLAROID subtle tilt on mouse enter
══════════════════════════════════ */
document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-12px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
