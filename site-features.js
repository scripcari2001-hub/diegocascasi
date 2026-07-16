/* Funzioni del sito: menu mobile, indice aree, fisarmonica, SEO e contatti rapidi */
(function () {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function initMobileNavigation() {
    const header = qs('.header');
    const container = qs('.header .container');
    const nav = qs('.nav');
    if (!header || !container || !nav || qs('.nav-toggle', container)) return;

    nav.id = nav.id || 'mainNav';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Apri il menu di navigazione');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    container.insertBefore(toggle, nav);
    document.body.classList.add('nav-ready');

    function closeMenu(returnFocus = false) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Apri il menu di navigazione');
      document.body.classList.remove('nav-open');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) return closeMenu();
      nav.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Chiudi il menu di navigazione');
      document.body.classList.add('nav-open');
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (nav.classList.contains('is-open') && !header.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  function ensureMeta(selector, attributes, content) {
    if (!content) return;
    let element = qs(selector);
    if (!element) {
      element = document.createElement('meta');
      Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  function currentPage() {
    const path = window.location.pathname.replace(/\/$/, '');
    const page = (path.split('/').pop() || 'index').toLowerCase();
    return page.endsWith('.html') ? page.slice(0, -5) : page;
  }

  function updateSeo(data) {
    if (!data?.studio) return;
    const page = currentPage();
    const studio = data.studio.nome || 'Studio Legale Cascasi';
    let title = `${studio} – ${data.studio.sottoTitolo || 'Avvocato'}`;
    let description = data.home?.heroSottotitolo || '';

    if (page === 'chi-siamo') {
      title = `${data.chiSiamo?.heroTitolo || 'Lo Studio'} – ${studio}`;
      description = data.chiSiamo?.heroSottotitolo || description;
    } else if (page === 'aree') {
      title = `${data.aree?.heroTitolo || 'Aree di attività'} – ${studio}`;
      description = data.aree?.heroSottotitolo || description;
    } else if (page === 'contatti') {
      title = `${data.contatti?.heroTitolo || 'Contatti'} – ${studio}`;
      description = data.contatti?.heroSottotitolo || description;
    }

    document.title = title;
    ensureMeta('meta[name="description"]', { name: 'description' }, description);
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    ensureMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
  }

  function populateHomeReasons(data) {
    const section = qs('.home-reasons-section');
    const values = data?.chiSiamo?.valori;
    if (!section || !Array.isArray(values)) return;

    qsa('.reason-card', section).forEach((card, index) => {
      const value = values[index];
      if (!value) return;
      const title = qs('h3', card);
      const text = qs('p', card);
      if (title) title.textContent = value.titolo;
      if (text) text.textContent = value.testo;
    });
  }

  function buildAreaIndex(data) {
    const index = qs('.area-index');
    const blocks = qsa('.area-block');
    if (!index || !blocks.length) return;

    index.textContent = '';
    blocks.forEach((block, position) => {
      const title = data?.aree?.specializzazioni?.[position]?.titolo || qs('h2', block)?.textContent || `Area ${position + 1}`;
      block.id = `area-${slugify(title) || position + 1}`;
      block.setAttribute('tabindex', '-1');
      const link = document.createElement('a');
      link.href = `#${block.id}`;
      link.textContent = title;
      link.addEventListener('click', () => {
        if (window.innerWidth <= 760) openArea(block);
      });
      index.appendChild(link);
    });
  }

  function openArea(block) {
    if (!block) return;
    block.classList.add('is-open');
    qs('.area-toggle', block)?.setAttribute('aria-expanded', 'true');
  }

  function initAreaAccordion() {
    const blocks = qsa('.area-block');
    if (!blocks.length || document.body.classList.contains('area-accordion-ready')) return;

    blocks.forEach((block, index) => {
      const heading = qs('h2', block);
      const paragraph = qs('.area-text > p:not(.section-label)', block);
      const list = qs('.area-list', block);
      if (!heading || !paragraph || !list) return;

      const details = document.createElement('div');
      details.className = 'area-details';
      details.id = `${block.id || `area-${index + 1}`}-details`;
      paragraph.parentNode.insertBefore(details, paragraph);
      details.append(paragraph, list);

      const title = heading.textContent;
      heading.textContent = '';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'area-toggle';
      toggle.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
      toggle.setAttribute('aria-controls', details.id);
      toggle.innerHTML = `<span>${escapeHtml(title)}</span><span class="area-toggle-icon" aria-hidden="true">+</span>`;
      heading.appendChild(toggle);

      if (index === 0) block.classList.add('is-open');
      toggle.addEventListener('click', () => {
        const open = block.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    });
    document.body.classList.add('area-accordion-ready');
  }

  function createMobileContactBar(data) {
    if (qs('.mobile-contact-bar') || !data?.studio) return;
    const studio = data.studio;
    const bar = document.createElement('nav');
    bar.className = 'mobile-contact-bar';
    bar.setAttribute('aria-label', 'Contatti rapidi');

    const items = [
      [studio.telefonoLink, 'Chiama', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'],
      [studio.email ? `mailto:${studio.email}` : '', 'Email', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'],
      ['contatti.html#contactForm', 'Appuntamento', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>']
    ];

    items.forEach(([href, label, icon]) => {
      if (!href) return;
      const link = document.createElement('a');
      link.href = href;
      link.innerHTML = `${icon}<span>${label}</span>`;
      qsa('svg', link).forEach(svg => {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      });
      bar.appendChild(link);
    });
    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-contact-bar');
  }

  function applyData(data) {
    updateSeo(data);
    populateHomeReasons(data);
    buildAreaIndex(data);
    initAreaAccordion();
    createMobileContactBar(data);
  }

  function waitForData() {
    if (window._jsonData) return applyData(window._jsonData);
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window._jsonData) {
        window.clearInterval(timer);
        applyData(window._jsonData);
      } else if (attempts >= 50) {
        window.clearInterval(timer);
        buildAreaIndex(null);
        initAreaAccordion();
      }
    }, 100);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    waitForData();
  });
}());
