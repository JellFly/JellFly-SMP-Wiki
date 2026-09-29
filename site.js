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

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
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
      target.style.setProperty("--reveal-delay", `${Math.min(revealIndex * 35, 210)}ms`);
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