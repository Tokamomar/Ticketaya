document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('accessToken');
    const userId = new URLSearchParams(window.location.search).get('id'); 

    document.getElementById('backToUser').href = `User_Page.html?id=${userId}`;

    // Fetch current user data
    fetch(`http://127.0.0.1:8000/account/retrieveuser/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(user => {
        if (user) {
            document.getElementById('firstName').value = user.firstName;
            document.getElementById('lastName').value = user.lastName;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
        }
    });

    document.getElementById('updateUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const newFirstName = document.getElementById('firstName').value;
        const newLastName = document.getElementById('lastName').value;
        const newUsername = document.getElementById('username').value;
        const newEmail = document.getElementById('email').value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        document.getElementById('emailError').style.display = 'none';

        if (!emailPattern.test(newEmail)) {
            document.getElementById('emailError').textContent = 'Invalid email format';
            document.getElementById('emailError').style.display = 'block';
            return;
        }

        const updatedData = {
            first_name: newFirstName,
            last_name: newLastName,
            username: newUsername,
            email: newEmail
        };

        // Update user data
        fetch(`http://127.0.0.1:8000/account/updateuser/${userId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('overlay').style.display = 'block';
                document.getElementById('successMessage').style.display = 'block'; 

                setTimeout(function() {
                    window.location.href = `User_Page.html?id=${userId}`;
                }, 2000);
            } else {
                console.error('Error updating user:', response.statusText);
            }
        })
        .catch(error => console.error('Error updating user:', error));
    });
});
