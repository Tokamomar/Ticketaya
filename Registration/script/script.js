const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError")

function checkPasswords(){
    if(password.value !== confirmPassword.value){
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
}

confirmPassword.addEventListener('input', checkPasswords);
password.addEventListener('input', checkPasswords);

const closeBtns = document.getElementsByClassName('closeBtn');
for (const closeBtn of closeBtns) {
    closeBtn.addEventListener('click', () => {
        const popupContainers = document.getElementsByClassName('popup-container');
        for (const popupContainer of popupContainers) {
            popupContainer.style.display = 'none';
        }
        window.location.href = '../index/login.html'
    });
}

const submitBtn = document.getElementById('submitBtn');
// when all data are accepted
submitBtn.addEventListener('click' , ()=>{
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'flex';
})