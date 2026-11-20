const searchTrigger = document.querySelector(".search-button");

if (searchTrigger) {
  const searchPanel = document.createElement("section");
  searchPanel.id = "site-search-panel";
  searchPanel.className = "wiki-search-panel";
  searchPanel.hidden = true;
  searchPanel.setAttribute("role", "dialog");
  searchPanel.setAttribute("aria-labelledby", "wiki-search-title");
  searchPanel.innerHTML = `
    <div class="wiki-search-header">
      <strong id="wiki-search-title">Recherche sur tout le site</strong>
      <button class="wiki-search-close" type="button" aria-label="Fermer la recherche">Fermer</button>
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
    "wiki-commandes.html"
  ];
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const fuseScriptUrl = "https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.min.js";
  let loadingIndex = false;
  let indexStarted = false;
  let unavailablePages = 0;
  let jobIndexUnavailable = false;
  let fuzzySearch = null;
  let fuzzySearchUnavailable = false;

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
    const cleanTitle = title.trim() || cleanText;
    entries.push({
      title: cleanTitle,
      category,
      text: cleanText,
      href,
      searchOrder: entries.length,
      normalizedTitle: normalize(cleanTitle),
      normalizedContent: normalize(`${cleanTitle} ${category} ${cleanText}`)
    });
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
    if (!jobs || !anchorIds) return false;

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

    return true;
  }

  function findFuzzyMatches(terms) {
    if (!fuzzySearch || terms.some((term) => term.length < 2)) return [];

    const resultsByTerm = terms.map((term) => fuzzySearch.search(term));
    if (resultsByTerm.some((results) => results.length === 0)) return [];

    const scoreMaps = resultsByTerm.slice(1).map((results) =>
      new Map(results.map(({ item, score }) => [item, score]))
    );
    const matches = [];

    resultsByTerm[0].forEach(({ item, score }) => {
      const scores = [score];
      for (const scoreMap of scoreMaps) {
        const nextScore = scoreMap.get(item);
        if (nextScore === undefined) return;
        scores.push(nextScore);
      }

      matches.push({
        entry: item,
        order: item.searchOrder,
        score: scores.reduce((total, value) => total + value, 0) / scores.length
      });
    });

    return matches.sort((a, b) => a.score - b.score || a.order - b.order);
  }

  function renderResults() {
    const query = normalize(searchInput.value);
    resultsList.replaceChildren();
    if (!query) {
      showMessage(loadingIndex ? "Chargement de l’index du site…" : "Saisissez un mot-clé pour rechercher.");
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    const matches = [];
    entries.forEach((entry, order) => {
      if (!terms.every((term) => entry.normalizedContent.includes(term))) return;

      const score = entry.normalizedTitle === query
        ? 0
        : entry.normalizedTitle.startsWith(query)
          ? 1
          : entry.normalizedTitle.includes(query) ? 2 : 3;
      matches.push({ entry, order, score });
    });
    matches.sort((a, b) => a.score - b.score || a.order - b.order);
    if (!matches.length) matches.push(...findFuzzyMatches(terms));

    if (!matches.length) {
      const message = loadingIndex
        ? "Indexation en cours…"
        : fuzzySearchUnavailable
          ? "Aucun résultat trouvé. La recherche approximative est indisponible."
          : "Aucun résultat trouvé.";
      showMessage(message);
    } else {
      matches.slice(0, 12).forEach(({ entry }) => {
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
    if (jobIndexUnavailable) {
      showMessage("Les fiches métiers n’ont pas pu être indexées.");
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
    searchTrigger.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      startIndexing();
      searchInput.focus();
      renderResults();
    }
  }

  function loadJobData() {
    if (indexJobs()) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("wiki-metier.js", document.baseURI).href;
      script.onload = () => {
        if (indexJobs()) {
          resolve();
        } else {
          reject(new Error("Les données des métiers sont indisponibles."));
        }
      };
      script.onerror = () => reject(new Error("Impossible de charger les données des métiers."));
      document.head.append(script);
    });
  }

  function loadFuzzySearch() {
    if (typeof window.Fuse === "function") return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = fuseScriptUrl;
      const timeout = window.setTimeout(() => {
        script.remove();
        reject(new Error("Le chargement de Fuse.js a expiré."));
      }, 8000);
      script.onload = () => {
        window.clearTimeout(timeout);
        if (typeof window.Fuse === "function") {
          resolve();
        } else {
          reject(new Error("Fuse.js n’est pas disponible après son chargement."));
        }
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Impossible de charger Fuse.js."));
      };
      document.head.append(script);
    });
  }

  function startIndexing() {
    if (indexStarted) return;
    indexStarted = true;
    loadingIndex = true;

    const pageRequests = sitePages
      .filter((page) => page !== currentPage)
      .map(async (page) => {
        const response = await fetch(new URL(page, document.baseURI));
        if (!response.ok) throw new Error(`Impossible de charger ${page} (${response.status}).`);
        const html = await response.text();
        const parsedDocument = new DOMParser().parseFromString(html, "text/html");
        indexDocument(parsedDocument, page, false);
      });

    Promise.allSettled([loadJobData(), loadFuzzySearch(), ...pageRequests]).then(([jobResult, fuseResult, ...pageResults]) => {
      if (jobResult.status === "rejected") {
        jobIndexUnavailable = true;
        console.error("Impossible d’indexer les fiches métiers :", jobResult.reason);
      }
      if (fuseResult.status === "fulfilled" && typeof window.Fuse === "function") {
        fuzzySearch = new window.Fuse(entries, {
          includeScore: true,
          ignoreLocation: true,
          minMatchCharLength: 2,
          threshold: 0.35,
          keys: [
            { name: "normalizedTitle", weight: 0.7 },
            { name: "normalizedContent", weight: 0.3 }
          ]
        });
      } else {
        fuzzySearchUnavailable = true;
        const reason = fuseResult.status === "rejected"
          ? fuseResult.reason
          : new Error("Fuse.js n’est pas disponible.");
        console.error("La recherche approximative est indisponible :", reason);
      }
      unavailablePages = pageResults.filter((result) => result.status === "rejected").length;
      loadingIndex = false;
      renderResults();
    });
  }

  indexDocument(document, currentPage, true);
  if (window.location.hash) {
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        ?.scrollIntoView({ block: "start" });
    });
  }
  renderResults();

  searchTrigger.addEventListener("click", () => setOpen(searchPanel.hidden));
  closeButton.addEventListener("click", () => {
    setOpen(false);
    searchTrigger.focus();
  });
  searchInput.addEventListener("input", renderResults);
  resultsList.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !searchPanel.hidden) {
      setOpen(false);
      searchTrigger.focus();
    }
  });

}
