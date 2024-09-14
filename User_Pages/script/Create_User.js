document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('jwtToken');
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
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        password2 : confirmPassword
    };

    fetch('http://127.0.0.1:8000/user/check/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email }) 
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
            return fetch('http://127.0.0.1:8000/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
        }
    })
    .then(response => {
        if (response && response.ok) {
            window.location.href = 'All_Users.html';
        } else if (response) {
            throw new Error('Failed to create user');
        }
    })
    .catch(error => console.error('Error creating user:', error));
});
