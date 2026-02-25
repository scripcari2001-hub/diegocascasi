/* ════════════════════════════════════════
  UTILITY
════════════════════════════════════════ */

function set(selector, valore) {
  const el = document.querySelector(selector);
  if (el && valore !== undefined) el.textContent = valore;
}

function setAll(selector, valore) {
  document.querySelectorAll(selector).forEach(el => {
    if (valore !== undefined) el.textContent = valore;
  });
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el && html !== undefined) el.innerHTML = html;
}

function setAttr(selector, attributo, valore) {
  const el = document.querySelector(selector);
  if (el && valore !== undefined) el.setAttribute(attributo, valore);
}

function setAllAttr(selector, attributo, valore) {
  document.querySelectorAll(selector).forEach(el => {
    if (valore !== undefined) el.setAttribute(attributo, valore);
  });
}

/* ════════════════════════════════════════
  topbar · navigazione · footer · copyright
════════════════════════════════════════ */
function popolaComuni(d) {
  const s = d.studio;
  const n = d.nav;
  const f = d.footer;

/*  Topbar  */
const topbarSpan = document.querySelector('.topbar span');
const topbarLink = document.querySelector('.topbar a');

if (topbarSpan && topbarLink) {
  topbarSpan.textContent = d.topbar.testo + '\u00a0';
  topbarLink.textContent = s.telefono;
  topbarLink.href = s.telefonoLink;
}

  /*  Brand (nome studio + tag)  */
  document.querySelectorAll('.brand').forEach(el => {
    el.innerHTML = `${s.nome}<span>${s.sottoTitolo}</span>`;
  });

/* ── Navigazione ── */
document.querySelectorAll('.nav a').forEach(a => {
  const href = (a.getAttribute('href') || '').replace(/^\/|\.html$/g, '').toLowerCase();

  if (!a.classList.contains('btn-call')) {
    if (href === '' || href === 'index')      a.textContent = n.home;
    else if (href === 'chi-siamo')            a.textContent = n.chiSiamo;
    else if (href === 'aree')                 a.textContent = n.aree;
    else if (href === 'contatti')             a.textContent = n.contatti;
  }
});

/* ── Bottone chiama ── */
document.querySelectorAll('.btn-call').forEach(a => {
  a.textContent = n.chiama;
  a.href = s.telefonoLink;
});

  /*  brand  */
  document.querySelectorAll('.footer-brand').forEach(el => {
    el.innerHTML = `${s.nome}<span>${s.sottoTitolo}</span>`;
  });

  /*  descrizione  */
  set('.footer-desc', `${f.descrizione} ${s.annoFondazione}.`);

  /*  titoli colonne  */
  const footerH4 = document.querySelectorAll('.footer-col h4');
  if (footerH4[0]) footerH4[0].textContent = f.navTitolo;
  if (footerH4[1]) footerH4[1].textContent = f.contattiTitolo;
  if (footerH4[2]) footerH4[2].textContent = f.legaleTitolo;

  /* contatti (indirizzo, tel, email)  */
  const items = document.querySelectorAll('.footer-contact-item');
  if (items[0]) items[0].textContent = s.indirizzo;
  if (items[1]) items[1].innerHTML = `<a href="${s.telefonoLink}">${s.telefono}</a>`;
  if (items[2]) items[2].innerHTML = `<a href="mailto:${s.email}">${s.email}</a>`;

  /* link privacy e cookie  */
  const footerLinks = document.querySelectorAll('.footer-bottom a');
  if (footerLinks[0]) footerLinks[0].textContent = f.privacyLink;
  if (footerLinks[1]) footerLinks[1].textContent = f.cookieLink;

  /* copyright  */
  const copy = document.querySelector('.footer-bottom span');
  if (copy) copy.textContent = `© ${new Date().getFullYear()} ${s.nome} – P.IVA ${s.piva}`;
}

/* ════════════════════════════════════════
  index
════════════════════════════════════════ */
function popolaHome(d) {
  const h = d.home;
  const s = d.studio;

  /* Hero */
  set('.hero .hero-eyebrow', h.heroOcchio);
  const h1 = document.querySelector('.hero h1');
  if (h1) h1.innerHTML = h.heroTitolo.replace(
    h.heroTitoloEm, `<em>${h.heroTitoloEm}</em>`
  );
  set('.hero .hero-sub', h.heroSottotitolo);

  const btns = document.querySelectorAll('.hero-btns a');
  if (btns[0]) btns[0].textContent = h.heroBtnPrimario;
  if (btns[1]) btns[1].textContent = h.heroBtnSecondario;

  /* Sezione cards */
  set('.section .section-label', h.sezioneOcchio);
  set('.section h2', h.sezioneTitolo);

  document.querySelectorAll('.home-card').forEach((card, i) => {
    const c = h.cards[i];
    if (!c) return;
    card.href = c.link;
    const h3 = card.querySelector('h3');
    const p  = card.querySelector('p');
    const a  = card.querySelector('.card-link');
    if (h3) h3.textContent = c.titolo;
    if (p)  p.textContent  = c.testo;
    if (a)  a.textContent  = c.linkTesto;
  });

  /*  banner */
  set('.cta-banner h2', h.ctaTitolo);
  set('.cta-banner p',  h.ctaSottotitolo);
  const ctaBtn = document.querySelector('.cta-banner .btn-primary');
  if (ctaBtn) {
    ctaBtn.href = s.telefonoLink;
    ctaBtn.textContent = `${h.ctaBottone} – ${s.telefono}`;
  }
}

/* ════════════════════════════════════════
  chi-siamo
════════════════════════════════════════ */
function popolaChiSiamo(d) {
  const c = d.chiSiamo;

  /* Hero */
  set('.page-hero .hero-eyebrow', c.heroOcchio);
  set('.page-hero h1', c.heroTitolo);
  set('.page-hero-sub', c.heroSottotitolo);

  /* foto */
  const fotoSpan = document.querySelector('.img-placeholder span');
  if (fotoSpan) fotoSpan.textContent = c.fotoPlaceholder;

  /* Sezione profilo */
  set('.studio-text .section-label', c.sezioneOcchio);
  set('.studio-text h2', c.sezioneTitolo);

  const pp = document.querySelectorAll('.studio-text > p:not(.section-label)');
  if (pp[0]) pp[0].textContent = c.paragrafo1;
  if (pp[1]) pp[1].textContent = c.paragrafo2;
  if (pp[2]) pp[2].textContent = c.paragrafo3;

  /* Statistiche */
  document.querySelectorAll('.detail-item').forEach((item, i) => {
    const stat = c.statistiche[i];
    if (!stat) return;
    const num   = item.querySelector('.detail-num');
    const label = item.querySelector('.detail-label');
    if (num) {
      num.dataset.target = stat.numero;
      num.dataset.suffix = stat.suffisso;
      num.textContent    = '0' + stat.suffisso;
    }
    if (label) label.textContent = stat.etichetta;
  });

  /* Valori – label sezione */
  const valoriSection = document.querySelector('.section-cream');
  if (valoriSection) {
    const lbl = valoriSection.querySelector('.section-label');
    const h2  = valoriSection.querySelector('h2');
    if (lbl) lbl.textContent = c.valoriOcchio;
    if (h2)  h2.textContent  = c.valoriTitolo;
  }

  document.querySelectorAll('.valore-card').forEach((card, i) => {
    const v = c.valori[i];
    if (!v) return;
    const h3 = card.querySelector('h3');
    const p  = card.querySelector('p');
    if (h3) h3.textContent = v.titolo;
    if (p)  p.textContent  = v.testo;
  });

  /*  banner */
  set('.cta-banner h2', c.ctaTitolo);
  set('.cta-banner p',  c.ctaSottotitolo);
  const ctaBtn = document.querySelector('.cta-banner .btn-primary');
  if (ctaBtn) ctaBtn.textContent = c.ctaBottone;
}

/* ════════════════════════════════════════
  aree
════════════════════════════════════════ */
function popolaAree(d) {
  const a = d.aree;

  /* Hero */
  set('.page-hero .hero-eyebrow', a.heroOcchio);
  set('.page-hero h1', a.heroTitolo);
  set('.page-hero-sub', a.heroSottotitolo);

  /* Blocchi specializzazioni */
  document.querySelectorAll('.area-block').forEach((block, i) => {
    const spec = a.specializzazioni[i];
    if (!spec) return;
    const label = block.querySelector('.section-label');
    const h2    = block.querySelector('h2');
    const p     = block.querySelector('p');
    const list  = block.querySelector('.area-list');
    if (label) label.textContent = spec.numero;
    if (h2)    h2.textContent    = spec.titolo;
    if (p)     p.textContent     = spec.testo;
    if (list)  list.innerHTML    = spec.voci.map(v => `<li>${v}</li>`).join('');
  });

  /* Sezione "Nel dettaglio" */
  const cream = document.querySelector('.section-cream');
  if (cream) {
    set('.section-cream .section-label', a.attivitaOcchio);
    set('.section-cream h2', a.attivitaTitolo);
  }

  /* Lista attività */
  const actList = document.querySelector('.activity-list');
  if (actList) {
    actList.innerHTML = a.attivita.map(item => `<li>${item}</li>`).join('');
  }

  /* Box laterale */
  const ctaBox = document.querySelector('.attivita-cta');
  if (ctaBox) {
    const h3  = ctaBox.querySelector('h3');
    const p   = ctaBox.querySelector('p');
    const btn = ctaBox.querySelector('a');
    if (h3)  h3.textContent  = a.ctaBoxTitolo;
    if (p)   p.textContent   = a.ctaBoxTesto;
    if (btn) btn.textContent = a.ctaBoxBottone;
  }

  /*  banner */
  set('.cta-banner h2', a.ctaTitolo);
  set('.cta-banner p',  a.ctaSottotitolo);
  const ctaBannerBtn = document.querySelector('.cta-banner .btn-primary');
  if (ctaBannerBtn) ctaBannerBtn.textContent = a.ctaBottone;
}

/* ════════════════════════════════════════
  contatti
════════════════════════════════════════ */
function popolaContatti(d) {
  const c = d.contatti;
  const s = d.studio;

  /* Hero */
  set('.page-hero .hero-eyebrow', c.heroOcchio);
  set('.page-hero h1', c.heroTitolo);
  set('.page-hero-sub', c.heroSottotitolo);

  /* titoli */
  set('.contatti-info .section-label', c.infoOcchio);
  set('.contatti-info h2', c.infoTitolo);

  /* Info blocks (indirizzo, tel, email, orari) */
  const blocks = document.querySelectorAll('.info-block');

  if (blocks[0]) {
    const lbl = blocks[0].querySelector('.info-label');
    const val = blocks[0].querySelector('.info-value');
    if (lbl) lbl.textContent = c.labelIndirizzo;
    if (val) val.innerHTML   = s.indirizzo.replace(', ', '<br>');
  }
  if (blocks[1]) {
    const lbl  = blocks[1].querySelector('.info-label');
    const link = blocks[1].querySelector('.info-link');
    if (lbl)  lbl.textContent  = c.labelTelefono;
    if (link) { link.href = s.telefonoLink; link.textContent = s.telefono; }
  }
  if (blocks[2]) {
    const lbl  = blocks[2].querySelector('.info-label');
    const link = blocks[2].querySelector('.info-link');
    if (lbl)  lbl.textContent  = c.labelEmail;
    if (link) { link.href = `mailto:${s.email}`; link.textContent = s.email; }
  }
  if (blocks[3]) {
    const lbl = blocks[3].querySelector('.info-label');
    const val = blocks[3].querySelector('.info-value');
    if (lbl) lbl.textContent = c.labelOrari;
    if (val) val.innerHTML   = s.orari.replace(' — ', '<br>');
  }

  /* titoli */
  set('.contatti-form-wrap .section-label', c.formOcchio);
  set('.contatti-form-wrap h2', c.formTitolo);
  const formSub = document.querySelector('.contatti-form-wrap > p');
  if (formSub) formSub.textContent = c.formSottotitolo;

  /* campi */
  const labels = document.querySelectorAll('.contact-form label');
  const labelMap = {
    'nome':     c.formLabelNome,
    'cognome':  c.formLabelCognome,
    'email':    c.formLabelEmail,
    'telefono': c.formLabelTelefono,
    'oggetto':  c.formLabelOggetto,
    'messaggio':c.formLabelMessaggio
  };
  labels.forEach(label => {
    const forAttr = label.getAttribute('for');
    if (forAttr && labelMap[forAttr]) {
      /* Mantieni l'asterisco se presente */
      const hasStar = label.textContent.includes('*');
      label.textContent = labelMap[forAttr] + (hasStar ? ' *' : '');
    }
  });

  /* checkbox privacy */
  const privacyLabel = document.querySelector('label[for="privacy"]');
  if (privacyLabel) {
    privacyLabel.innerHTML =
      `${c.formPrivacy} <a href="privacy.html">${c.formPrivacyLink}</a> *`;
  }

  /* placeholder  */
  setAttr('#nome',      'placeholder', c.formPlaceholderNome);
  setAttr('#cognome',   'placeholder', c.formPlaceholderCognome);
  setAttr('#email',     'placeholder', c.formPlaceholderEmail);
  setAttr('#telefono',  'placeholder', c.formPlaceholderTelefono);
  setAttr('#messaggio', 'placeholder', c.formPlaceholderMessaggio);

  /* select opzioni */
  const select = document.getElementById('oggetto');
  if (select) {
    select.innerHTML =
      `<option value="" disabled selected>${c.formPlaceholderOggetto}</option>` +
      c.formOpzioni.map(o =>
        `<option value="${o.value}">${o.testo}</option>`
      ).join('');
  }

  /* bottone e nota */
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) submitBtn.textContent = c.formBottone;
  set('.form-note', c.formNota);

  /* Messaggio di successo */
  set('#formSuccess h3', c.successTitolo);
  set('#formSuccess p',  c.successTesto);

  /* Mappa */
  const mapLink = document.querySelector('.map-overlay a');
  if (mapLink) {
    mapLink.href = c.mappaLink;
    mapLink.textContent = c.mappaTasto;
  }
  const mapAddr = document.querySelector('.map-overlay p');
  if (mapAddr) mapAddr.textContent = s.indirizzoMappa;
}

/* ════════════════════════════════════════
  CONTATORI ANIMATI
════════════════════════════════════════ */
function animateCounter(el) {
  const target    = parseInt(el.dataset.target, 10);
  const suffix    = el.dataset.suffix || '';
  const duration  = 1400;
  const step      = 16;
  const increment = target / (duration / step);
  let current     = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

/* ════════════════════════════════════════
  ANIMAZIONI 
════════════════════════════════════════ */
function initAnimazioni() {
  const revealEls = document.querySelectorAll(
    '.spec-card, .valore-card, .home-card, .activity-list li, .attivita-cta, .area-block, .info-block'
  );
  revealEls.forEach(el => el.classList.add('reveal-hidden'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));

  /* Contatori animati */
  const studioDetail = document.querySelector('.studio-detail');
  if (studioDetail) {
    const counters = studioDetail.querySelectorAll('.detail-num[data-target]');
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { counters.forEach(animateCounter); cObs.disconnect(); }
      });
    }, { threshold: 0.4 });
    cObs.observe(studioDetail);
  }

/* Active nav */
const current = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
document.querySelectorAll('.nav a').forEach(a => {
  a.classList.remove('active');
  const href = (a.getAttribute('href') || '')
    .replace(/^\/|\.html$/g, '')
    .toLowerCase();

  if (href === current || (current === 'index' && href === '')) {
    a.classList.add('active');
  }
});
}

/* ════════════════════════════════════════
  invio email
════════════════════════════════════════ */
function initForm() {
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  const btnOrigText = document.querySelector('.btn-submit')?.textContent || 'Invia messaggio';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      const vuoto = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      if (vuoto) { field.style.borderColor = '#e57373'; valid = false; }
    });
    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    btn.disabled    = true;
    btn.textContent = window._jsonData?.contatti?.formBottoneInvio || 'Invio in corso…';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display       = 'flex';
          formSuccess.style.flexDirection = 'column';
          formSuccess.style.alignItems    = 'center';
        }
      } else {
        const json = await res.json().catch(() => ({}));
        alert('Errore: ' + (json.error || 'Riprova più tardi.'));
        btn.disabled    = false;
        btn.textContent = btnOrigText;
      }
    } catch {
      alert('Errore di rete. Controlla la connessione e riprova.');
      btn.disabled    = false;
      btn.textContent = btnOrigText;
    }
  });
}

/* ════════════════════════════════════════
  COOKIE 
════════════════════════════════════════ */
function initCookieBanner(cb) {
  if (!document.getElementById('cookieBanner')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cookieBanner" role="dialog" aria-label="Consenso cookie">
        <p class="banner-text">
          ${cb.testo} <a href="cookie.html">${cb.linkTesto}</a>.
        </p>
        <div class="banner-btns">
          <button class="banner-accept" id="bannerAccept">${cb.btnAccetta}</button>
          <button class="banner-reject" id="bannerReject">${cb.btnRifiuta}</button>
          <button class="banner-prefs" onclick="window.location='cookie.html'">${cb.btnPersonalizza}</button>
        </div>
      </div>
    `);
  }

  const banner  = document.getElementById('cookieBanner');
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => banner.classList.add('visible'), 600);
  }

  function hideBanner() {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  }

  document.getElementById('bannerAccept')?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePrefs', JSON.stringify({ analitici: true }));
    hideBanner();
  });
  document.getElementById('bannerReject')?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePrefs', JSON.stringify({ analitici: false }));
    hideBanner();
  });
}

/* ════════════════════════════════════════
  Caricamento JSON
════════════════════════════════════════ */
fetch('contenuti.json', { cache: 'no-store' })
  .then(res => {
    if (!res.ok) throw new Error('File non trovato');
    return res.json();
  })
  .then(data => {
    window._jsonData = data;

    popolaComuni(data);

const path = window.location.pathname.replace(/\/$/, '');
let page = (path.split('/').pop() || 'index').toLowerCase();

if (location.hostname.endsWith('github.io')) {
  const repo = (location.pathname.split('/')[1] || '').toLowerCase();
  if (page === repo) page = 'index';
}

if (page === 'index' || page === 'index.html') {
  popolaHome(data);
} else if (page === 'chi-siamo' || page === 'chi-siamo.html') {
  popolaChiSiamo(data);
} else if (page === 'aree' || page === 'aree.html') {
  popolaAree(data);
} else if (page === 'contatti' || page === 'contatti.html') {
  popolaContatti(data);
}

    initAnimazioni();
    initForm();
    initCookieBanner(data.cookieBanner);
  })
  .catch(err => {
    console.warn('contenuti.json non caricato:', err.message);
    initAnimazioni();
    initForm();
    initCookieBanner({
      testo: 'Utilizziamo cookie tecnici e analitici. Leggi la',
      linkTesto: 'Cookie Policy',
      btnAccetta: 'Accetta tutti',
      btnRifiuta: 'Solo necessari',
      btnPersonalizza: 'Personalizza'
    });
  });
