const settings = document.getElementById('settings');
const settingsPopup = document.getElementById('settingsPopup');
const cancel = document.getElementById('cancel');
const heart = document.getElementById('heart');

settings.addEventListener('click' , ()=>{
    settingsPopup.style.display = "flex";
})
cancel.addEventListener('click' , ()=>{
    settingsPopup.style.display = "none";
})
settingsPopup.addEventListener('click' , ()=>{
    settingsPopup.style.display = "none";
})

var clicked = false ;
heart.addEventListener('click' , ()=>{
    if(!clicked){
        heart.style.color = "red";
        clicked = true ;
    }else{
        heart.style.color = "white";
        clicked = false
    }
})
 