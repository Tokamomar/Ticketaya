document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('jwtToken'); // JWT token
    const username = new URLSearchParams(window.location.search).get('username');

    if (!username) {
        console.error('No username provided');
        return;
    }

    fetch(`http://127.0.0.1:8000/api/user/${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('username').textContent = `Username: ${data.username}`;
        document.getElementById('email').textContent = `Email: ${data.email}`;
    })
    .catch(error => console.error('Error:', error));

    document.getElementById('updateButton').addEventListener('click', function() {
        window.location.href = `Update_User.html?username=${encodeURIComponent(username)}`;
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        if (confirm('Are you sure you want to remove this user account?')) {
            fetch(`http://127.0.0.1:8000/api/user/${encodeURIComponent(username)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'All_Users.html';
                } else {
                    alert('Failed to delete user');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    document.querySelector('.back-link').addEventListener('click', function() {
        window.location.href = 'All_Users.html'; 
    });
});
