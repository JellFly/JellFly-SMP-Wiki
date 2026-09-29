const searchButton = document.querySelector(".wiki-page .search-button");
const wikiHeader = document.querySelector(".wiki-page .topbar");

if (searchButton && wikiHeader) {
  const panel = document.createElement("section");
  panel.className = "wiki-search-panel";
  panel.id = "wiki-search-panel";
  panel.setAttribute("role", "search");
  panel.setAttribute("aria-label", "Recherche dans le Wiki");
  panel.hidden = true;

  const field = document.createElement("input");
  field.className = "wiki-search-input";
  field.type = "search";
  field.placeholder = "Rechercher un métier, une commande...";
  field.setAttribute("aria-label", "Rechercher dans le Wiki");
  field.autocomplete = "off";

  const closeButton = document.createElement("button");
  closeButton.className = "wiki-search-close";
  closeButton.type = "button";
  closeButton.textContent = "Fermer";

  const resultList = document.createElement("ul");
  resultList.className = "wiki-search-results";
  resultList.setAttribute("aria-live", "polite");

  const panelHeader = document.createElement("div");
  panelHeader.className = "wiki-search-header";
  const panelTitle = document.createElement("strong");
  panelTitle.textContent = "Recherche dans le Wiki";
  panelHeader.append(panelTitle, closeButton);
  panel.append(panelHeader, field, resultList);
  wikiHeader.insertAdjacentElement("afterend", panel);

  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");

  const commandSections = [
    {
      title: "Commandes principales",
      href: "wiki-commandes.html#commandes-generales",
      text: "/rules Consulter les règles du serveur | /spawn Se téléporter au spawn, une fois par 5 min | /rtp Se téléporter aléatoirement dans l'overworld à au moins 10 000 blocs, une fois par 15 min | /jobstats Afficher les stats des métiers"
    },
    {
      title: "TPA",
      href: "wiki-commandes.html#tpa",
      text: "/tpa {joueur} Envoyer une demande de téléportation à un joueur | /tpahere {joueur} Envoyer une demande de téléportation à vous à un joueur"
    },
    {
      title: "Argent",
      href: "wiki-commandes.html#argent",
      text: "/money Consulter le solde | /money send player amount | /pay player amount Envoyer de l'argent | /money top | /moneytop Consulter le classement d'argent"
    },
    {
      title: "Shop (Admin Shop)",
      href: "wiki-commandes.html#shop",
      text: "/shop Ouvrir les shops | /shop shop Ouvrir un shop spécifique | /shop shop category Ouvrir une catégorie"
    },
    {
      title: "Hôtel des ventes",
      href: "wiki-commandes.html#hotel-des-ventes",
      text: "/ah Ouvrir l'hôtel des ventes | /ah sell price Vendre un item"
    },
    {
      title: "Trade (Échanges)",
      href: "wiki-commandes.html#trade",
      text: "/trade player Envoyer une demande d'échange à moins de 10 blocs | /trade accept player Accepter une demande d'échange"
    },
    {
      title: "Home",
      href: "wiki-commandes.html#home",
      text: "/home Ouvrir le menu des homes | /home home Téléportation | /sethome Créer un home | /delhome Supprimer un home | /buyhome Acheter un home"
    },
    {
      title: "Playtime (temps de jeu)",
      href: "wiki-commandes.html#playtime",
      text: "/playtime Voir les informations du temps de jeu | /playtime top Classement des joueurs actifs"
    }
  ];

  const jobEntries = Object.entries(window.jellflyWikiJobs ?? {}).map(([key, job]) => {
    const text = [];
    const collectGroups = (groups = []) => {
      for (const group of groups) {
        text.push(group.title);
        if (group.items) text.push(...group.items.split("|"));
        if (group.groups) collectGroups(group.groups);
      }
    };

    text.push(job.title, job.intro ?? "");
    for (const section of job.sections) {
      text.push(section.title, section.intro ?? "");
      collectGroups(section.groups);
    }

    return {
      title: job.title,
      category: "Métier",
      href: `wiki-metier-detail.html?metier=${key}`,
      text: text.join(" ")
    };
  });

  const entries = [
    { title: "Métiers", category: "Rubrique", href: "wiki-metiers.html", text: "Mineur Bucheron Fermier Chasseur Sorcier" },
    { title: "Commandes", category: "Rubrique", href: "wiki-commandes.html", text: "commandes serveur" },
    { title: "Factions", category: "Rubrique", href: "wiki-factions.html", text: "à venir bientôt" },
    ...commandSections.map((section) => ({ ...section, category: "Commande" })),
    ...jobEntries
  ];

  function renderResults(query) {
    resultList.replaceChildren();
    const normalizedQuery = normalize(query.trim());

    if (!normalizedQuery) {
      const prompt = document.createElement("li");
      prompt.className = "wiki-search-message";
      prompt.textContent = "Saisissez un métier, une ressource ou une commande.";
      resultList.append(prompt);
      return;
    }

    const matches = entries.filter((entry) => normalize(`${entry.title} ${entry.text}`).includes(normalizedQuery));

    if (matches.length === 0) {
      const empty = document.createElement("li");
      empty.className = "wiki-search-message";
      empty.textContent = "Aucun résultat dans le Wiki.";
      resultList.append(empty);
      return;
    }

    for (const entry of matches.slice(0, 12)) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = entry.href;

      const title = document.createElement("strong");
      title.textContent = entry.title;
      const category = document.createElement("span");
      category.textContent = entry.category;
      const description = document.createElement("small");
      const matchIndex = normalize(entry.text).indexOf(normalizedQuery);
      const startIndex = Math.max(0, matchIndex - 48);
      const endIndex = Math.min(entry.text.length, startIndex + 140);
      description.textContent = `${startIndex > 0 ? "..." : ""}${entry.text.slice(startIndex, endIndex).trim()}${endIndex < entry.text.length ? "..." : ""}`;

      link.append(title, category, description);
      item.append(link);
      resultList.append(item);
    }
  }

  function setSearchOpen(isOpen) {
    panel.hidden = !isOpen;
    searchButton.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) field.focus();
  }

  searchButton.setAttribute("aria-label", "Rechercher dans le Wiki");
  searchButton.setAttribute("aria-controls", panel.id);
  searchButton.setAttribute("aria-expanded", "false");
  searchButton.addEventListener("click", () => setSearchOpen(panel.hidden));
  closeButton.addEventListener("click", () => setSearchOpen(false));
  field.addEventListener("input", () => renderResults(field.value));
  resultList.addEventListener("click", (event) => {
    if (event.target.closest("a")) setSearchOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSearchOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !searchButton.contains(event.target)) {
      setSearchOpen(false);
    }
  });

  renderResults("");
}