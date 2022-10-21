const word = document.querySelector(".word");
const correctNum = document.querySelector(".correct-count");
const wrongNum = document.querySelector(".wrong-count");
const mistakesNum = document.querySelector(".word-mistakes");
const timerDysplay = document.querySelector('#timer');

let currentIndex = 0;
let mistakesCounter = 0;
let wrongWordCounter = 0;
let correctWordCounter = 0;
let seconds = 0;
let timerId = null;

//получаем и выводим случайное слово 
async function getRandomWord() {
  const response = await fetch("https://api.api-ninjas.com/v1/randomword");  
  if (response.ok) {
    const jsonData = await response.json();    
    const randomWord = jsonData.word;
    dysplayWord(randomWord);
  } else {
    alert(`Ошибка ${response.status}`);
  }
}

function dysplayWord(str) {
  word.textContent = "";
  const fragment = new DocumentFragment(); 
  for (let letter of str) {    
    const span = document.createElement("span");
    span.textContent = letter;
    fragment.append(span);
  }
  word.append(fragment);
}

getRandomWord().catch((error) => alert(error));

// часы
function startTimer() {
  timerId = setInterval(() => {
    seconds += 1;
    timerDysplay.textContent = getTimeStr(seconds);
  }, 1000)
}

function getTimeStr(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  if (m < 10) {
    m = `0${m}`;
  }
  if (s < 10) {
    s = `0${s}`;
  }
  return `${m}:${s}`;
}

startTimer();

//время пошло! ждем клик
document.addEventListener("keydown", (event) => {  
  const letters = word.querySelectorAll("span");  

  if (event.key === "Shift") {
    return
  }  
  if (event.key === letters[currentIndex].textContent) {    
    letters[currentIndex].className = 'c';
    currentIndex += 1;    
  } else {
    letters[currentIndex].className = 'w';
    mistakesCounter += 1;
    mistakesNum.textContent = mistakesCounter;      
  }
  //когда доходим до конца слова
  if (currentIndex === letters.length) {
    if (mistakesCounter === 0) {
      correctWordCounter += 1;
      correctNum.textContent = correctWordCounter;
      if (correctWordCounter === 5) {  
        const message = `Вы выиграли! Ваше время ${getTimeStr(seconds)}`;
        endGame(message);
        return;
      };
    } else {
      wrongWordCounter += 1;
      wrongNum.textContent = wrongWordCounter;
      if (wrongWordCounter === 5) {
        const message = `Вы проиграли :( Ваше время ${getTimeStr(seconds)}`;
        endGame(message);
        return;        
      };
    };
    resetSession();
  };
});

function endGame(message) {
  clearInterval(timerId); 
  setTimeout(() => {
    alert(message);
    resetGame();
  }, 50);
}

function resetGame() {
  currentIndex = 0;
  mistakesCounter = 0;
  wrongWordCounter = 0;
  correctWordCounter = 0;
  mistakesNum.textContent = mistakesCounter;
  wrongNum.textContent = wrongWordCounter;
  correctNum.textContent = correctWordCounter;
  getRandomWord().catch((error) => alert(error));
  seconds = 0;
  timerDysplay.textContent = getTimeStr(seconds);
  startTimer();  
};

function resetSession() {
  currentIndex = 0;
  mistakesCounter = 0;      
  getRandomWord().catch((error) => alert(error));
  mistakesNum.textContent = mistakesCounter;
}