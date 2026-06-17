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
   3D TILT EFFECT
══════════════════════════════════ */
document.querySelectorAll('.polaroid, .profile-card, .video-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    
    // Profile card needs to maintain its scale and translate from CSS
    if (card.classList.contains('profile-card')) {
      card.style.transform = `translateY(-8px) rotateY(${x}deg) rotateX(${y}deg) scale(1)`;
    } else {
      card.style.transform = `translateY(-12px) rotateY(${x}deg) rotateX(${y}deg)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ══════════════════════════════════
   PARALLAX SCROLLING
══════════════════════════════════ */
(function initParallax() {
  const rings = document.querySelectorAll('.hero-deco-ring');
  const collage = document.querySelector('.collage-frame img');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Hero rings
    rings.forEach((ring, i) => {
      const speed = (i + 1) * 0.15;
      ring.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Collage subtle parallax
    if (collage) {
      // only apply if in viewport approximately
      const rect = collage.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        collage.style.transform = `translateY(${(rect.top - window.innerHeight/2) * 0.05}px) scale(1.05)`;
      }
    }
  }, { passive: true });
})();


/* ══════════════════════════════════
   DYNAMIC PORTFOLIO FEATURES
══════════════════════════════════ */

/* 1. Rotating Manifesto */
(function initManifesto() {
  const manifestos = [
    "some ideas make sense with data.<br>Others come alive through visuals.<br>I'm curious about what happens when<br>Both meet and how people interact with them.",
    "code is functional, design is emotional.<br>I strive to build experiences that<br>bridge the gap between logic<br>and human intuition.",
    "simplicity is the ultimate sophistication.<br>I focus on removing the unnecessary<br>so that the essential may speak.",
    "every detail matters.<br>from the database schema down<br>to the micro-interactions on<br>a user interface.",
    "exploring the intersection of art and tech.<br>where algorithms paint pictures<br>and interfaces tell stories."
  ];
  
  const el = document.getElementById('heroManifesto');
  if (el) {
    const randomIndex = Math.floor(Math.random() * manifestos.length);
    el.innerHTML = manifestos[randomIndex];
  }
})();

/* 2. Time-Aware Greetings */
(function initTimeGreeting() {
  const el = document.getElementById('timeGreeting');
  if (!el) return;
  
  const hour = new Date().getHours();
  let greeting = "Hello";
  
  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good evening";
  } else {
    greeting = "Late night building?";
  }
  
  el.textContent = greeting;
})();

/* 3. Generative Canvas Background */
(function initCanvasBackground() {
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
  const numParticles = 15;
  const colors = ['#ff2b5b', '#00e0e0', '#242933'];
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 80 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.1
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
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    
    ctx.globalAlpha = 1; // reset
    requestAnimationFrame(draw);
  }
  draw();
})();

/* 4. Interactive Easter Egg (Confetti on Profile Picture) */
(function initConfetti() {
  const profileImg = document.getElementById('profileImg');
  if (!profileImg) return;
  
  profileImg.addEventListener('click', (e) => {
    const numConfetti = 30;
    const colors = ['#ff2b5b', '#00e0e0', '#ffffff', '#242933'];
    const rect = profileImg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < numConfetti; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-particle';
      
      // Randomize color
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Randomize size
      const size = Math.random() * 6 + 4;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      
      // Initial position
      confetti.style.left = centerX + 'px';
      confetti.style.top = centerY + 'px';
      
      document.body.appendChild(confetti);
      
      // Random trajectory
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 80 + 40;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 50; // slight upward bias
      
      // Animate
      confetti.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], {
        duration: Math.random() * 600 + 400,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
      });
      
      // Cleanup
      setTimeout(() => confetti.remove(), 1100);
    }
  });
  
  // Make profile picture look clickable
  profileImg.style.cursor = 'pointer';
})();

/* 5. "Currently Listening To" Widget */
(function initListeningWidget() {
  const songs = [
    "Arctic Monkeys - Do I Wanna Know?",
    "The Weeknd - Blinding Lights",
    "Daft Punk - Harder, Better, Faster, Stronger",
    "Tame Impala - The Less I Know The Better",
    "Frank Ocean - Pink + White",
    "Kendrick Lamar - All The Stars",
    "Childish Gambino - Redbone"
  ];
  
  const songEl = document.getElementById('listeningSong');
  const widget = document.getElementById('listeningWidget');
  if (!songEl || !widget) return;
  
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  songEl.textContent = randomSong;
  
  // Slight delay entrance
  widget.style.opacity = '0';
  widget.style.transform = 'translate(-50%, 20px)';
  setTimeout(() => {
    widget.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    widget.style.opacity = '1';
    widget.style.transform = 'translate(-50%, 0)';
  }, 1000);
})();
