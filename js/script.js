const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDay = theme === "day";
  themeIcon.textContent = isDay ? "☾" : "☀";
  themeLabel.textContent = isDay ? "Modo noite" : "Modo dia";
  themeToggle.setAttribute("aria-label", isDay ? "Ativar modo noite" : "Ativar modo dia");
  themeMeta.setAttribute("content", isDay ? "#f4f6f8" : "#101010");
  try { localStorage.setItem("dia-ti-theme", theme); } catch (_) {}
}

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "night" ? "day" : "night");
});

try {
  const savedTheme = localStorage.getItem("dia-ti-theme");
  if (savedTheme === "day" || savedTheme === "night") applyTheme(savedTheme);
} catch (_) {}

// Data do evento no horário de Brasília (UTC-03:00).
const eventDate = new Date("2026-10-29T12:40:00-03:00").getTime();
const countdownTitle = document.getElementById("countdown-title");
const countdownTimer = document.getElementById("countdown-timer");

function updateCountdown() {
  const remaining = eventDate - Date.now();

  if (remaining <= 0) {
    countdownTitle.textContent = "O DIA DO TI JÁ COMEÇOU...";
    countdownTimer.hidden = true;
    return;
  }

  countdownTitle.textContent = "O DIA DO TI ESTÁ VINDO";
  countdownTimer.hidden = false;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  document.getElementById("countdown-days").textContent = String(days).padStart(2, "0");
  document.getElementById("countdown-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("countdown-minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("countdown-seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

function atualizarLider(cards) {
    const maiorPontuacao = Math.max(
        ...cards.map(item => item.score)
    );

    cards.forEach(item => {
        item.card.classList.toggle(
            "lider",
            item.score === maiorPontuacao &&
            Number.isFinite(item.score)
        );
    });
}
/* ANTIGO loadScores usando o PHP
async function loadScores() {
  const status = document.getElementById("score-status");
  const groups = ["amarelo", "azul", "roxo", "vermelho"];

  try {
    const response = await fetch("get_scores.php", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível consultar os arquivos de pontuação.");
    const scores = await response.json();

    const cards = groups.map((group) => {
      const target = document.getElementById(`score-${group}`);
      const parsed = Number(scores[group]);
      const valid = Number.isFinite(parsed);
      target.textContent = valid ? parsed.toLocaleString("pt-BR") : "—";
      return {
        group,
        score: valid ? parsed : Number.NEGATIVE_INFINITY,
        card: target.closest(".score-card")
      };
    });

    // Com a grade em direção RTL, a maior pontuação fica à direita.
    // Identifica o grupo líder.
    atualizarLider(cards);

    // Ordena da maior para a menor pontuação.
    cards.sort((a, b) => b.score - a.score);

    const grid = document.querySelector(".score-grid");
    cards.forEach(({ card }) => grid.appendChild(card));

    status.textContent = "Pontuações carregadas dos arquivos do evento.";
    status.classList.remove("error");
  } catch (error) {
    groups.forEach((group) => {
      document.getElementById(`score-${group}`).textContent = "—";
    });
    status.textContent = "Não foi possível carregar os pontos. Execute o site em um servidor com PHP.";
    status.classList.add("error");
    console.error(error);
  }
}*/

async function loadScores() {
  const status = document.getElementById("score-status");
  const groups = ["amarelo", "azul", "roxo", "vermelho"];

  try {
    const cards = await Promise.all(
      groups.map(async (group) => {
        const response = await fetch(`scores/${group}.txt`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar a pontuação de ${group}.`);
        }

        const texto = await response.text();
        const valor = texto.trim();
        const score = valor === "" ? NaN : Number(valor);

        if (!Number.isFinite(score)) {
          throw new Error(`Pontuação inválida para ${group}.`);
        }

        const target = document.getElementById(`score-${group}`);
        target.textContent = score.toLocaleString("pt-BR");

        return {
          group,
          score,
          card: target.closest(".score-card")
        };
      })
    );

    // Identifica o grupo com a maior pontuação.
    if (typeof atualizarLider === "function") {
      atualizarLider(cards);
    }

    // Ordena da maior para a menor pontuação.
    cards.sort((a, b) => b.score - a.score);

    const grid = document.querySelector(".score-grid");
    cards.forEach(({ card }) => grid.appendChild(card));

    status.textContent = "Pontuações carregadas com sucesso.";
    status.classList.remove("error");

  } catch (error) {
    groups.forEach((group) => {
      document.getElementById(`score-${group}`).textContent = "—";
    });

    document.querySelectorAll(".score-card").forEach((card) => {
      card.classList.remove("lider");
    });

    status.textContent = "Não foi possível carregar as pontuações.";
    status.classList.add("error");

    console.error(error);
  }
}

loadScores();

// Atualiza os números a cada 15 segundos.
setInterval(loadScores, 15000);



loadScores();
// Atualiza os números periodicamente caso os arquivos sejam alterados durante o evento.
setInterval(loadScores, 15000);
