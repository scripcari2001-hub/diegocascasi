/* Rifiniture progressive senza modificare i testi principali dell'avvocato */
(function () {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function loadStyles() {
    if (qs('link[href="site-refinements.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'site-refinements.css';
    document.head.appendChild(link);
  }

  function isContactsPage() {
    const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
    return page === 'contatti' || page === 'contatti.html';
  }

  function injectContactExtras() {
    if (!isContactsPage()) return;

    const formWrap = qs('.contatti-form-wrap');
    const form = qs('#contactForm');
    if (formWrap && form && !qs('.appointment-notice', formWrap)) {
      const notice = document.createElement('div');
      notice.className = 'appointment-notice';
      notice.innerHTML = `
        <span class="appointment-notice-icon" aria-hidden="true">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
        </span>
        <div>
          <strong>Ricevimento esclusivamente su appuntamento</strong>
          <p>Dopo l’invio della richiesta tramite il modulo o via email, lo Studio ricontatterà l’interessato per concordare data e orario dell’incontro.</p>
        </div>`;
      formWrap.insertBefore(notice, form);
    }

    const map = qs('.map-placeholder');
    if (map && !qs('.faq-section')) {
      const section = document.createElement('section');
      section.className = 'section faq-section';
      section.setAttribute('aria-labelledby', 'faqTitle');
      section.innerHTML = `
        <div class="container">
          <p class="section-label">Informazioni utili</p>
          <div class="divider"></div>
          <h2 id="faqTitle">Domande frequenti</h2>
          <div class="faq-wrap">
            <div class="faq-item">
              <button class="faq-question">Lo Studio riceve senza appuntamento?</button>
              <div class="faq-answer"><p>No. Lo Studio riceve esclusivamente su appuntamento, così da poter dedicare a ogni incontro il tempo necessario.</p></div>
            </div>
            <div class="faq-item">
              <button class="faq-question">In quali città opera lo Studio?</button>
              <div class="faq-answer"><p>Lo Studio ha i propri riferimenti a Milano e Monza e presta assistenza in ambito stragiudiziale e giudiziale secondo le esigenze del caso.</p></div>
            </div>
            <div class="faq-item">
              <button class="faq-question">Come posso inviare i documenti?</button>
              <div class="faq-answer"><p>Dopo il primo contatto, lo Studio indicherà il canale più appropriato per trasmettere la documentazione in modo ordinato e riservato.</p></div>
            </div>
            <div class="faq-item">
              <button class="faq-question">In quanto tempo riceverò una risposta?</button>
              <div class="faq-answer"><p>Le richieste vengono esaminate nel più breve tempo possibile. I tempi possono variare in base alla complessità della situazione descritta.</p></div>
            </div>
            <div class="faq-item">
              <button class="faq-question">È possibile richiedere una consulenza online?</button>
              <div class="faq-answer"><p>La modalità dell’incontro viene valutata caso per caso. Nella richiesta è possibile indicare l’eventuale preferenza per un colloquio da remoto.</p></div>
            </div>
          </div>
        </div>`;
      map.parentNode.insertBefore(section, map);
    }
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
  }

  function replaceMobileContactBar(data) {
    const existing = qs('.mobile-contact-bar');
    if (!existing || !data?.studio) return false;

    const email = data.studio.email ? `mailto:${data.studio.email}` : 'contatti.html#contactForm';
    const maps = data.contatti?.mappaLink || 'https://maps.google.com/';
    existing.innerHTML = `
      <a href="${email}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span>Email</span>
      </a>
      <a href="contatti.html#contactForm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
        <span>Appuntamento</span>
      </a>
      <a href="${maps}" target="_blank" rel="noopener noreferrer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Come arrivare</span>
      </a>`;
    return true;
  }

  function waitForDynamicContent() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const data = window._jsonData;
      if (data && replaceMobileContactBar(data)) {
        window.clearInterval(timer);
      } else if (attempts >= 60) {
        window.clearInterval(timer);
      }
    }, 100);
  }

  function init() {
    loadStyles();
    injectContactExtras();
    initFaq();
    enhanceFooter();
    waitForDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
