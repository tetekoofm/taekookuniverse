const tfyChat = [
    {character:"tae", message:"Kook, are you ready?"},
    {character:"jk", message:"Ready for what? You've been hiding something from me all day."},
    {character:"tae", message:"Maybe I have."},
    {character:"jk", message:"You know I'm bad at waiting for surprises, right?"},
    {character:"tae", message:"That's why I chose this place, so you will enjoy."},
    {character:"jk", message:"I like that idea."},
    {character:"tae", message:"I'll get us some snacks. Wait here for a minute."},
    {character:"jk", message:"Okay, but don't take too long."}
];

const tfyMissingChat = [
    {character:"jk", message:"Tae?"},
    {character:"jk", message:"You've been gone for a while..."},
    {character:"jk", message:"Where did you go?"},
    {character:"jk", message:"Wait... what's this?"}
];

let tfyChatIndex = 0;
let tfyMissingIndex = 0;

document.addEventListener("DOMContentLoaded",()=>{
    showNextTFYChat();
});


function showNextTFYChat(){

    if(tfyChatIndex >= tfyChat.length){
        setTimeout(()=>{
            startSearchScene();
        },1000);
        return;
    }

    let chat=tfyChat[tfyChatIndex];

    showBubble(
        chat.character==="tae" ? "taeBubble" : "jkBubble",
        chat.message
    );

    tfyChatIndex++;

    setTimeout(()=>{
        hideBubbles();
        showNextTFYChat();
    },3000);
}


function startSearchScene(){

    hideBubbles();

    let tae=document.querySelector(".tae-character");

    if(tae){
        tae.classList.add("tfy-hidden");
    }

    setTimeout(()=>{
        showNextMissingChat();
    },1000);

}

function showNextMissingChat(){

    if(tfyMissingIndex >= tfyMissingChat.length){

        setTimeout(()=>{
            showFirstClue();
        },1500);

        return;
    }

    let chat=tfyMissingChat[tfyMissingIndex];

    showBubble("jkBubble",chat.message);

    tfyMissingIndex++;

    setTimeout(()=>{
        hideBubbles();
        showNextMissingChat();
    },2500);
}


function showFirstClue(){

    document.getElementById("taeNote")
    .classList.remove("hidden");

}


function showBubble(id,message){

    let bubble=document.getElementById(id);

    bubble.querySelector(".bubble-text").innerHTML=message;
    bubble.classList.add("show");

}


function hideBubbles(){

    document.querySelectorAll(".story-bubble")
    .forEach(bubble=>{
        bubble.classList.remove("show");
    });

}