let gameSeq = [];
let userSeq = [];

const btns = ["sky", "orange", "red", "blue"];
let level = 0;
let started = false;

let gameMode = "normal";
let soundEnabled = true;
let showingSequence = false;

document.getElementById("mode-select").addEventListener("change", function () {
  gameMode = this.value;
});

const soundToggleBtn = document.getElementById("sound-toggle");
soundToggleBtn.addEventListener("click", function () {
  soundEnabled = !soundEnabled;
  soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

const levelTitle = document.getElementById("level-title");
const score = document.getElementById("score");
const highScoreText = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");
const themeToggle = document.getElementById("theme-toggle");
const restartBtn = document.getElementById("restart-btn");

restartBtn.addEventListener("click", function () {
  if (started) {
    resetGame();
    startGame();
  } else {
    restartBtn.innerText = `Click Start Game!`;
    restartBtn.classList.add("clicked");
  }
});

let highScore = localStorage.getItem("simonHighScore") || 0;
highScoreText.textContent = `🏆 High Score: ${highScore}`;

const sounds = {
  correct: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
  wrong: new Audio("https://s3.amazonaws.com/adam-recvlohe-sounds/error.wav")
};

document.addEventListener("keydown", startGame);
startBtn.addEventListener("click", function () {
  if(startBtn.innerText==="▶️ Start Game"){
    startBtn.classList.add("flash");
    setTimeout(() => startBtn.classList.remove("flash"), 250);
  }
  // startBtn.classList.add("clicked");
  // startBtn.innerText = `Started`;
  startBtn.classList.add("primary");
  restartBtn.innerText = `🔁 Restart Game`;
  restartBtn.classList.remove("clicked");
  startGame();
});



restartBtn.addEventListener("click",function(){
  if(restartBtn.innerText==="🔁 Restart Game"){
    restartBtn.classList.add("flash");
    setTimeout(() => restartBtn.classList.remove("flash"), 250);
  }
});

function startGame() {
  if (!started) {
    started = true;
    level = 0;
    gameSeq = [];
    levelUp();
  }
}

function levelUp() {
  userSeq = [];
  level++;
  levelTitle.innerText = `Level ${level}`;

  const randColor = btns[Math.floor(Math.random() * 4)];
  gameSeq.push(randColor);

  if (gameMode === "memory") {
    showingSequence = true;
    showFullPattern(() => {
      showingSequence = false;
    });
  } else {
    flashBtn(randColor);
  }
}

function playSound(color) {
  if (soundEnabled && sounds[color]) {
    sounds[color].currentTime = 0;
    sounds[color].play();
  }
}

function btnPress() {
  if (showingSequence) return;

  let btn = this;
  let userColor = btn.id;

  userSeq.push(userColor);
  btn.classList.add("userFlash");
  playSound("correct");

  btn.classList.add("clicked");
  setTimeout(() => btn.classList.remove("clicked"), 150);
  setTimeout(() => btn.classList.remove("userFlash"), 200);

  checkAns(userSeq.length - 1);
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    playSound("wrong");
    startBtn.innerText = `Start Game Again!`;
    startBtn.classList.remove("primary");
    document.body.classList.add("game-over");
    levelTitle.innerHTML = `Game Over!<br>Press Start to play again`;

    if (level - 1 > highScore) {
      highScore = level - 1;
      localStorage.setItem("simonHighScore", highScore);
    }
    score.innerHTML = `Score: <b>${level - 1}</b>`;
    highScoreText.textContent = `🏆 High Score: ${highScore}`;
    setTimeout(() => document.body.classList.remove("game-over"), 300);
    resetGame();
  }
}

function resetGame() {
  gameSeq = [];
  userSeq = [];
  started = false;
  // startBtn.classList.remove("clicked");
}

document.querySelectorAll(".inner-div").forEach(btn => {
  btn.addEventListener("click", btnPress);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent =
    document.body.classList.contains("dark-mode") ? "🌙 Theme" : "🌞 Theme";
});

function showFullPattern(callback) {
  let i = 0;
  const intervalTime = gameMode === "fast" ? 300 : 600;

  const interval = setInterval(() => {
    const color = gameSeq[i];
    flashBtn(color);
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, intervalTime);
}

function flashBtn(color) {
  const btn = document.getElementById(color);
  btn.classList.add("flash");
  playSound("correct");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

