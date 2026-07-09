/* ==========================================================================
   MANDUCO — Base de datos de consejos
   Cada consejo tiene: id, categoría, título, texto y una etiqueta manuscrita
   (el "corner" que aparece en la carta del mazo).
   ========================================================================== */

const CATEGORIES = [
  { id: "ansiedad", label: "Ansiedad", icon: "🌊", desc: "Herramientas para calmar el cuerpo y ordenar la mente cuando todo se siente urgente." },
  { id: "autoestima", label: "Autoestima", icon: "🌱", desc: "Formas de hablarte a ti mismo con la misma paciencia que le darías a alguien que quieres." },
  { id: "relaciones", label: "Relaciones", icon: "🤝", desc: "Cómo poner límites, comunicarte y sostener vínculos sin perderte a ti mismo." },
  { id: "estres", label: "Estrés y estudio", icon: "🔥", desc: "Estrategias para semanas cargadas, exámenes y la sensación de no dar abasto." },
  { id: "habitos", label: "Hábitos saludables", icon: "🌤️", desc: "Rutinas pequeñas que sostienen el ánimo: sueño, movimiento y descanso real." },
  { id: "perdidas", label: "Pérdidas y cambios", icon: "🍂", desc: "Acompañamiento para procesos de duelo, rupturas y despedidas." }
];

const TIPS = [
  {
    id: 1, category: "ansiedad", tag: "respirar",
    title: "La respiración 4-7-8",
    text: "Inhala contando hasta 4, sostén el aire contando hasta 7 y exhala lento contando hasta 8. Repítelo cuatro veces. Alargar la exhalación le avisa a tu cuerpo que puede bajar la guardia."
  },
  {
    id: 2, category: "ansiedad", tag: "aterrizar",
    title: "La técnica 5-4-3-2-1",
    text: "Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles y 1 que puedes saborear. Es un ancla simple para volver al presente cuando la mente se acelera."
  },
  {
    id: 3, category: "ansiedad", tag: "pensar",
    title: "Escribe el peor escenario",
    text: "Cuando una preocupación da vueltas, escríbela hasta el final: ¿qué es lo peor que podría pasar? Casi siempre, verlo en papel reduce su tamaño y te permite pensar en un plan concreto."
  },
  {
    id: 4, category: "ansiedad", tag: "cuerpo",
    title: "Relajación muscular progresiva",
    text: "Tensa los puños con fuerza durante 5 segundos y suéltalos de golpe. Sube por brazos, hombros y cara. La ansiedad vive también en el cuerpo, no solo en los pensamientos."
  },
  {
    id: 5, category: "autoestima", tag: "voz interna",
    title: "Háblate como a un amigo",
    text: "Antes de una autocrítica dura, pregúntate: '¿le diría esto a alguien que quiero?'. Si la respuesta es no, busca una versión más justa de la misma frase."
  },
  {
    id: 6, category: "autoestima", tag: "logros",
    title: "El cuaderno de las tres cosas",
    text: "Cada noche anota tres cosas que hiciste bien, por pequeñas que sean. No tienen que ser logros grandes: llegar a tiempo, responder con calma o simplemente intentarlo cuenta."
  },
  {
    id: 7, category: "autoestima", tag: "comparación",
    title: "Cuidado con las redes a las 11pm",
    text: "Comparar tu vida completa con los mejores momentos de otros es una trampa. Si notas que una app te deja peor de lo que estabas, es información: puedes cerrarla."
  },
  {
    id: 8, category: "autoestima", tag: "cuerpo",
    title: "Separa tu valor de tu productividad",
    text: "Un mal día, una nota baja o un error no miden quién eres. Puedes tener un mal desempeño puntual y seguir siendo alguien capaz; ambas cosas conviven."
  },
  {
    id: 9, category: "relaciones", tag: "límites",
    title: "'No' es una oración completa",
    text: "No necesitas justificar cada límite con una lista de razones. Un 'no puedo esta vez' dicho con calma es suficiente, y practicarlo lo hace menos incómodo con el tiempo."
  },
  {
    id: 10, category: "relaciones", tag: "conflicto",
    title: "Habla desde el 'yo', no desde el ataque",
    text: "Cambia 'siempre haces esto' por 'yo me siento así cuando pasa esto'. Baja la defensiva del otro y abre espacio real para resolver, en vez de solo pelear."
  },
  {
    id: 11, category: "relaciones", tag: "escucha",
    title: "Escucha para entender, no para responder",
    text: "Mientras el otro habla, resiste el impulso de preparar tu respuesta. Pregúntale '¿qué necesitas de mí ahora mismo, que te escuche o que te ayude a resolver?'"
  },
  {
    id: 12, category: "relaciones", tag: "soledad",
    title: "Pedir ayuda no es una carga",
    text: "La mayoría de las personas se sienten bien cuando alguien les pide apoyo; les da la oportunidad de ser útiles. Guardarte todo solo aumenta el peso, no lo reduce."
  },
  {
    id: 13, category: "estres", tag: "tiempo",
    title: "La regla de los dos minutos",
    text: "Si una tarea toma menos de dos minutos, hazla ya en vez de anotarla. Vacía la lista de pendientes pequeños y deja espacio mental para lo que sí requiere concentración."
  },
  {
    id: 14, category: "estres", tag: "estudio",
    title: "Bloques Pomodoro reales",
    text: "25 minutos de estudio enfocado, 5 de descanso total (levántate, no revises el celular), y cada cuatro bloques un descanso de 20 minutos. El cerebro rinde mejor con pausas que sin ellas."
  },
  {
    id: 15, category: "estres", tag: "prioridad",
    title: "Elige tu 'única cosa' del día",
    text: "De toda tu lista, elige una sola tarea que si la terminas, harías del día un éxito. El resto es extra. Esto evita la parálisis de tener demasiado por hacer."
  },
  {
    id: 16, category: "estres", tag: "examen",
    title: "Antes de un examen: mueve el cuerpo",
    text: "Cinco minutos de estiramiento o caminar bajan el cortisol más rápido que seguir repasando. Llegar con la mente clara vale más que el último repaso apurado."
  },
  {
    id: 17, category: "habitos", tag: "sueño",
    title: "Una hora sin pantallas antes de dormir",
    text: "La luz azul retrasa la producción de melatonina. Cambia el scroll nocturno por leer, escuchar música suave o simplemente conversar; el cuerpo agradece la rutina."
  },
  {
    id: 18, category: "habitos", tag: "movimiento",
    title: "Camina aunque sean diez minutos",
    text: "No hace falta ir al gimnasio para notar el efecto: una caminata corta baja la tensión y mejora el ánimo casi de inmediato. Es de las herramientas más subestimadas que existen."
  },
  {
    id: 19, category: "habitos", tag: "descanso",
    title: "El descanso no hay que ganárselo",
    text: "No necesitas terminar todo para merecer parar. Programa descansos como citas fijas, no como premio condicionado a la productividad."
  },
  {
    id: 20, category: "habitos", tag: "rutina",
    title: "Ancla tu día con un ritual simple",
    text: "Un café, abrir la ventana o escribir tres líneas al despertar puede darle una señal clara a tu cuerpo de que el día empieza. Los rituales pequeños ordenan días desordenados."
  },
  {
    id: 21, category: "perdidas", tag: "duelo",
    title: "El duelo no tiene un cronograma",
    text: "No existe un tiempo 'correcto' para superar una pérdida. Hay días mejores y peores incluso meses después, y eso no significa que no estés avanzando."
  },
  {
    id: 22, category: "perdidas", tag: "ruptura",
    title: "Después de una ruptura, ordena lo práctico primero",
    text: "Antes de resolver lo emocional de golpe, atiende lo concreto: dormir, comer, moverte. La estabilidad básica sostiene el terreno para procesar el resto."
  },
  {
    id: 23, category: "perdidas", tag: "cambio",
    title: "Los cambios grandes también se lloran",
    text: "Graduarte, mudarte o cambiar de ciudad puede doler aunque sea algo bueno. Estás dejando una versión conocida de tu vida, y eso también merece un espacio de despedida."
  },
  {
    id: 24, category: "perdidas", tag: "acompañar",
    title: "Acompañar no es tener la respuesta",
    text: "Si alguien cercano está en duelo, no necesitas frases perfectas. Muchas veces 'estoy aquí' y quedarte en silencio con la persona pesa más que cualquier consejo."
  }
];

// Utilidad compartida: obtiene una carta aleatoria (usada en la portada)
function getRandomTip(excludeId) {
  const pool = excludeId ? TIPS.filter(t => t.id !== excludeId) : TIPS;
  return pool[Math.floor(Math.random() * pool.length)];
}
