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
const updateBtn = document.getElementById('updateBtn');
const accountImage = document.getElementById('accountImage');
const showPosts = document.getElementById('showPosts');
const confirmDeletingPost = document.getElementById('confirmDeletingPost');


updateBtn.addEventListener('click' , ()=>{
    window.location.href = "../index/edit_profile.html"
})
settings.addEventListener('click' , ()=>{
    settingsPopup.style.display = "flex";
    settingsContainer.style.display = "flex";
    confirmDeleting.style.display = "none"
    changedMsg.style.display = "none";
    confirmDeletingPost.style.display ="none"

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
    localStorage.setItem("userId",data.id) ;
    //!  expand the data
    accountImage.src = `${data.image}`;
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
        if(!response.ok){
            return response.json().then(errorData => {
                // Handle specific error responses
                if (errorData.old_password) {
                    notCorrectPass.style.display = "block";
                }
                if(confirmNewPass !== newPass){
                    notMatchPass.style.display = "block"
                }
            });
        }else{
            changePasswordForm.style.display = "none";
        changedMsg.style.display = "flex";
        okBtn.addEventListener('click', () => {
            settingsPopup.style.display = "none";
            changedMsg.style.display = "none";
        });
        return response.json();
        }
            
    }) //then

})

//todo --------------------------------- start showing the posts in account -----------------------------------

fetch('http://127.0.0.1:8000/Post/show/' , {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
        }
}).then(response=>{
    if(response.ok){
        return response.json();
    }
}).then(data=>{

    function createBlog(postId, username, eventTime, author_image ,eventName, description, postImage, likes) {
        let blogDiv = document.createElement('div');
        blogDiv.classList.add('blog');
    
        let blogCreatorDiv = document.createElement('div');
        blogCreatorDiv.classList.add('blog_creator');
    
        let profileImg = document.createElement('img');
        profileImg.classList.add('blog_creator_img');
        profileImg.src = author_image;
        profileImg.alt = 'pfp';
    
        let usernameSpan = document.createElement('span');
        usernameSpan.classList.add('blog_creator_name');
    
        let firstNameSpan = document.createElement('span');
        firstNameSpan.classList.add('creator_first_name');
        firstNameSpan.textContent = username;
    
    //todo ===================   time format     ======================================
        let eventTypeSpan = document.createElement('span');
        eventTypeSpan.classList.add('eventType');
    
        function formatDate(eventTime) {
            let date = new Date(eventTime);
        
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear(); 
        
            let hours = String(date.getHours()).padStart(2, '0');
            let minutes = String(date.getMinutes()).padStart(2, '0');
        
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
        
        let formattedDate = formatDate(eventTime);    
        eventTypeSpan.textContent = formattedDate;
    //todo ===================   time format     ======================================
    
        usernameSpan.appendChild(firstNameSpan);
        blogCreatorDiv.appendChild(profileImg);
        blogCreatorDiv.appendChild(usernameSpan);
        blogCreatorDiv.appendChild(eventTypeSpan);


        let postOptionsDiv = document.createElement('div');
    postOptionsDiv.classList.add('postOptions');

    let editPostSpan = document.createElement('span');
    editPostSpan.classList.add('editPost');
    editPostSpan.textContent = 'edit';

    let deletePostSpan = document.createElement('span');
    deletePostSpan.classList.add('deletePost');
    deletePostSpan.textContent = 'delete';

    // Add click event listeners for edit and delete
    editPostSpan.addEventListener('click', function () {
        editPost(postId);
    });

    deletePostSpan.addEventListener('click', function () {
        deletePost(postId);
    });

    // Append edit and delete options to postOptionsDiv
    postOptionsDiv.appendChild(editPostSpan);
    postOptionsDiv.appendChild(deletePostSpan);

    // Append postOptionsDiv to blogCreatorDiv
    blogCreatorDiv.appendChild(postOptionsDiv);
    
        let blogBodyDiv = document.createElement('div');
        blogBodyDiv.classList.add('blog_body');
    
        let postName = document.createElement('h3');
        postName.classList.add('postName');
        postName.textContent = eventName;
    
        let descPara = document.createElement('p');
        descPara.classList.add('desc');
        descPara.textContent = description;
    
        blogBodyDiv.appendChild(postName);
        blogBodyDiv.appendChild(descPara);
    
        //! Only create the image part if the postImage does not contain "media/0"
        if (!postImage.includes("media/0") || !postImage == null) {
            let postImgHolderDiv = document.createElement('div');
            postImgHolderDiv.classList.add('post_img_holder');
    
            let postImg = document.createElement('img');
            postImg.classList.add('post_img');
            postImg.src = postImage;
            postImg.alt = 'post';
    
            postImgHolderDiv.appendChild(postImg);
            blogBodyDiv.appendChild(postImgHolderDiv);
        }
    
        let reactsDiv = document.createElement('div');
        reactsDiv.classList.add('reacts');
    
        let heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-regular', 'fa-heart');
        heartIcon.style.cursor = 'pointer';
        heartIcon.id = `heart_${postId}`;
        heartIcon.setAttribute('data-post-id' , postId);
    
        heartIcon.addEventListener('click' , function(){
            toggleLike(postId , heartIcon)
        });
    
        let likesPara = document.createElement('p');
        likesPara.classList.add('likes');
        if (Array.isArray(likes)) {
            likesPara.textContent = `${likes.length} likes`;
        } else {
            likesPara.textContent = '0 likes';  // Default to 0 if likes is undefined or not an array
        }
    
        reactsDiv.appendChild(heartIcon);
        reactsDiv.appendChild(likesPara);
    
        blogBodyDiv.appendChild(reactsDiv);
    
        blogDiv.appendChild(blogCreatorDiv);
        blogDiv.appendChild(blogBodyDiv);
    
        showPosts.prepend(blogDiv);
    
        checkUserReaction(postId, heartIcon);
    }

    
    function createBlogWithoutImg(postId, username, eventTime, author_image,eventName, description, likes) {
        let blogDiv = document.createElement('div');
        blogDiv.classList.add('blog');
    
        let blogCreatorDiv = document.createElement('div');
        blogCreatorDiv.classList.add('blog_creator');
    
        let profileImg = document.createElement('img');
        profileImg.classList.add('blog_creator_img');
        profileImg.src = author_image;
        profileImg.alt = 'pfp';
    
        let usernameSpan = document.createElement('span');
        usernameSpan.classList.add('blog_creator_name');
    
        let firstNameSpan = document.createElement('span');
        firstNameSpan.classList.add('creator_first_name');
        firstNameSpan.textContent = username;
    
    //todo ===================   time format     ======================================
        let eventTypeSpan = document.createElement('span');
        eventTypeSpan.classList.add('eventType');
    
        function formatDate(eventTime) {
            let date = new Date(eventTime);
        
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear(); 
        
            let hours = String(date.getHours()).padStart(2, '0');
            let minutes = String(date.getMinutes()).padStart(2, '0');
        
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
        
        let formattedDate = formatDate(eventTime);    
        eventTypeSpan.textContent = formattedDate;
    //todo ===================   time format     ======================================
    
        usernameSpan.appendChild(firstNameSpan);
        blogCreatorDiv.appendChild(profileImg);
        blogCreatorDiv.appendChild(usernameSpan);
        blogCreatorDiv.appendChild(eventTypeSpan);
    
        let postOptionsDiv = document.createElement('div');
    postOptionsDiv.classList.add('postOptions');

    let editPostSpan = document.createElement('span');
    editPostSpan.classList.add('editPost');
    editPostSpan.textContent = 'edit';

    let deletePostSpan = document.createElement('span');
    deletePostSpan.classList.add('deletePost');
    deletePostSpan.textContent = 'delete';

    // Add click event listeners for edit and delete
    editPostSpan.addEventListener('click', function () {
        editPost(postId);
    });

    deletePostSpan.addEventListener('click', function () {
        deletePost(postId);
    });

    // Append edit and delete options to postOptionsDiv
    postOptionsDiv.appendChild(editPostSpan);
    postOptionsDiv.appendChild(deletePostSpan);

    // Append postOptionsDiv to blogCreatorDiv
    blogCreatorDiv.appendChild(postOptionsDiv);

        let blogBodyDiv = document.createElement('div');
        blogBodyDiv.classList.add('blog_body');
    
        let postName = document.createElement('h3');
        postName.classList.add('postName');
        postName.textContent = eventName;
    
        let descPara = document.createElement('p');
        descPara.classList.add('desc');
        descPara.textContent = description;
    
        blogBodyDiv.appendChild(postName);
        blogBodyDiv.appendChild(descPara);
    
        let reactsDiv = document.createElement('div');
        reactsDiv.classList.add('reacts');
    
        let heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-regular', 'fa-heart');
        heartIcon.style.cursor = 'pointer';
        heartIcon.id = `heart_${postId}`;
        heartIcon.setAttribute('data-post-id' , postId);
    
        heartIcon.addEventListener('click' , function(){
            toggleLike(postId , heartIcon)
        });
    
        let likesPara = document.createElement('p');
        likesPara.classList.add('likes');
        if (Array.isArray(likes)) {
            likesPara.textContent = `${likes.length} likes`;
        } else {
            likesPara.textContent = '0 likes';  // Default to 0 if likes is undefined or not an array
        }
    
        reactsDiv.appendChild(heartIcon);
        reactsDiv.appendChild(likesPara);
    
        blogBodyDiv.appendChild(reactsDiv);
    
        blogDiv.appendChild(blogCreatorDiv);
        blogDiv.appendChild(blogBodyDiv);
    
        showPosts.prepend(blogDiv);
    
        checkUserReaction(postId, heartIcon);
    }

    function toggleLike(postId , heartIcon){
        fetch(`http://127.0.0.1:8000/Post/likes/${postId}`,{
            method : 'post' , 
            headers : {
               'Content-Type': 'application/json',
               'Authorization' : `Bearer ${accessToken}`
            },
            body : JSON.stringify({})
        })
        .then(response =>{
            if(!response.ok){
                alert("couldn't put like")
            }
            return response.json();
        })
        .then(data=>{
    
            let likesPara = heartIcon.nextElementSibling;
            let updatedLikes = data.likes.length;  
    
            if (heartIcon.classList.contains('fa-regular')) {
                console.log("you liked this post");
                heartIcon.classList.remove('fa-regular', 'fa-heart');
                heartIcon.classList.add('fa-solid', 'fa-heart');  
                localStorage.setItem(`liked_post_${postId}`, true);
            }else {
                heartIcon.classList.remove('fa-solid', 'fa-heart');
                heartIcon.classList.add('fa-regular', 'fa-heart');  
                localStorage.removeItem(`liked_post_${postId}`);
            }
    
    
            likesPara.textContent = `${updatedLikes} likes`;
        })
    }
    
    function checkUserReaction(postId, heartIcon) {
        if(data[i].likes.includes(Number(localStorage.getItem('userId')))){
            heartIcon.classList.remove('fa-regular', 'fa-heart');
            heartIcon.classList.add('fa-solid', 'fa-heart');
        }else{
            heartIcon.classList.remove('fa-solid', 'fa-heart');
            heartIcon.classList.add('fa-regular', 'fa-heart');
        }
    
    }
    //! ===================================================================
    
    for(var i = 0 ; i<data.length ; i++){
       const creatorId = Number(localStorage.getItem('userId'));

       if(creatorId ==  data[i].author_id){

        if(data[i].image){
            createBlog(data[i].id,data[i].author_name , data[i].created_at ,data[i].author_image, data[i].title , data[i].content, data[i].image , data[i].likes)   
        }else{
            createBlogWithoutImg(data[i].id,data[i].author_name , data[i].created_at ,data[i].author_image, data[i].title , data[i].content, data[i].likes)   
        }
        
    }
    }

})
function deletePost(postId) {
    console.log("delete"  + postId);
    console.log(confirmDeletingPost)
    settingsPopup.style.display = "flex"
   confirmDeletingPost.style.display = "flex";
   settingsContainer.style.display = "none"
   confirmDeleting.style.display = "none"
   const deletePostBtn = document.getElementById('deletePostBtn');


   deletePostBtn.addEventListener('click' , ()=>{
    fetch(`http://127.0.0.1:8000/Post/Update/${postId}` , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response=>{
        if(response.ok){
            window.location.reload();
            return response.json();
        }else{
            alert("can't delete post")
        }
    })
   })

}


function editPost(postId) {
    localStorage.setItem("editPostId" , postId)
    window.location.href = "../index/edit_post.html"
}