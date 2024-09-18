document.addEventListener('DOMContentLoaded', function() {
    // const token = localStorage.getItem('jwtToken');
    const username = new URLSearchParams(window.location.search).get('username');

    fetch(`http://127.0.0.1:8000/account/updateprofile/${username}/`, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${token}`
        // }
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
            firstName: newFirstName,
            lastName: newLastName,
            username: newUsername,
            email: newEmail
        };

        fetch('http://127.0.0.1:8000/account/updateprofile/check/', {
            method: 'PUT',
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${token}`
            // },
            body: JSON.stringify({ username: newUsername, email: newEmail })
        })
        .then(response => response.json())
        .then(data => {
            if (data.usernameTaken && newUsername !== username) {
                document.getElementById('emailError').textContent = 'Username is already taken';
                document.getElementById('emailError').style.display = 'block';
                return;
            } else if (data.emailTaken) {
                document.getElementById('emailError').textContent = 'Email is already registered';
                document.getElementById('emailError').style.display = 'block';
                return;
            } else {
                return fetch(`http://127.0.0.1:8000/account/updateprofile/${username}/`, {
                    method: 'PUT',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    //     'Authorization': `Bearer ${token}`
                    // },
                    body: JSON.stringify(updatedData)
                });
            }
        })
        .then(response => {
            if (response && response.ok) {
                window.location.href = `User_Page.html?username=${newUsername}`;
            } else if (response) {
                throw new Error('Failed to update user');
            }
        })
        .catch(error => console.error('Error updating user:', error));
    });
});
