

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

//TODO make the img required
//!  DONT forget the time 