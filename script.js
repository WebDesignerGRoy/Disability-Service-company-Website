/**
 * Inclusive Support Services — script.js
 * Features:
 *  - Mobile hamburger menu toggle
 *  - Smooth header shrink on scroll
 *  - Contact form validation & submission feedback
 *  - Accessible focus management for mobile nav
 */

(function () {
  'use strict';

  /* ==================== Hamburger / Mobile Nav ==================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav    = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));

      // Shift focus into nav when opened
      if (isOpen) {
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        hamburgerBtn.focus();
      }
    });

    // Close mobile nav on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburgerBtn.focus();
      }
    });

    // Close mobile nav when a link inside it is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ==================== Sticky Header Shrink on Scroll ==================== */
  const siteHeader = document.querySelector('.site-header');

  if (siteHeader) {
    const shrinkHeader = () => {
      if (window.scrollY > 60) {
        siteHeader.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)';
      } else {
        siteHeader.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
      }
    };
    window.addEventListener('scroll', shrinkHeader, { passive: true });
  }

  /* ==================== Contact Form ==================== */
  const submitBtn = document.getElementById('submitBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name     = document.getElementById('name');
      const email    = document.getElementById('email');
      const message  = document.getElementById('message');
      const consent  = document.getElementById('consent');
      let valid = true;

      // Clear previous errors
      document.querySelectorAll('.field-error').forEach(el => el.remove());
      document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        valid = false;
      }

      // Validate email
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }

      // Validate message
      if (!message.value.trim()) {
        showError(message, 'Please tell us how we can help.');
        valid = false;
      }

      // Validate consent
      if (!consent.checked) {
        showError(consent, 'Please consent to your details being stored.');
        valid = false;
      }

      if (valid) {
        // Simulate form submission
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        setTimeout(() => {
          showSuccess();
          submitBtn.textContent = 'Send enquiry';
          submitBtn.disabled = false;
        }, 1400);
      }
    });
  }

  function showError(field, message) {
    field.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    field.parentNode.appendChild(err);
    field.focus();
  }

  function showSuccess() {
    // Remove existing success message if present
    const existing = document.querySelector('.form-success');
    if (existing) existing.remove();

    const success = document.createElement('div');
    success.className = 'form-success';
    success.setAttribute('role', 'status');
    success.textContent = '✓ Thank you! We\'ll be in touch within 1–2 business days.';
    const form = document.querySelector('.contact-form');
    if (form) {
      form.appendChild(success);
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Clear form fields
    ['name', 'email', 'phone', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const consent = document.getElementById('consent');
    if (consent) consent.checked = false;
  }

  /* ==================== Dynamic CSS for form errors ==================== */
  const style = document.createElement('style');
  style.textContent = `
    .input-error {
      border-color: #c0392b !important;
      box-shadow: 0 0 0 3px rgba(192,57,43,0.15) !important;
    }
    .field-error {
      color: #c0392b;
      font-size: 0.78rem;
      margin-top: 4px;
      display: block;
    }
    .form-success {
      background: #e6f3ec;
      color: #1e5e3b;
      border: 1px solid #2a7a4f;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 0.9rem;
      font-weight: 700;
      margin-top: 4px;
      animation: fadeIn 0.35s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* ==================== Smooth scroll for anchor links ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = siteHeader ? siteHeader.offsetHeight : 64;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  /* ==================== Video thumbs: placeholder interaction ==================== */
  document.querySelectorAll('.video-thumb').forEach(thumb => {
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('role', 'button');

    const activate = () => {
      const label = thumb.getAttribute('aria-label') || 'Video';
      // In production this would open a modal or navigate to video
      thumb.innerHTML = `
        <div style="
          position:absolute;inset:0;display:flex;align-items:center;
          justify-content:center;background:#000;color:#fff;
          font-size:0.8rem;padding:10px;text-align:center;
        ">
          ▶ Playing: ${label.replace('Play video: ', '')}
        </div>
      `;
    };
    thumb.addEventListener('click', activate);
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

})();
