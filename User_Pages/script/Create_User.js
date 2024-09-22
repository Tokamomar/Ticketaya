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
        is_admin: 1,  
        password: password
    };

    fetch('http://127.0.0.1:8000/account/addadmin/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)  
    })
    .then(response => response.json().then(data => {
        if (response.ok) {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('successMessage').style.display = 'block';

            setTimeout(() => {
                window.location.href = 'All_Users.html';
            }, 2000);
      } else {
          if (data.username) {
              document.getElementById('usernameError').textContent = 'Username is already taken';
              document.getElementById('usernameError').style.display = 'block';
          }
          if (data.email) {
              document.getElementById('emailError').textContent = 'Email is already registered';
              document.getElementById('emailError').style.display = 'block';
          }
      }
  }))
  .catch(error => {
      console.error('Error creating user:', error);
  });


document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;

    if (password !== confirmPassword) {
        document.getElementById('passwordError').textContent = 'Passwords do not match';
        document.getElementById('passwordError').style.display = 'block';
    } else {
        document.getElementById('passwordError').style.display = 'none';
    }
});
});
