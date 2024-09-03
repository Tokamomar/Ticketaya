document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();  

    // Get the input values
    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;
    const errorMsg = document.getElementById('errorMsg');

    // Create the data object to send to the backend
    const data = {
        username: username,
        password: password
    };

    
    fetch('http://127.0.0.1:8000/account/login/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();  
    })
    .then(data => {
        // Handle success - maybe redirect to a dashboard or show a success message
        alert("successful login")
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        errorMsg.style.display = "block"
    });
});
