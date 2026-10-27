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

async function loadScores() {
  const status = document.getElementById("score-status");
  const groups = ["amarelo", "azul", "roxo", "vermelho"];

  try {
    const response = await fetch("get_scores.php", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível consultar os arquivos de pontuação.");
    const scores = await response.json();

    groups.forEach((group) => {
      const target = document.getElementById(`score-${group}`);
      const value = Number(scores[group]);
      target.textContent = Number.isFinite(value) ? value.toLocaleString("pt-BR") : "—";
    });

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
}

loadScores();
// Atualiza os números periodicamente caso os arquivos sejam alterados durante o evento.
setInterval(loadScores, 15000);
