/* Uniforma l'identità dello Studio senza modificare i contenuti giuridici. */
(function () {
  'use strict';

  const BRAND = 'Studio Legale Cascasi & Bianchi';
  const SUBTITLE = 'Studio legale a Milano e Monza';

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function replaceBrandText(value) {
    return String(value || '')
      .replace(/Studio Legale dell[’']Avv\. Diego Cascasi/gi, BRAND)
      .replace(/Studio Legale Cascasi(?!\s*&\s*Bianchi)/gi, BRAND);
  }

  function normalizeBranding() {
    qsa('.brand, .footer-brand').forEach(element => {
      element.innerHTML = `${BRAND}<span>${SUBTITLE}</span>`;
    });

    document.title = replaceBrandText(document.title);

    qsa('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach(meta => {
      const current = meta.getAttribute('content');
      if (current) meta.setAttribute('content', replaceBrandText(current));
    });

    const heroSub = qs('.hero .hero-sub');
    if (heroSub) heroSub.textContent = replaceBrandText(heroSub.textContent);

    const studioText = qs('.studio-text');
    if (studioText) {
      const label = qs('.section-label', studioText);
      const heading = qs('h2', studioText);
      const paragraphs = qsa(':scope > p:not(.section-label)', studioText);

      if (label) label.textContent = 'Lo Studio';
      if (heading) heading.textContent = BRAND;
      if (paragraphs[0]) {
        paragraphs[0].textContent = 'Lo Studio Legale Cascasi & Bianchi opera a Milano dal 2007. L’Avv. Diego Cascasi è iscritto all’Albo degli Avvocati di Milano dal 2007. Lo Studio si rivolge a privati, professionisti, amministratori di condominio, imprese e società.';
      }
    }

    const imagePlaceholder = qs('.img-placeholder');
    if (imagePlaceholder) {
      imagePlaceholder.setAttribute('aria-label', `Foto dello ${BRAND} da inserire`);
      const caption = qs('span', imagePlaceholder);
      if (caption) caption.textContent = `Foto dello ${BRAND}`;
    }

    qsa('.legal-body strong').forEach(element => {
      if (element.textContent.trim() === 'Studio Legale Cascasi') {
        element.textContent = BRAND;
      }
    });

    const copyright = qs('.footer-bottom span');
    if (copyright && /Studio Legale Cascasi/.test(copyright.textContent)) {
      copyright.textContent = copyright.textContent.replace(/Studio Legale Cascasi(?:\s*&\s*Bianchi)?/, BRAND);
    }
  }

  function init() {
    normalizeBranding();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      normalizeBranding();
      if (attempts >= 30) window.clearInterval(timer);
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
