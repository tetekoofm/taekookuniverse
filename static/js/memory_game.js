const allImages = window.memoryImages || [];

console.log("Memory images:", allImages);

const difficulties = {
    easy:[3, 5, 8, 10, 12],
    difficult:[6, 8, 12, 15, 18]
};

let difficulty = "";
let level = 0;
let lock = false;
let flippedCard = null;
let matchedPairs = 0;
let confettiPieces = [];

const board = document.getElementById("game-board");
const msg = document.getElementById("message");
const levelText = document.getElementById("level-text");

function startGame(mode){
    difficulty = mode;
    level = 0;

    document.querySelector(".memory-game").classList.add("playing");

    document.getElementById("difficulty-select").style.display="none";
    document.getElementById("game-area").style.display="block";

    startLevel();
}

function startLevel(){
    msg.style.display="none";

    level++;

    const maxLevels = difficulties[difficulty].length;

    if(level > maxLevels){
        finishGame();
        return;
    }

    const pairs = difficulties[difficulty][level-1];

    levelText.textContent =
        `${difficulty.toUpperCase()} - Level ${level} (${pairs} pairs)`;

    const selectedImages = getRandomImages(pairs);

    let cards=[];

    selectedImages.forEach(img=>{
        cards.push(createCard(img));
        cards.push(createCard(img));
    });

    shuffle(cards);

    board.innerHTML="";

    board.style.gridTemplateColumns =
        `repeat(${Math.ceil(Math.sqrt(cards.length))},1fr)`;

    cards.forEach(card=>board.appendChild(card));

    matchedPairs=0;
    flippedCard=null;
    lock=false;
}

function getRandomImages(count){
    let copy=[...allImages];
    shuffle(copy);

    return copy.slice(0,count);
}

function createCard(image){
    const card=document.createElement("div");

    card.classList.add("memory-card");

    card.innerHTML=`
        <div class="memory-front">💜</div>
        <div class="memory-back">
            <img src="${image}">
        </div>
    `;

    card.addEventListener("click",()=>flip(card));

    return card;
}

function flip(card){
    if(lock || card.classList.contains("flip")) return;

    card.classList.add("flip");

    if(!flippedCard){
        flippedCard=card;
    }else{
        checkMatch(card);
    }
}

function checkMatch(card2){
    lock=true;

    const img1=flippedCard.querySelector("img").src;
    const img2=card2.querySelector("img").src;

    if(img1===img2){

        matchedPairs++;

        flippedCard=null;
        lock=false;

        const pairs = difficulties[difficulty][level-1];

        if(matchedPairs===pairs){
            setTimeout(startLevel,1000);
        }

    }else{

        setTimeout(()=>{
            flippedCard.classList.remove("flip");
            card2.classList.remove("flip");
            flippedCard=null;
            lock=false;

        },800);
    }
}

function finishGame(){
    board.innerHTML="";

    msg.innerHTML=`
        <div class="memory-trophy">🏆</div>
        <h2>Congratulations!</h2>
        <p>You completed all rounds and became a</p>
        <h3>💜 Taekook Memory Master 💜</h3>
    `;

    msg.style.display="block";

    launchConfetti();
}

function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
}

function launchConfetti(){
    confettiPieces=[];

    for(let i=0;i<120;i++){
        confettiPieces.push({
            x:Math.random()*window.innerWidth,
            y:-20,
            size:Math.random()*8+4,
            speed:Math.random()*3+2,
            rotation:Math.random()*360
        });
    }

    animateConfetti();

    setTimeout(()=>{
        confettiPieces=[];
    },4000);
}

function animateConfetti(){
    if(confettiPieces.length===0) return;

    let canvas=document.getElementById("confetti-canvas");

    if(!canvas){
        canvas=document.createElement("canvas");
        canvas.id="confetti-canvas";
        document.body.appendChild(canvas);
    }

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    let ctx=canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);

    confettiPieces.forEach(piece=>{
        ctx.save();
        ctx.translate(piece.x,piece.y);
        ctx.rotate(piece.rotation);

        ctx.fillStyle=
            ["#6A0DAD","#0FFF50","#FFD700","#FF69B4"]
            [Math.floor(Math.random()*4)];

        ctx.fillRect(
            0,
            0,
            piece.size,
            piece.size
        );

        ctx.restore();

        piece.y+=piece.speed;
        piece.rotation+=5;
    });

    confettiPieces=confettiPieces.filter(
        piece=>piece.y<canvas.height
    );

    requestAnimationFrame(animateConfetti);
}