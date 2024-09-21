const logout_btn = document.getElementById('logout_btn');
logout_btn.addEventListener('click', ()=>{
    window.location.href = '../../Registration/index/login.html'
});
// const heart = document.getElementById('heart');
// var clicked = false ;
// heart.addEventListener('click' , ()=>{
//     if(!clicked){
//         heart.style.color = "red";
//         clicked = true ;
//     }else{
//         heart.style.color = "white";
//         clicked = false
//     }
// })

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
    const usernameAcc = document.getElementById('username');
    usernameAcc.textContent = data.username
    const firstName = document.getElementById('firstName');
    firstName.textContent = data.first_name
    const secondName = document.getElementById('secondName');
    secondName.textContent = data.last_name
    const pfp = document.getElementById('pfp');
    pfp.src = `http://127.0.0.1:8000${data.image}`

    localStorage.setItem("userId" , data.id);
    
}).catch(error=>{
    console.error('Error fetching profile data:', error)
})


const logout = document.getElementById('logout_btn');
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

fetch('http://127.0.0.1:8000/Post/show/' , {
    method : 'GET',
    headers:{
        'Content-Type' : 'application/json',
    },
}).then(response=>{
    if(!response.ok){
        alert("there is a problem")
    }
    return response.json();
}).then(data=>{

//! ===================================================================

function createBlog(postId, username, eventTime, eventName, description, postImage, likes) {
    let blogDiv = document.createElement('div');
    blogDiv.classList.add('blog');

    let blogCreatorDiv = document.createElement('div');
    blogCreatorDiv.classList.add('blog_creator');

    let profileImg = document.createElement('img');
    profileImg.classList.add('blog_creator_img');
    profileImg.src = "../images/pfp.jpg";
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

    document.getElementById('blogsBar').appendChild(blogDiv);

    checkUserReaction(postId, heartIcon);
}


//? ------------------------------------------------------------------------------------------------
//?-------------------------------------------------------------------------------------------------

function createBlogWithoutImg(postId, username, eventTime, eventName, description, likes) {
    let blogDiv = document.createElement('div');
    blogDiv.classList.add('blog');

    let blogCreatorDiv = document.createElement('div');
    blogCreatorDiv.classList.add('blog_creator');

    let profileImg = document.createElement('img');
    profileImg.classList.add('blog_creator_img');
    profileImg.src = "../images/pfp.jpg";
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

    document.getElementById('blogsBar').appendChild(blogDiv);

    checkUserReaction(postId, heartIcon);
}



//? ------------------------------------------------------------------------------------------------
//?-------------------------------------------------------------------------------------------------

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

    // if (isLiked) {
    //     heartIcon.classList.remove('fa-regular', 'fa-heart');
    //     heartIcon.classList.add('fa-solid', 'fa-heart');  // Liked heart style
    // }
}
//! ===================================================================

for(var i = 0 ; i<data.length ; i++){
    if(data[i].image){
        createBlog(data[i].id,data[i].author_name , data[i].created_at , data[i].title , data[i].content, data[i].image , data[i].likes)   
    }else{
        createBlogWithoutImg(data[i].id,data[i].author_name , data[i].created_at , data[i].title , data[i].content, data[i].likes)   
    }
    
}
})