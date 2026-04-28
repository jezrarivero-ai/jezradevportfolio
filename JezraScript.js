const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const mobThemeToggle = document.getElementById('mobThemeToggle');
const mobThemeIcon  = document.getElementById('mobThemeIcon');

function applyTheme(dark) {
    html.dataset.theme = dark ? 'dark' : 'light';
    themeToggle.textContent = dark ? '☀️' : '🌙';
    mobThemeIcon.innerHTML = dark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ? saved === 'dark' : prefersDark);

    themeToggle.addEventListener('click', () => applyTheme(html.dataset.theme !== 'dark'));
    mobThemeToggle.addEventListener('click', () => applyTheme(html.dataset.theme !== 'dark'));

    /* ── Active Nav on Scroll ──────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navLinks a');
    const mobItems = document.querySelectorAll('.mob-nav-item');

    function setActive(id) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      mobItems.forEach(a => a.classList.toggle('active', a.dataset.section === id));
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.35, rootMargin: '-80px 0px -30% 0px' });
    sections.forEach(s => observer.observe(s));

    /* ── Scroll Reveal ─────────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // Stagger child cards within a grid
          const delay = e.target.closest('.skills-grid, .projects-grid')
            ? Array.from(e.target.parentElement.children).indexOf(e.target) * 80
            : 0;
          setTimeout(() => e.target.classList.add('visible'), delay);
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ── Skill Bar Animation ───────────────────────────────── */
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = (bar.dataset.width || 0) + '%';
            }, i * 120 + 200);
          });
          barObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.skill-card').forEach(c => barObserver.observe(c));

    /* ── Project Filter ────────────────────────────────────── */
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
          const show = f === 'all' || card.dataset.category === f;
          card.classList.toggle('hidden', !show);
          if (show) {
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = '';
          }
        });
      });
    });

    /* ── Contact Form ──────────────────────────────────────── */
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Simulate send (replace with actual form action / EmailJS / etc.)
      setTimeout(() => {
        this.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }, 1200);
    });

    /* ── Smooth scroll for anchor links ───────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = window.innerWidth <= 768 ? 0 : 70;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    });