document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    var email = document.getElementById('email').value;
    
    // Simulate sending a password reset email
    if (validateEmail(email)) {
        document.getElementById('message').innerText = 'A password reset link has been sent to your email address.';
        document.getElementById('message').style.color = 'green';
    } else {
        document.getElementById('message').innerText = 'Please enter a valid email address.';
        document.getElementById('message').style.color = 'red';
    }
});

function validateEmail(email) {
    // Simple regex for basic email validation
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
