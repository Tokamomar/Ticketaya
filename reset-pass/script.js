document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('message').innerText = 'Passwords do not match!';
        document.getElementById('message').style.color = 'red';
    } else {
        document.getElementById('message').innerText = 'Password reset successful!';
        document.getElementById('message').style.color = '#80ed99';

        // You can add code here to handle the actual password reset, such as sending a request to the server
    }
});
