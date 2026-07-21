document.addEventListener("DOMContentLoaded",()=>{

    const image=document.getElementById("parkEntranceImage");
    const questionBox=document.getElementById("parkQuestion");
    const answerInput=document.getElementById("parkAnswer");
    const checkButton=document.getElementById("checkPass");
    const message=document.getElementById("passMessage");
    const questionSection=document.getElementById("passQuestionBox");
    const parkPass=document.getElementById("parkPass");
    const enterButton=document.getElementById("enterPark");

    let currentQuestion=null;

    const hour=new Intl.DateTimeFormat("en-US",{
        timeZone:"America/New_York",
        hour:"numeric",
        hour12:false
    }).format(new Date());

    if(hour>=6 && hour<18){
        image.style.backgroundImage=
        "url('/static/images/games/themepark/themepark_day.png')";
    }
    else{
        image.style.backgroundImage=
        "url('/static/images/games/themepark/themepark_night.png')";
    }

    fetch("/static/json/themeparkpass.json")
    .then(response=>response.json())
    .then(data=>{

        currentQuestion=
        data[Math.floor(Math.random()*data.length)];

        questionBox.textContent=
        "❓ "+currentQuestion.question;

    })
    .catch(error=>{
        questionBox.textContent=
        "Unable to load question.";
        console.error(error);
    });

    checkButton.addEventListener("click",()=>{
        if(!currentQuestion){
            return;
        }

        const answer=
        answerInput.value
        .trim()
        .toLowerCase();

        const correct=
        currentQuestion.answers.some(item=>
            item.toLowerCase()===answer
        );

        if(correct){
            message.textContent=
            "✨ Welcome to TKU Theme Park! Your pass is ready!";
            questionSection.style.display="none";
            parkPass.classList.remove("hidden");
        }
        else{
            message.textContent=
            "🎩 The Gatekeeper says... try again!";
        }
    });

    enterButton.addEventListener("click",()=>{
        window.location.href="/games/themepark";
    });
});