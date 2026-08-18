document.addEventListener("DOMContentLoaded",()=>{
    const buttons=document.querySelectorAll(".filter-btn");
    const cards=document.querySelectorAll(".lyrics-song-card");
    buttons.forEach(button=>{
        button.addEventListener("click",()=>{
            buttons.forEach(btn=>btn.classList.remove("active"));
            button.classList.add("active");
            const artist=button.dataset.artist;
            cards.forEach(card=>{
                if(artist==="all"||card.dataset.artist===artist){
                    card.style.display="block";
                }else{
                    card.style.display="none";
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded",()=>{
    const buttons=document.querySelectorAll(".toggle-btn");
    const sections=document.querySelectorAll(".lyrics-section");
    buttons.forEach(button=>{
        button.addEventListener("click",()=>{
            const target=button.dataset.target;
            buttons.forEach(btn=>btn.classList.remove("active"));
            button.classList.add("active");
            sections.forEach(section=>{
                if(target==="all"||section.classList.contains(target)){
                    section.style.display="block";
                }else{
                    section.style.display="none";
                }
            });
            if(target==="all"){
                document.querySelector(".lyrics-container").classList.add("show-all");
            }
        });
    });
});