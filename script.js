/* =====================================================
   SMILECRAFT DENTAL CLINIC — JAVASCRIPT
   ===================================================== */
'use strict';

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initFAQ();
  initForm();
  initActiveNavLinks();
});

/* =============================================
   NAVBAR — scroll shadow & active state
   ============================================= */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  const hamburger = $('#hamburger-btn');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  $$('.mobile-link', mobileMenu).forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click (if menu is open)
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* =============================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================= */
function initScrollAnimations() {
  const elements = $$('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   ACTIVE NAV LINKS — on scroll
   ============================================= */
function initActiveNavLinks() {
  const sections = $$('section[id], main > *[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => sectionObserver.observe(section));
}

/* =============================================
   FAQ ACCORDION
   ============================================= */
function initFAQ() {
  const faqItems = $$('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = $('.faq-question', item);
    const answer = $('.faq-answer', item);
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items (accordion behavior)
      faqItems.forEach(otherItem => {
        const otherBtn = $('.faq-question', otherItem);
        const otherAnswer = $('.faq-answer', otherItem);
        if (otherBtn && otherAnswer && otherItem !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
        }
      });

      // Toggle current item
      btn.setAttribute('aria-expanded', (!isExpanded).toString());
      answer.classList.toggle('open', !isExpanded);
    });
  });
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initForm() {
  const form = $('#assessment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = $('#patient-name');
    const phone = $('#patient-phone');
    const concern = $('#dental-concern');

    let hasError = false;

    [name, phone, concern].forEach(field => {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 4px rgba(239,68,68,.1)';
        hasError = true;
        field.addEventListener('input', () => {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }, { once: true });
      }
    });

    if (hasError) return;

    // Phone format validation
    const phoneVal = phone.value.replace(/\s/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(phoneVal)) {
      phone.style.borderColor = '#EF4444';
      phone.style.boxShadow = '0 0 0 4px rgba(239,68,68,.1)';
      phone.focus();
      return;
    }

    // Show success
    showSuccessModal();
    form.reset();
  });
}

function showSuccessModal() {
  const modal = $('#success-modal');
  const backdrop = $('#modal-backdrop');
  if (!modal || !backdrop) return;

  modal.style.display = 'block';
  backdrop.style.display = 'block';

  // Auto-close after 6 seconds
  setTimeout(() => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
  }, 6000);

  // Allow ESC key to close
  const closeOnEsc = (e) => {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
      document.removeEventListener('keydown', closeOnEsc);
    }
  };
  document.addEventListener('keydown', closeOnEsc);
}

/* =============================================
   SMOOTH SCROLL for anchor links
   ============================================= */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  const navHeight = 90;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

  window.scrollTo({ top, behavior: 'smooth' });
});

/* =============================================
   COUNTER ANIMATION for statistics
   ============================================= */
function animateCounter(el, end, suffix = '', duration = 1500) {
  const start = 0;
  const range = end - start;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + range * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

// Observe doctor stats for counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent;
    const num = parseInt(text.replace(/\D/g, ''), 10);
    const suffix = text.includes('+') ? '+' : '';
    if (num && !el.dataset.animated) {
      el.dataset.animated = 'true';
      animateCounter(el, num, suffix);
    }
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

$$('.doc-stat strong').forEach(el => counterObserver.observe(el));

/* =============================================
   NAVBAR hide logo text on small screens
   ============================================= */
(function handleLogoResize() {
  const logoSub = $('.logo-sub');
  if (!logoSub) return;
  const check = () => {
    logoSub.style.display = window.innerWidth < 480 ? 'none' : '';
  };
  check();
  window.addEventListener('resize', check, { passive: true });
})();
