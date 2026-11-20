const statusPanel = document.querySelector(".server-status");

if (statusPanel) {
  const statusUrl = "https://api.mcsrvstat.us/3/smp.jellfly.win";

  function renderStatus(state, data) {
    const item = statusPanel.querySelector("[data-server-status]");
    const message = item.querySelector("[data-status-message]");
    const playerCount = item.querySelector("[data-player-count]");

    item.classList.remove("is-online", "is-offline", "is-unavailable");
    item.classList.add(state);
    playerCount.textContent = "";

    if (state === "is-unavailable") {
      message.textContent = "Vérification indisponible";
      return;
    }

    if (!data.online) {
      message.textContent = "Hors ligne ou non détecté";
      return;
    }

    message.textContent = "En ligne";
    if (data.players && Number.isFinite(data.players.online) && Number.isFinite(data.players.max)) {
      playerCount.textContent = `${data.players.online}/${data.players.max} joueurs`;
    }
  }

  async function updateServerStatus() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(statusUrl, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (typeof data.online !== "boolean") {
        throw new Error("La réponse du service de statut est invalide.");
      }

      renderStatus(data.online ? "is-online" : "is-offline", data);
    } catch (error) {
      console.error("Impossible de vérifier le statut du serveur :", error);
      renderStatus("is-unavailable", null);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function refreshServerStatus() {
    statusPanel.setAttribute("aria-busy", "true");
    await updateServerStatus();
    statusPanel.setAttribute("aria-busy", "false");
  }

  refreshServerStatus();
  window.setInterval(refreshServerStatus, 5 * 60 * 1000);
}
