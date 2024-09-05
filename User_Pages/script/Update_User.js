document.addEventListener('DOMContentLoaded', function() {
    const username = new URLSearchParams(window.location.search).get('username');
    const userInfo = JSON.parse(localStorage.getItem('users')) || [];
    const user = userInfo.find(user => user.username === username);

    if (user) {
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
    }

    document.getElementById('updateUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const newUsername = document.getElementById('username').value;
        const newEmail = document.getElementById('email').value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(newEmail)) {
            document.getElementById('emailError').textContent = 'Invalid email format';
            document.getElementById('emailError').style.display = 'block';
            return;
        } else {
            document.getElementById('emailError').style.display = 'none';
        }

        if (newUsername !== username) {
            if (userInfo.some(user => user.username === newUsername)) {
                document.getElementById('emailError').textContent = 'Username is already taken';
                document.getElementById('emailError').style.display = 'block';
                return;
            }
        }

        const updatedUsers = userInfo.map(user => user.username === username ? { username: newUsername, email: newEmail } : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        window.location.href = `User_Page.html?username=${newUsername}`;
    });
});
