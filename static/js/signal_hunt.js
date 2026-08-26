document.addEventListener("DOMContentLoaded", () => {
    const TOTAL_ROUNDS = 7;
    const MAX_ROUND_SCORE = 100;
    const SIGNAL_LIFETIME = 1500;
    const VALID_SIGNALS = ["🐻","🐯","🐰","💜","💚","❤️","💛"];
    const FAKE_SIGNAL = "🚫";

    const signalArea = document.getElementById("signalArea");
    const signalIntro = document.getElementById("signalIntro");
    const signalMessage = document.getElementById("signalMessage");
    const signalTarget = document.getElementById("signalTarget");
    const feedback = document.getElementById("feedback");
    const roundResult = document.getElementById("roundResult");
    const resultLabel = document.getElementById("resultLabel");
    const reactionTime = document.getElementById("reactionTime");
    const pointsEarned = document.getElementById("pointsEarned");
    const startButton = document.getElementById("startButton");
    const replayButton = document.getElementById("replayButton");
    const closeResults = document.getElementById("closeResults");
    const roundNumber = document.getElementById("roundNumber");
    const scoreDisplay = document.getElementById("score");
    const bestScoreDisplay = document.getElementById("bestScore");
    const finalResults = document.getElementById("finalResults");
    const finalScore = document.getElementById("finalScore");
    const finalRank = document.getElementById("finalRank");
    const finalBestReaction = document.getElementById("finalBestReaction");
    const correctSignals = document.getElementById("correctSignals");
    const avoidedSignals = document.getElementById("avoidedSignals");
    const newBest = document.getElementById("newBest");
    const progressDots = document.querySelectorAll(".progress-dot");

    let currentRound = 0;
    let score = 0;
    let reactionTimes = [];
    let correctCount = 0;
    let avoidedCount = 0;
    let currentSignalIsFake = false;
    let signalVisible = false;
    let waitingForSignal = false;
    let reactionStart = 0;
    let signalTimer = null;
    let signalLifetimeTimer = null;
    let nextRoundTimer = null;
    let gameActive = false;
    let personalBest = parseInt(localStorage.getItem("tkuSignalHuntBest"));

    bestScoreDisplay.textContent = isNaN(personalBest) ? "—" : personalBest.toLocaleString();

    function startGame() {
        clearAllTimers();
        currentRound = 0;
        score = 0;
        reactionTimes = [];
        correctCount = 0;
        avoidedCount = 0;
        currentSignalIsFake = false;
        signalVisible = false;
        waitingForSignal = false;
        gameActive = true;
        scoreDisplay.textContent = "0";
        finalResults.style.display = "none";
        signalIntro.style.display = "none";
        roundResult.style.display = "none";
        signalTarget.style.display = "none";
        signalMessage.style.display = "block";
        signalMessage.textContent = "GET READY...";
        resetProgress();

        nextRoundTimer = setTimeout(() => {
            startRound();
        }, 800);
    }

    function startRound() {
        if (!gameActive) return;

        clearTimeout(signalLifetimeTimer);

        currentRound++;
        roundNumber.textContent = currentRound;
        updateProgress();

        roundResult.style.display = "none";
        signalTarget.style.display = "none";
        signalTarget.classList.remove("valid","fake");

        signalMessage.style.display = "block";
        signalMessage.textContent = "WATCH FOR THE SIGNAL";

        signalVisible = false;
        waitingForSignal = true;

        const delay = Math.floor(Math.random() * 2300) + 1200;

        signalTimer = setTimeout(showSignal, delay);
    }

    function showSignal() {
        if (!gameActive) return;

        waitingForSignal = false;
        signalVisible = true;
        signalMessage.style.display = "none";

        currentSignalIsFake = Math.random() < 0.25;

        const selectedSignal = currentSignalIsFake
            ? FAKE_SIGNAL
            : VALID_SIGNALS[Math.floor(Math.random() * VALID_SIGNALS.length)];

        signalTarget.innerHTML = `<span>${selectedSignal}</span>`;
        signalTarget.classList.remove("valid","fake");
        signalTarget.classList.add(currentSignalIsFake ? "fake" : "valid");

        positionTarget();
        randomizeTargetSize();

        signalTarget.style.display = "flex";
        reactionStart = performance.now();

        signalLifetimeTimer = setTimeout(signalExpired, SIGNAL_LIFETIME);
    }

    function signalExpired() {
        if (!gameActive || !signalVisible) return;

        signalVisible = false;
        signalTarget.style.display = "none";

        if (currentSignalIsFake) {
            avoidedCount++;
            score += MAX_ROUND_SCORE;
            scoreDisplay.textContent = score.toLocaleString();

            showFeedback("+100","correct");
            showResult("SIGNAL AVOIDED",null,MAX_ROUND_SCORE);
        } else {
            showFeedback("MISSED","penalty");
            showResult("TOO SLOW",null,0);
        }
    }

    function handleSignalClick(event) {
        event.stopPropagation();

        if (!gameActive) return;

        if (waitingForSignal) {
            falseStart();
            return;
        }

        if (!signalVisible) return;

        clearTimeout(signalLifetimeTimer);

        const elapsed = (performance.now() - reactionStart) / 1000;
        const time = Math.round(elapsed * 1000) / 1000;

        signalVisible = false;
        signalTarget.style.display = "none";

        if (currentSignalIsFake) {
            handleFakeSignal(time);
        } else {
            handleValidSignal(time);
        }
    }

    function handleValidSignal(time) {
        correctCount++;
        reactionTimes.push(time);

        const speedRatio = Math.max(0,Math.min(1,1 - (time / (SIGNAL_LIFETIME / 1000))));
        const points = Math.round(50 + (50 * speedRatio));

        score += points;
        scoreDisplay.textContent = score.toLocaleString();

        showFeedback(`+${points}`,"correct");
        showResult("GREAT REACTION",time,points);
    }

    function handleFakeSignal(time) {
        showFeedback("FAKE SIGNAL!","wrong");
        showResult("FAKE SIGNAL!",time,0);
    }

    function falseStart() {
        clearTimeout(signalTimer);
        waitingForSignal = false;

        showFeedback("TOO SOON!","penalty");
        showResult("TOO SOON!",null,0);
    }

    function showResult(label,time,points) {
        resultLabel.textContent = label;
        reactionTime.textContent = time !== null ? time.toFixed(3) : "—";
        pointsEarned.textContent = points > 0 ? `+${points} POINTS` : "0 POINTS";
        roundResult.style.display = "block";

        if (currentRound >= TOTAL_ROUNDS) {
            nextRoundTimer = setTimeout(finishGame,1100);
            return;
        }

        nextRoundTimer = setTimeout(startRound,1100);
    }

    function showFeedback(text,type) {
        feedback.textContent = text;
        feedback.className = `feedback ${type}`;
        feedback.style.display = "block";
        void feedback.offsetWidth;
        feedback.style.animation = "none";
        void feedback.offsetWidth;
        feedback.style.animation = "";

        setTimeout(() => {
            feedback.style.display = "none";
        },700);
    }

    function positionTarget() {
        const areaWidth = signalArea.clientWidth;
        const areaHeight = signalArea.clientHeight;
        const targetSize = window.innerWidth <= 768 ? 120 : 145;
        const padding = 20;

        const maxX = Math.max(padding,areaWidth - targetSize - padding);
        const maxY = Math.max(padding,areaHeight - targetSize - padding);

        const x = Math.random() * Math.max(0,maxX - padding) + padding;
        const y = Math.random() * Math.max(0,maxY - padding) + padding;

        signalTarget.style.left = `${x}px`;
        signalTarget.style.top = `${y}px`;
        signalTarget.style.transform = "none";
    }

    function randomizeTargetSize() {
        const sizes = [115,125,135,145];
        const size = sizes[Math.floor(Math.random() * sizes.length)];

        signalTarget.style.width = `${size}px`;
        signalTarget.style.height = `${size}px`;
    }

    function finishGame() {
        gameActive = false;
        clearAllTimers();

        signalTarget.style.display = "none";
        signalMessage.style.display = "none";
        roundResult.style.display = "none";

        const bestReaction = reactionTimes.length ? Math.min(...reactionTimes) : null;
        const oldBest = personalBest;
        const isNewBest = isNaN(personalBest) || score > personalBest;

        if (isNewBest) {
            personalBest = score;
            localStorage.setItem("tkuSignalHuntBest",personalBest);
            bestScoreDisplay.textContent = personalBest.toLocaleString();
        }

        finalScore.textContent = `${score} / ${TOTAL_ROUNDS * MAX_ROUND_SCORE}`;
        finalBestReaction.textContent = bestReaction !== null ? bestReaction.toFixed(3) : "—";
        correctSignals.textContent = correctCount;
        avoidedSignals.textContent = avoidedCount;
        finalRank.textContent = getRank(score);

        if (isNewBest && (isNaN(oldBest) || score > oldBest)) {
            newBest.style.display = "block";
        } else {
            newBest.style.display = "none";
        }

        finalResults.style.display = "flex";
        updateProgress(true);
    }

    function getRank(score) {
        if (score >= 650) return "MASTER";
        if (score >= 575) return "EXPERT";
        if (score >= 500) return "ADVANCED";
        if (score >= 400) return "SKILLED";
        if (score >= 300) return "EXPLORER";
        return "BEGINNER";
    }

    function resetProgress() {
        progressDots.forEach(dot => {
            dot.classList.remove("active","completed");
        });

        if (progressDots[0]) {
            progressDots[0].classList.add("active");
        }
    }

    function updateProgress(final = false) {
        progressDots.forEach((dot,index) => {
            dot.classList.remove("active","completed");

            if (index < currentRound - 1) {
                dot.classList.add("completed");
            }

            if (!final && index === currentRound - 1) {
                dot.classList.add("active");
            }

            if (final) {
                dot.classList.add("completed");
            }
        });
    }

    function clearAllTimers() {
        clearTimeout(signalTimer);
        clearTimeout(signalLifetimeTimer);
        clearTimeout(nextRoundTimer);
    }

    startButton.addEventListener("click",startGame);
    replayButton.addEventListener("click",startGame);

    closeResults.addEventListener("click",() => {
        finalResults.style.display = "none";
    });

    signalTarget.addEventListener("click",handleSignalClick);

    signalArea.addEventListener("click",event => {
        if (!gameActive) return;
        if (event.target === signalTarget || event.target.closest(".signal-target")) return;

        if (waitingForSignal) {
            falseStart();
        }
    });
});