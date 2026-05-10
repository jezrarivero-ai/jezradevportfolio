//THEME TOGGLE ---
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const mobThemeToggle = document.getElementById('mobThemeToggle');

function applyTheme(dark) {
    html.dataset.theme = dark ? 'dark' : 'light';
    if(themeToggle) themeToggle.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(html.dataset.theme !== 'dark'));
}
if (mobThemeToggle) {
    mobThemeToggle.addEventListener('click', () => applyTheme(html.dataset.theme !== 'dark'));
}

//WELCOME LOADER LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    let width = 0;
    
    // Simulate loading progress
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 600); // Wait a split second after filling
        } else {
            width += Math.floor(Math.random() * 20) + 10;
            if(width > 100) width = 100;
            loaderBar.style.width = width + '%';
        }
    }, 150);
});

//SCROLL REVEAL & SKILL BARS
const reveals = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.skill-bar-fill');

function checkScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < triggerBottom) {
            reveal.classList.add('visible');
        }
    });

    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        if (barTop < triggerBottom) {
            bar.style.width = bar.dataset.width + '%';
        }
    });
}

window.addEventListener('scroll', checkScroll);
checkScroll();

// --- MODAL LOGIC ---
const projectModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

window.openProjectModal = function(card) {
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    projectModal.classList.add('open');
};

if (modalClose) {
    modalClose.addEventListener('click', () => {
        projectModal.classList.remove('open');
    });
}

// Close modal when clicking outside the content
window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.classList.remove('open');
    }
});

//Projects
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
            card.offsetHeight; 
            card.style.animation = '';
          }
        });
      });
    });

//ACTIVE NAV LINK HIGHLIGHTING
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const mobNavLinks = document.querySelectorAll('.mob-nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });

    mobNavLinks.forEach(a => {
        a.classList.remove('active');
        if (a.dataset.section === current) {
            a.classList.add('active');
        }
    });
});

/* EMAILJS CONTACT FORM INTEGRATION */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const submitBtn = this.querySelector('.form-submit');
        const originalBtnText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_e59wscu', 'template_mq8iwkk', this)
            .then(() => {
                // Success
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = '#10B981'; // Success Green
                
                // Hide form and show success message if you have one
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    
                    // Optional: Show your success div
                    document.getElementById('formSuccess').style.display = 'block';
                    contactForm.style.display = 'none';
                }, 2000);
            }, (error) => {
                // Error
                console.error('FAILED...', error);
                submitBtn.textContent = 'Error! Try Again';
                submitBtn.style.backgroundColor = '#EF4444'; // Error Red
                submitBtn.disabled = false;
            });
    });
}
