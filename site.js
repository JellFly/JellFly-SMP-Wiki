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
      setMenuOpen(false);
      wikiDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-drop-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
  });
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
    const address = button.dataset.copy;
    const feedback = button.closest(".server-address")?.nextElementSibling;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = address;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "absolute";
        temporaryInput.style.left = "-9999px";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }

      button.textContent = "Adresse copiée";
      if (feedback) feedback.textContent = "L’adresse du serveur a été copiée.";
    } catch {
      button.textContent = "Copie impossible";
      if (feedback) feedback.textContent = `Copiez manuellement l’adresse ${address}.`;
    }

    window.setTimeout(() => {
      button.textContent = "Copier l’adresse";
    }, 1800);
  });
});

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