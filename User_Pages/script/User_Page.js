document.addEventListener('DOMContentLoaded', function() {
    const username = new URLSearchParams(window.location.search).get('username');
    const userInfo = JSON.parse(localStorage.getItem('users')) || [];
    const user = userInfo.find(user => user.username === username);

    if (user) {
        document.getElementById('username').textContent = `Username: ${user.username}`;
        document.getElementById('email').textContent = `Email: ${user.email}`;
    }

    document.getElementById('updateButton').addEventListener('click', function() {
        window.location.href = `Update_User.html?username=${username}`;
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        if (confirm('Are you sure you want to remove this user account?')) {
            const updatedUsers = userInfo.filter(user => user.username !== username);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            window.location.href = 'All_Users.html';
        }
    });
});
