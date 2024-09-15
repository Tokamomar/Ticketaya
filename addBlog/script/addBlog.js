

const toggleOptions = document.querySelectorAll('.toggle-option');
toggleOptions.forEach(option => {
  option.addEventListener('click', function() {
    toggleOptions.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
  });
});

const backBtn = document.getElementById('back');
backBtn.addEventListener('click' , ()=>{
  window.location.href = '../../addBlog/index/blogPosts.html';
})

const form = document.getElementById('form');
   form.addEventListener('submit', function(event) {
       event.preventDefault(); 
       
       const imgInput = document.getElementById('imgInput');
       const file = imgInput.files[0];

       const selectImg = document.getElementById('selectImg');
       if(!file){
        selectImg.style.display = 'block';
        validImg.style.display = 'none';
       }else if (!file.type.startsWith('image/')){
        const validImg = document.getElementById('validImg');
        validImg.style.display = 'block';
        selectImg.style.display = 'none';
        
       }else{
        //submit the form
        const formData = new FormData();
        formData.append('file', file);

        const accessToken = document.getElementById('accessToken');
        fetch('', {
          method : 'POST',
          headers:{
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
          body : JSON.stringify(formData),
        })
        then(response=>{
          if(!response.ok){
              alert("can not post")
          }  
          return response.json();
      }).then(data=>{
          alert(data.msg)
      })
       }
   });