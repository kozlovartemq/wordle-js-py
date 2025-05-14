//const correct_word = prompt("Загадай любое слово");

const attempts_div = document.querySelector("div.attempts-remaining")
const words_div = document.querySelector("div#words")
const input = document.querySelector("input")
const button = document.querySelector("button");
const hint = document.querySelector(".input-hint");

const wordList = ["ЖИЗНЬ", "ВЕТЕР", "МЫСЛЬ"];

function addlistener(func) {
  button.addEventListener("click", func);
  //input.addEventListener("keypress", function (e) {
  //  if (e.key === "Enter") {
  //    func();
  //  }
//});
}

function removelistener(func) {
  button.removeEventListener("click", func);
}

button.addEventListener("click", start_game);


function start_game(){
  const correct_word = input.value.trim().toUpperCase();
  const word_len = correct_word.length
  attempts_div.style.display = 'all';
  input.value = "";
  input.maxLength = word_len;
  input.placeholder = "Введите слово!";
  create_word(word_len);
  button.removeEventListener("click", start_game);
  button.addEventListener("click", submit_word);
}

function create_word(word_len){
  const word = document.createElement("div");
  word.className = "word-container";
  words_div.appendChild(word)
  for (let i = 0; i < word_len; i++) {
    const letter = document.createElement("div");
    letter.className = "letter-box";
    letter.id = i;
    word.appendChild(letter)
  }
}

function submit_word() {
  const submited_word = input.value.trim().toUpperCase();
  input.value = "";
  if (submited_word.length === correct_word.length){
    const words = document.querySelectorAll("div.word-container")
    if (words.length > 1) {
      create_word()
    }
    fill_word(submited_word)
  }
}

function fill_word(word) {
  const last_word = document.querySelectorAll("div.word-container")[-1]
  for (let child of last_word.children) {
    child.insertAdjacentText('beforeend', word[child.id])
  }
}