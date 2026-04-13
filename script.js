/* ============================================================
   FUTURENOVA — Script
   Animations, interactions, canvas particle field
   ============================================================ */

'use strict';

/* ── CANVAS LOGO ── */
(function initLogoCanvas() {
  function drawLogo(canvas) {
    if (!canvas) return;
    const isFooter = canvas.classList.contains('logo-canvas--footer');
    const dpr      = window.devicePixelRatio || 1;
    const cssW     = isFooter ? 260 : 220;
    const cssH     = isFooter ? 40  : 34;
    const fontSize = isFooter ? 24  : 19;

    canvas.style.width  = cssW + 'px';
    canvas.style.height = cssH + 'px';
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    const cy = cssH / 2;   /* vertical centre */

    /* ── helpers ── */
    function glowLine(x1, y1, x2, y2, col, width) {
      ctx.save();
      ctx.shadowColor = 'rgba(80,190,255,0.9)';
      ctx.shadowBlur  = 8;
      ctx.strokeStyle = col;
      ctx.lineWidth   = width;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.shadowBlur  = 18;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.restore();
    }

    /* ── text ── */
    ctx.font = `900 ${fontSize}px Orbitron, monospace`;
    ctx.textBaseline = 'middle';

    /* measure AFTER setting font */
    const textW = ctx.measureText('FUTURENOVA').width;
    const beamGap = 5;
    const leftEnd  = 24;                        /* where text starts */
    const rightStart = leftEnd + textW + beamGap; /* where right beam starts */

    /* left beam – horizontal */
    const leftBeamStart = leftEnd - beamGap - 22;
    glowLine(leftBeamStart, cy, leftEnd - beamGap, cy, 'rgba(200,230,255,0.95)', 1.5);
    /* left cross – vertical */
    glowLine(leftBeamStart, cy - 10, leftBeamStart, cy + 10, 'rgba(255,255,255,0.9)', 1);

    /* GLOW PASSES — outer → inner */
    const glowLayers = [
      { blur: 24, alpha: 0.30, col: 'rgba(0,90,255,1)'   },
      { blur: 14, alpha: 0.55, col: 'rgba(30,150,255,1)'  },
      { blur: 7,  alpha: 0.75, col: 'rgba(120,210,255,1)' },
      { blur: 3,  alpha: 0.90, col: 'rgba(210,240,255,1)' },
    ];
    glowLayers.forEach(({ blur, col }) => {
      ctx.save();
      ctx.shadowColor = col;
      ctx.shadowBlur  = blur;
      ctx.fillStyle   = '#ffffff';
      ctx.fillText('FUTURENOVA', leftEnd, cy + 1);
      ctx.restore();
    });

    /* crisp white top pass */
    ctx.save();
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = '#ffffff';
    ctx.fillText('FUTURENOVA', leftEnd, cy + 1);
    ctx.restore();

    /* right beam – horizontal */
    glowLine(rightStart, cy, rightStart + 22, cy, 'rgba(200,230,255,0.95)', 1.5);
    /* right cross – vertical */
    glowLine(rightStart + 22, cy - 10, rightStart + 22, cy + 10, 'rgba(255,255,255,0.9)', 1);
    /* right diagonal bolt */
    glowLine(rightStart + 5, cy - 11, rightStart + 22, cy + 7, 'rgba(180,230,255,0.85)', 1.5);
  }

  function renderAll() {
    drawLogo(document.getElementById('logoNav'));
    drawLogo(document.getElementById('logoFooter'));
  }

  /* Draw after fonts are confirmed loaded */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderAll);
  } else {
    window.addEventListener('load', renderAll);
  }
  /* Redraw on resize (handles devicePixelRatio changes on zoom) */
  window.addEventListener('resize', renderAll, { passive: true });
})();

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function followCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();

  document.querySelectorAll('a, button, .service-header, .pillar-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.borderColor = 'rgba(0,168,255,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(0,168,255,0.25)';
    });
  });
})();

/* ── NAV SCROLL ── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── HAMBURGER / MOBILE MENU ── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── HERO PARTICLE CANVAS ── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = [];
    const count = Math.min(Math.floor(W * H / 8000), 150);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.3,
        a:  Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Connections */
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,168,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    /* Dots */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,168,255,${p.a})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });
  ro.observe(canvas);
  resize();
  draw();
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 2000;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;

      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── SERVICE ACCORDION ── */
(function initServices() {
  const items = document.querySelectorAll('.service-item');
  items.forEach(item => {
    const header = item.querySelector('.service-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Open first by default */
  if (items.length) items[0].classList.add('open');
})();

/* ── CONTACT FORM ── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.innerHTML = '<span>Messaggio inviato! Ti contatteremo presto.</span>';
    btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
})();

/* ── SMOOTH PARALLAX on hero ── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const gridLines   = document.querySelector('.hero-grid-lines');
  if (!heroContent) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = `translateY(${y * 0.25}px)`;
        heroContent.style.opacity   = `${1 - y / (window.innerHeight * 0.7)}`;
        if (gridLines) gridLines.style.transform = `translateY(${y * 0.1}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ── GLITCH hover on canvas logo ── */
(function initGlitch() {
  const navLink = document.querySelector('.nav-logo');
  const canvas  = document.getElementById('logoNav');
  if (!navLink || !canvas) return;

  const glitchChars = '!@#X01<>|_';
  const full = 'FUTURENOVA';
  let timer;

  navLink.addEventListener('mouseenter', () => {
    let count = 0;
    timer = setInterval(() => {
      if (count > 8) { clearInterval(timer); return; }
      const r  = Math.floor(Math.random() * full.length);
      const gc = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      const word = full.split('').map((c, i) => i === r ? gc : c).join('');

      const dpr     = window.devicePixelRatio || 1;
      const cssW    = 220, cssH = 34, fontSize = 19;
      const cy      = cssH / 2;
      const ctx     = canvas.getContext('2d');
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = `900 ${fontSize}px Orbitron, monospace`;
      ctx.textBaseline = 'middle';

      [{ blur:14, col:'rgba(30,150,255,1)' }, { blur:4, col:'rgba(180,230,255,1)' }].forEach(({ blur, col }) => {
        ctx.shadowColor = col; ctx.shadowBlur = blur; ctx.fillStyle = '#fff';
        ctx.fillText(word, 24, cy + 1);
      });
      ctx.shadowBlur = 0; ctx.fillStyle = '#fff';
      ctx.fillText(word, 24, cy + 1);
      ctx.restore();
      count++;
    }, 55);
  });

  navLink.addEventListener('mouseleave', () => {
    clearInterval(timer);
    /* redraw clean logo */
    const evt = new Event('resize');
    window.dispatchEvent(evt);
  });
})();
