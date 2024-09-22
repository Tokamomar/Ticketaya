// Get references to the input elements first
const eventNameInput = document.getElementById("eventName");
const descriptionTextarea = document.getElementById("description");
const imgPreview = document.getElementById("imgPreview");
const existingImage = document.getElementById("existingImage"); // Existing image element

// Get the post ID and access token from local storage
const editPostId = Number(localStorage.getItem('editPostId'));
const accessToken = localStorage.getItem("accessToken");

// Handle the back button click
const backBtn = document.getElementById("back");
backBtn.addEventListener("click", () => {
  window.location.href = "../index/account.html";
});

// Fetch the post data
fetch(`http://127.0.0.1:8000/Post/Update/${editPostId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
    }
})
.then(response => {
    if(response.ok) {
        return response.json();
    }
})
.then(data => {
    console.log(data);
    
    eventNameInput.value = data.title; 
     descriptionTextarea.value = data.content; 
        
    if (data.image) { 
        existingImage.src = data.image; 
        existingImage.style.display = "block"; 
        imgPreview.style.display = "none"
    } else {
        existingImage.style.display = "none"; 
        imgPreview.style.display = "block"
    }
})
.catch(error => console.error('Error fetching post data:', error));

document.getElementById('imgInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result; 
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the updated values from the inputs
    const updatedTitle = eventNameInput.value;
    const updatedContent = descriptionTextarea.value;
    const imgInput = document.getElementById("imgInput");
    const file = imgInput.files[0];

    if (file) {
        // If an image is selected, validate and send the data with image
        if (!file.type.startsWith("image/")) {
            const validImg = document.getElementById("validImg");
            validImg.style.display = "block";
            selectImg.style.display = "none";
        } else {
            const postData = new FormData();
            postData.append("title", updatedTitle);
            postData.append("content", updatedContent);
            postData.append("image", file);

            fetch(`http://127.0.0.1:8000/Post/Update/${editPostId}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: postData,
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Cannot update post with image");
                } else {
                    showSuccessPopup();
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    } else {
        // If no image is selected, send the data without image
        const postData = {
            title: updatedTitle,
            content: updatedContent,
        };

        fetch(`http://127.0.0.1:8000/Post/Update/${editPostId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(postData),
        })
        .then((response) => {
            if (!response.ok) {
                alert("Cannot update post without image");
            } else {
                showSuccessPopup();
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
});

// Show success popup
function showSuccessPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "flex";
    const closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
        window.location.reload();
    });
}
