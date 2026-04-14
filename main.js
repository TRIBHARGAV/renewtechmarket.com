// ============================================================
//  RENEW TECH MARKET — main.js
//  Shared across all pages
// ============================================================

/* ---- Sticky Navbar ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

/* ---- Mobile Nav Toggle ---- */
const navToggle  = document.getElementById('navToggle');
const navMobile  = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });
  // close on link click
  navMobile.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
}

/* ---- Highlight active nav link ---- */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === page) link.classList.add('active');
  });
})();

/* ---- AOS (Animate on Scroll) ---- */
(function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
})();

/* ---- Counter Animation ---- */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 'true';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ---- Toast Notification ---- */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---- Product "Buy / Enquire" buttons ---- */
document.addEventListener('click', e => {
  if (e.target.matches('[data-enquire]')) {
    const name = e.target.dataset.enquire;
    const msg  = encodeURIComponent(`Hi! I'm interested in the ${name}. Please share details.`);
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  }
  if (e.target.matches('[data-service]')) {
    const name = e.target.dataset.service;
    const msg  = encodeURIComponent(`Hi! I want to book a service: ${name}.`);
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  }
});

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.querySelector('[name=name]').value.trim();
    const phone   = contactForm.querySelector('[name=phone]').value.trim();
    const service = contactForm.querySelector('[name=service]').value;
    const msg     = contactForm.querySelector('[name=message]').value.trim();
    if (!name || !phone) { showToast('⚠️ Please fill required fields.'); return; }
    const waMsg   = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${msg}`);
    window.open(`https://wa.me/919876543210?text=${waMsg}`, '_blank');
    contactForm.reset();
    showToast('✅ Message sent via WhatsApp!');
  });
}

/* ---- Products filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const priceSort  = document.getElementById('priceSort');
const productCards = document.querySelectorAll('.product-card[data-brand]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      const show = filter === 'all' || card.dataset.brand === filter || card.dataset.ram === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

if (priceSort) {
  priceSort.addEventListener('change', () => {
    const grid    = document.getElementById('productsGrid');
    const cards   = [...grid.querySelectorAll('.product-card')];
    const sorted  = cards.sort((a, b) => {
      const pa = parseInt(a.dataset.price), pb = parseInt(b.dataset.price);
      return priceSort.value === 'asc' ? pa - pb : pb - pa;
    });
    sorted.forEach(c => grid.appendChild(c));
  });
}

/* ---- Wishlist toggle ---- */
document.addEventListener('click', e => {
  if (e.target.matches('.wish')) {
    e.target.textContent = e.target.textContent === '🤍' ? '❤️' : '🤍';
    showToast(e.target.textContent === '❤️' ? '❤️ Added to wishlist' : 'Removed from wishlist');
  }
});

/* ---- Smooth reveal hero text ---- */
(function () {
  const heroEls = document.querySelectorAll('.hero-eyebrow, .hero-title, .hero-sub, .hero-actions, .hero-stats');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .7s ease ${i * 0.12}s, transform .7s ease ${i * 0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
  });
})();
