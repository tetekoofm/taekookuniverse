let questions=[];
let currentIndex=0;
let score=0;
let answered=false;
let totalQuestions=10;

const quoteText=document.getElementById("quoteText");
const scoreText=document.getElementById("score");
const currentQuestion=document.getElementById("currentQuestion");
const resultArea=document.getElementById("resultArea");
const resultText=document.getElementById("resultText");
const nextBtn=document.getElementById("nextBtn");
const gameComplete=document.getElementById("gameComplete");
const finalScore=document.getElementById("finalScore");
const finalMessage=document.getElementById("finalMessage");

const taeAnswer=document.getElementById("taeAnswer");
const kooAnswer=document.getElementById("kooAnswer");
const restartBtn=document.getElementById("restartBtn");

fetch("/static/json/who_said_it.json")
.then(response=>response.json())
.then(data=>{
    console.log("Loaded questions:",data);
    questions=data.sort(()=>Math.random()-0.5).slice(0,totalQuestions);
    console.log("Game questions:",questions);
    loadQuestion();
})
.catch(error=>console.error("Who Said It loading error:",error));

function loadQuestion(){
    if(currentIndex>=questions.length){
        finishGame();
        return;
    }

    answered=false;
    resultArea.style.display="none";

    let question=questions[currentIndex];

    quoteText.textContent=`"${question.quote}"`;
    currentQuestion.textContent=currentIndex+1;
}

function checkAnswer(choice){

    if(answered) return;

    answered=true;

    let correctAnswer=questions[currentIndex].answer;

    if(choice===correctAnswer){
        score+=10;
        scoreText.textContent=score;
        resultText.innerHTML=`✨ Correct! ✨<br><br>${correctAnswer} said this!`;
    }
    else{
        resultText.innerHTML=`❌ Wrong!<br><br>${correctAnswer} said this!`;
    }

    resultArea.style.display="block";
    resultArea.classList.add("show");
    
    setTimeout(()=>{
        currentIndex++;
        loadQuestion();
    },1500);
}

function nextQuestion(){

    currentIndex++;
    loadQuestion();

}

function finishGame(){

    document.querySelector(".quote-stage").style.display="none";
    document.querySelector(".character-choice").style.display="none";
    resultArea.style.display="none";

    gameComplete.classList.remove("hidden");

    finalScore.textContent=score;

    if(score===100){
        finalMessage.textContent="🌟 TaeKook Expert! You know their words perfectly!";
    }
    else if(score>=70){
        finalMessage.textContent="💜💚 Amazing! You know them well!";
    }
    else if(score>=40){
        finalMessage.textContent="✨ Not bad! Keep exploring TaeKook memories!";
    }
    else{
        finalMessage.textContent="🌱 Time for a TaeKook marathon!";
    }
}

function restartGame(){

    currentIndex=0;
    score=0;

    scoreText.textContent=0;

    document.querySelector(".quote-stage").style.display="";
    document.querySelector(".character-choice").style.display="";

    gameComplete.classList.add("hidden");

    questions=questions.sort(()=>Math.random()-0.5);

    loadQuestion();
}

taeAnswer.addEventListener("click",()=>{
    checkAnswer("Tae");
});

kooAnswer.addEventListener("click",()=>{
    checkAnswer("Koo");
});

restartBtn.addEventListener("click",()=>{
    restartGame();
});