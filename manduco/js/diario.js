/* ==========================================================================
   MANDUCO — Diario emocional
   Guarda registros de ánimo con localStorage cuando está disponible.
   Si el navegador lo bloquea (por ejemplo en una vista previa embebida),
   cae de forma silenciosa a un arreglo en memoria para que la página
   nunca se rompa.
   ========================================================================== */

const STORAGE_KEY = "manduco_diario_entries";
const MOOD_SCORE = { "😄": 5, "🙂": 4, "😐": 3, "😕": 2, "😔": 1 };

let memoryEntries = [];
let storageAvailable = true;

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    storageAvailable = false;
    return memoryEntries;
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    storageAvailable = false;
    memoryEntries = entries;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const moodPicker = document.getElementById("mood-picker");
  const textArea = document.getElementById("diario-text");
  const saveBtn = document.getElementById("save-entry-btn");
  const saveHint = document.getElementById("save-hint");
  const entryList = document.getElementById("entry-list");
  const emptyState = document.getElementById("diario-empty");
  const chart = document.getElementById("mood-chart");

  let entries = loadEntries();
  let selectedMood = null;

  if (!storageAvailable) {
    saveHint.textContent = "Guardando solo en esta sesión (el navegador bloqueó el almacenamiento local).";
  }

  moodPicker.addEventListener("click", (e) => {
    const btn = e.target.closest(".mood-btn");
    if (!btn) return;
    selectedMood = btn.dataset.mood;
    [...moodPicker.children].forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });

  saveBtn.addEventListener("click", () => {
    if (!selectedMood) {
      saveHint.textContent = "Elige primero un estado de ánimo.";
      return;
    }
    const entry = {
      id: Date.now(),
      mood: selectedMood,
      text: textArea.value.trim(),
      date: new Date().toISOString()
    };
    entries = [entry, ...entries];
    saveEntries(entries);
    textArea.value = "";
    selectedMood = null;
    [...moodPicker.children].forEach(b => b.classList.remove("selected"));
    saveHint.textContent = storageAvailable ? "Registro guardado." : "Guardado en esta sesión.";
    render();
  });

  entryList.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".entry-delete");
    if (!delBtn) return;
    const id = Number(delBtn.dataset.id);
    entries = entries.filter(en => en.id !== id);
    saveEntries(entries);
    render();
  });

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function render() {
    // Lista de registros
    entryList.innerHTML = "";
    emptyState.style.display = entries.length === 0 ? "block" : "none";

    entries.forEach(en => {
      const card = document.createElement("div");
      card.className = "entry-card";
      card.innerHTML = `
        <span class="entry-mood">${en.mood}</span>
        <div style="flex:1;">
          <div class="entry-meta">${formatDate(en.date)}</div>
          <p class="entry-body">${en.text ? en.text : "<em>Sin nota adicional.</em>"}</p>
        </div>
        <button class="entry-delete" data-id="${en.id}">Eliminar</button>
      `;
      entryList.appendChild(card);
    });

    // Gráfico de barras con los últimos 14 registros (del más antiguo al más nuevo)
    chart.innerHTML = "";
    const recent = [...entries].slice(0, 14).reverse();
    recent.forEach(en => {
      const bar = document.createElement("div");
      bar.className = "mood-bar";
      const score = MOOD_SCORE[en.mood] || 3;
      bar.style.height = `${(score / 5) * 100}%`;
      bar.title = `${en.mood} · ${formatDate(en.date)}`;
      chart.appendChild(bar);
    });
  }

  render();
});
