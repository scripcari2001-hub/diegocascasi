/* Studio Legale Cascasi & Bianchi — comportamento unico del sito */
(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const currentPage = document.body.dataset.page || "index";

  const setText = (selector, value, root = document) => {
    const element = qs(selector, root);
    if (element && value !== undefined && value !== null) element.textContent = value;
  };

  const setLink = (element, href, label) => {
    if (!element) return;
    if (href) element.href = href;
    if (label !== undefined && label !== null) element.textContent = label;
  };

  const replaceTextList = (container, values) => {
    if (!container || !Array.isArray(values)) return;
    container.replaceChildren(...values.map(value => {
      const item = document.createElement("li");
      item.textContent = value;
      return item;
    }));
  };

  function initNavigation() {
    const toggle = qs(".nav-toggle");
    const nav = qs("#mainNav");
    if (!toggle || !nav) return;

    const close = (restoreFocus = false) => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Apri il menu");
      document.body.classList.remove("nav-open");
      if (restoreFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const opening = toggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", opening);
      toggle.classList.toggle("is-open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.setAttribute("aria-label", opening ? "Chiudi il menu" : "Apri il menu");
      document.body.classList.toggle("nav-open", opening);
    });

    nav.addEventListener("click", event => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("click", event => {
      if (nav.classList.contains("is-open") && !event.target.closest(".header")) close();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) close(true);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) close();
    });
  }

  function syncCommonContent(data) {
    const studio = data?.studio;
    const professionals = data?.professionisti;
    if (!studio || !Array.isArray(professionals)) return;

    qsa(".brand-name,.footer-brand-name").forEach(element => {
      element.textContent = studio.nome;
    });
    qsa(".brand-subtitle,.footer-brand-name + span").forEach(element => {
      element.textContent = studio.sottoTitolo;
    });
    qsa(".footer-desc").forEach(element => {
      element.textContent = data.footer?.descrizione || studio.descrizione;
    });
    qsa(".footer-appointment").forEach(element => {
      element.textContent = studio.ricevimento;
    });

    const topbar = qs(".topbar-inner");
    if (topbar) {
      setText(":scope > span:first-child", studio.ricevimento, topbar);
      const links = qsa(".topbar-emails a", topbar);
      professionals.slice(0, 2).forEach((person, index) => {
        setLink(links[index], `mailto:${person.email}`, index === 0 ? "Email Milano" : "Email Monza");
      });
    }

    const labels = data.nav || {};
    qsa("#mainNav a").forEach(link => {
      const href = link.getAttribute("href") || "";
      if (link.classList.contains("nav-cta")) link.textContent = labels.appuntamento || "Richiedi un appuntamento";
      else if (href.startsWith("index")) link.textContent = labels.home || "Home";
      else if (href.startsWith("chi-siamo")) link.textContent = labels.chiSiamo || "Lo Studio";
      else if (href.startsWith("aree")) link.textContent = labels.aree || "Aree di attività";
      else if (href.startsWith("contatti")) link.textContent = labels.contatti || "Contatti";
    });

    qsa(".footer-col").forEach(column => {
      const heading = qs("h2", column)?.textContent.trim().toLowerCase();
      if (heading === "email") {
        const links = qsa("a", column);
        professionals.slice(0, 2).forEach((person, index) => {
          setLink(links[index], `mailto:${person.email}`, person.nome);
        });
      }
      if (heading === "sedi") {
        const rows = qsa("p", column);
        professionals.slice(0, 2).forEach((person, index) => {
          if (rows[index]) rows[index].textContent = person.indirizzo;
        });
      }
    });

    const mobileLinks = qsa(".mobile-contact-bar a");
    professionals.slice(0, 2).forEach((person, index) => {
      setLink(mobileLinks[index], `mailto:${person.email}`, index === 0 ? "Email Milano" : "Email Monza");
    });

    const copyright = qs(".footer-bottom > span:first-child");
    if (copyright) copyright.textContent = data.footer?.copyright || `© ${new Date().getFullYear()} ${studio.nome}`;
  }

  function syncSeo(data) {
    if (!data?.studio || currentPage === "privacy" || currentPage === "cookie") return;
    const studioName = data.studio.nome;
    let title = `${studioName} – ${data.studio.sottoTitolo}`;
    let description = data.home?.heroSottotitolo || data.studio.descrizione;

    if (currentPage === "chi-siamo") {
      title = `${data.chiSiamo?.heroTitolo || "Lo Studio"} – ${studioName}`;
      description = data.chiSiamo?.heroSottotitolo || description;
    } else if (currentPage === "aree") {
      title = `${data.aree?.heroTitolo || "Aree di attività"} – ${studioName}`;
      description = data.aree?.heroSottotitolo || description;
    } else if (currentPage === "contatti") {
      title = `${data.contatti?.heroTitolo || "Contatti"} – ${studioName}`;
      description = data.contatti?.heroSottotitolo || description;
    }

    document.title = title;
    const descriptionMeta = qs("meta[name='description']");
    const ogTitle = qs("meta[property='og:title']");
    const ogDescription = qs("meta[property='og:description']");
    if (descriptionMeta) descriptionMeta.content = description;
    if (ogTitle) ogTitle.content = title;
    if (ogDescription) ogDescription.content = description;
  }

  function setEmphasizedTitle(element, title, emphasizedWord) {
    if (!element || !title) return;
    const position = emphasizedWord ? title.indexOf(emphasizedWord) : -1;
    if (position < 0) {
      element.textContent = title;
      return;
    }
    const emphasis = document.createElement("em");
    emphasis.textContent = emphasizedWord;
    element.replaceChildren(
      document.createTextNode(title.slice(0, position)),
      emphasis,
      document.createTextNode(title.slice(position + emphasizedWord.length))
    );
  }

  function syncHome(data) {
    const home = data.home;
    if (!home) return;
    setText(".hero-eyebrow", home.heroOcchio);
    setEmphasizedTitle(qs(".hero h1"), home.heroTitolo, home.heroTitoloEm);
    setText(".hero-sub", home.heroSottotitolo);
    const heroButtons = qsa(".hero-btns a");
    setLink(heroButtons[0], "aree.html", home.heroBtnPrimario);
    setLink(heroButtons[1], "contatti.html#contactForm", home.heroBtnSecondario);

    const activities = qs(".home-cards")?.closest(".section");
    setText(".section-label", home.sezioneOcchio, activities);
    setText("h2", home.sezioneTitolo, activities);
    qsa(".home-card").forEach((card, index) => {
      const item = home.cards?.[index];
      if (!item) return;
      setLink(card, item.link);
      setText("h3", item.titolo, card);
      setText("p", item.testo, card);
      setText(".card-link", item.linkTesto, card);
    });

    const reasons = qs(".home-reasons")?.closest(".section");
    setText(".section-label", home.motiviOcchio, reasons);
    setText("h2", home.motiviTitolo, reasons);
    qsa(".reason-card").forEach((card, index) => {
      const value = data.chiSiamo?.valori?.[index];
      if (!value) return;
      setText("h3", value.titolo, card);
      setText("p", value.testo, card);
    });

    setText(".cta-banner h2", home.ctaTitolo);
    setText(".cta-banner p", home.ctaSottotitolo);
    setText(".cta-banner .btn-primary", home.ctaBottone);
  }

  function syncProfessional(card, person) {
    if (!card || !person) return;
    card.id = person.id || card.id;
    setText("h2", person.nome, card);
    setText(".professional-register", person.albo, card);

    const photo = qs(".professional-photo", card);
    if (photo) {
      photo.setAttribute("aria-label", person.fotoAlt || `Foto di ${person.nome}`);
      photo.replaceChildren();
      if (person.foto) {
        const image = document.createElement("img");
        image.src = person.foto;
        image.alt = person.fotoAlt || `Foto di ${person.nome}`;
        image.loading = "lazy";
        image.decoding = "async";
        photo.append(image);
      } else {
        const initials = document.createElement("span");
        initials.setAttribute("aria-hidden", "true");
        initials.textContent = person.iniziali || "";
        const caption = document.createElement("small");
        caption.textContent = "Foto da inserire";
        photo.append(initials, caption);
      }
    }

    const biography = qs(".professional-bio", card);
    if (biography && Array.isArray(person.paragrafi)) {
      biography.replaceChildren(...person.paragrafi.map(text => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
      }));
    }

    const contacts = qsa(".professional-contacts > div", card);
    if (contacts[0]) setText("dd", person.indirizzo, contacts[0]);
    if (contacts[1]) setLink(qs("a", contacts[1]), `mailto:${person.email}`, person.email);
    if (contacts[2]) setLink(qs("a", contacts[2]), `mailto:${person.pec}`, person.pec);
  }

  function syncStudio(data) {
    const content = data.chiSiamo;
    if (!content) return;
    setText(".page-hero .hero-eyebrow", content.heroOcchio);
    setText(".page-hero h1", content.heroTitolo);
    setText(".page-hero-sub", content.heroSottotitolo);

    const professionalsSection = qs(".professionals-grid")?.closest(".section");
    setText(".section-label", content.sezioneOcchio, professionalsSection);
    setText("h2", content.sezioneTitolo, professionalsSection);
    setText(".section-intro", content.sezioneSottotitolo, professionalsSection);
    qsa(".professional-card").forEach((card, index) => syncProfessional(card, data.professionisti?.[index]));

    const valuesSection = qs(".values-grid")?.closest(".section");
    setText(".section-label", content.valoriOcchio, valuesSection);
    setText("h2", content.valoriTitolo, valuesSection);
    qsa(".value-card").forEach((card, index) => {
      const value = content.valori?.[index];
      if (!value) return;
      setText("h3", value.titolo, card);
      setText("p", value.testo, card);
    });

    setText(".cta-banner h2", content.ctaTitolo);
    setText(".cta-banner p", content.ctaSottotitolo);
    setText(".cta-banner .btn-primary", content.ctaBottone);
  }

  function rebuildAreaIndexLink(link, area) {
    if (!link || !area) return;
    const number = document.createElement("span");
    number.textContent = area.numero;
    link.href = `#${area.id}`;
    link.replaceChildren(number, document.createTextNode(area.titolo));
  }

  function syncAreas(data) {
    const areas = data.aree;
    if (!areas) return;
    setText(".page-hero .hero-eyebrow", areas.heroOcchio);
    setText(".page-hero h1", areas.heroTitolo);
    setText(".page-hero-sub", areas.heroSottotitolo);
    setText("#area-index-title", areas.indiceTitolo);

    const indexLinks = qsa(".area-index a");
    qsa(".area-card").forEach((card, index) => {
      const area = areas.specializzazioni?.[index];
      if (!area) return;
      const id = area.id || `area-${index + 1}`;
      const contentId = `${id}-content`;
      card.id = id;
      const toggle = qs(".area-toggle", card);
      if (toggle) toggle.setAttribute("aria-controls", contentId);
      setText(".area-number", area.numero, card);
      const title = qsa(".area-toggle > span", card)[1];
      if (title) title.textContent = area.titolo;
      const content = qs(".area-content", card);
      if (content) content.id = contentId;
      setText(".area-content > p", area.testo, card);
      replaceTextList(qs(".area-content ul", card), area.voci);
      rebuildAreaIndexLink(indexLinks[index], { ...area, id });
    });

    const activities = qs(".activities-layout")?.closest(".section");
    setText(".section-label", areas.attivitaOcchio, activities);
    setText("h2", areas.attivitaTitolo, activities);
    replaceTextList(qs(".activity-list"), areas.attivita);
    setText(".network-box h3", areas.ctaBoxTitolo);
    setText(".network-box p", areas.ctaBoxTesto);
    setText(".network-box a", areas.ctaBoxBottone);
    setText(".cta-banner h2", areas.ctaTitolo);
    setText(".cta-banner p", areas.ctaSottotitolo);
    setText(".cta-banner .btn-primary", areas.ctaBottone);
  }

  function syncOffice(card, person) {
    if (!card || !person) return;
    setText(".office-kicker", person.sedeNome, card);
    setText("h3", person.nome, card);
    setText("address", person.indirizzo, card);
    const rows = qsa("dl > div", card);
    if (rows[0]) setLink(qs("a", rows[0]), `mailto:${person.email}`, person.email);
    if (rows[1]) setLink(qs("a", rows[1]), `mailto:${person.pec}`, person.pec);
    setLink(qs(".text-link", card), person.mappaLink, "Apri in Google Maps →");
  }

  function syncContacts(data) {
    const contacts = data.contatti;
    if (!contacts) return;
    setText(".page-hero .hero-eyebrow", contacts.heroOcchio);
    setText(".page-hero h1", contacts.heroTitolo);
    setText(".page-hero-sub", contacts.heroSottotitolo);
    setText(".appointment-notice strong", contacts.avvisoTitolo);
    setText(".appointment-notice p", contacts.avvisoTesto);

    const offices = qs(".offices-grid")?.closest(".section");
    setText(".section-label", contacts.infoOcchio, offices);
    setText("h2", contacts.infoTitolo, offices);
    qsa(".office-card").forEach((card, index) => syncOffice(card, data.professionisti?.[index]));

    const formSection = qs(".contact-layout")?.closest(".section");
    setText(".section-label", contacts.formOcchio, formSection);
    setText("h2", contacts.formTitolo, formSection);
    setText(".contact-layout > div:first-child > p:last-child", contacts.formSottotitolo);

    const fieldLabels = {
      nome: contacts.formLabelNome,
      cognome: contacts.formLabelCognome,
      email: contacts.formLabelEmail,
      oggetto: contacts.formLabelOggetto,
      messaggio: contacts.formLabelMessaggio
    };
    Object.entries(fieldLabels).forEach(([id, label]) => {
      const element = qs(`label[for='${id}']`);
      if (element && label) element.textContent = `${label} *`;
    });

    const placeholders = {
      nome: contacts.formPlaceholderNome,
      cognome: contacts.formPlaceholderCognome,
      email: contacts.formPlaceholderEmail,
      messaggio: contacts.formPlaceholderMessaggio
    };
    Object.entries(placeholders).forEach(([id, value]) => {
      const field = qs(`#${id}`);
      if (field && value) field.placeholder = value;
    });

    const select = qs("#oggetto");
    if (select && Array.isArray(contacts.formOpzioni)) {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = contacts.formPlaceholderOggetto;
      const options = contacts.formOpzioni.map(optionData => {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.testo;
        return option;
      });
      select.replaceChildren(placeholder, ...options);
    }

    const privacyLabel = qs("label[for='privacy']");
    if (privacyLabel) {
      const link = document.createElement("a");
      link.href = "privacy.html";
      link.textContent = contacts.formPrivacyLink;
      privacyLabel.replaceChildren(document.createTextNode(`${contacts.formPrivacy} `), link, document.createTextNode(" *"));
    }

    setText(".btn-submit", contacts.formBottone);
    setText(".form-note", contacts.formNota);
    setText("#formSuccess h3", contacts.successTitolo);
    setText("#formSuccess p", contacts.successTesto);

    const faqContainer = qs(".faq-container");
    setText(".section-label", contacts.faqOcchio, faqContainer);
    setText("h2", contacts.faqTitolo, faqContainer);
    qsa(".faq-item").forEach((item, index) => {
      const faq = contacts.faq?.[index];
      if (!faq) return;
      const button = qs(".faq-question", item);
      const icon = qs("span", button);
      if (button) {
        button.replaceChildren(document.createTextNode(faq.domanda));
        if (icon) button.append(icon);
      }
      setText(".faq-answer p", faq.risposta, item);
    });
  }

  function syncPage(data) {
    window.siteContent = data;
    syncCommonContent(data);
    syncSeo(data);
    if (currentPage === "index") syncHome(data);
    if (currentPage === "chi-siamo") syncStudio(data);
    if (currentPage === "aree") syncAreas(data);
    if (currentPage === "contatti") syncContacts(data);
  }

  function initAreas() {
    const cards = qsa(".area-card");
    if (!cards.length) return;
    const media = window.matchMedia("(max-width: 760px)");

    const applyLayoutState = () => {
      cards.forEach((card, index) => {
        const open = !media.matches || index === 0;
        card.classList.toggle("is-open", open);
        qs(".area-toggle", card)?.setAttribute("aria-expanded", String(open));
      });
      openCurrentHash();
    };

    const openCurrentHash = () => {
      if (!window.location.hash) return;
      const target = qs(window.location.hash);
      if (!target?.classList.contains("area-card")) return;
      target.classList.add("is-open");
      qs(".area-toggle", target)?.setAttribute("aria-expanded", "true");
    };

    cards.forEach(card => {
      const button = qs(".area-toggle", card);
      button?.addEventListener("click", () => {
        if (!media.matches) return;
        const open = !card.classList.contains("is-open");
        card.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });

    applyLayoutState();
    media.addEventListener?.("change", applyLayoutState);
    window.addEventListener("hashchange", openCurrentHash);
  }

  function initFaq() {
    qsa(".faq-question").forEach(button => {
      button.addEventListener("click", () => {
        const answer = document.getElementById(button.getAttribute("aria-controls"));
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        if (answer) answer.hidden = !open;
      });
    });
  }

  function clearFieldError(field) {
    field.removeAttribute("aria-invalid");
    const error = field.id ? qs(`#${field.id}-error`) : null;
    error?.remove();
    field.removeAttribute("aria-describedby");
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    field.setAttribute("aria-invalid", "true");
    if (!field.id) return;
    const error = document.createElement("small");
    error.className = "field-error";
    error.id = `${field.id}-error`;
    error.textContent = message;
    field.setAttribute("aria-describedby", error.id);
    field.closest(".form-group")?.append(error);
  }

  function validateForm(form) {
    let valid = true;
    qsa("[required]", form).forEach(field => {
      clearFieldError(field);
      const empty = field.type === "checkbox" ? !field.checked : !String(field.value).trim();
      if (empty) {
        valid = false;
        showFieldError(field, field.type === "checkbox" ? "Devi accettare la Privacy Policy." : "Compila questo campo.");
      }
    });
    const email = qs("#email", form);
    if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      valid = false;
      showFieldError(email, "Inserisci un indirizzo email valido.");
    }
    return valid;
  }

  function initForm() {
    const form = qs("#contactForm");
    if (!form) return;
    const status = qs("#formStatus");
    const success = qs("#formSuccess");
    const button = qs(".btn-submit", form);
    const originalLabel = button?.textContent || "Invia richiesta";

    form.addEventListener("input", event => {
      if (event.target.matches("input,select,textarea")) clearFieldError(event.target);
    });
    form.addEventListener("change", event => {
      if (event.target.matches("input,select,textarea")) clearFieldError(event.target);
    });
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!validateForm(form)) {
        qs("[aria-invalid='true']", form)?.focus();
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = window.siteContent?.contatti?.formBottoneInvio || "Invio in corso…";
      }
      if (status) {
        status.className = "form-status";
        status.textContent = "";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Invio non riuscito");
        form.hidden = true;
        if (success) success.hidden = false;
      } catch {
        if (status) {
          status.className = "form-status error";
          status.textContent = "Non è stato possibile inviare la richiesta. Puoi scrivere direttamente a uno degli indirizzi email indicati sopra.";
        }
        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
      }
    });
  }

  function initCookieNotice() {
    const banner = qs("#cookieBanner");
    const button = qs("#cookieAccept");
    if (!banner || !button) return;
    let accepted = false;
    try {
      accepted = localStorage.getItem("cookieNoticeAccepted") === "true";
    } catch {
      accepted = false;
    }
    if (!accepted) window.setTimeout(() => banner.classList.add("visible"), 400);
    button.addEventListener("click", () => {
      try {
        localStorage.setItem("cookieNoticeAccepted", "true");
      } catch {
        /* Il sito continua a funzionare anche senza localStorage. */
      }
      banner.classList.remove("visible");
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = qsa(".home-card,.reason-card,.value-card,.professional-card,.area-card,.office-card,.network-box,.faq-item");
    elements.forEach(element => element.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    elements.forEach(element => observer.observe(element));
  }

  async function loadContent() {
    try {
      const response = await fetch("contenuti.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      syncPage(await response.json());
    } catch (error) {
      console.warn("Contenuti dinamici non caricati; vengono mantenuti i testi HTML.", error);
    }
  }

  function init() {
    initNavigation();
    initAreas();
    initFaq();
    initForm();
    initCookieNotice();
    initReveal();
    loadContent();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
