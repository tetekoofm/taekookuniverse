let triviaData=[];
let questionPool=[];
let currentTriviaQuestion=null;
let score=0;
let questionCount=0;
let timeLeft=60;
let timer;
let answered=false;
let gameOver=false;

fetch("/static/json/taekook_trivia.json")
.then(response=>response.json())
.then(data=>{
triviaData=data;
startTrivia();
});

function startTrivia(){
score=0;
questionCount=0;
timeLeft=60;
gameOver=false;
questionPool=[...triviaData].sort(()=>Math.random()-0.5);
document.getElementById("score").innerText=0;
document.getElementById("question-count").innerText=0;
document.getElementById("timer").innerText=timeLeft;
document.getElementById("skip-btn").disabled=false;
loadQuestion();
startTimer();
}

function loadQuestion(){
answered=false;
if(questionPool.length===0){
questionPool=[...triviaData].sort(()=>Math.random()-0.5);
}
currentTriviaQuestion=questionPool.pop();
document.getElementById("trivia-question").innerText=currentTriviaQuestion.question;
let html="";
currentTriviaQuestion.options.forEach(option=>{
html+=`<button class="answer-btn">${option}</button>`;
});
document.getElementById("answer-options").innerHTML=html;
document.querySelectorAll(".answer-btn").forEach(btn=>{
btn.onclick=()=>checkAnswer(btn,btn.innerText);
});
document.getElementById("feedback").innerText="";
}

function checkAnswer(button,answer){
if(answered||gameOver)return;
answered=true;
questionCount++;
let correct=currentTriviaQuestion.answer;
document.querySelectorAll(".answer-btn").forEach(btn=>{
btn.disabled=true;
if(btn.innerText.trim()===correct){
btn.classList.add("correct");
}
});
if(answer===correct){
score+=100;
button.classList.add("correct");
document.getElementById("feedback").innerText="✨ Correct!";
}else{
button.classList.add("wrong");
document.getElementById("feedback").innerText="Correct answer: "+correct;
}
document.getElementById("score").innerText=score;
document.getElementById("question-count").innerText=questionCount;
setTimeout(()=>{
if(!gameOver){
loadQuestion();
}
},800);
}

function skipQuestion(){
if(gameOver)return;
loadQuestion();
}

document.getElementById("skip-btn").onclick=skipQuestion;

function startTimer(){
clearInterval(timer);
timer=setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText=timeLeft;
if(timeLeft<=0){
clearInterval(timer);
endGame();
}
},1000);
}

function endGame(){
gameOver=true;
clearInterval(timer);
document.getElementById("feedback").innerText="🎉 Time's up! Final Score: "+score;
document.querySelectorAll(".answer-btn").forEach(btn=>btn.disabled=true);
document.getElementById("skip-btn").disabled=true;
}

document.getElementById("exitBtn").onclick=()=>{
    window.location.href="/challenge-zone";
};