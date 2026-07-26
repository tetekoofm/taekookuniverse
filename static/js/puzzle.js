let puzzleSize=3;
let currentImage="";
let score=0;
let completedCount=0;
let timer;
let elapsedSeconds=0;
let puzzleStartTime=0;
let pieces=[];
let selectedPiece=null;
let puzzleComplete=false;

const board=document.getElementById("puzzleBoard");
document.querySelectorAll(".difficulty-btn").forEach(btn=>{
    btn.onclick=()=>{
        document.querySelectorAll(".difficulty-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        puzzleSize=parseInt(btn.dataset.size);
    };
});

document.getElementById("startBtn").onclick=()=>{
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    score=0;
    completedCount=0;
    elapsedSeconds=0;
    document.getElementById("score").textContent=0;
    document.getElementById("completedCount").textContent=0;
    document.getElementById("timer").textContent="00:00";
    startTimer();
    loadPuzzle();
};

function startTimer(){
    clearInterval(timer);
    timer=setInterval(()=>{
        elapsedSeconds++;
        document.getElementById("timer").textContent=formatTime(elapsedSeconds);
    },1000);
}

function formatTime(seconds){
    let min=Math.floor(seconds/60);
    let sec=seconds%60;
    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function loadPuzzle(){
    puzzleComplete=false;
    puzzleStartTime=elapsedSeconds;
    board.innerHTML="";
    pieces=[];
    currentImage=puzzleImages[Math.floor(Math.random()*puzzleImages.length)];
    let size=board.clientWidth;
    let pieceSize=size/puzzleSize;
    let positions=[];
    for(let i=0;i<puzzleSize*puzzleSize;i++){
        positions.push(i);
    }
    positions.sort(()=>Math.random()-.5);
    positions.forEach((correctId,index)=>{
        let piece=document.createElement("div");
        let row=Math.floor(correctId/puzzleSize);
        let col=correctId%puzzleSize;
        piece.className="puzzle-piece";
        piece.dataset.correct=correctId;
        piece.dataset.position=index;
        piece.style.width=pieceSize+"px";
        piece.style.height=pieceSize+"px";
        piece.style.backgroundImage=`url('${currentImage}')`;
        piece.style.backgroundSize=`${size}px ${size}px`;
        piece.style.backgroundPosition=`-${col*pieceSize}px -${row*pieceSize}px`;
        setPosition(piece,index,pieceSize);
        addDrag(piece);
        pieces.push(piece);
        board.appendChild(piece);
    });
}

function setPosition(piece,index,size){
    let row=Math.floor(index/puzzleSize);
    let col=index%puzzleSize;
    piece.style.left=col*size+"px";
    piece.style.top=row*size+"px";
}

function addDrag(piece){
    let offsetX=0;
    let offsetY=0;
    let dragging=false;
    piece.onpointerdown=e=>{
        if(piece.classList.contains("locked"))return;
        selectedPiece=piece;
        dragging=true;
        piece.setPointerCapture(e.pointerId);
        let rect=piece.getBoundingClientRect();
        offsetX=e.clientX-rect.left;
        offsetY=e.clientY-rect.top;
        piece.style.zIndex=50;
    };

    piece.onpointermove=e=>{
        if(!dragging)return;
        let rect=board.getBoundingClientRect();
        let x=e.clientX-rect.left-offsetX;
        let y=e.clientY-rect.top-offsetY;
        piece.style.left=x+"px";
        piece.style.top=y+"px";
    };

    piece.onpointerup=e=>{
        if(!dragging)return;
        dragging=false;
        piece.releasePointerCapture(e.pointerId);
        let size=board.clientWidth/puzzleSize;
        let x=parseFloat(piece.style.left);
        let y=parseFloat(piece.style.top);
        let col=Math.round(x/size);
        let row=Math.round(y/size);
        let targetPosition=row*puzzleSize+col;
        let target=pieces.find(p=>
            parseInt(p.dataset.position)===targetPosition &&
            p!==piece
        );

        if(target){
            swapPieces(piece,target);
        }
        else{
            setPosition(piece,parseInt(piece.dataset.position),size);
        }
        piece.style.zIndex=1;
        selectedPiece=null;
    };
}

function swapPieces(a,b){
    let temp=a.dataset.position;
    a.dataset.position=b.dataset.position;
    b.dataset.position=temp;
    let size=board.clientWidth/puzzleSize;
    setPosition(a,parseInt(a.dataset.position),size);
    setPosition(b,parseInt(b.dataset.position),size);
    checkSolved(a);
    checkSolved(b);
}

function checkSolved(piece){
    if(piece.dataset.position===piece.dataset.correct){
        piece.classList.add("locked");
    }
    else{
        piece.classList.remove("locked");
    }
    checkComplete();
}

function checkComplete(){
    if(puzzleComplete)return;
    let solved=pieces.every(piece=>
        piece.dataset.position===piece.dataset.correct
    );
    if(solved){
        puzzleComplete=true;
        puzzleSolved();
    }
}

function puzzleSolved(){
    let timeTaken=elapsedSeconds-puzzleStartTime;
    score+=100;
    completedCount++;
    document.getElementById("score").textContent=score;
    document.getElementById("completedCount").textContent=completedCount;
    document.getElementById("completeScore").textContent=score;
    document.getElementById("completeTime").textContent=formatTime(timeTaken);
    document.getElementById("completeScreen").classList.remove("hidden");
}

document.getElementById("nextPuzzleBtn").onclick=()=>{
    document.getElementById("completeScreen").classList.add("hidden");
    loadPuzzle();
};

document.getElementById("exitBtn").onclick=()=>{
    window.location.href="/challenge-zone";
};