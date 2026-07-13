/* Miglioramenti progressivi: accessibilità, validazione form, preferenze cookie */
(function () {
  'use strict';

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setDecorativeSvgAccessibility() {
    qsa('.home-card-icon svg, .area-icon svg, .spec-icon svg, .info-icon svg, .map-overlay svg, .form-success svg').forEach(svg => {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    });
  }

  function getFieldLabel(field) {
    const id = field.getAttribute('id');
    const label = id ? qs(`label[for="${id}"]`) : null;
    return (label?.textContent || field.getAttribute('name') || 'Campo').replace('*', '').trim();
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    const id = field.getAttribute('id');
    if (!id) return;
    const error = qs(`#${id}-error`);
    if (error) error.remove();
    field.removeAttribute('aria-describedby');
  }

  function setFieldError(field, message) {
    clearFieldError(field);
    const id = field.getAttribute('id');
    field.setAttribute('aria-invalid', 'true');
    if (!id) return;
    const error = document.createElement('small');
    error.className = 'field-error';
    error.id = `${id}-error`;
    error.textContent = message;
    field.setAttribute('aria-describedby', error.id);

    const formGroup = field.closest('.form-group') || field.parentElement;
    formGroup.appendChild(error);
  }

  function validateContactForm(form) {
    let valid = true;

    qsa('[required]', form).forEach(field => {
      clearFieldError(field);
      const empty = field.type === 'checkbox' ? !field.checked : !String(field.value || '').trim();
      if (empty) {
        valid = false;
        setFieldError(field, field.type === 'checkbox' ? 'Devi accettare la Privacy Policy per inviare il modulo.' : `Compila il campo ${getFieldLabel(field)}.`);
      }
    });

    const email = qs('#email', form);
    if (email && email.value.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) {
        valid = false;
        setFieldError(email, 'Inserisci un indirizzo email valido.');
      }
    }

    const telefono = qs('#telefono', form);
    if (telefono && telefono.value.trim()) {
      const phoneOk = /^[+\d\s().-]{6,20}$/.test(telefono.value.trim());
      if (!phoneOk) {
        valid = false;
        setFieldError(telefono, 'Inserisci un numero di telefono valido.');
      }
    }

    return valid;
  }

  function initBetterFormValidation() {
    const form = qs('#contactForm');
    if (!form) return;

    form.addEventListener('input', event => {
      if (event.target.matches('input, textarea, select')) clearFieldError(event.target);
    });

    form.addEventListener('change', event => {
      if (event.target.matches('input, textarea, select')) clearFieldError(event.target);
    });

    form.addEventListener('submit', event => {
      if (!validateContactForm(form)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const firstInvalid = qs('[aria-invalid="true"]', form);
        if (firstInvalid) firstInvalid.focus();
      }
    }, true);
  }

  function readCookiePrefs() {
    try {
      return JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
    } catch {
      return {};
    }
  }

  function saveCookiePrefs(prefs, consentValue) {
    localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
    localStorage.setItem('cookieConsent', consentValue);
  }

  function initCookiePreferencesPage() {
    const toggle = qs('#toggle-analitici');
    const save = qs('#savePrefs');
    const reject = qs('#rejectAll');
    const savedMsg = qs('#prefSaved');
    if (!toggle || !save || !reject) return;

    const saved = readCookiePrefs();
    toggle.checked = Boolean(saved.analitici);

    function showSaved() {
      if (!savedMsg) return;
      savedMsg.style.display = 'flex';
      setTimeout(() => { savedMsg.style.display = 'none'; }, 3000);
    }

    save.addEventListener('click', () => {
      saveCookiePrefs({ analitici: toggle.checked }, 'custom');
      showSaved();
    });

    reject.addEventListener('click', () => {
      toggle.checked = false;
      saveCookiePrefs({ analitici: false }, 'rejected');
      showSaved();
    });
  }

  function secureDynamicHtmlFromJson() {
    // Funzione disponibile per eventuali evoluzioni del sito: evita di costruire HTML non sanificato da JSON.
    window.safeListHtml = function safeListHtml(items) {
      return Array.isArray(items) ? items.map(item => `<li>${escapeHtml(item)}</li>`).join('') : '';
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    setDecorativeSvgAccessibility();
    initBetterFormValidation();
    initCookiePreferencesPage();
    secureDynamicHtmlFromJson();
  });
}());
