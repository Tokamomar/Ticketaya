document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    let usernameError = false;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.username === username)) {
        document.getElementById('usernameError').textContent = 'Username is already taken';
        document.getElementById('usernameError').style.display = 'block';
        usernameError = true;
    } else {
        document.getElementById('usernameError').style.display = 'none';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format';
        document.getElementById('emailError').style.display = 'block';
        return;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    if (!usernameError) {
        users.push({ username, email });
        localStorage.setItem('users', JSON.stringify(users));

        window.location.href = 'All_Users.html';
    }
});
