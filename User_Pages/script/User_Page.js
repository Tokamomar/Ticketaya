    document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('accessToken'); 
    const userId = new URLSearchParams(window.location.search).get('id'); 

    if (!userId) {
        console.error('No user ID provided');
        return;
    }

    // Fetch user details
    fetch(`http://127.0.0.1:8000/account/retrieveuser/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Display user details 
        document.getElementById('username').textContent = `Username: ${data.username}`;
        document.getElementById('email').textContent = `Email: ${data.email}`;
        document.getElementById('fullName').textContent = `Full Name: ${data.first_name} ${data.last_name}`;
        document.getElementById('accountStatus').textContent = `Account Status: ${data.is_admin ? 'Admin' : 'User'}`;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to retrieve user details. Please try again.');
    });

    // Update button 
    document.getElementById('updateButton').addEventListener('click', function() {
        window.location.href = `Update_User.html?id=${encodeURIComponent(userId)}`; 
    });

    // Delete button 
    document.getElementById('deleteButton').addEventListener('click', function() {
        if (confirm('Are you sure you want to remove this account?')) {
            // Delete user request
            fetch(`http://127.0.0.1:8000/account/deleteuser/${userId}/`, {
                method: 'Post',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    document.getElementById('overlay').style.display = 'block';
                    document.getElementById('deleteSuccessMessage').style.display = 'block';

                    setTimeout(() => {
                        window.location.href = 'All_Users.html';
                    }, 2000);
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
