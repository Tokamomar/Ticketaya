const settings = document.getElementById('settings');
const settingsPopup = document.getElementById('settingsPopup');
const cancel = document.getElementById('cancel');
const heart = document.getElementById('heart');
const deleteAccount = document.getElementById("deleteAccount");
const settingsContainer = document.getElementById('settingsContainer');
const confirmDeleting = document.getElementById('confirmDeleting');
const back = document.getElementById('back');
const deleteBtn = document.getElementById('delete');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const backPass = document.getElementById('backPass');
const notMatchPass = document.getElementById('notMatchPass');
const notCorrectPass = document.getElementById('notCorrectPass');
const changedMsg = document.getElementById('changedMsg');
const okBtn = document.getElementById('okBtn');


settings.addEventListener('click' , ()=>{
    settingsPopup.style.display = "flex";
    settingsContainer.style.display = "flex";
    confirmDeleting.style.display = "none"
})
cancel.addEventListener('click' , ()=>{
    settingsPopup.style.display = "none";
})
settingsPopup.addEventListener('click' , ()=>{
    settingsPopup.style.display = "none";
})
settingsContainer.addEventListener('click', (event) => {
    event.stopPropagation();  
});
confirmDeleting.addEventListener('click', (event) => {
    event.stopPropagation();  
});
deleteAccount.addEventListener('click' , ()=>{
     settingsContainer.style.display = "none";
     confirmDeleting.style.display = "flex";
})
back.addEventListener('click' , ()=>{
    settingsContainer.style.display = "flex";
    confirmDeleting.style.display = "none";  
})
backPass.addEventListener('click' , ()=>{
    settingsContainer.style.display = "flex";
    changePasswordForm.style.display = "none";  
})
changePasswordForm.addEventListener('click' , (e)=>{
    e.stopPropagation();
})
changePasswordBtn.addEventListener('click' , ()=>{
    changePasswordForm.style.display = "flex"
    settingsContainer.style.display = "none";
    
})

var clicked = false ;
heart.addEventListener('click' , ()=>{
    if(!clicked){
        heart.style.color = "red";
        clicked = true ;
    }else{
        heart.style.color = "white";
        clicked = false
    }
})

deleteBtn.addEventListener('click' , ()=>{
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://127.0.0.1:8000/account/deleteaccount/' , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }, 
    }).then(response=>{
        if(!response.ok){
            alert("can not delete the acc")
        }  
        return response.json();
    }).then(data=>{
        alert(data.msg)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = "../../Registration/index/login.html"
    })
})

const logout = document.getElementById('logout');
logout.addEventListener('click' , ()=>{

    //todo fetch the api and make it takes the refresh token from the local storage and clear it 
    const refresh = localStorage.getItem("refreshToken") ;
    const data = {refresh_token : refresh};
    fetch('http://127.0.0.1:8000/account/logout/' ,{
        method : 'POST',
        headers:{
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(data),
    }).then(response =>{
        if(!response.ok){
            throw new Error("Failed to logout");
        } 
        return response.json();
    }).then(data =>{
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("accessToken")
        alert(data.msg)
        window.location.href = "../../Registration/index/login.html";
    })


})


const accessToken = localStorage.getItem('accessToken');
fetch('http://127.0.0.1:8000/account/profile/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
        },
}).then(response=>{
    if(response.ok){
        return response.json();
    }else{
        alert("can not fetch the profile data")
    }
}).then(data=>{
    console.log(data)
    //!  expand the data
    const usernameAcc = document.getElementById('usernameAcc');
    usernameAcc.textContent = data.username
    const firstName = document.getElementById('firstName');
    firstName.textContent = data.first_name
    const secondName = document.getElementById('secondName');
    secondName.textContent = data.last_name
    
}).catch(error=>{
    console.error('Error fetching profile data:', error)
})

changePasswordForm.addEventListener('submit' , function (e){
    e.preventDefault();

    const oldPass = document.getElementById('oldPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmNewPass = document.getElementById('confirmNewPass').value;

    data = {
        old_password : oldPass,
        new_password : newPass,
        confirm_password : confirmNewPass
    }
    fetch('http://127.0.0.1:8000/account/changepassword/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
    })
    .then(response=>{
        if(response.ok){
            return response.json();
        }
        else if(newPass!==confirmNewPass){
            notMatchPass.style.display = "block"
        }
        else{
            notCorrectPass.style.display = "block"
        }
    }).then(data=>{
        changePasswordForm.style.display = "none";
            changedMsg.style.display = "flex";
            okBtn.addEventListener('click' , ()=>{
                settingsPopup.style.display = "none";
                changedMsg.style.display = "none"

            })
        console.log(data.msg)
    })

})