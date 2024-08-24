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