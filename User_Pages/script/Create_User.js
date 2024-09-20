document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('accessToken');
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';

    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format';
        document.getElementById('emailError').style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('passwordError').textContent = 'Passwords do not match';
        document.getElementById('passwordError').style.display = 'block';
        return;
    }

    const userData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,  
        password: password
    };

    fetch('http://127.0.0.1:8000/account/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)  
    })
    .then(response => response.json())
    .then(data => {
        if (data.usernameTaken) {
            document.getElementById('emailError').textContent = 'Username is already taken';
            document.getElementById('emailError').style.display = 'block';
            return;
        } else if (data.emailTaken) {
            document.getElementById('emailError').textContent = 'Email is already registered';
            document.getElementById('emailError').style.display = 'block';
            return;
        } else {
            // Successful user creation, redirect to All Users page
            window.location.href = 'All_Users.html';
        }
    })
    .catch(error => console.error('Error creating user:', error));
});
