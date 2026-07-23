document.addEventListener("DOMContentLoaded",()=>{

    console.log("Themepark JS loaded");

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

    if(image){
        if(hour>=6 && hour<18){
            image.style.backgroundImage=
            "url('/static/images/games/themepark/themepark_day.png')";
        }
        else{
            image.style.backgroundImage=
            "url('/static/images/games/themepark/themepark_night.png')";
        }
    }

    if(questionBox){
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
    }

    if(checkButton){
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
    }

    if(enterButton){
        enterButton.addEventListener("click",()=>{
            window.location.href="/themepark";
        });
    }

    const zoneCards=document.querySelectorAll(".zone-card");
    zoneCards.forEach(card=>{
        card.addEventListener("mouseenter",()=>{
            const title=card.querySelector("h2")?.textContent;
            if(title){
                console.log("Visiting:",title);
            }
        });
    });
    const guideButton=document.getElementById("parkGuideButton");
    const guideModal=document.getElementById("parkGuideModal");
    const closeGuide=document.getElementById("closeGuide");
    const guideTitle=document.getElementById("guideTitle");
    const guideDescription=document.getElementById("guideDescription");
    const guideFooter=document.getElementById("guideFooter");
    
    if(guideButton && guideModal){
    
        guideButton.addEventListener("click",()=>{
    
            guideModal.classList.remove("hidden");
    
        });
    
        if(closeGuide){
            closeGuide.addEventListener("click",()=>{
                guideModal.classList.add("hidden");
            });
        }
    
        guideModal.addEventListener("click",(event)=>{
            if(event.target===guideModal){
                guideModal.classList.add("hidden");
            }
        });
    
        fetch("/static/json/themeparkguide.json")
        .then(response=>response.json())
        .then(data=>{
    
            if(guideTitle){
                guideTitle.textContent=data.title;
            }
    
            if(guideDescription){
                guideDescription.textContent=data.description;
            }
    
            if(guideFooter){
                guideFooter.textContent=data.footer;
                guideFooter.style.whiteSpace="pre-line";
            }
    
        })
        .catch(error=>{
            console.error("Guide JSON error:",error);
        });
    
    }
});