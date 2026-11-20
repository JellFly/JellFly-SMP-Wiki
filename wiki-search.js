const searchButton = document.querySelector(".search-button");

if (searchButton) {
  const searchPanel = document.createElement("section");
  searchPanel.className = "wiki-search-panel";
  searchPanel.hidden = true;
  searchPanel.setAttribute("role", "dialog");
  searchPanel.setAttribute("aria-label", "Recherche sur le site");
  searchPanel.innerHTML = `
    <div class="wiki-search-header">
      <strong>Recherche sur tout le site</strong>
      <button class="wiki-search-close" type="button">Fermer</button>
    </div>
    <label class="visually-hidden" for="wiki-search-input">Rechercher</label>
    <input class="wiki-search-input" id="wiki-search-input" type="search" placeholder="Rechercher dans toutes les pages…" autocomplete="off">
    <ul class="wiki-search-results" aria-live="polite"></ul>
  `;
  document.body.append(searchPanel);

  const searchInput = searchPanel.querySelector(".wiki-search-input");
  const resultsList = searchPanel.querySelector(".wiki-search-results");
  const closeButton = searchPanel.querySelector(".wiki-search-close");
  const entries = [];
  const sitePages = [
    "index.html",
    "voter.html",
    "reglement.html",
    "patch-notes.html",
    "wiki.html",
    "wiki-metiers.html",
    "wiki-commandes.html",
    "wiki-factions.html"
  ];
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  let loadingIndex = true;
  let unavailablePages = 0;

  function normalize(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("fr")
      .trim();
  }

  function slugify(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  }

  function addEntry(title, category, text, href) {
    const cleanText = text.replace(/\s+/g, " ").trim();
    if (!cleanText || !href) return;
    entries.push({ title: title.trim() || cleanText, category, text: cleanText, href });
  }

  function indexDocument(doc, page, shouldSetIds) {
    const main = doc.querySelector("main");
    if (!main) return;

    const pageTitle = doc.querySelector("h1")?.textContent.trim()
      || doc.title.replace(/^JellFly(?:SMP)?\s*-\s*/i, "").trim()
      || page;
    const elements = main.querySelectorAll("h1, h2, h3, h4");

    elements.forEach((element, index) => {
      const text = element.textContent.replace(/\s+/g, " ").trim();
      if (!text) return;

      let id = element.id;
      if (!id) {
        id = `search-${slugify(text) || "section"}-${index}`;
        if (shouldSetIds) element.id = id;
      }

      addEntry(text, pageTitle, text, `${page}#${encodeURIComponent(id)}`);
    });
  }

  function indexJobs() {
    const jobs = window.jellflyWikiJobs;
    const anchorIds = window.jellflyWikiAnchorIds;
    if (!jobs || !anchorIds) return;

    function indexGroups(jobKey, job, groups, sectionIndex, groupPath = []) {
      groups.forEach((group, groupIndex) => {
        const path = [...groupPath, groupIndex];
        const groupHref = `wiki-metier-detail.html?metier=${encodeURIComponent(jobKey)}#${anchorIds.group(jobKey, sectionIndex, path)}`;
        addEntry(`${job.title} — ${group.title}`, "Métiers", group.title, groupHref);

        if (group.groups) indexGroups(jobKey, job, group.groups, sectionIndex, path);
      });
    }

    Object.entries(jobs).forEach(([jobKey, job]) => {
      addEntry(job.title, "Métiers", job.title, `wiki-metier-detail.html?metier=${encodeURIComponent(jobKey)}#job-title`);
      job.sections.forEach((section, sectionIndex) => {
        const sectionHref = `wiki-metier-detail.html?metier=${encodeURIComponent(jobKey)}#${anchorIds.section(jobKey, sectionIndex)}`;
        addEntry(`${job.title} — ${section.title}`, "Métiers", section.title, sectionHref);
        indexGroups(jobKey, job, section.groups, sectionIndex);
      });
    });
  }

  function renderResults() {
    const query = normalize(searchInput.value);
    resultsList.replaceChildren();
    if (!query) {
      showMessage(loadingIndex ? "Chargement de l’index du site…" : "Saisissez un mot-clé pour rechercher.");
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    const matches = entries
      .map((entry, order) => {
        const title = normalize(entry.title);
        const content = normalize(`${entry.title} ${entry.category} ${entry.text}`);
        if (!terms.every((term) => content.includes(term))) return null;

        const score = title === query ? 0 : title.startsWith(query) ? 1 : title.includes(query) ? 2 : 3;
        return { ...entry, order, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score || a.order - b.order)
      .slice(0, 12);

    if (!matches.length) {
      showMessage(loadingIndex ? "Indexation en cours…" : "Aucun résultat trouvé.");
    } else {
      matches.forEach((entry) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        const title = document.createElement("strong");
        const category = document.createElement("span");
        const snippet = document.createElement("small");

        link.href = entry.href;
        title.textContent = entry.title;
        category.textContent = entry.category;
        snippet.textContent = entry.text.slice(0, 180);
        link.append(title, category, snippet);
        item.append(link);
        resultsList.append(item);
      });
    }

    if (unavailablePages) {
      showMessage(`${unavailablePages} page(s) n’ont pas pu être indexées.`);
    }
  }

  function showMessage(message) {
    const item = document.createElement("li");
    item.className = "wiki-search-message";
    item.textContent = message;
    resultsList.append(item);
  }

  function setOpen(isOpen) {
    searchPanel.hidden = !isOpen;
    if (isOpen) {
      searchInput.focus();
      renderResults();
    }
  }

  indexDocument(document, currentPage, true);
  indexJobs();
  if (window.location.hash) {
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        ?.scrollIntoView({ block: "start" });
    });
  }
  renderResults();

  searchButton.addEventListener("click", () => setOpen(searchPanel.hidden));
  closeButton.addEventListener("click", () => {
    setOpen(false);
    searchButton.focus();
  });
  searchInput.addEventListener("input", renderResults);
  resultsList.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !searchPanel.hidden) {
      setOpen(false);
      searchButton.focus();
    }
  });

  Promise.allSettled(
    sitePages
      .filter((page) => page !== currentPage)
      .map(async (page) => {
        const response = await fetch(new URL(page, document.baseURI));
        if (!response.ok) throw new Error(`Impossible de charger ${page} (${response.status}).`);
        const html = await response.text();
        const parsedDocument = new DOMParser().parseFromString(html, "text/html");
        indexDocument(parsedDocument, page, false);
      })
  ).then((results) => {
    unavailablePages = results.filter((result) => result.status === "rejected").length;
    loadingIndex = false;
    renderResults();
  });
}
