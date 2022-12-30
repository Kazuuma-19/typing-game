const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random"
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById('typeInput')
const timer = document.getElementById('timer');

const typeSound = new Audio("./audio/typing-sound.mp3");
const incorrectSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");


// inputテキストとdisplayの文字が一致しているか判定
typeInput.addEventListener("input", () => {
  //add type sound
  typeSound.play();
  typeSound.currentTime = 0;

  // spanタグを全て取得
  const sentenceArray = typeDisplay.querySelectorAll("span");
  // inputに入力されたvalueを分割し取得,
  const arrayValue = typeInput.value.split("");
  let correct = true;

  sentenceArray.forEach((characterSpan, index) => {
    //初期状態（入力前）
    if (arrayValue[index] == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');

      correct = false;
    } else {
      //characterSpan(radomSentence)とarrayValue(inputText)が一致してるか？
      if (characterSpan.innerText == arrayValue[index]) {
        characterSpan.classList.add('correct');
        characterSpan.classList.remove('incorrect');
      } else {
        characterSpan.classList.add('incorrect');
        characterSpan.classList.remove('correct');

        //add wrong sound
        incorrectSound.volume = 0.3;
        incorrectSound.play();
        incorrectSound.currentTime = 0;

        correct = false;
      }
    }
  });

  //correctの値がtrueならば次の文章に移行
  if (correct == true) {
    //正解時の音
    correctSound.play();
    correctSound.currentTime = 0;

    RenderNextSentence();
  }
});

//ajaxでランダムな文章を取得
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())//json形式に変換
    .then((data) => data.content);//dataの中のcontentを取得
}

//表示する(取得するGetRandomSentence()を待ってから以下の関数を起動)
async function RenderNextSentence() {
  //sentenceに代入
  const sentence = await GetRandomSentence();

  //display欄を空
  typeDisplay.innerText = "";

  // 文章を分解
  let oneText = sentence.split("");
  //1文字ずつspanでかこう(1文字ずつcharacterに代入)
  oneText.forEach(character => {
    const characterSpan = document.createElement("span");
    //spanタグの中に文字を代入
    characterSpan.innerText = character;
    // console.log(characterSpan);
    typeDisplay.appendChild(characterSpan);
    // characterSpan.classList.add("correct");
  });

  // テキストボックス内をリセット
  typeInput.value = "";

  StartTimer();
}

//Timer用function
let StartTime;
let originTime = 30;

function StartTimer() {
  timer.innerText = originTime;
  //スタート時刻を取得
  StartTime = new Date();
  //1000msごとに30からカウントダウンを繰り返す
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    //0になったらタイムアウト
    if (timer.innerText <= 0) {
      TimeUp();
    }
  }, 1000);
}
function getTimerTime() {
  //1秒ずれている
  return Math.floor((new Date() - StartTime) / 1000);
}
//timeupしたら、次のテキストに移行
function TimeUp() {
  RenderNextSentence();
}

RenderNextSentence();