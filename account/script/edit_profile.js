const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  window.location.href = "./account.html";
});
const accessToken = localStorage.getItem("accessToken");
const profileImg = document.getElementById("profileImg");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const usernameInput = document.getElementById("usernameInput");

fetch("http://127.0.0.1:8000/account/updateprofile/", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((response) => {
    if (!response.ok) {
      alert("could not get the data");
    }
    return response.json();
  })
  .then((data) => {

    profileImg.src = `http://127.0.0.1:8000${data.image}`
    console.log(profileImg)
    // Update other fields if available in the response
    if (data.first_name) firstName.textContent = data.first_name;
    if (data.last_name) lastName.textContent = data.last_name;
    if (data.email) email.textContent = data.email;

    // Optionally, populate the input fields with the data as well
    if (data.first_name) firstNameInput.value = data.first_name;
    if (data.last_name) lastNameInput.value = data.last_name;
    if (data.email) emailInput.value = data.email;
    if (data.username) usernameInput.value = data.username;
  });

const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const firstNameInput = document.getElementById("firstNameInput").value;
  const lastNameInput = document.getElementById("lastNameInput").value;
  const emailInput = document.getElementById("emailInput").value;
  const usernameInput = document.getElementById("usernameInput").value;
  const profilePhotoInput = document.getElementById("profilePhotoInput");

  let selectedFile = null;
  if (profilePhotoInput.files.length > 0) {
    selectedFile = profilePhotoInput.files[0]; // Get the first selected file
  }

  profilePhotoInput.addEventListener("change", function () {
    // Check if any file is selected
    if (profilePhotoInput.files.length > 0) {
      const selectedFile = profilePhotoInput.files[0]; // Get the first selected file
    }
  });

  const formData = new FormData();
  formData.append("email", emailInput);
  formData.append("username", usernameInput);
  formData.append("first_name", firstNameInput);
  formData.append("last_name", lastNameInput);
  if (selectedFile) {
    formData.append("image", selectedFile); // Append the selected file if it exists
  }

  fetch("http://127.0.0.1:8000/account/updateprofile/", {
    method: "PUT",
    headers: {
      //'Content-Type': 'application/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.status === 406) {
        return response.json().then((error) => {
          //todo show the error msg
          const popup = document.getElementById("popup");
          popup.style.display = "flex";
          const message = document.getElementById("message");
          message.textContent = error.msg;
          const closeBtn = document.getElementById("closeBtn");
          closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
            window.location.reload();
          });
        });
      } else if (!response.ok) {
        return response.json().then((error) => {
          const popup = document.getElementById("popup");
          popup.style.display = "flex";
          const message = document.getElementById("message");
          if(error.username){
            message.textContent = error.username;
          }if(error.email){
            message.textContent = error.email;
          }if(error.username && error.email){
            message.textContent = error.username + " " + error.email;
          }
          const closeBtn = document.getElementById("closeBtn");
          closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
            window.location.reload();
          });
        });
      }
      return response.json();
    })
    .then((data) => {
        const popup = document.getElementById("popup");
          popup.style.display = "flex";
          const message = document.getElementById("message");
          if (Array.isArray(data.msg)) {
            // Join array elements with line breaks
            message.innerHTML = data.msg.join('<br>'); // Use innerHTML to interpret <br> tags
        } else {
            // If it's a single message, just display it
            message.textContent = data.msg;
        }
          const closeBtn = document.getElementById("closeBtn");
          closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
            window.location.reload();
          });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
