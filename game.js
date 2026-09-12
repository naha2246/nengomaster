const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const answerButton = document.getElementById("answerButton");

const answerInput = document.getElementById("answerInput");
const timerText = document.getElementById("timer");
const eventText = document.getElementById("eventText");
const questionNumber = document.getElementById("questionNumber");
const resultMessage = document.getElementById("resultMessage");

const scoreText = document.getElementById("scoreText");
const accuracyText = document.getElementById("accuracyText");
const rankText = document.getElementById("rankText");
const wrongList = document.getElementById("wrongList");

const questionCount = document.getElementById("questionCount");

const keypadButtons = document.querySelectorAll(".key");
const deleteKey = document.getElementById("deleteKey");

let questions = [];
let currentIndex = 0;
let currentQuestion;
let score = 0;

let timer;
let timeLeft = 20;

let wrongQuestions = [];
let combo = 0;

questionCount.textContent = `収録問題：${QUESTIONS.length}問`;

const comboText = document.createElement("div");
comboText.id = "comboText";
timerText.parentNode.insertBefore(comboText, timerText);

function shuffle(array){

    const newArray=[...array];

    for(let i=newArray.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [newArray[i],newArray[j]]=[newArray[j],newArray[i]];
    }

    return newArray;
}

function startGame(){

    titleScreen.style.display="none";
    gameScreen.style.display="block";
    resultScreen.style.display="none";

    questions=shuffle(QUESTIONS).slice(0,20);

    currentIndex=0;
    score=0;
    combo=0;
    wrongQuestions=[];

    showQuestion();
}

function showQuestion(){

    if(currentIndex>=questions.length){
        finishGame();
        return;
    }

    currentQuestion=questions[currentIndex];

    questionNumber.textContent=`第${currentIndex+1}問 / ${questions.length}問`;

    eventText.textContent=currentQuestion.event;

    answerInput.value="";
    answerInput.focus();

    resultMessage.textContent="";
    resultMessage.className="";

    comboText.textContent = combo >= 2 ? `🔥 ${combo}連続！` : "";

    startTimer();
}

function startTimer(){

    clearInterval(timer);

    timeLeft=20;
    timerText.textContent=`${timeLeft}秒`;
    timerText.classList.remove("warning");

    timer=setInterval(()=>{

        timeLeft--;
        timerText.textContent=`${timeLeft}秒`;

        if(timeLeft<=5){
            timerText.classList.add("warning");
        }

        if(timeLeft<=0){

            clearInterval(timer);

            combo=0;
            wrongQuestions.push(currentQuestion);

            showResult(false);

        }

    },1000);
}

function checkAnswer(){

    clearInterval(timer);

    const answer=Number(answerInput.value);

    const correct=answer===currentQuestion.year;

    if(correct){
        score++;
        combo++;
    }else{
        combo=0;
        wrongQuestions.push(currentQuestion);
    }

    showResult(correct);
}

function flashScreen(className){

    document.body.classList.add(className);

    setTimeout(()=>{
        document.body.classList.remove(className);
    },250);

}

function showResult(correct){

    if(correct){

        resultMessage.textContent="✓ 正解！";
        resultMessage.className="correct";
        flashScreen("flash-correct");

    }else{

        resultMessage.textContent=`✗ 不正解（正解：${currentQuestion.year}年）`;
        resultMessage.className="wrong";
        flashScreen("flash-wrong");

    }

    answerButton.disabled=true;

    setTimeout(()=>{

        answerButton.disabled=false;

        currentIndex++;

        showQuestion();

    },1000);
}

function finishGame(){

    clearInterval(timer);

    gameScreen.style.display="none";
    resultScreen.style.display="block";

    scoreText.textContent=`${score} / ${questions.length}問正解`;

    const accuracy=Math.round(score/questions.length*100);

    accuracyText.textContent=`正答率：${accuracy}%`;

    let rank;

    if(accuracy===100) rank="S+";
    else if(accuracy>=90) rank="S";
    else if(accuracy>=80) rank="A";
    else if(accuracy>=70) rank="B";
    else if(accuracy>=60) rank="C";
    else rank="D";

    rankText.textContent=`🏅 ランク：${rank}`;

    wrongList.innerHTML="";

    if(wrongQuestions.length===0){

        wrongList.innerHTML="<p>🎉 全問正解！すごい！</p>";

    }else{

        wrongQuestions.forEach(q=>{

            wrongList.innerHTML+=`
            <div class="wrongItem">
                ${q.event}<br>
                <strong>${q.year}年</strong>
            </div>`;

        });

    }
}

startButton.addEventListener("click",startGame);

restartButton.addEventListener("click",startGame);

answerButton.addEventListener("click",checkAnswer);

answerInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){
        checkAnswer();
    }

});

// テンキー
keypadButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        answerInput.value+=button.textContent;

    });

});

deleteKey.addEventListener("click",()=>{

    answerInput.value=answerInput.value.slice(0,-1);

});