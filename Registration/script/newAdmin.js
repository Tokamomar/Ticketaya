const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const form = document.getElementById("adminForm");
const successMessage = document.getElementById("successMessage");
const cancelBtn = document.getElementById("cancelBtn");
const formHeading = document.getElementById("formHeading");

function checkPasswords() {
    if (password.value !== confirmPassword.value) {
        passwordError.style.display = 'block';
        return false;
    } 
    else {
        passwordError.style.display = 'none';
        return true;
    }
}

confirmPassword.addEventListener('input', checkPasswords);
password.addEventListener('input', checkPasswords);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (checkPasswords()) {
        form.style.display = 'none';
        formHeading.style.display = 'none';
        successMessage.style.display = 'block';
    }
});

cancelBtn.addEventListener('click', function () {
    form.reset();
    passwordError.style.display = 'none';
});
