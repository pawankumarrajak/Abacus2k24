/* ============================================================
   ABACUS CLUB — MAIN JAVASCRIPT
   Code The Future | GEC West Champaran
   ============================================================ */

'use strict';

/* ================================================================
   1. CUSTOM CURSOR
   ================================================================ */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.15;
  trailY += (mouseY - trailY) * 0.15;
  trail.style.left = trailX + 'px';
  trail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, input, select, textarea, .domain-card, .project-card, .team-card, .event-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.borderColor = 'var(--purple)';
    cursor.style.boxShadow = '0 0 15px var(--purple), 0 0 30px rgba(139,92,246,0.3)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursor.style.borderColor = 'var(--cyan)';
    cursor.style.boxShadow = '0 0 10px var(--cyan), 0 0 20px rgba(0, 245, 255, 0.3)';
  });
});

/* ================================================================
   2. PRELOADER
   ================================================================ */
(function initPreloader() {
  const canvas = document.getElementById('preloader-canvas');
  const ctx = canvas.getContext('2d');
  const bar = document.getElementById('preloader-bar');
  const pct = document.getElementById('preloader-percent');
  const status = document.getElementById('preloader-status');
  const logLines = document.querySelectorAll('.log-line');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle system for preloader
  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#00f5ff' : '#0066ff',
    });
  }

  function drawPreloader() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.04)';
    ctx.lineWidth = 1;
    const gs = 60;
    for (let x = 0; x < canvas.width; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    requestAnimationFrame(drawPreloader);
  }
  drawPreloader();

  // Loading sequence
  let progress = 0;
  const statusMessages = [
    'BOOTING KERNEL MODULES...',
    'LOADING NEURAL NETWORKS...',
    'ESTABLISHING SECURE CONNECTION...',
    'DECRYPTING ELITE CODER DATABASE...',
    'COMPILING SYSTEM MODULES...',
    'SYSTEM READY.'
  ];

  const logTimings = [300, 600, 1000, 1400, 1800];
  logTimings.forEach((t, i) => {
    setTimeout(() => {
      if (logLines[i]) logLines[i].classList.add('visible');
      status.textContent = statusMessages[i] || statusMessages[statusMessages.length - 1];
    }, t);
  });

  const interval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 60);

  setTimeout(() => {
    if (logLines[4]) logLines[4].classList.add('visible');
    setTimeout(exitPreloader, 500);
  }, 2400);

  function exitPreloader() {
    const preloader = document.getElementById('preloader');
    const site = document.getElementById('site');
    preloader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    preloader.style.opacity = '0';
    preloader.style.transform = 'scale(1.02)';
    site.style.transition = 'opacity 0.6s ease';
    site.style.opacity = '1';
    setTimeout(() => {
      preloader.style.display = 'none';
      initHeroCanvas();
      initTyping();
      startHeroStats();
    }, 800);
  }
})();

/* ================================================================
   3. NAVBAR
   ================================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ================================================================
   4. HERO CANVAS — Three.js particle field + animated grid
   ================================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // PARTICLE SYSTEM
  const pCount = 600;
  const pGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(pCount * 3);
  const colors = new Float32Array(pCount * 3);

  for (let i = 0; i < pCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    const t = Math.random();
    if (t < 0.5) { colors[i*3]=0; colors[i*3+1]=0.96; colors[i*3+2]=1; }
    else if (t < 0.8) { colors[i*3]=0; colors[i*3+1]=0.4; colors[i*3+2]=1; }
    else { colors[i*3]=0.55; colors[i*3+1]=0.36; colors[i*3+2]=0.96; }
  }
  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMat = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.7 });
  const points = new THREE.Points(pGeom, pMat);
  scene.add(points);

  // GRID
  const gridHelper = new THREE.GridHelper(200, 40, 0x003344, 0x001122);
  gridHelper.rotation.x = Math.PI / 4;
  gridHelper.position.y = -15;
  scene.add(gridHelper);

  // GLOWING LINES
  const linesGroup = new THREE.Group();
  scene.add(linesGroup);
  for (let i = 0; i < 20; i++) {
    const points2 = [];
    const y = (Math.random() - 0.5) * 40;
    points2.push(new THREE.Vector3(-60, y, (Math.random() - 0.5) * 20));
    points2.push(new THREE.Vector3(60, y + (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20));
    const lg = new THREE.BufferGeometry().setFromPoints(points2);
    const lm = new THREE.LineBasicMaterial({
      color: Math.random() > 0.5 ? 0x00f5ff : 0x0066ff,
      transparent: true,
      opacity: Math.random() * 0.3 + 0.05
    });
    linesGroup.add(new THREE.Line(lg, lm));
  }

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    points.rotation.y = time * 0.03 + mx * 0.05;
    points.rotation.x = my * 0.03;
    gridHelper.position.z = Math.sin(time * 0.5) * 3;
    linesGroup.rotation.y = time * 0.01 + mx * 0.02;

    // Animate positions slightly
    const pos = pGeom.attributes.position.array;
    for (let i = 1; i < pCount * 3; i += 3) {
      pos[i] += Math.sin(time + i) * 0.005;
    }
    pGeom.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ================================================================
   5. HERO TYPING ANIMATION
   ================================================================ */
function initTyping() {
  const el = document.getElementById('hero-typing');
  const words = ['WEB DEVELOPMENT', 'AI / MACHINE LEARNING', 'DATA STRUCTURES & ALGORITHMS', 'CYBER SECURITY', 'OPEN SOURCE', 'COMPETITIVE PROGRAMMING', 'APP DEVELOPMENT'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();
}

/* ================================================================
   6. HERO STAT COUNTERS
   ================================================================ */
function startHeroStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    animateCounter(el, 0, target, 2000);
  });
}
function animateCounter(el, from, to, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = to;
  }
  requestAnimationFrame(update);
}

/* ================================================================
   7. SCROLL REVEAL (IntersectionObserver)
   ================================================================ */
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 100);
      revealObs.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.reveal-text, .reveal-para, .story-item').forEach(el => revealObs.observe(el));

// Staggered grids
const staggerObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.domain-card, .project-card, .team-card, .event-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('visible');
          // Trigger progress bars for domain cards
          if (card.classList.contains('domain-card')) {
            card.classList.add('in-view');
          }
        }, i * 120);
      });
      staggerObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.domains-grid, .projects-grid, .team-grid, .events-track').forEach(el => staggerObs.observe(el));

/* ================================================================
   8. STATS COUNTER (scroll triggered)
   ================================================================ */
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, 0, target, 2500);
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const statsSection = document.getElementById('stats');
if (statsSection) statsObs.observe(statsSection);

/* ================================================================
   9. INTERACTIVE TERMINAL
   ================================================================ */
(function initTerminal() {
  const body = document.getElementById('terminal-body');
  const input = document.getElementById('terminal-input');
  const prompt = 'abacus@gec:~$ ';
  let history = [];
  let histIdx = -1;

  const commands = {
    help: () => `
<span style="color:var(--cyan)">ABACUS SYSTEM — AVAILABLE COMMANDS</span>
<span style="color:var(--text-dim)">─────────────────────────────────────</span>
  <span class="t-cmd">help</span>          Show this help menu
  <span class="t-cmd">events</span>        List upcoming events
  <span class="t-cmd">domains</span>       Show our tech domains
  <span class="t-cmd">join</span>          How to join ABACUS CLUB
  <span class="t-cmd">projects</span>      View our projects
  <span class="t-cmd">team</span>          Meet the team
  <span class="t-cmd">stats</span>         Club statistics
  <span class="t-cmd">contact</span>       Contact information
  <span class="t-cmd">matrix</span>        Initialize matrix mode
  <span class="t-cmd">clear</span>         Clear terminal
<span style="color:var(--text-dim)">─────────────────────────────────────</span>`,

    events: () => `
<span style="color:var(--cyan)">[ UPCOMING EVENTS ]</span>
  ▸ <span style="color:#fff">ABACUS HACK</span>        — 48H Hackathon      <span style="color:var(--green)">UPCOMING</span>
  ▸ <span style="color:#fff">CODE STORM</span>         — Monthly CP Contest  <span style="color:var(--green)">MONTHLY</span>
  ▸ <span style="color:#fff">WEB DEV SURGE</span>      — 7-Day Bootcamp      <span style="color:var(--cyan)">UPCOMING</span>
  ▸ <span style="color:#fff">HACK THE FLAG</span>      — 24H CTF Challenge   <span style="color:var(--cyan)">UPCOMING</span>
  ▸ <span style="color:#fff">FUTURE STACK TALK</span>  — Tech Talk Series   <span style="color:var(--green)">RECURRING</span>
<span style="color:var(--text-dim)">→ Join our Discord for event updates.</span>`,

    domains: () => `
<span style="color:var(--cyan)">[ OPERATION SECTORS ]</span>
  <span style="color:var(--purple)">⬡</span> WEB DEVELOPMENT  — React, Node, Full-Stack
  <span style="color:var(--purple)">◈</span> AI / ML          — Deep Learning, LLMs, CV
  <span style="color:var(--purple)">▣</span> APP DEVELOPMENT  — Flutter, Kotlin, Swift
  <span style="color:var(--purple)">≋</span> DSA & CP          — Algorithms, Codeforces
  <span style="color:var(--purple)">⬕</span> CYBER SECURITY   — CTF, Ethical Hacking
  <span style="color:var(--purple)">◉</span> OPEN SOURCE      — GSoC, Hacktoberfest
<span style="color:var(--text-dim)">→ Choose a domain and level up your skills.</span>`,

    join: () => `
<span style="color:var(--cyan)">[ JOIN ABACUS CLUB ]</span>
<span style="color:var(--text-dim)">──────────────────────────────────</span>
  STEP 1: <span style="color:#fff">Fill the contact form</span> on this website.
  STEP 2: <span style="color:#fff">Join our Discord server</span> for interview.
  STEP 3: <span style="color:#fff">Attend orientation</span> — next batch: June 2026.
  STEP 4: <span style="color:#fff">LEVEL UP.</span>

<span style="color:var(--green)">→ Status: RECRUITMENT OPEN</span>
<span style="color:var(--text-dim)">→ Email: abacusclub@gecwc.ac.in</span>`,

    projects: () => `
<span style="color:var(--cyan)">[ ACTIVE DEPLOYMENTS ]</span>
  ● <span style="color:#fff">CampusBridge</span>   — AI Placement Portal       <span style="color:var(--green)">LIVE</span>
  ● <span style="color:#fff">NeuralNote</span>     — AI Lecture Summarizer     <span style="color:var(--green)">LIVE</span>
  ● <span style="color:#fff">AttendTrack</span>    — Smart Attendance App       <span style="color:var(--green)">LIVE</span>
  ● <span style="color:#fff">SecScan</span>        — Web Vulnerability Scanner  <span style="color:var(--green)">LIVE</span>
  ● <span style="color:#fff">CodeCollab</span>     — Real-time Code Editor      <span style="color:var(--green)">LIVE</span>
  ● <span style="color:#fff">VisionGrade</span>    — AI Answer Sheet Grader     <span style="color:var(--green)">LIVE</span>
<span style="color:var(--text-dim)">→ github.com/abacusclub-gecwc</span>`,

    team: () => `
<span style="color:var(--cyan)">[ CORE OPERATORS ]</span>
  <span style="color:#fbbf24">★</span> Prof. A. Kumar    — Faculty Coordinator
  <span style="color:var(--cyan)">◈</span> Rajat Kumar       — Club Lead
  <span style="color:var(--purple)">▸</span> Saurav Gupta      — Tech Head
  <span style="color:var(--purple)">▸</span> Priya Mishra      — Design Head
  <span style="color:var(--green)">→</span> Amit Singh        — Full Stack Dev
  <span style="color:var(--green)">→</span> Neha Kumari       — AI/ML Engineer
<span style="color:var(--text-dim)">→ 200+ active members across all domains.</span>`,

    stats: () => `
<span style="color:var(--cyan)">[ SYSTEM METRICS ]</span>
  MEMBERS      ██████████  200+
  PROJECTS     ████████░░  50+
  WORKSHOPS    ███████░░░  30+
  HACKATHONS   █████░░░░░  10+
  OSS COMMITS  ██████████  500+
<span style="color:var(--green)">→ All systems nominal. Elite status: ACTIVE.</span>`,

    contact: () => `
<span style="color:var(--cyan)">[ CONTACT INFORMATION ]</span>
  📍 Location  : GEC West Champaran, Bihar — 845438
  📧 Email     : abacusclub@gecwc.ac.in
  💬 Discord   : discord.gg/abacusclub
  📱 Telegram  : t.me/abacusclub
  🐙 GitHub    : github.com/abacusclub-gecwc
  🕐 Hours     : Mon–Sat, 10:00–18:00 IST
<span style="color:var(--green)">→ STATUS: ALL SYSTEMS OPERATIONAL</span>`,

    matrix: () => {
      body.style.color = '#00ff00';
      input.style.color = '#00ff00';
      setTimeout(() => {
        body.style.color = '';
        input.style.color = '';
      }, 5000);
      return `<span style="color:#00ff00">MATRIX MODE ACTIVATED — 5 SECONDS</span>
<span style="color:#00ff00">01001000 01100101 01101100 01101100 01101111</span>
<span style="color:#00ff00">Wake up, Neo... The Matrix has you...</span>
<span style="color:#00ff00">Follow the white rabbit. ●</span>`;
    },

    clear: () => {
      body.innerHTML = '<div class="t-line welcome">&gt; ABACUS CLUB TERMINAL v2.0 — Welcome, Elite Coder.</div>';
      return null;
    }
  };

  function addLine(html, cls = 'output') {
    const div = document.createElement('div');
    div.className = `t-line ${cls}`;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function processCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    if (!cmd) return;

    addLine(`${prompt}${cmd}`, 'user-cmd');
    history.unshift(cmd);
    histIdx = -1;

    if (commands[cmd]) {
      const res = commands[cmd]();
      if (res) {
        // Animate each line
        const lines = res.split('\n').filter(l => l.trim());
        lines.forEach((line, i) => {
          setTimeout(() => addLine(line, 'output'), i * 40);
        });
      }
    } else {
      setTimeout(() => {
        addLine(`<span style="color:#ff5f57">bash: ${cmd}: command not found. Type <span class="t-cmd">help</span> for commands.</span>`, 'error');
      }, 100);
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      processCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx];
      } else {
        histIdx = -1;
        input.value = '';
      }
      e.preventDefault();
    }
  });

  // Focus on click
  document.getElementById('terminal-body').addEventListener('click', () => input.focus());
})();

/* ================================================================
   10. EVENTS CAROUSEL
   ================================================================ */
(function initEvents() {
  const track = document.getElementById('events-track');
  const prevBtn = document.getElementById('ev-prev');
  const nextBtn = document.getElementById('ev-next');
  let current = 0;
  const cards = track.querySelectorAll('.event-card');
  const cardW = 340 + 24; // width + gap

  function update() {
    const maxScroll = Math.max(0, cards.length * cardW - (window.innerWidth - 120));
    const offset = Math.min(current * cardW, maxScroll);
    track.style.transform = `translateX(-${offset}px)`;
  }

  prevBtn.addEventListener('click', () => { current = Math.max(0, current - 1); update(); });
  nextBtn.addEventListener('click', () => { current = Math.min(cards.length - 2, current + 1); update(); });

  // Touch/drag
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) { current = Math.min(cards.length - 2, current + 1); update(); }
    if (diff < -50) { current = Math.max(0, current - 1); update(); }
  });
})();

/* ================================================================
   11. PROJECT FILTER
   ================================================================ */
(function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const cat = card.dataset.cat;
        const show = filter === 'all' || cat === filter;
        if (show) {
          card.classList.remove('hidden');
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 60);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
})();

/* ================================================================
   12. MOUSE GLOW / PARALLAX
   ================================================================ */
(function initMouseGlow() {
  let glowEl = document.createElement('div');
  glowEl.style.cssText = `
    position: fixed; width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 245, 255, 0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 9990;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glowEl);

  document.addEventListener('mousemove', (e) => {
    glowEl.style.left = e.clientX + 'px';
    glowEl.style.top = e.clientY + 'px';
  });
})();

/* ================================================================
   13. TILT EFFECT ON TEAM CARDS
   ================================================================ */
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ================================================================
   14. DOMAIN CARDS TILT
   ================================================================ */
document.querySelectorAll('.domain-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ================================================================
   15. CONTACT FORM
   ================================================================ */
(function initForm() {
  const form = document.getElementById('join-form');
  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.innerHTML = '<span>TRANSMITTING...</span><div class="btn-scan"></div>';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.innerHTML = '<span>✓ TRANSMISSION RECEIVED</span><div class="btn-scan"></div>';
      submitBtn.style.opacity = '1';
      submitBtn.style.background = 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))';
      submitBtn.style.borderColor = 'var(--green)';
      submitBtn.style.color = 'var(--green)';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = '<span>SEND TRANSMISSION</span><div class="btn-scan"></div>';
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
      }, 3000);
    }, 1500);
  });
})();

/* ================================================================
   16. SMOOTH SCROLL for nav links
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ================================================================
   17. GLITCH EFFECT on ABACUS title (periodic)
   ================================================================ */
(function initGlitch() {
  const h1Lines = document.querySelectorAll('.hero-title-line');
  function glitch() {
    h1Lines.forEach(el => {
      el.style.textShadow = `
        ${(Math.random()-0.5)*6}px 0 var(--cyan),
        ${(Math.random()-0.5)*6}px 0 var(--purple),
        0 0 40px rgba(0,245,255,0.5)
      `;
      el.style.transform = `skewX(${(Math.random()-0.5)*4}deg)`;
    });
    setTimeout(() => {
      h1Lines.forEach(el => {
        el.style.textShadow = '';
        el.style.transform = '';
      });
    }, 100);
  }

  setInterval(() => {
    if (Math.random() > 0.6) glitch();
  }, 3000);
})();

/* ================================================================
   18. SECTION BACKGROUND GRID PARALLAX
   ================================================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.section-bg-grid').forEach(el => {
    el.style.transform = `translateY(${scrollY * 0.05}px)`;
  });
}, { passive: true });

/* ================================================================
   19. FOOTER YEAR
   ================================================================ */
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
  footerCopy.textContent = `© ${new Date().getFullYear()} ABACUS CLUB — GEC West Champaran`;
}

/* ================================================================
   20. PAGE LOAD COMPLETE
   ================================================================ */
console.log('%cABACUS CLUB — CODE THE FUTURE', 'color: #00f5ff; font-family: monospace; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f5ff;');
console.log('%cGEC West Champaran | Est. 2020', 'color: #8b5cf6; font-family: monospace;');
