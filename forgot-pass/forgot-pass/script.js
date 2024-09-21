// document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the form from submitting in the traditional way

//     var email = document.getElementById('email').value;
    
//     // Simulate sending a password reset email
//     if (validateEmail(email)) {
//         document.getElementById('message').innerText = 'A password reset link has been sent to your email address.';
//         document.getElementById('message').style.color = 'green';
//     } else {
//         document.getElementById('message').innerText = 'Please enter a valid email address.';
//         document.getElementById('message').style.color = 'red';
//     }
// });

// function validateEmail(email) {
//     // Simple regex for basic email validation
//     var re = /\S+@\S+\.\S+/;
//     return re.test(email);
// }

document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    var email = document.getElementById('email').value;
    var messageElement = document.getElementById('message');
    
    // Validate email first
    if (validateEmail(email)) {
        // Prepare the data to be sent in the request body
        var data = {
            email: email
        };

        // Make the POST request to the reset password email endpoint
        fetch('http://127.0.0.1:8000/account/sendrestpasswordemail/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  // Convert the data object to a JSON string
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg) {
                // Success message
                messageElement.innerText = 'A password reset link has been sent to your email address.';
                messageElement.style.color = 'green';
            } else {
                // Display the error message returned from the server
                messageElement.innerText = 'An error occurred: ' + (data.email ? data.email : 'Please try again.');
                messageElement.style.color = 'red';
            }
        })
        .catch(error => {
            // Handle network or other errors
            messageElement.innerText = 'An error occurred. Please try again later.';
            messageElement.style.color = 'red';
            console.error('Error:', error);
        });
    } else {
        // Invalid email format
        messageElement.innerText = 'Please enter a valid email address.';
        messageElement.style.color = 'red';
    }
});

function validateEmail(email) {
    // Simple regex for basic email validation
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
