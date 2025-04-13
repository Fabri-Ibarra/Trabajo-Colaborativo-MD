const questions = [
  {
    type: "ordenar",
    question: "Ordene los pasos para demostrar por inducción la fórmula siguiente...",
    image: "images/induccion_matematica_consinga.png",
    orderItems: [
      "images/paso_base.png",
      "images/hipotesis_de_induccion.png",
      "images/paso_inductivo.png"
    ]
  },
  {
    type: "single",
    question: "Determine la solución de ∩i∈Ai.",
    image: "images/interseccion_de_A.png",
    answers: {
      a: "{10}",
      b: "{6}",
      c: "{2,6,10}",
      d: "{1,2,4,5,6,7,8,10}"
    },
    correctAnswers: ["b"]
  },
  {
    type: "single",
    question: "Que es un conjunto por comprension",
    image: "images/conjunto_por_comprension.png",
    answers: {
      a: "Es aquel que enuncia las propiedades que cumplen los elementos del conjunto",
      b: "Es escribir explícitamente los elementos del conjunto.",
      c: "Es el conjunto donde no importa el orden de los elementos.",
      d: "Ninguna de las anteriores"
    },
    correctAnswers: ["a"]
  },
  {
    type: "single",
    question: "Selecciona el diagrama que cumple con la siguiente operacion: AU(B∩C)",
    image: "images/union_b_interseccion_c.png",
    answers: {
      a: "images/diagrama_d.png",
      b: "images/diagrama_b.png",
      c: "images/diagrama_c.png",
      d: "images/diagrama_a.png"
    },
    correctAnswers: ["d"]
  },
  {
    type: "single",
    question: "Debes emparejar tareas con recursos, tienes las tareas T y recursos R. ¿Cuántos pares ordenados contiene TxR?",
    image: "images/producto_cruz.png",
    answers: {
      a: "3",
      b: "5",
      c: "6",
      d: "9"
    },
    correctAnswers: ["c"]
  },
  {
    type: "single",
    question: "Que tipo de relacion es R?",
    image: "images/relacion_r.png",
    answers: {
      a: "Reflexiva",
      b: "Antisimetrica",
      c: "De orden parcial",
      d: "De equivalencia"
    },
    correctAnswers: ["d"]
  },
  {
    type: "single",
    question: "Cual de estas relaciones representa una funcion?",
    image: "images/funciones_1.png",
    answers: {
      a: "La relacion 2 es una funcion",
      b: "La relacion 1 es una funcion",
    },
    correctAnswers: ["b"]
  },
  {
    type: "multiple",
    question: "Para la siguiente funcion seleccione su dominio, codominio y rango",
    image: "images/funciones_2.png",
    answers: {
      a: "Dominio : {A,X,C,D}",
      b: "Dominio : {A,B,C,D}",
      c: "Codominio: {X,Y,Z,W}",
      d: "Codominio : { W,Z }",
      e: "Rango : {A,D,Z}",
      f: "Rango : {Y,W}",
    },
    correctAnswers: ["b","c","f"]
  },
  {
    type: "single",
    question: "A que clasificacion corresponde la siguiente funcion",
    image: "images/funciones_2.png",
    answers: {
      a: "Es inyectiva",
      b: "Es sobreyectiva",
      c: "Es biyectiva",
      d: "Ninguna de las anteriores"
    },
    correctAnswers: ["d"]
  }
];

let current = 0;
let correctCountGlobal = 0;
let timer;
let timeLeft = 15;

const questionText = document.getElementById("question-box");
const answersContainer = document.getElementById("options-box");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("time");
const sortableList = document.createElement("ul");
sortableList.id = "sortable";

function displayQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      alert("¡Tiempo agotado!");
      nextQuestion();
    }
  }, 1000);

  const question = questions[current];
  questionText.textContent = question.question;

  const existingImage = document.getElementById("question-image");
  if (existingImage) existingImage.remove();

  if (question.image) {
    const img = document.createElement("img");
    img.src = question.image;
    img.id = "question-image";
    img.alt = "Imagen de la pregunta";
    img.style.maxWidth = "100%";
    img.style.margin = "15px 0";
    questionText.insertAdjacentElement("afterend", img);
  }

  answersContainer.innerHTML = "";

  if (question.type === "single" || question.type === "multiple") {
    const inputType = question.type === "single" ? "radio" : "checkbox";

    for (const [key, value] of Object.entries(question.answers)) {
      const label = document.createElement("label");
      label.classList.add("option-label");

      const input = document.createElement("input");
      input.type = inputType;
      input.name = "answer";
      input.value = key;

      label.appendChild(input);

      if (typeof value === "string" && value.startsWith("images/")) {
        const img = document.createElement("img");
        img.src = value;
        img.alt = `Respuesta ${key}`;
        img.classList.add("option-image");
        img.draggable = false;
        label.appendChild(img);
      } else {
        label.appendChild(document.createTextNode(value));
      }

      answersContainer.appendChild(label);
    }

  } else if (question.type === "ordenar") {
    answersContainer.innerHTML = "Ordena los pasos:";
    sortableList.innerHTML = "";

    const items = [...question.orderItems];
    items.sort(() => Math.random() - 0.5);

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.dataset.originalIndex = question.orderItems.indexOf(item);

      if (item.startsWith("images/")) {
        const img = document.createElement("img");
        img.src = item;
        img.alt = "Elemento para ordenar";
        img.classList.add("order-image");
        img.draggable = false;
        li.appendChild(img);
      } else {
        li.textContent = item;
      }

      li.draggable = true;
      li.addEventListener("dragstart", dragStart);
      li.addEventListener("dragover", dragOver);
      li.addEventListener("drop", drop);
      li.addEventListener("dragend", dragEnd);
      sortableList.appendChild(li);
    });

    answersContainer.appendChild(sortableList);
  }
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.originalIndex);
  e.target.classList.add("dragging");
}

function dragOver(e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(sortableList, e.clientY);
  const dragging = document.querySelector(".dragging");
  if (afterElement == null) {
    sortableList.appendChild(dragging);
  } else {
    sortableList.insertBefore(dragging, afterElement);
  }
}

function drop(e) {
  e.preventDefault();
}

function dragEnd(e) {
  e.target.classList.remove("dragging");
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function nextQuestion() {
  clearInterval(timer);
  const question = questions[current];

  if (question.type === "single" || question.type === "multiple") {
    const selected = document.querySelectorAll('input[name="answer"]:checked');
    const selectedValues = Array.from(selected).map(input => input.value);
    const correctAnswers = question.correctAnswers;
    const correctCount = selectedValues.filter(v => correctAnswers.includes(v)).length;
    const totalCorrect = correctAnswers.length;

    if (question.type === "single") {
      const isCorrect = correctCount === 1 && selectedValues.length === 1;
      if (isCorrect) correctCountGlobal++;
      alert(isCorrect ? "¡Correcto!" : "Incorrecto");
    } else {
      const isFullyCorrect = correctCount === totalCorrect && selectedValues.length === totalCorrect;
      if (isFullyCorrect) correctCountGlobal++;
      alert(`Respuestas correctas: ${correctCount}/${totalCorrect}`);
    }

  } else if (question.type === "ordenar") {
    const userOrder = Array.from(sortableList.children).map(li => parseInt(li.dataset.originalIndex));
    const correctOrder = [...question.orderItems.keys()];
    const isCorrect = userOrder.every((val, idx) => val === correctOrder[idx]);

    if (isCorrect) correctCountGlobal++;
    alert(isCorrect ? "¡Orden correcto!" : "Orden incorrecto");
  }

  current++;
  if (current < questions.length) {
    displayQuestion();
  } else {
    const finalScore = Math.round((correctCountGlobal / questions.length) * 100);
    alert(`¡Terminaste! Puntaje final: ${finalScore}/100`);
    nextBtn.disabled = true;
  }
}

nextBtn.addEventListener("click", nextQuestion);
displayQuestion();
