document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();  

    
    const firstName = document.querySelector('.firstname').value;
    const lastName = document.querySelector('.lastname').value;
    const username = document.querySelector('.username').value;
    const email = document.querySelector('.email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

   

    
    const data = {
        email: email,
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password2 : confirmPassword
    };

    
    fetch('http://127.0.0.1:8000/account/register/', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }else{
            return response.json().then(errorMsg=>{
                if (errorMsg.username) {
                    document.querySelector('.usernameError').innerText = errorMsg.username[0];
                    document.querySelector('.usernameError').style.display = 'block';
        
                    const usernameInput = document.getElementById('usernameInput')
                    usernameInput.addEventListener('input' , function(){
                    document.querySelector('.usernameError').style.display = 'none';
                    } )
                }
        
                if (errorMsg.email) {
                    document.querySelector('.emailError').innerText = errorMsg.email[0];
                    document.querySelector('.emailError').style.display = 'block';
        
                    const emailInput = document.getElementById('emailInput')
                    emailInput.addEventListener('input' , function(){
                    document.querySelector('.emailError').style.display = 'none';
                    } )
                }
                if (password !== confirmPassword) {
                    document.getElementById('passwordError').style.display = 'block';
        
                    const passwordInput = document.getElementById('password')
                    passwordInput.addEventListener('input' , function(){
                    document.querySelector('#passwordError').style.display = 'none';
                    } )
        
                    const confirmPasswordInput = document.getElementById('confirmPassword')
                    confirmPasswordInput.addEventListener('input' , function(){
                    document.querySelector('#passwordError').style.display = 'none';
                    } )
                }
            })
        }
    })  
    .then(data => {
        if (data) {
            document.getElementById('popupContainer').style.display = 'flex';
        } else {
            
           
        
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

