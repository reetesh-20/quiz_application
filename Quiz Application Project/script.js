const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen"),
  submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next"),
  endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score"),
  progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion = 0,
  timer;

startBtn.addEventListener("click", () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value;
  time = timePerQuestion.value;
  startBtn.innerText = "Loading...";
  fetch(`https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      showQuestion(questions[currentQuestion]);
    });
});

function showQuestion(q) {
  const questionText = document.querySelector(".question");
  const answersWrapper = document.querySelector(".answer-wrapper");
  const questionNumber = document.querySelector(".number");

  questionText.innerHTML = q.question;
  const answers = [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random());

  answersWrapper.innerHTML = "";
  answers.forEach((ans) => {
    const div = document.createElement("div");
    div.className = "answer";
    div.innerHTML = `
      <span class="text">${ans}</span>
      <span class="checkbox"><i class="fas fa-check"></i></span>`;
    div.onclick = () => {
      document.querySelectorAll(".answer").forEach(a => a.classList.remove("selected"));
      div.classList.add("selected");
      submitBtn.disabled = false;
    };
    answersWrapper.appendChild(div);
  });

  questionNumber.innerHTML = `Question <span class="current">${currentQuestion + 1}</span><span class="total">/${questions.length}</span>`;
  submitBtn.disabled = true;
  nextBtn.style.display = "none";
  submitBtn.style.display = "block";
  startTimer(time);
}

function startTimer(duration) {
  clearInterval(timer);
  let t = duration;
  timer = setInterval(() => {
    if (t >= 0) {
      progressBar.style.width = `${(t / duration) * 100}%`;
      progressText.innerText = `${t} sec`;
      t--;
    } else {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

submitBtn.onclick = checkAnswer;
nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(questions[currentQuestion]);
  } else {
    showScore();
  }
};

function checkAnswer() {
  clearInterval(timer);
  const selected = document.querySelector(".answer.selected");
  const correct = questions[currentQuestion].correct_answer;
  document.querySelectorAll(".answer").forEach(a => {
    const txt = a.querySelector(".text").innerHTML;
    if (txt === correct) {
      a.classList.add("correct");
    } else {
      if (a === selected) a.classList.add("wrong");
    }
    a.classList.add("checked");
  });

  if (selected && selected.querySelector(".text").innerHTML === correct) {
    score++;
  }

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
}

function showScore() {
  quiz.classList.add("hide");
  endScreen.classList.remove("hide");
  finalScore.innerText = score;
  totalScore.innerText = `/ ${questions.length}`;
  launchConfetti();
}

document.querySelector(".restart").onclick = () => {
  window.location.reload();
};

function launchConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    confetti({
      particleCount: 50,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      ...defaults
    });
  }, 200);
}
