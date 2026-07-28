const GAME_NAME = "Song Scramble";
let songs = [];
let remainingSongs = [];
let currentSong = '';
let score = 0;
let questionCount = 0;
const maxQuestions = 10;
let gameOver = false;

// Load songs JSON
async function loadSongs() {
    const res = await fetch('/static/json/guess_song_scrambled.json');
    songs = await res.json();
    remainingSongs = [...songs];
    startGame();
}

// Shuffle word
function shuffleWord(word) {
    let arr = word.replace(/\s+/g,'').split('');
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

// Start game
function startGame() {
    score = 0;
    questionCount = 0;
    gameOver = false;
    remainingSongs = [...songs];
    document.getElementById('score').innerText = score;
    document.getElementById('question-count').innerText = questionCount;
    document.getElementById('feedback').innerText = '';
    enableButtons();
    nextSong();
}

// Next song
function nextSong() {
    if(questionCount >= maxQuestions || remainingSongs.length === 0){
        endGame();
        return;
    }

    // Pick a random song from remainingSongs
    const idx = Math.floor(Math.random() * remainingSongs.length);
    currentSong = remainingSongs[idx];

    // Remove selected song from remainingSongs to prevent repeats
    remainingSongs.splice(idx, 1);

    const wordCount = currentSong.trim().split(/\s+/).length;
    document.getElementById('clue-text').innerText = `Clue: ${wordCount} word${wordCount > 1 ? 's' : ''}`;
    document.getElementById('jumbled-text').innerText = shuffleWord(currentSong);
    document.getElementById('user-answer').value = '';
    document.getElementById('feedback').innerText = '';

    questionCount++;
    document.getElementById('question-count').innerText = questionCount;
    enableButtons();
}

// Confetti
function launchConfetti(particles=100){
    confetti({ particleCount: particles, spread: 70, origin: { y:0.6 } });
}

// Enable/disable buttons
function disableButtons(){
    document.getElementById('check-answer-btn').disabled = true;
    document.getElementById('skip-btn').disabled = true;
}
function enableButtons(){
    document.getElementById('check-answer-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
}

// Check answer
document.getElementById('check-answer-btn').addEventListener('click', ()=>{
    if(gameOver) return;
    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g,'');
    const userAnswer = normalize(document.getElementById('user-answer').value);
    const correctAnswer = normalize(currentSong);

    if(userAnswer === correctAnswer.toLowerCase()){
        score++;
        document.getElementById('feedback').innerText = 'Correct! 🎉';
        launchConfetti();
    } else {
        document.getElementById('feedback').innerText = `Incorrect ❌. Answer was: ${currentSong}`;
    }
    document.getElementById('score').innerText = score;
    disableButtons();
    setTimeout(nextSong, 1000);
});

// Skip
document.getElementById('skip-btn').addEventListener('click', ()=>{
    if(gameOver) return;
    disableButtons();
    nextSong();
});

// End game
function endGame(){
    gameOver = true;
    disableButtons();
    showScorePopup();
}

// Show score popup
function showScorePopup(){
    document.getElementById("final-score").innerText = score;
    document.getElementById("username-input").style.display = 'inline-block';
    document.getElementById("username-input").value = '';
    document.getElementById("submit-score-btn").style.display = 'inline-block';
    document.getElementById("skip-score-btn").style.display = 'inline-block';
    document.getElementById("post-game-menu").style.display = 'none';

    const popup = document.getElementById("score-popup");
    popup.style.display = "flex";
    popup.classList.add("active");
}

// Submit / skip score
document.getElementById('submit-score-btn').addEventListener('click', ()=> saveAndShowPost(true));
document.getElementById('skip-score-btn').addEventListener('click', ()=> saveAndShowPost(false));

async function saveAndShowPost(useUsername){
    const username = useUsername ? document.getElementById("username-input").value.trim() || "Anonymous" : "Anonymous";
    const isTop = await saveScore(username, score, GAME_NAME);
    showPostGameMenu(isTop);
}

// Show post-game menu
function showPostGameMenu(isTop){
    document.getElementById("username-input").style.display = 'none';
    document.getElementById("submit-score-btn").style.display = 'none';
    document.getElementById("skip-score-btn").style.display = 'none';
    document.getElementById("post-game-menu").style.display = 'block';

    if(isTop) launchConfetti(500);
}

// Save leaderboard score
async function saveScore(username, score, gameName){
    try {
        const res = await fetch('/submit_score', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({game: gameName, username, score})
        });
        if(!res.ok){
            console.error(await res.text());
            return false;
        }
        const data = await res.json();
        displayLeaderboard(data.leaderboard || []);
        return data.leaderboard[0]?.score === score;
    } catch(err){
        console.error("Error saving score:", err);
        return false;
    }
}

// Display leaderboard
function displayLeaderboard(leaderboard){
    const list = document.getElementById("leaderboard");
    list.innerHTML = "";
    if(!leaderboard.length){
        list.innerHTML = "<li>No scores yet!</li>";
        return;
    }
    leaderboard.forEach((entry,i)=>{
        const li = document.createElement("li");
        li.innerText = `${i+1}️⃣ ${entry.username} — ${entry.score}`;
        if(i===0) li.style.border="2px solid gold";
        else if(i===1) li.style.border="2px solid silver";
        else if(i===2) li.style.border="2px solid #cd7f32";
        list.appendChild(li);
    });
}

// Post-game menu actions
function goHome(){ window.location.href = '/'; }
function goGames(){ window.location.href = '/games'; }
function playAgain(){
    const popup = document.getElementById("score-popup");
    popup.style.display='none';
    popup.classList.remove("active");
    document.getElementById("username-input").style.display='inline-block';
    document.getElementById("username-input").value='';
    document.getElementById("submit-score-btn").style.display='inline-block';
    document.getElementById("skip-score-btn").style.display='inline-block';
    document.getElementById("post-game-menu").style.display='none';
    startGame();
}

// Load leaderboard on page load
document.addEventListener('DOMContentLoaded', async ()=>{
    try{
        const res = await fetch(`/leaderboard/${GAME_NAME}`);
        if(!res.ok){
            console.error(await res.text());
            return;
        }
        const data = await res.json();
        displayLeaderboard(data);
    } catch(err){ console.error(err); }
});

loadSongs();

document.getElementById("exitBtn").onclick=()=>{
    window.location.href="/challenge-zone";
};