const savedTheme = localStorage.getItem("jellfly-theme");
if (savedTheme === "dark") {
  document.documentElement.dataset.theme = "dark";
}

const navigation = document.querySelector(".main-nav");
const header = document.querySelector(".topbar");

if (navigation && header) {
  if (!navigation.id) navigation.id = "main-navigation";

  const menuButton = document.createElement("button");
  menuButton.className = "mobile-nav-toggle";
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", "Ouvrir le menu");
  menuButton.setAttribute("aria-controls", navigation.id);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = '<span></span><span></span><span></span><span class="visually-hidden">Menu</span>';
  header.insertBefore(menuButton, navigation);

  function setMenuOpen(isOpen) {
    header.classList.toggle("is-menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  }

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  const wikiDropdowns = navigation.querySelectorAll(".nav-drop");
  wikiDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-drop-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isOpen = dropdown.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (dropdown.contains(event.target)) return;
      dropdown.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
      wikiDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-drop-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const mobileMenuWasOpen = header.classList.contains("is-menu-open");
      const focusedDropdown = Array.from(wikiDropdowns).find((dropdown) => dropdown.contains(document.activeElement));
      setMenuOpen(false);
      wikiDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-drop-toggle")?.setAttribute("aria-expanded", "false");
      });
      if (mobileMenuWasOpen) {
        menuButton.focus();
      } else if (focusedDropdown) {
        focusedDropdown.querySelector(".nav-drop-toggle")?.focus();
      }
    }
  });
}

const searchButton = header?.querySelector(".search-button");
if (header && searchButton) {
  const themeButton = document.createElement("button");
  themeButton.className = "theme-toggle";
  themeButton.type = "button";

  function updateThemeButton() {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeButton.setAttribute("aria-label", isDark ? "Activer le thème clair" : "Activer le thème sombre");
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.title = isDark ? "Activer le thème clair" : "Activer le thème sombre";
    themeButton.innerHTML = isDark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 15.1A9 9 0 018.9 3.7a9 9 0 1011.4 11.4z"></path></svg>';
  }

  themeButton.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (isDark) {
      delete document.documentElement.dataset.theme;
      localStorage.setItem("jellfly-theme", "light");
    } else {
      document.documentElement.dataset.theme = "dark";
      localStorage.setItem("jellfly-theme", "dark");
    }
    updateThemeButton();
  });

  const headerActions = document.createElement("div");
  headerActions.className = "header-actions";
  searchButton.parentNode.insertBefore(headerActions, searchButton);
  headerActions.append(themeButton, searchButton);
  updateThemeButton();
}

const pageRevealSelectors = [
  "main h1",
  "main .toc",
  "main .vote-widget",
  "main .vote-stats > *",
  "main .rules-page > p",
  "main .rules-page > ul",
  "main .rules-page > h2",
  "main .patch-page > .lead",
  "main .patch-page > h3",
  "main .patch-page > .patch-entry",
  "main .wiki-grid .wiki-card",
  "main .article-section > section",
  "main #job-content > h2",
  "main #job-content > h3",
  "main #job-content > ul"
];

const revealTargetSet = new Set(document.querySelectorAll("[data-reveal]"));
for (const selector of pageRevealSelectors) {
  document.querySelectorAll(selector).forEach((element) => revealTargetSet.add(element));
}

const revealTargets = Array.from(revealTargetSet);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length && "IntersectionObserver" in window && !reduceMotion && !document.hidden) {
  document.documentElement.classList.add("motion-ready");
  let revealIndex = 0;
  revealTargets.forEach((target) => {
    if (!target.hasAttribute("data-reveal")) {
      target.setAttribute("data-reveal", "");
      target.style.setProperty("--reveal-delay", `${Math.min(revealIndex * 22, 132)}ms`);
      revealIndex += 1;
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.01, rootMargin: "0px 0px -16px 0px" });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

document.querySelectorAll(".copy-address").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const isPort = button.dataset.copyType === "port";
    const feedback = button.closest(".server-address, .bedrock-endpoint")?.nextElementSibling;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = value;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "absolute";
        temporaryInput.style.left = "-9999px";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }

      button.textContent = isPort ? "Port copié" : "Adresse copiée";
      if (feedback) {
        feedback.textContent = isPort ? "Le port du serveur a été copié." : "L’adresse du serveur a été copiée.";
      }
    } catch {
      button.textContent = "Copie impossible";
      if (feedback) {
        feedback.textContent = isPort
          ? `Copiez manuellement le port ${value}.`
          : `Copiez manuellement l’adresse ${value}.`;
      }
    }

    window.setTimeout(() => {
      button.textContent = isPort ? "Copier le port" : "Copier l’adresse";
    }, 1800);
  });
});

const shareButton = document.querySelector(".home-share-button");
if (shareButton) {
  const shareFeedback = document.querySelector(".share-feedback");
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  const shareUrl = canonicalLink?.href || window.location.href.split("#")[0];

  async function copyShareUrl() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return;
    }

    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = shareUrl;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "absolute";
    temporaryInput.style.left = "-9999px";
    document.body.append(temporaryInput);
    temporaryInput.select();
    try {
      if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
    } finally {
      temporaryInput.remove();
    }
  }

  shareButton.addEventListener("click", async () => {
    shareFeedback.textContent = "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "JellFly SMP",
          text: "Rejoignez JellFly SMP, serveur Minecraft communautaire.",
          url: shareUrl
        });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Le partage natif a échoué :", error);
      }
    }

    try {
      await copyShareUrl();
      shareFeedback.textContent = "Lien du serveur copié.";
    } catch (error) {
      console.error("Impossible de copier le lien du serveur :", error);
      shareFeedback.textContent = "Partage impossible. Copiez l’adresse du site depuis votre navigateur.";
    }
  });
}

document.querySelectorAll('a[href="#rejoindre"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector("#rejoindre");
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
    history.pushState(null, "", "#rejoindre");
  });
});

let crispLoaded = false;
function loadCrisp() {
  if (crispLoaded) return;
  crispLoaded = true;
  document.removeEventListener("pointerdown", loadCrisp);
  document.removeEventListener("keydown", loadCrisp);

  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = "fcfddadb-38b9-481a-957c-81511383e478";
  window.$crisp.push(["config", "color:mode", ["light"]]);

  const script = document.createElement("script");
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  document.head.append(script);
}

document.addEventListener("pointerdown", loadCrisp, { once: true });
document.addEventListener("keydown", loadCrisp, { once: true });
if ("requestIdleCallback" in window) {
  window.requestIdleCallback(loadCrisp, { timeout: 2500 });
} else {
  window.setTimeout(loadCrisp, 1200);
}

const backToTopButton = document.createElement("button");
backToTopButton.className = "back-to-top";
backToTopButton.type = "button";
backToTopButton.setAttribute("aria-label", "Remonter en haut de la page");
backToTopButton.title = "Remonter en haut de la page";
backToTopButton.hidden = true;
backToTopButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"></path></svg>';
document.body.append(backToTopButton);

function updateBackToTopVisibility() {
  backToTopButton.hidden = window.scrollY < 320;
}

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});