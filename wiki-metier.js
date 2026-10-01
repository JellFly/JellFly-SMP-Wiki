const jobs = {
  mineur: {
    title: "Mineur",
    intro: "Exploitez les minerais, cuisez vos ressources et développez votre métier grâce à l'exploration du monde.",
    sections: [
      {
        title: "Niveau",
        intro: "Pour monter en niveaux en métiers de Mineur plusieurs options s'offre à vous selon votre niveau",
        groups: [
          { title: "Niveau 1", items: "Minerai de cuivre — 5.0 XP|Minerai de cuivre (Deepslate) — 5.0 XP|Minerai de charbon — 4.0 XP|Minerai de charbon (Deepslate) — 4.0 XP|Granite — 3.0 XP|Diorite — 3.0 XP|Andésite — 3.0 XP|Tuff — 3.0 XP|Calcite — 3.0 XP|Deepslate — 1.0 XP|Pierre (STONE) — 0.5 XP" },
          { title: "Niveau 2", items: "Minerai d'or — 15.0 XP|Minerai d'or (Deepslate) — 15.0 XP|Minerai de fer — 10.0 XP|Minerai de fer (Deepslate) — 10.0 XP" },
          { title: "Niveau 3", items: "Minerai de redstone — 15.0 XP|Minerai de redstone (Deepslate) — 15.0 XP|Minerai de lapis — 15.0 XP|Minerai de lapis (Deepslate) — 15.0 XP" },
          { title: "Niveau 4", items: "Minerai de diamant — 25.0 XP|Minerai de diamant (Deepslate) — 25.0 XP" },
          { title: "Niveau 5", items: "Débris antiques — 500.0 XP|Blackstone — 1.0 XP|Obsidienne — 0.5 XP|Basalte — 0.5 XP|Minerai d'or du Nether — 0.3 XP|Minerai de quartz du Nether — 0.2 XP|Netherrack — 0.1 XP" },
          { title: "Niveau 6", items: "Minerai d'émeraude — 50.0 XP|Minerai d'émeraude (Deepslate) — 50.0 XP" },
          { title: "Niveau 10", items: "End Stone — 0.5 XP" },
          { title: "Cuisson", groups: [
            { title: "Niveau 1", items: "Lingot de cuivre — 5.0 XP" },
            { title: "Niveau 2", items: "Lingot de fer — 10.0 XP" },
            { title: "Niveau 3", items: "Lingot d'or — 15.0 XP" },
            { title: "Niveau 5", items: "Éclat de netherite — 50.0 XP" }
          ] }
        ]
      },
      {
        title: "Argent",
        intro: "Lorsque vous atteignez le niveau 20 vous débloquerez une nouvelle fonctionnalité qui vous permet de gagner de l'argent lorsque vous minez certains blocs",
        groups: [
          { title: "Minerais précieux", items: "Débris antiques — $15.00|Minerai de diamant — $10.00|Minerai d'émeraude — $6.00|Minerai d'émeraude (Deepslate) — $1000.00|Minerai de lapis — $3.00|Éclat de netherite — $3.00|Minerai de redstone — $2.00" },
          { title: "Minerais communs", items: "Minerai d'or — $1.20|Minerai de fer — $1.00|Minerai de cuivre — $0.70|Minerai d'or du Nether — $0.70|Minerai de charbon — $0.50|Minerai de quartz du Nether — $0.50" },
          { title: "Blocs et pierres", items: "Blackstone — $0.30|Basalte — $0.30|End Stone — $0.20|Granite — $0.20|Diorite — $0.20|Andésite — $0.20|Tuff — $0.20|Calcite — $0.20|Deepslate — $0.10|Pierre (Stone) — $0.10|Obsidienne — $0.10|Netherrack — $0.01" }
        ]
      }
    ]
  },
  bucheron: {
    title: "Bucheron",
    intro: "Coupez les différents types de bois pour gagner de l'expérience et débloquer de nouvelles récompenses.",
    sections: [
      {
        title: "Niveau",
        intro: "Pour monter en niveau plusieurs option s'offre à vous selon votre niveau",
        groups: [
          { title: "En cassant du bois", groups: [
            { title: "Niveau 1", items: "Chêne (Log) — 11.0 XP|Bouleau (Log) — 11.0 XP|Jungle (Log) — 11.0 XP|Acacia (Log) — 11.0 XP|Chêne noir (Log) — 11.0 XP|Chêne (Wood) — 11.0 XP|Sapin (Wood) — 11.0 XP|Bouleau (Wood) — 11.0 XP|Jungle (Wood) — 11.0 XP|Acacia (Wood) — 11.0 XP" },
            { title: "Niveau 2", items: "Mangrove (Log) — 14.0 XP|Chêne pâle (Log) — 14.0 XP|Mangrove (Wood) — 14.0 XP|Cerisier (Wood) — 14.0 XP|Chêne noir (Wood) — 11.0 XP" },
            { title: "Niveau 3", items: "Cerisier (Log) — 14.0 XP|Crimson (Stem) — 14.0 XP|Warped (Stem) — 14.0 XP|Chêne pâle (Wood) — 14.0 XP|Crimson (Hyphae) — 14.0 XP|Warped (Hyphae) — 14.0 XP" }
          ] }
        ]
      },
      {
        title: "Argent",
        intro: "Lorsque vous atteignez le niveau 15 vous commencer à gagner de l'argent lorsque vous cassez certain bloc",
        groups: [
          { title: "Bois standards", items: "Mangrove (Log) — $9.00|Chêne (Log) — $0.50|Sapin (Log) — $0.50|Bouleau (Log) — $0.50|Jungle (Log) — $0.50|Acacia (Log) — $0.50|Chêne noir (Log) — $0.50|Chêne pâle (Log) — $0.50|Cerisier (Log) — $0.50|Chêne (Wood) — $0.50|Sapin (Wood) — $0.50|Bouleau (Wood) — $0.50|Jungle (Wood) — $0.50|Acacia (Wood) — $0.50|Chêne noir (Wood) — $0.50|Mangrove (Wood) — $0.50|Cerisier (Wood) — $0.50|Chêne pâle (Wood) — $0.50" },
          { title: "Bois du Nether", items: "Crimson (Stem) — $0.50|Warped (Stem) — $0.50|Crimson (Hyphae) — $0.50|Warped (Hyphae) — $0.50" }
        ]
      }
    ]
  },
  fermier: {
    title: "Fermier",
    intro: "Le métier de fermier est surment celui avec le plus grand nombre de taches. Entre récolter ses champs, apprivoiser des animaux et les reproduires il est toujours occupé.",
    sections: [
      {
        title: "XP",
        intro: "Pour monter de niveau dans ce métiers plusieurs option s'offre à vous selon votre niveau:",
        groups: [
          { title: "Récolte", groups: [
            { title: "Niveau 1", items: "Blé — 5.0 XP|Carottes — 5.0 XP" },
            { title: "Niveau 2", items: "Pommes de terre — 5.0 XP|Betteraves — 5.0 XP" },
            { title: "Niveau 3", items: "Verrue du Nether — 25.0 XP" },
            { title: "Niveau 4", items: "Cacao — 20.0 XP" },
            { title: "Niveau 5", items: "Baies sucrées (buisson) — 10.0 XP|Fleur-torche (pousse) — 17.0 XP|Pitcher (pousse) — 17.0 XP" }
          ] },
          { title: "Apprivoiser", groups: [
            { title: "Niveau 10", items: "Lama de marchand — 35.0 XP|Cheval — 15.0 XP|Âne — 15.0 XP|Mule — 15.0 XP|Lama — 15.0 XP|Loup — 10.0 XP|Chat — 10.0 XP|Perroquet — 10.0 XP|Chameau — 10.0 XP" }
          ] },
          { title: "Reproduire", items: "Renifleur (Sniffer) — 40.0 XP|Lama de marchand — 40.0 XP|Champimeuh (Mooshroom) — 35.0 XP|Tortue — 35.0 XP|Chameau — 30.0 XP|Lama — 30.0 XP|Panda — 30.0 XP|Cheval — 25.0 XP|Âne — 25.0 XP|Renard — 25.0 XP|Mule — 24.0 XP|Mouton — 20.0 XP|Cochon — 20.0 XP|Poulet — 20.0 XP|Lapin — 20.0 XP|Chèvre — 20.0 XP|Loup — 20.0 XP|Chat — 20.0 XP|Ocelot — 20.0 XP|Abeille — 20.0 XP|Strider — 20.0 XP|Vache — 20.0 XP" }
        ]
      },
      {
        title: "Argent",
        intro: "Lorsque vous atteignez le niveau 20 vous débloquez l'option de gagner de l'argent en effectuant certaine action",
        groups: [
          { title: "Récolte", items: "Pitcher (crop) — $1.00|Fleur-torche (crop) — $1.00|Betteraves — $0.30|Blé — $0.20|Carottes — $0.20|Pommes de terre — $0.20|Verrue du Nether — $0.50|Cacao — $0.50|Baies sucrées — $0.50" },
          { title: "Reproduire", items: "Lama de marchand — $2.00|Champimeuh (Mooshroom) — $1.00|Chameau — $1.00|Lama — $1.00|Cheval — $1.00|Âne — $1.00|Mule — $1.00|Chèvre — $1.00|Renifleur (Sniffer) — $0.50|Tortue — $0.50|Panda — $0.50|Renard — $0.50|Vache — $0.50|Mouton — $0.50|Cochon — $0.50|Poulet — $0.50|Lapin — $0.50|Loup — $0.50|Chat — $0.50|Ocelot — $0.50|Abeille — $0.50|Strider — $0.50" }
        ]
      }
    ]
  },
  chasseur: {
    title: "Chasseur",
    intro: "Entre la pêche, la chasse et la cuisson",
    sections: [
      {
        title: "Niveau",
        intro: "Plusieurs option s'offre à vous pour monter de niveau dans ce métier.",
        groups: [
          { title: "Pêche", groups: [
            { title: "Niveau 1", items: "Morue — 8.0 XP|Saumon — 8.0 XP|Poisson tropical — 8.0 XP|Poisson-globe — 8.0 XP" }
          ] },
          { title: "Combat", groups: [
            { title: "Niveau 1", items: "Zombie — 10.0 XP|Husk — 10.0 XP|Squelette — 10.0 XP|Araignée — 10.0 XP|Creeper — 10.0 XP|Slime — 10.0 XP|Villageois zombifié — 10.0 XP|Silverfish — 8.0 XP|Vache — 4.0 XP|Champimeuh — 4.0 XP|Cochon — 4.0 XP|Mouton — 4.0 XP|Poulet — 4.0 XP|Lapin — 4.0 XP|Cheval — 5.0 XP|Âne — 5.0 XP|Mule — 5.0 XP|Chat — 5.0 XP|Ocelot — 5.0 XP|Perroquet — 5.0 XP|Tortue — 5.0 XP|Calmar — 5.0 XP|Calmar brillant — 5.0 XP|Chauve-souris — 5.0 XP|Villageois — 5.0 XP|Marchand ambulant — 5.0 XP|Golem de neige — 5.0 XP|Renard — 8.0 XP|Abeille — 8.0 XP|Chèvre — 8.0 XP|Axolotl — 8.0 XP|Allay — 8.0 XP|Renifleur — 8.0 XP|Têtard — 5.0 XP|Grenouille — 5.0 XP|Cheval squelette — 5.0 XP|Cheval zombie — 5.0 XP" },
            { title: "Niveau 2", items: "Noyé — 10.0 XP|Stray — 10.0 XP|Araignée des cavernes — 10.0 XP|Pillager — 10.0 XP|Bogged — 10.0 XP|Lama — 5.0 XP|Lama de marchand — 5.0 XP|Loup — 5.0 XP|Panda — 8.0 XP|Dauphin — 8.0 XP|Armadillo — 8.0 XP|Chameau — 8.0 XP|Ours polaire — 8.0 XP" },
            { title: "Niveau 3", items: "Enderman — 10.0 XP|Sorcière — 10.0 XP|Phantom — 10.0 XP|Vindicator — 10.0 XP|Vex — 10.0 XP|Endermite — 8.0 XP|Golem de fer — 15.0 XP|Strider — 8.0 XP" },
            { title: "Niveau 4", items: "Cube de magma — 10.0 XP|Hoglin — 10.0 XP|Gardien — 10.0 XP|Piglin — 10.0 XP|Piglin zombifié — 10.0 XP" },
            { title: "Niveau 5", items: "Blaze — 10.0 XP|Ghast — 10.0 XP|Zoglin — 10.0 XP" },
            { title: "Niveau 6", items: "Squelette Wither — 10.0 XP|Shulker — 10.0 XP" },
            { title: "Niveau 8", items: "Evoker — 24.0 XP|Ravager — 24.0 XP|Piglin Brute — 24.0 XP|Elder Guardian — 24.0 XP|Illusioner — 24.0 XP" },
            { title: "Niveau 10", items: "Breeze — 24.0 XP|Creaking — 24.0 XP" },
            { title: "Niveau 15", items: "Ender Dragon — 500.0 XP" },
            { title: "Niveau 18", items: "Wither — 250.0 XP" },
            { title: "Niveau 20", items: "Warden — 1000.0 XP" }
          ] },
          { title: "Cuire", groups: [
            { title: "Niveau 1:", items: "Bœuf — 8.0 XP|Porc — 8.0 XP|Poulet — 8.0 XP|Mouton cuits — 8.0 XP|Morue — 6.0 XP|Saumon cuits — 6.0 XP|Lapin cuit — 6.0 XP" }
          ] }
        ]
      },
      {
        title: "Argent",
        intro: "Lorsque vous atteignez le niveau 20 vous débloquez une fonctionnalitée qui vous donne de l'argent selon certaines actions",
        groups: [
          { title: "Pêche", items: "Morue — $0.30|Saumon — $0.30|Poisson tropical — $0.30|Poisson-globe — $0.30" },
          { title: "Combat", items: "Warden — $100.00|Ender Dragon — $12.00|Wither — $10.00|Evoker — $2.00|Ravager — $2.00|Piglin Brute — $2.00|Elder Guardian — $2.00|Illusioner — $2.00|Breeze — $2.00|Creaking — $2.00|Golem de fer — $0.60|Zombie — $0.50|Husk — $0.50|Squelette — $0.50|Araignée — $0.50|Creeper — $0.50|Slime — $0.50|Villageois zombifié — $0.50|Noyé — $0.50|Stray — $0.50|Araignée des cavernes — $0.50|Pillager — $0.50|Bogged — $0.50|Enderman — $0.50|Sorcière — $0.50|Phantom — $0.50|Vindicator — $0.50|Vex — $0.50|Cube de magma — $0.50|Hoglin — $0.50|Gardien — $0.50|Piglin — $0.50|Piglin zombifié — $0.50|Blaze — $0.50|Ghast — $0.50|Zoglin — $0.50|Squelette Wither — $0.50|Shulker — $0.50|Renard — $0.25|Abeille — $0.25|Chèvre — $0.25|Axolotl — $0.25|Allay — $0.25|Renifleur — $0.25|Panda — $0.25|Dauphin — $0.25|Armadillo — $0.25|Chameau — $0.25|Ours polaire — $0.25|Strider — $0.25|Silverfish — $0.30|Endermite — $0.30|Cheval — $0.15|Âne — $0.15|Mule — $0.15|Chat — $0.15|Ocelot — $0.15|Perroquet — $0.15|Tortue — $0.15|Calmar — $0.15|Calmar brillant — $0.15|Chauve-souris — $0.15|Lama — $0.15|Lama de marchand — $0.15|Loup — $0.15|Têtard — $0.15|Grenouille — $0.15|Cheval squelette — $0.15|Cheval zombie — $0.15|Villageois — $0.10|Marchand ambulant — $0.10|Golem de neige — $0.10|Vache — $0.10|Champimeuh — $0.10|Cochon — $0.10|Mouton — $0.10|Poulet — $0.10|Lapin — $0.10" },
          { title: "Cuisson", items: "Bœuf cuit — $0.30|Porc cuit — $0.30|Poulet cuit — $0.30|Mouton cuit — $0.30|Lapin cuit — $0.20|Morue cuite — $0.20|Saumon cuit — $0.20" }
        ]
      }
    ]
  },
  sorcier: {
    title: "Sorcier",
    intro: "Préparez des potions et enchantez vos équipements pour progresser dans les niveaux du métier.",
    sections: [
      {
        title: "Niveau",
        groups: [
          { title: "Potion", groups: [
            { title: "Niveau 1", items: "Eau — 4.0 XP — $0.05|Basique, Épaisse, Étrange — 8.0 X" },
            { title: "Niveau 2", items: "Bond, Rapidité, Faiblesse — 9.0 XP" },
            { title: "Niveau 3", items: "Vision nocturne, Lenteur, Respiration aquatique, Poison — 9.0 XP" },
            { title: "Niveau 4", items: "Résistance au feu, Force — 9.0 / 13.0 XP|Soin, Nuisance — 13.0 XP" },
            { title: "Niveau 5", items: "Invisibilité, Régénération — 13.0 XP" },
            { title: "Niveau 6", items: "Chute lente — 15.0 XP" },
            { title: "Niveau 7", items: "Chance — 15.0 XP" },
            { title: "Niveau 8", items: "Maître tortue — 15.0 XP" },
            { title: "Niveau 9", items: "Charge de vent, Tissage, Suintement, Infestation — 15.0 XP" }
          ] },
          { title: "Enchatements", groups: [
            { title: "Niveau 1", items: "Outils en bois — 10.0 XP|Outils en pierre — 10.0 XP|Cisailles — 10.0 XP|Armure en cuir — 10.0 XP|Livre — 8.0 XP" },
            { title: "Niveau 2", items: "Canne à pêche — 10.0 XP|Bouclier — 10.0 XP|Armure en cotte de mailles — 10.0 XP" },
            { title: "Niveau 3", items: "Outils en fer — 10.0 XP|Outils en or — 10.0 XP — $0.15|Arc, Arbalète, Trident — 10.0 XP — $0.15|Armure en fer — 10.0 XP — $0.15|Armure en or — 10.0 XP — $0.15" },
            { title: "Niveau 4", items: "Livre enchanté — 8.0 XP — $0.05" },
            { title: "Niveau 6", items: "Outils en diamant — 13.0 XP — $0.25|Armure en diamant — 13.0 XP — $0.25" },
            { title: "Niveau 10", items: "Outils en netherite — 13.0 XP — $0.30|Armure en netherite — 13.0 XP — $0.30" }
          ] }
        ]
      },
      {
        title: "Argent",
        groups: [
          { title: "Potion", items: "Chance, Maître tortue, Chute lente, Charge de vent, Tissage, Suintement, Infestation — $0.60|Invisibilité, Soin, Nuisance, Régénération, Force — $0.40|Vision nocturne, Bond, Résistance au feu, Rapidité, Lenteur, Respiration aquatique, Poison, Faiblesse — $0.30|Basique, Épaisse, Étrange — $0.20|Eau — $0.05" },
          { title: "Enchantement", items: "Outils en netherite — $0.30|Armure en netherite — $0.30|Outils en diamant — $0.25|Armure en diamant — $0.25|Outils en fer — $0.15|Outils en or — $0.15|Arc — $0.15|Arbalète — $0.15|Trident — $0.15|Canne à pêche — $0.15|Armure en fer — $0.15|Armure en or — $0.15|Outils en bois — $0.10|Outils en pierre — $0.10|Cisailles, Bouclier — $0.10|Armure en cuir — $0.10|Armure en cotte de mailles — $0.10|Livre — $0.10|Livre enchanté — $0.05" }
        ]
      }
    ]
  }
};

const content = document.querySelector("#job-content");
const jobKey = new URLSearchParams(window.location.search).get("metier");
const job = jobs[jobKey];
window.jellflyWikiJobs = jobs;

function appendText(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.append(element);
}

function renderGroups(parent, groups, depth = 3) {
  for (const group of groups) {
    appendText(parent, depth > 3 ? "h4" : "h3", group.title);
    if (group.items) {
      const list = document.createElement("ul");
      list.className = "simple-list";
      for (const item of group.items.split("|")) appendText(list, "li", item);
      parent.append(list);
    }
    if (group.groups) renderGroups(parent, group.groups, depth + 1);
  }
}

if (content && job) {
  document.title = `JellFlySMP - Wiki - ${job.title}`;
  document.querySelector("#job-title").textContent = job.title;
  if (job.intro) appendText(content, "p", job.intro);

  for (const section of job.sections) {
    appendText(content, "h2", section.title);
    if (section.intro) appendText(content, "p", section.intro);
    renderGroups(content, section.groups);
  }
} else if (content) {
  document.querySelector("#job-title").textContent = "Métier introuvable";
  appendText(content, "p", "Choisissez un métier dans la liste.");
  const link = document.createElement("a");
  link.href = "wiki-metiers.html";
  link.textContent = "Retour aux métiers";
  content.append(link);
}
