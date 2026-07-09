/* ==========================================================================
   MANDUCO — Mazo de cartas
   Controla la carta visible en el hero y la animación de "sacar carta".
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const front = document.querySelector(".deck-card.front");
  const drawBtn = document.getElementById("draw-card-btn");
  if (!front || !drawBtn) return;

  let currentTip = getRandomTip();
  renderCard(currentTip);

  drawBtn.addEventListener("click", () => {
    front.classList.add("drawing");

    window.setTimeout(() => {
      currentTip = getRandomTip(currentTip.id);
      renderCard(currentTip);
      front.classList.remove("drawing");
    }, 380);
  });

  function renderCard(tip) {
    const catData = CATEGORIES.find(c => c.id === tip.category);
    front.querySelector(".card-tag").textContent = "# " + tip.tag;
    front.querySelector(".card-title").textContent = tip.title;
    front.querySelector(".card-text").textContent = tip.text;
    front.querySelector(".card-corner").textContent = catData ? catData.icon : "🌤️";
  }
});
