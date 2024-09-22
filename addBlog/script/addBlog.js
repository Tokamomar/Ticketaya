const backBtn = document.getElementById("back");
backBtn.addEventListener("click", () => {
  window.location.href = "../../addBlog/index/blogPosts.html";
});

const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("eventName").value;
  const content = document.getElementById("description").value;
  const imgInput = document.getElementById("imgInput");
  const file = imgInput.files[0];
  console.log(file);
  const selectImg = document.getElementById("selectImg");
  const accessToken = localStorage.getItem("accessToken");

  if (file) {
    // if there is an img
    console.log("there is a file");
    if (!file.type.startsWith("image/")) {
      const validImg = document.getElementById("validImg");
      validImg.style.display = "block";
      selectImg.style.display = "none";
    } else {
      //submit the form

      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", file);

      console.log(postData);
      fetch("http://127.0.0.1:8000/Post/create/", {
        method: "POST",
        headers: {
          // 'Content-Type' : 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: postData,
      })
        .then((response) => {
          if (!response.ok) {
            console.log(accessToken);
            alert("can not post");
          }else {
            const popup = document.getElementById("popup");
            popup.style.display = "flex";
  
            const closeBtn = document.getElementById("closeBtn");
            closeBtn.addEventListener("click", () => {
              popup.style.display = "none";
              window.location.reload();
            });
          }
          return response.json();
        })
        .then((data) => {
          // alert(data.msg)
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  } //! if there is an img
  else {
    const postData = {
      title: title,
      content: content,
      // image: null,
    };

    console.log(postData);
    fetch("http://127.0.0.1:8000/Post/create/", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(accessToken);
          alert("can not post");
        } else {
          const popup = document.getElementById("popup");
          popup.style.display = "flex";

          const closeBtn = document.getElementById("closeBtn");
          closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
            window.location.reload();
          });
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}); // submit
