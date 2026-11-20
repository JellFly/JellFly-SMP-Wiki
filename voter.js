const voteApiBase = "https://vote-proxy.jellflypro.workers.dev/";
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#minecraft-username");
const confirmUsernameButton = document.querySelector("#confirm-username");
const usernameFeedback = document.querySelector("#username-feedback");
const platformList = document.querySelector("#platform-list");
const voteTotal = document.querySelector("#vote-total");
const leaderboardList = document.querySelector("#leaderboard-list");
const countdownTimers = new Map();
const automaticVerificationTimers = new Map();
let usernameConfirmed = false;

const voteSites = [
  {
    id: "serveur-prive",
    name: "Serveur Privé",
    voteUrl: "https://serveur-prive.net/minecraft/jellflysmp/vote/{username}",
    statusPath: "/api/vote/status"
  },
  {
    id: "topserveur",
    name: "TopServeur",
    voteUrl: "https://top-serveurs.net/minecraft/vote/jellfly-smp?pseudo={username}",
    statusPath: "/api/vote/status?platform=topserveur"
  },
  {
    id: "serveurs-minecraft",
    name: "ServeursMinecraft.com",
    voteUrl: "https://serveur-minecraft.com/5921?pseudo={username}",
    statusPath: "/api/vote/status?platform=serveurs-minecraft"
  }
];

function getUsername() {
  return usernameInput.value.trim();
}

function isValidUsername(username) {
  return /^[A-Za-z0-9_]{3,16}$/.test(username);
}

function updatePlatformButtons() {
  const enabled = usernameConfirmed && isValidUsername(getUsername());
  platformList.querySelectorAll("button").forEach((button) => {
    button.disabled = !enabled;
  });
}

function setUsernameFeedback(message, state = "") {
  usernameFeedback.className = `username-feedback${state ? ` ${state}` : ""}`;
  usernameFeedback.textContent = message;
}

function parseVoteDate(value) {
  const numericValue = Number(value);
  const date = Number.isFinite(numericValue)
    ? new Date(numericValue < 100000000000 ? numericValue * 1000 : numericValue)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function makeVoteLink(site, voteUrl = site.voteUrl) {
  const link = document.createElement("a");
  const personalizedUrl = voteUrl.replaceAll("{username}", encodeURIComponent(getUsername()));
  link.className = "vote-link";
  link.href = personalizedUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `Voter sur ${site.name}`;
  return link;
}

function formatRemainingTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours} h ${minutes} min ${seconds} s`;
}

function startCountdown(site, card, nextVoteAt) {
  const countdown = card.querySelector(".platform-countdown");
  const nextVoteDate = parseVoteDate(nextVoteAt);
  if (!nextVoteDate) return;
  const endTime = nextVoteDate.getTime();

  clearInterval(countdownTimers.get(site.id));
  const update = () => {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      countdown.textContent = "Vous pouvez revoter maintenant.";
      card.querySelector(".platform-status").textContent = "Votre vote est à nouveau disponible.";
      card.querySelector(".platform-status").classList.replace("success", "warning");
      clearInterval(countdownTimers.get(site.id));
      countdownTimers.delete(site.id);
      card.querySelector(".vote-link")?.remove();
      card.append(makeVoteLink(site));
      return;
    }
    countdown.textContent = `Prochain vote dans ${formatRemainingTime(remaining)}.`;
  };

  update();
  countdownTimers.set(site.id, setInterval(update, 1000));
}

function makePlatformCard(site) {
  const card = document.createElement("article");
  card.className = "vote-platform-card";
  card.dataset.siteId = site.id;

  const title = document.createElement("h4");
  title.textContent = site.name;
  const description = document.createElement("p");
  description.textContent = "Vérifiez si votre prochain vote est disponible.";

  const button = document.createElement("button");
  button.type = "button";
  button.disabled = true;
  button.textContent = "Vérifier mon vote";
  button.addEventListener("click", () => checkVoteStatus(site, card, button));

  const status = document.createElement("p");
  status.className = "platform-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const countdown = document.createElement("p");
  countdown.className = "platform-countdown";
  countdown.setAttribute("aria-live", "polite");

  card.append(title, description, button, status, countdown);
  return card;
}

async function checkVoteStatus(site, card, button) {
  if (!usernameConfirmed || !isValidUsername(getUsername())) {
    setUsernameFeedback("Confirmez d’abord un pseudo Minecraft valide.", "error");
    usernameInput.focus();
    return;
  }

  const status = card.querySelector(".platform-status");
  const countdown = card.querySelector(".platform-countdown");
  clearTimeout(automaticVerificationTimers.get(site.id));
  automaticVerificationTimers.delete(site.id);
  button.disabled = true;
  button.textContent = "Vérification…";
  status.className = "platform-status";
  status.textContent = "";
  countdown.textContent = "";
  card.querySelector(".vote-link")?.remove();
  clearInterval(countdownTimers.get(site.id));
  countdownTimers.delete(site.id);

  try {
    const url = new URL(site.statusPath, voteApiBase);
    url.searchParams.set("username", getUsername());
    url.searchParams.set("playername", getUsername());
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const voteUrl = data.voteUrl || data.vote_url || site.voteUrl;
    if (data.hasVoted === true || data.voted === true) {
      const votedAt = data.votedAt ? parseVoteDate(data.votedAt) : null;
      const dateText = votedAt
        ? ` enregistré le ${votedAt.toLocaleDateString("fr-FR")}`
        : "";
      status.className = "platform-status success";
      status.textContent = `Vous avez déjà voté${dateText}.`;

      const nextVoteAt = data.nextVoteAt || (Number(data.nextVoteSeconds) > 0
        ? new Date(Date.now() + Number(data.nextVoteSeconds) * 1000).toISOString()
        : null);
      if (nextVoteAt) startCountdown(site, card, nextVoteAt);
    } else {
      status.className = "platform-status warning";
      status.textContent = "Votre vote est disponible.";
      card.append(makeVoteLink(site, voteUrl));
    }
  } catch {
    status.className = "platform-status error";
    status.textContent = "Vérification indisponible. Vous pouvez tout de même accéder au vote.";
    card.append(makeVoteLink(site));
  } finally {
    button.disabled = false;
    button.textContent = "Vérifier mon vote";
  }
}

platformList.addEventListener("click", (event) => {
  const voteLink = event.target.closest(".vote-link");
  if (!voteLink) return;

  const card = voteLink.closest(".vote-platform-card");
  const site = voteSites.find((candidate) => candidate.id === card?.dataset.siteId);
  if (!card || !site) return;

  clearTimeout(automaticVerificationTimers.get(site.id));
  const usernameAtVote = getUsername();
  const countdown = card.querySelector(".platform-countdown");
  countdown.textContent = "Vérification automatique dans 15 secondes…";
  automaticVerificationTimers.set(site.id, setTimeout(() => {
    automaticVerificationTimers.delete(site.id);
    if (!usernameConfirmed || getUsername() !== usernameAtVote) {
      countdown.textContent = "Confirmez à nouveau votre pseudo pour vérifier le vote.";
      return;
    }
    checkVoteStatus(site, card, card.querySelector("button"));
  }, 15000));
});

function renderPlatforms() {
  platformList.replaceChildren(...voteSites.map(makePlatformCard));
}

function renderLeaderboard(data) {
  const count = Number(data.voteCount);
  voteTotal.textContent = Number.isFinite(count) ? count.toLocaleString("fr-FR") : "—";
  leaderboardList.replaceChildren();

  const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
  if (leaderboard.length === 0) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "Aucun classement disponible pour le moment.";
    leaderboardList.append(empty);
    return;
  }

  for (const [index, entry] of leaderboard.entries()) {
    const row = document.createElement("li");
    const rank = document.createElement("span");
    rank.textContent = `#${entry.position || index + 1}`;
    const username = document.createElement("strong");
    username.textContent = entry.username;
    const votes = document.createElement("em");
    const voteCount = Number(entry.votes) || 0;
    votes.textContent = `${voteCount} vote${voteCount > 1 ? "s" : ""}`;
    row.append(rank, username, votes);
    leaderboardList.append(row);
  }
}

async function loadVoteStats() {
  try {
    const response = await fetch(new URL("/api/vote/stats", voteApiBase), {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderLeaderboard(await response.json());
  } catch {
    voteTotal.textContent = "—";
    leaderboardList.replaceChildren();
    const unavailable = document.createElement("li");
    unavailable.className = "leaderboard-empty";
    unavailable.textContent = "Compteur et classement indisponibles pour le moment.";
    leaderboardList.append(unavailable);
  }
}

usernameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = getUsername();
  if (!isValidUsername(username)) {
    usernameConfirmed = false;
    confirmUsernameButton.classList.remove("confirmed");
    setUsernameFeedback("Pseudo invalide : 3 à 16 lettres, chiffres ou _. ", "error");
    updatePlatformButtons();
    usernameInput.focus();
    return;
  }

  usernameConfirmed = true;
  confirmUsernameButton.classList.add("confirmed");
  setUsernameFeedback(`Pseudo confirmé : ${username}`, "success");
  updatePlatformButtons();
});

usernameInput.addEventListener("input", () => {
  usernameConfirmed = false;
  confirmUsernameButton.classList.remove("confirmed");
  setUsernameFeedback("", "");
  updatePlatformButtons();
});

renderPlatforms();
loadVoteStats();
