/* ==========================================================================
   MANDUCO — Página de consejos
   Renderiza chips de filtro, maneja búsqueda por texto y lee el parámetro
   ?cat= de la URL para preseleccionar una categoría al llegar desde la portada.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const filtersBar = document.getElementById("filters-bar");
  const grid = document.getElementById("tips-grid");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("search-input");

  let activeCategory = "todos";
  let searchTerm = "";

  // Construir los chips de categoría dinámicamente a partir de data.js
  CATEGORIES.forEach(cat => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.cat = cat.id;
    chip.textContent = `${cat.icon} ${cat.label}`;
    filtersBar.appendChild(chip);
  });

  filtersBar.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    [...filtersBar.children].forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    render();
  });

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  function render() {
    const filtered = TIPS.filter(tip => {
      const matchesCategory = activeCategory === "todos" || tip.category === activeCategory;
      const haystack = (tip.title + " " + tip.text + " " + tip.tag).toLowerCase();
      const matchesSearch = searchTerm === "" || haystack.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    grid.innerHTML = "";
    emptyState.style.display = filtered.length === 0 ? "block" : "none";

    filtered.forEach(tip => {
      const cat = CATEGORIES.find(c => c.id === tip.category);
      const card = document.createElement("article");
      card.className = "tip-card";
      card.innerHTML = `
        <div class="tip-cat">${cat ? cat.icon + " " + cat.label : ""}</div>
        <h3>${tip.title}</h3>
        <p>${tip.text}</p>
      `;
      grid.appendChild(card);
    });
  }

  // Leer ?cat= de la URL (viene de los enlaces de la portada)
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("cat");
  if (preselect && CATEGORIES.some(c => c.id === preselect)) {
    activeCategory = preselect;
    const targetChip = [...filtersBar.children].find(c => c.dataset.cat === preselect);
    if (targetChip) {
      [...filtersBar.children].forEach(c => c.classList.remove("active"));
      targetChip.classList.add("active");
    }
  }

  render();
});
