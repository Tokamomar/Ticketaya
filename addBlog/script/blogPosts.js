const logout_btn = document.getElementById('logout_btn');
logout_btn.addEventListener('click', ()=>{
    window.location.href = '../../Registration/index/login.html'
});

//todo click heart -> red
//todo show username of the account 

// fetch('http://127.0.0.1:8000/account/login/', { 
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),  
// })
// .then(response => {
//     if (!response.ok) {
//         throw new Error('Login failed');
//     }
//     return response.json();  
// })
// .then(data => {
//     const accessToken = data.token.access
//     const refreshToken = data.token.refresh

//     console.log('accesstoken : ' , accessToken)
//     console.log('refreshtoken : ' , refreshToken)

//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
    
//     console.log(data.is_admin);
//     alert("successful login")
// })
// .catch(error => {
//     console.error('Error:', error);
//     errorMsg.style.display = "block"
// });



// Replace with the actual API endpoint for user information
const apiEndpoint = 'http://127.0.0.1:8000/account/register/';

const accessToken =  localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

console.log(accessToken);
console.log(refreshToken);


// Make a request to the user info endpoint
fetch(apiEndpoint, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    // Access user details
    const firstName = data.first_name;
    const lastName = data.last_name ;
    const username = data.username ;

    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Username:', username);

    // You can now use firstName, lastName, and username in your app
})
.catch(error => {
    console.error('Error fetching user information:', error);
});
