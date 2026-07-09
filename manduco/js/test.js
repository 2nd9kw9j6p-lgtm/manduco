/* ==========================================================================
   MANDUCO — Test de autorreflexión
   Cuestionario corto de 8 preguntas sobre la semana. NO es una herramienta
   diagnóstica: da una lectura general y sugiere una categoría de consejos.
   Cada opción vale de 0 a 3 puntos.
   ========================================================================== */

const QUESTIONS = [
  {
    text: "En la última semana, ¿qué tan seguido sentiste que no tenías tiempo para todo lo que debías hacer?",
    options: ["Casi nunca", "Algunas veces", "Frecuentemente", "Casi todos los días"]
  },
  {
    text: "¿Qué tan fácil te resultó conciliar el sueño?",
    options: ["Muy fácil", "Con algo de esfuerzo", "Me costó varias noches", "Me costó casi todas las noches"]
  },
  {
    text: "¿Con qué frecuencia te sorprendiste dándole vueltas a la misma preocupación?",
    options: ["Casi nunca", "De vez en cuando", "Seguido", "Casi todo el tiempo"]
  },
  {
    text: "¿Cómo describirías tu energía general esta semana?",
    options: ["Alta, me sentí con ganas", "Normal", "Baja, cansado la mayoría del tiempo", "Muy baja, agotado siempre"]
  },
  {
    text: "¿Qué tan cómodo te sentiste hablando de cómo te sentías con alguien cercano?",
    options: ["Muy cómodo", "Cómodo con algunas personas", "Preferí guardármelo casi siempre", "Evité el tema por completo"]
  },
  {
    text: "¿Con qué frecuencia sentiste que un pequeño problema se sentía enorme?",
    options: ["Casi nunca", "Alguna vez", "Varias veces", "Casi todos los días"]
  },
  {
    text: "¿Qué tan seguido tuviste un momento para ti mismo, sin pantallas ni pendientes?",
    options: ["Todos los días", "Varias veces en la semana", "Una o dos veces", "Prácticamente nunca"]
  },
  {
    text: "En general, ¿cómo calificarías esta semana comparada con una semana normal para ti?",
    options: ["Mejor de lo normal", "Similar a lo normal", "Un poco más difícil", "Mucho más difícil"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("test-body");
  const progressFill = document.getElementById("progress-fill");
  const answers = new Array(QUESTIONS.length).fill(null);
  let current = 0;

  renderQuestion();

  function renderQuestion() {
    progressFill.style.width = `${(current / QUESTIONS.length) * 100}%`;
    const q = QUESTIONS[current];

    body.innerHTML = `
      <div class="test-question">
        <h2>${q.text}</h2>
        <div class="test-options">
          ${q.options.map((opt, i) => `
            <div class="test-option ${answers[current] === i ? 'selected' : ''}" data-value="${i}">${opt}</div>
          `).join("")}
        </div>
        <div class="test-nav">
          <button class="btn btn-outline" id="prev-btn" ${current === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>← Anterior</button>
          <button class="btn btn-primary" id="next-btn" ${answers[current] === null ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            ${current === QUESTIONS.length - 1 ? 'Ver resultado' : 'Siguiente →'}
          </button>
        </div>
      </div>
    `;

    body.querySelectorAll(".test-option").forEach(opt => {
      opt.addEventListener("click", () => {
        answers[current] = parseInt(opt.dataset.value, 10);
        renderQuestion();
      });
    });

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (current > 0) {
      prevBtn.addEventListener("click", () => { current -= 1; renderQuestion(); });
    }
    if (answers[current] !== null) {
      nextBtn.addEventListener("click", () => {
        if (current === QUESTIONS.length - 1) {
          renderResult();
        } else {
          current += 1;
          renderQuestion();
        }
      });
    }
  }

  function renderResult() {
    progressFill.style.width = "100%";
    const total = answers.reduce((sum, v) => sum + v, 0);
    const maxScore = QUESTIONS.length * 3;
    const percent = Math.round((total / maxScore) * 100);

    let badge, message, recommendedCat, tone;
    if (percent < 30) {
      badge = "Semana llevadera";
      tone = "var(--moss)";
      recommendedCat = "habitos";
      message = "Parece que esta semana estuvo relativamente bajo control. Es un buen momento para reforzar hábitos que sostienen ese equilibrio, más que para apagar incendios.";
    } else if (percent < 60) {
      badge = "Semana cargada";
      tone = "var(--gold)";
      recommendedCat = "estres";
      message = "Hubo momentos de presión real esta semana. No es una emergencia, pero sí una señal para bajarle un poco el ritmo a las cosas que dependen de ti y priorizar descanso.";
    } else {
      badge = "Semana pesada";
      tone = "var(--rose)";
      recommendedCat = "ansiedad";
      message = "Esta parece haber sido una semana particularmente difícil. Vale la pena ser amable contigo mismo y, si esta sensación se mantiene varias semanas seguidas, considerar hablarlo con un psicólogo: no tiene que resolverse solo.";
    }

    const cat = CATEGORIES.find(c => c.id === recommendedCat);

    body.innerHTML = `
      <div class="test-result">
        <span class="result-badge">${badge}</span>
        <h2>Tu lectura de esta semana</h2>
        <div class="result-meter">
          <div class="result-meter-fill" style="width:${percent}%; background:${tone};"></div>
        </div>
        <p>${message}</p>
        <div class="result-note">
          Te podrían servir los consejos de <strong>${cat.icon} ${cat.label}</strong>: ${cat.desc}
        </div>
        <div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="consejos.html?cat=${recommendedCat}" class="btn btn-primary">Ver esos consejos</a>
          <button id="retry-btn" class="btn btn-outline">Repetir el test</button>
        </div>
      </div>
    `;

    document.getElementById("retry-btn").addEventListener("click", () => {
      current = 0;
      answers.fill(null);
      renderQuestion();
    });
  }
});
