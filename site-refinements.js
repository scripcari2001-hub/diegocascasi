/* Rifiniture progressive senza modificare i testi principali dell'avvocato */
(function () {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const FALLBACK_EMAIL = 'info@studiolegalecascasi.it';

  function getStudioEmail() {
    const dynamicEmail = window._jsonData?.studio?.email;
    if (dynamicEmail) return dynamicEmail;

    const existingEmailLink = qs('a[href^="mailto:"]');
    if (existingEmailLink) {
      return existingEmailLink.getAttribute('href').replace(/^mailto:/i, '').split('?')[0];
    }

    return FALLBACK_EMAIL;
  }

  function loadStyles() {
    if (qs('link[href="site-refinements.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'site-refinements.css';
    document.head.appendChild(link);
  }

  function loadBranding() {
    if (qs('script[src="studio-branding.js"]')) return;
    const script = document.createElement('script');
    script.src = 'studio-branding.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  function initFaq() {
    qsa('.faq-item').forEach((item, index) => {
      const button = qs('.faq-question', item);
      const answer = qs('.faq-answer', item);
      if (!button || !answer || button.dataset.ready === 'true') return;
      const answerId = answer.id || `faq-answer-${index + 1}`;
      answer.id = answerId;
      button.type = 'button';
      button.setAttribute('aria-controls', answerId);
      button.setAttribute('aria-expanded', 'false');
      button.dataset.ready = 'true';
      button.addEventListener('click', () => {
        const isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  function ensureEmailContact() {
    const email = getStudioEmail();
    const mailto = `mailto:${email}`;

    qsa('.topbar').forEach(topbar => {
      const desiredHtml = `<span>Per fissare un appuntamento scrivi a&nbsp;</span><a href="${mailto}">${email}</a>`;
      if (topbar.innerHTML !== desiredHtml) topbar.innerHTML = desiredHtml;
    });

    const contactInfo = qs('.contatti-info');
    if (contactInfo && !qs('a[href^="mailto:"]', contactInfo)) {
      const emailBlock = document.createElement('div');
      emailBlock.className = 'info-block';
      emailBlock.innerHTML = `
        <div class="info-icon">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div>
          <p class="info-label">Email</p>
          <a href="${mailto}" class="info-value info-link">${email}</a>
        </div>`;

      const hoursBlock = qsa('.info-block', contactInfo).find(block =>
        block.textContent.toLowerCase().includes('orari')
      );
      if (hoursBlock) contactInfo.insertBefore(emailBlock, hoursBlock);
      else contactInfo.appendChild(emailBlock);
    }

    qsa('.footer').forEach(footer => {
      const contactColumn = qsa('.footer-col', footer).find(column =>
        qs('h4', column)?.textContent.trim().toLowerCase() === 'contatti'
      );
      if (!contactColumn || qs('a[href^="mailto:"]', contactColumn)) return;

      const emailItem = document.createElement('p');
      emailItem.className = 'footer-contact-item';
      emailItem.innerHTML = `<a href="${mailto}">${email}</a>`;

      const appointmentNote = qs('.footer-appointment-note', contactColumn);
      if (appointmentNote) contactColumn.insertBefore(emailItem, appointmentNote);
      else contactColumn.appendChild(emailItem);
    });
  }

  function removePhoneReferences() {
    qsa('a[href^="tel:"]').forEach(link => {
      if (link.classList.contains('btn-call')) {
        link.href = 'contatti.html#contactForm';
        link.textContent = 'Richiedi un appuntamento';
        link.classList.remove('btn-call');
        link.classList.add('btn-appointment');
      } else {
        const removable = link.closest('.info-block, .footer-contact-item');
        if (removable) removable.remove();
        else link.remove();
      }
    });

    qsa('.contact-form .form-group').forEach(group => {
      const field = qs('input[name="telefono"], input#telefono', group);
      if (field) group.remove();
    });

    qsa('.footer-contact-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes('telefono') || /\b\d{2,4}[\s.-]\d{3,4}/.test(text)) item.remove();
    });

    qsa('.info-block').forEach(block => {
      const text = block.textContent.toLowerCase();
      if (text.includes('telefono')) block.remove();
    });

    const homeCta = qs('.cta-banner .btn-primary[href^="tel:"]');
    if (homeCta) {
      homeCta.href = 'contatti.html#contactForm';
      homeCta.textContent = 'Richiedi un appuntamento';
    }

    ensureEmailContact();
  }

  function enhanceFooter() {
    qsa('.footer').forEach(footer => {
      const contactColumn = qsa('.footer-col', footer).find(column =>
        qs('h4', column)?.textContent.trim().toLowerCase() === 'contatti'
      );
      if (contactColumn && !qs('.footer-appointment-note', contactColumn)) {
        const note = document.createElement('p');
        note.className = 'footer-appointment-note';
        note.textContent = 'Ricevimento esclusivamente su appuntamento';
        contactColumn.appendChild(note);
      }
      const firstColumn = qs('.footer-grid > div:first-child', footer);
      if (firstColumn && !qs('.footer-extra-links', firstColumn)) {
        const links = document.createElement('div');
        links.className = 'footer-extra-links';
        links.innerHTML = '<a href="aree.html">Aree di attività</a><a href="contatti.html">Richiedi un appuntamento</a><a href="privacy.html">Privacy</a><a href="cookie.html">Cookie</a>';
        firstColumn.appendChild(links);
      }
    });
    ensureEmailContact();
  }

  function replaceMobileContactBar(data) {
    const existing = qs('.mobile-contact-bar');
    if (!existing || !data?.studio) return false;
    const emailAddress = data.studio.email || getStudioEmail();
    const email = `mailto:${emailAddress}`;
    const maps = data.contatti?.mappaLink || 'https://maps.google.com/';
    existing.innerHTML = `
      <a href="${email}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>Email</span></a>
      <a href="contatti.html#contactForm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg><span>Appuntamento</span></a>
      <a href="${maps}" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>Come arrivare</span></a>`;
    return true;
  }

  function observePhoneReinsertion() {
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        removePhoneReferences();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href'] });
  }

  function waitForDynamicContent() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      removePhoneReferences();
      const data = window._jsonData;
      if (data && replaceMobileContactBar(data)) window.clearInterval(timer);
      else if (attempts >= 60) window.clearInterval(timer);
    }, 100);
  }

  function init() {
    loadStyles();
    loadBranding();
    initFaq();
    removePhoneReferences();
    enhanceFooter();
    waitForDynamicContent();
    observePhoneReinsertion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());